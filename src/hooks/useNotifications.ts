"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notification, NotificationCounts } from "@/types/notification";

interface UseNotificationsProps {
  userId?: string;
  restaurantId?: string;
  enabled?: boolean;
}

// Client-side notification functions
const getUnreadNotificationsClient = async (
  userId?: string,
  restaurantId?: string
): Promise<Notification[]> => {
  const supabase = createClient();

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error)
    throw new Error(`Error fetching unread notifications: ${error.message}`);
  return data || [];
};

const getNotificationCountsClient = async (
  userId?: string,
  restaurantId?: string
): Promise<NotificationCounts> => {
  const supabase = createClient();

  let query = supabase.from("notifications").select("is_read, priority");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error)
    throw new Error(`Error fetching notification counts: ${error.message}`);

  const counts: NotificationCounts = {
    total: data?.length || 0,
    unread: 0,
    byPriority: {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0,
    },
  };

  data?.forEach((notification) => {
    if (!notification.is_read) {
      counts.unread++;
    }

    if (notification.priority) {
      counts.byPriority[notification.priority]++;
    }
  });

  return counts;
};

const markNotificationAsReadClient = async (
  notificationId: string
): Promise<Notification> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("notification_id", notificationId)
    .select()
    .single();

  if (error)
    throw new Error(`Error marking notification as read: ${error.message}`);
  return data;
};

const subscribeToNotifications = (
  userId?: string,
  restaurantId?: string,
  onInsert?: (notification: Notification) => void,
  onUpdate?: (notification: Notification) => void
) => {
  const supabase = createClient();

  // Create a unique channel name to avoid conflicts
  const channelName = `notifications_${userId || "all"}_${
    restaurantId || "all"
  }_${Date.now()}`;

  const channel = supabase.channel(channelName);

  // Subscribe to INSERT events
  if (userId || restaurantId) {
    // Build filter for specific user/restaurant
    let filter = "";
    if (userId && restaurantId) {
      filter = `user_id=eq.${userId}`;
    } else if (userId) {
      filter = `user_id=eq.${userId}`;
    } else if (restaurantId) {
      filter = `restaurant_id=eq.${restaurantId}`;
    }

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: filter,
      },
      (payload) => {
        if (onInsert && payload.new) {
          onInsert(payload.new as Notification);
        }
      }
    );

    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: filter,
      },
      (payload) => {
        if (onUpdate && payload.new) {
          onUpdate(payload.new as Notification);
        }
      }
    );
  } else {
    // Subscribe to all notifications if no filters
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
      },
      (payload) => {
        if (onInsert && payload.new) {
          onInsert(payload.new as Notification);
        }
      }
    );

    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
      },
      (payload) => {
        if (onUpdate && payload.new) {
          onUpdate(payload.new as Notification);
        }
      }
    );
  }

  // Subscribe to the channel
  channel.subscribe((status) => {});

  return () => {
    supabase.removeChannel(channel);
  };
};

export function useNotifications({
  userId,
  restaurantId,
  enabled = true,
}: UseNotificationsProps = {}) {
  const queryClient = useQueryClient();

  // Query keys
  const notificationsKey = ["notifications", "unread", userId, restaurantId];
  const countsKey = ["notifications", "counts", userId, restaurantId];

  // Fetch unread notifications
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: notificationsKey,
    queryFn: () => getUnreadNotificationsClient(userId, restaurantId),
    enabled,
  });

  // Fetch notification counts
  const {
    data: counts = {
      total: 0,
      unread: 0,
      byPriority: { low: 0, normal: 0, high: 0, urgent: 0 },
    },
  } = useQuery({
    queryKey: countsKey,
    queryFn: () => getNotificationCountsClient(userId, restaurantId),
    enabled,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsReadClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey });
      queryClient.invalidateQueries({ queryKey: countsKey });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("notifications")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("is_read", false);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      if (restaurantId) {
        query = query.eq("restaurant_id", restaurantId);
      }

      const { error } = await query;

      if (error)
        throw new Error(
          `Error marking all notifications as read: ${error.message}`
        );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey });
      queryClient.invalidateQueries({ queryKey: countsKey });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribeToNotifications(
      userId,
      restaurantId,
      // On new notification
      (notification: Notification) => {
        queryClient.setQueryData(
          notificationsKey,
          (old: Notification[] = []) => [notification, ...old]
        );
        queryClient.invalidateQueries({ queryKey: countsKey });
      },
      // On notification update
      () => {
        queryClient.invalidateQueries({ queryKey: notificationsKey });
        queryClient.invalidateQueries({ queryKey: countsKey });
      }
    );

    return unsubscribe;
  }, [userId, restaurantId, enabled, queryClient, notificationsKey, countsKey]);

  // Manual refetch function
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: notificationsKey });
    queryClient.invalidateQueries({ queryKey: countsKey });
  };

  return {
    notifications,
    counts,
    isLoading,
    error: error?.message || null,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    refetch,
  };
}
