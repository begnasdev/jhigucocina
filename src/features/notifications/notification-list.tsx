"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  ShoppingCart,
  ChefHat,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/types/notification";
import { en } from "@/languages/en";
import { cn } from "@/lib/utils";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "high":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20";
      case "normal":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "low":
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
      default:
        return "border-l-gray-300 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getPriorityBadge = (priority: string | null) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="text-xs">
            🔴 Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge variant="warning" className="text-xs">
            🟠 High
          </Badge>
        );
      case "normal":
        return (
          <Badge variant="default" className="text-xs">
            🔵 Normal
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="text-xs">
            ⚪ Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_placed":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case "order_accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "order_preparing":
        return <ChefHat className="h-5 w-5 text-yellow-500" />;
      case "order_ready":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "order_served":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "order_cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "system_alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order_placed":
        return "Order Placed";
      case "order_accepted":
        return "Order Accepted";
      case "order_preparing":
        return "Order Preparing";
      case "order_ready":
        return "Order Ready";
      case "order_served":
        return "Order Served";
      case "order_cancelled":
        return "Order Cancelled";
      case "system_alert":
        return "System Alert";
      default:
        return "Notification";
    }
  };

  return (
    <Card
      className={cn(
        "border-l-4 transition-all hover:shadow-md",
        !notification.is_read
          ? getPriorityColor(notification.priority)
          : "border-l-gray-200 dark:border-l-gray-700",
        !notification.is_read && "ring-1 ring-blue-100 dark:ring-blue-900/20"
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h3
                    className={cn(
                      "text-sm sm:text-base font-medium",
                      !notification.is_read && "font-semibold"
                    )}
                  >
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <Badge
                      variant="destructive"
                      className="h-2 w-2 rounded-full p-0"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(notification.type)}
                  </Badge>
                  {getPriorityBadge(notification.priority)}
                  {notification.is_read && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      <Eye className="h-3 w-3 mr-1" />
                      Read
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {notification.created_at &&
                      formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                  </span>

                  {notification.read_at && (
                    <span className="text-xs text-green-600">
                      Read{" "}
                      {formatDistanceToNow(new Date(notification.read_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!notification.is_read && (
                <div className="flex sm:flex-col items-center sm:items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.notification_id)}
                    className="text-xs sm:w-full"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">
                      {en.NOTIFICATIONS.MARK_AS_READ}
                    </span>
                    <span className="sm:hidden">Mark Read</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotificationList({
  notifications,
  isLoading,
  error,
}: NotificationListProps) {
  const { markAsRead } = useNotifications({ enabled: false });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 bg-gray-200 rounded dark:bg-gray-700" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
                  <div className="h-3 bg-gray-200 rounded w-full dark:bg-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <h3 className="font-medium text-destructive">
            Error Loading Notifications
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">
            {en.NOTIFICATIONS.NO_NOTIFICATIONS}
          </h3>
          <p className="text-sm text-muted-foreground">
            {en.NOTIFICATIONS.NO_NOTIFICATIONS_DESCRIPTION}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <div key={notification.notification_id}>
          <NotificationItem
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
          />
          {index < notifications.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  );
}
