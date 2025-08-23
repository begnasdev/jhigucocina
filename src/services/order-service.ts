import { apiClient } from "@/utils/axios";
import { config } from "@/config";
import {
  ApiResponse,
  Order,
  InsertOrder,
  UpdateOrder,
  OrderWithItems,
} from "@/types/order";
import { CreateOrder } from "@/schemas/order-schema";

const { endpoints } = config;

export const orderService = {
  /**
   * Get all orders
   * @returns Promise resolving to all orders
   */
  async getAllOrders(): Promise<ApiResponse<OrderWithItems[]>> {
    const response = await apiClient.get(endpoints.orders.root);
    return response.data;
  },

  /**
   * Get order by ID
   * @param id - Order ID
   * @returns Promise resolving to order data
   */
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.get(endpoints.orders.byId(id));
    return response.data;
  },

  /**
   * Create new order
   * @param orderData - Order creation data
   * @returns Promise resolving to created order
   */
  async createOrder(orderData: CreateOrder): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(endpoints.orders.root, orderData);
    return response.data;
  },

  /**
   * Update order
   * @param id - Order ID
   * @param updateData - Order update data
   * @returns Promise resolving to updated order
   */
  async updateOrder(
    id: string,
    updateData: UpdateOrder
  ): Promise<ApiResponse<Order>> {
    const response = await apiClient.put(endpoints.orders.byId(id), updateData);
    return response.data;
  },

  /**
   * Delete order
   * @param id - Order ID
   * @returns Promise resolving to null
   */
  async deleteOrder(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(endpoints.orders.byId(id));
    return response.data;
  },
};
