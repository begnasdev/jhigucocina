import { apiClient } from "@/utils/axios";
import { config } from "@/config";
import {
  ApiResponse,
  MenuItem,
  InsertMenuItem,
  UpdateMenuItem,
  MenuItemFilters,
} from "@/types/menu_item";

const { endpoints } = config;

export const menuItemService = {
  /**
   * Get all menu items
   * @param filters - Optional filters for menu items
   * @returns Promise resolving to all menu items
   */
  async getAllMenuItems(
    filters?: MenuItemFilters
  ): Promise<ApiResponse<MenuItem[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(endpoints.menuItems.root, {
      params,
    });
    return response.data;
  },

  /**
   * Get menu item by ID
   * @param id - Menu item ID
   * @returns Promise resolving to menu item data
   */
  async getMenuItemById(id: string): Promise<ApiResponse<MenuItem>> {
    const response = await apiClient.get(endpoints.menuItems.byId(id));
    return response.data;
  },

  /**
   * Create new menu item
   * @param menuItemData - Menu item creation data
   * @returns Promise resolving to created menu item
   */
  async createMenuItem(
    menuItemData: InsertMenuItem
  ): Promise<ApiResponse<MenuItem>> {
    const response = await apiClient.post(
      endpoints.menuItems.root,
      menuItemData
    );
    return response.data;
  },

  /**
   * Update menu item
   * @param id - Menu item ID
   * @param updateData - Menu item update data
   * @returns Promise resolving to updated menu item
   */
  async updateMenuItem(
    id: string,
    updateData: UpdateMenuItem
  ): Promise<ApiResponse<MenuItem>> {
    const response = await apiClient.put(
      endpoints.menuItems.byId(id),
      updateData
    );
    return response.data;
  },

  /**
   * Delete menu item
   * @param id - Menu item ID
   * @returns Promise resolving to null
   */
  async deleteMenuItem(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(endpoints.menuItems.byId(id));
    return response.data;
  },
};
