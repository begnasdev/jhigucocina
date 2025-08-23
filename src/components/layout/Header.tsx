"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationDropdown } from "./NotificationDropdown";
import { useState } from "react";
import { en } from "@/languages/en";
import CartIcon from "@/features/cart/CartIcon";

interface HeaderProps {
  userId?: string;
  restaurantId?: string;
  userName?: string;
  userAvatar?: string;
}

export function Header({
  userId,
  restaurantId,
  userName,
  userAvatar,
}: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { counts, isLoading } = useNotifications({
    userId,
    restaurantId,
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Beautiful Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-sm">
              <span className="text-white font-bold text-sm">JG</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              JhiGuCocina
            </h1>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-2">
          <CartIcon />

          {/* Notification Button */}
          <DropdownMenu
            open={notificationOpen}
            onOpenChange={setNotificationOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {!isLoading && counts.unread > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {counts.unread > 99 ? "99+" : counts.unread}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <NotificationDropdown
                userId={userId}
                restaurantId={restaurantId}
                onClose={() => setNotificationOpen(false)}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName || "User"}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="sr-only">Profile menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="text-sm font-medium">{userName || "User"}</div>
                <div className="text-xs text-muted-foreground">
                  {en.PROFILE.MANAGE_ACCOUNT}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{en.PROFILE.PROFILE_SETTINGS}</DropdownMenuItem>
              <DropdownMenuItem>{en.PROFILE.ACCOUNT_SETTINGS}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {en.PROFILE.SIGN_OUT}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
