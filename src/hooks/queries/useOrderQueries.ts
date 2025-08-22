"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";
import { orderKeys } from "@/constants/queryKeys";

/**
 * Hook to fetch all orders
 * @returns Query for all orders
 */
export const useGetOrders = () =>
  useQuery({
    queryKey: orderKeys.all,
    queryFn: orderService.getAllOrders,
  });

/**
 * Hook to fetch a order by ID
 * @param id - Order ID
 * @returns Query for specific order
 */
export const useGetOrderById = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
