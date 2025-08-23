"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ShoppingCart, 
  ChefHat, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/types/notification";
import { en } from "@/languages/en";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  userId?: string;
  restaurantId?: string;
  onClose?: () => void;
}

function NotificationItem({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) {
  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_placed": return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case "order_accepted": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "order_preparing": return <ChefHat className="h-4 w-4 text-yellow-500" />;
      case "order_ready": return <Clock className="h-4 w-4 text-orange-500" />;
      case "order_served": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "order_cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      case "system_alert": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start space-x-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors",
        !notification.is_read && "bg-accent/20"
      )}
      onClick={() => !notification.is_read && onMarkAsRead(notification.notification_id)}
    >
      {/* Priority indicator */}
      <div className={cn("w-1 h-full rounded-full mt-1", getPriorityColor(notification.priority))} />
      
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn("text-sm font-medium", !notification.is_read && "font-semibold")}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
          
          {!notification.is_read && (
            <div className="flex-shrink-0 ml-2">
              <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {notification.created_at && 
              formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
          
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.notification_id);
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              {en.NOTIFICATIONS.MARK_AS_READ}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationDropdown({ 
  userId, 
  restaurantId, 
  onClose 
}: NotificationDropdownProps) {
  const { 
    notifications, 
    counts, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead 
  } = useNotifications({
    userId,
    restaurantId,
  });

  // Limit to 10 most recent notifications
  const limitedNotifications = notifications.slice(0, 10);
  const hasMoreNotifications = notifications.length > 10;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleViewAll = () => {
    // Navigate to notifications page - you can implement this later
    window.location.href = "/notifications";
    onClose?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">{en.BUTTON.LOADING}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-destructive">Error loading notifications</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">{en.NOTIFICATIONS.TITLE}</h3>
          {counts.unread > 0 && (
            <Badge variant="secondary" className="text-xs">
              {counts.unread} {en.NOTIFICATIONS.NEW}
            </Badge>
          )}
        </div>
        
        {counts.unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            {en.NOTIFICATIONS.MARK_ALL_READ}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {limitedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <h4 className="font-medium">{en.NOTIFICATIONS.NO_NOTIFICATIONS}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {en.NOTIFICATIONS.NO_NOTIFICATIONS_DESCRIPTION}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {limitedNotifications.map((notification) => (
              <NotificationItem
                key={notification.notification_id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
            
            {hasMoreNotifications && (
              <div className="p-3 text-center border-t bg-accent/20">
                <p className="text-xs text-muted-foreground">
                  +{notifications.length - 10} more notifications
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {limitedNotifications.length > 0 && (
        <div className="border-t p-3">
          <Button 
            variant="ghost" 
            className="w-full text-sm"
            onClick={handleViewAll}
          >
            {en.NOTIFICATIONS.VIEW_ALL}
          </Button>
        </div>
      )}
    </div>
  );
}