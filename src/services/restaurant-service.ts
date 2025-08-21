import { apiClient } from "@/utils/axios";
import { config } from "@/config";
import {
  ApiResponse,
  Restaurant,
  InsertRestaurant,
  UpdateRestaurant,
} from "@/types/restaurant";

const { endpoints } = config;

export const restaurantService = {
  /**
   * Get all restaurants
   * @returns Promise resolving to all restaurants
   */
  async getAllRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    const response = await apiClient.get(endpoints.restaurants.root);
    return response.data;
  },

  /**
   * Get restaurant by ID
   * @param id - Restaurant ID
   * @returns Promise resolving to restaurant data
   */
  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.get(endpoints.restaurants.byId(id));
    return response.data;
  },

  /**
   * Create new restaurant
   * @param restaurantData - Restaurant creation data
   * @returns Promise resolving to created restaurant
   */
  async createRestaurant(
    restaurantData: InsertRestaurant
  ): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.post(endpoints.restaurants.root, restaurantData);
    return response.data;
  },

  /**
   * Update restaurant
   * @param id - Restaurant ID
   * @param updateData - Restaurant update data
   * @returns Promise resolving to updated restaurant
   */
  async updateRestaurant(
    id: string,
    updateData: UpdateRestaurant
  ): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.put(
      endpoints.restaurants.byId(id),
      updateData
    );
    return response.data;
  },

  /**
   * Delete restaurant
   * @param id - Restaurant ID
   * @returns Promise resolving to null
   */
  async deleteRestaurant(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(endpoints.restaurants.byId(id));
    return response.data;
  },
};
