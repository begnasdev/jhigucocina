"use client";

import { useQuery } from "@tanstack/react-query";
import { menuItemService } from "@/services/menu-item-service";
import { menuItemKeys } from "@/constants/queryKeys";
import { MenuItemFilters } from "@/types/menu_item";

/**
 * Hook to fetch all menu items
 * @param filters - Optional filters for menu items
 * @returns Query for all menu items
 */
export const useGetMenuItems = (filters?: MenuItemFilters) =>
  useQuery({
    queryKey: menuItemKeys.list(filters || {}),
    queryFn: () => menuItemService.getAllMenuItems(filters),
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
