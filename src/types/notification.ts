import { Database, Tables, TablesInsert, TablesUpdate } from "./database";

export type Notification = Tables<"notifications">;
export type InsertNotification = TablesInsert<"notifications">;
export type UpdateNotification = TablesUpdate<"notifications">;

export type NotificationPriority =
  Database["public"]["Enums"]["notification_priority"];
export type NotificationType = Database["public"]["Enums"]["notification_type"];

// Additional helper types for the UI
export type NotificationWithUser = Notification & {
  user?: {
    user_id: string;
    name: string | null;
  };
};

export type NotificationCounts = {
  total: number;
  unread: number;
  byPriority: {
    low: number;
    normal: number;
    high: number;
    urgent: number;
  };
};
