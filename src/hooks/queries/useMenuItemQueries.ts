"use client";

import { useQuery } from "@tanstack/react-query";
import { menuItemService } from "@/services/menu-item-service";
import { menuItemKeys } from "@/constants/queryKeys";

/**
 * Hook to fetch all menu items
 * @returns Query for all menu items
 */
export const useGetMenuItems = () =>
  useQuery({
    queryKey: menuItemKeys.all,
    queryFn: menuItemService.getAllMenuItems,
  });

/**
 * Hook to fetch a menu item by ID
 * @param id - Menu item ID
 * @returns Query for specific menu item
 */
export const useGetMenuItemById = (id: string) =>
  useQuery({
    queryKey: menuItemKeys.detail(id),
    queryFn: () => menuItemService.getMenuItemById(id),
    enabled: !!id,
  });
