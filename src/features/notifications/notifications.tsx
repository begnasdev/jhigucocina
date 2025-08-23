"use client";

import { useState } from "react";
import { Bell, Filter, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import { en } from "@/languages/en";
import NotificationList from "./notification-list";
import { Database } from "@/types/database";
import { NotificationPriority, NotificationType } from "@/types/notification";

interface NotificationsProps {
  userId?: string;
  restaurantId?: string;
}

export default function Notifications({
  userId,
  restaurantId,
}: NotificationsProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [priorityFilter, setPriorityFilter] = useState<
    NotificationPriority | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  const {
    notifications,
    counts,
    isLoading,
    error,
    markAllAsRead,
    isMarkingAllAsRead,
    refetch,
  } = useNotifications({
    userId,
    restaurantId,
  });

  // Filter notifications based on selected filters
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread" && notification.is_read) return false;
    if (priorityFilter !== "all" && notification.priority !== priorityFilter)
      return false;
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;
    return true;
  });

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {en.NOTIFICATIONS.TITLE}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your notifications and stay updated
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {counts.unread > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="w-full sm:w-auto"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {en.NOTIFICATIONS.MARK_ALL_READ}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{counts.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-destructive">
              {counts.unread}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {counts.byPriority.urgent}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="h-2 w-2 bg-orange-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {counts.byPriority.high}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filter}
                onValueChange={(value: "all" | "unread") => setFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={priorityFilter}
                onValueChange={(value: NotificationPriority | "all") =>
                  setPriorityFilter(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="normal">🔵 Normal</SelectItem>
                  <SelectItem value="low">⚪ Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={typeFilter}
                onValueChange={(value: NotificationType | "all") =>
                  setTypeFilter(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order_placed">🛒 Order Placed</SelectItem>
                  <SelectItem value="order_accepted">
                    ✅ Order Accepted
                  </SelectItem>
                  <SelectItem value="order_preparing">
                    👨‍🍳 Order Preparing
                  </SelectItem>
                  <SelectItem value="order_ready">🔔 Order Ready</SelectItem>
                  <SelectItem value="order_served">✅ Order Served</SelectItem>
                  <SelectItem value="order_cancelled">
                    ❌ Order Cancelled
                  </SelectItem>
                  <SelectItem value="system_alert">⚠️ System Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <NotificationList
        notifications={filteredNotifications}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
