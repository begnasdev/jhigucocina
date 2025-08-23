import { createServerClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/client";
import {
  Notification,
  InsertNotification,
  UpdateNotification,
  NotificationCounts,
} from "@/types/notification";

// Server-side functions
export async function getUnreadNotifications(
  userId?: string,
  restaurantId?: string
): Promise<Notification[]> {
  const supabase = await createServerClient();

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
}

export async function getNotifications(
  userId?: string,
  restaurantId?: string,
  limit: number = 20
): Promise<Notification[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (restaurantId) {
    query = query.eq("restaurant_id", restaurantId);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Error fetching notifications: ${error.message}`);
  return data || [];
}

export async function getNotificationCounts(
  userId?: string,
  restaurantId?: string
): Promise<NotificationCounts> {
  const supabase = await createServerClient();

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
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const supabase = await createServerClient();

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
}

export async function markAllNotificationsAsRead(
  userId?: string,
  restaurantId?: string
): Promise<void> {
  const supabase = await createServerClient();

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
}

export async function createNotification(
  notification: InsertNotification
): Promise<Notification> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single();

  if (error) throw new Error(`Error creating notification: ${error.message}`);
  return data;
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("notification_id", notificationId);

  if (error) throw new Error(`Error deleting notification: ${error.message}`);
}

// Client-side functions for real-time
export function getClientSupabase() {
  return createClient();
}

export function subscribeToNotifications(
  userId?: string,
  restaurantId?: string,
  onInsert?: (notification: Notification) => void,
  onUpdate?: (notification: Notification) => void
) {
  const supabase = getClientSupabase();

  // Build filter based on user or restaurant
  let filter = "";
  if (userId && restaurantId) {
    filter = `user_id=eq.${userId},restaurant_id=eq.${restaurantId}`;
  } else if (userId) {
    filter = `user_id=eq.${userId}`;
  } else if (restaurantId) {
    filter = `restaurant_id=eq.${restaurantId}`;
  }

  const channel = supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: filter || undefined,
      },
      (payload) => {
        if (onInsert && payload.new) {
          onInsert(payload.new as Notification);
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: filter || undefined,
      },
      (payload) => {
        if (onUpdate && payload.new) {
          onUpdate(payload.new as Notification);
        }
      }
    );

  channel.subscribe();

  return () => {
    channel.unsubscribe();
  };
}

// Client-side API calls
export async function getUnreadNotificationsClient(
  userId?: string,
  restaurantId?: string
): Promise<Notification[]> {
  const supabase = getClientSupabase();

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
}

export async function getNotificationCountsClient(
  userId?: string,
  restaurantId?: string
): Promise<NotificationCounts> {
  const supabase = getClientSupabase();

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
}

export async function markNotificationAsReadClient(
  notificationId: string
): Promise<Notification> {
  const supabase = getClientSupabase();

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
}
