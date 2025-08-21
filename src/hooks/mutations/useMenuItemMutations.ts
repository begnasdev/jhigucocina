"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuItemService } from "@/services/menu-item-service";
import { InsertMenuItem, UpdateMenuItem } from "@/types/menu_item";
import { menuItemKeys } from "@/constants/queryKeys";
import { toast } from "sonner";

/**
 * Hook to create a new menu item
 * @returns Mutation for creating menu item
 */
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newMenuItem: InsertMenuItem) =>
      menuItemService.createMenuItem(newMenuItem),
    onSuccess: (response) => {
      toast.success(response.message || "Menu item created successfully!");
      queryClient.invalidateQueries({ queryKey: menuItemKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create menu item.");
    },
  });
};

/**
 * Hook to update a menu item
 * @returns Mutation for updating menu item
 */
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItem }) =>
      menuItemService.updateMenuItem(id, data),
    onSuccess: (response, { id }) => {
      toast.success(response.message || "Menu item updated successfully!");
      queryClient.invalidateQueries({ queryKey: menuItemKeys.all });
      queryClient.invalidateQueries({ queryKey: menuItemKeys.detail(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update menu item.");
    },
  });
};

/**
 * Hook to delete a menu item
 * @returns Mutation for deleting menu item
 */
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuItemService.deleteMenuItem(id),
    onSuccess: (response) => {
      toast.success(response.message || "Menu item deleted successfully!");
      queryClient.invalidateQueries({ queryKey: menuItemKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete menu item.");
    },
  });
};
