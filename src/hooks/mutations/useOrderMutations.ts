"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order-service";
import { InsertOrder, UpdateOrder } from "@/types/order";
import { orderKeys } from "@/constants/queryKeys";
import { toast } from "sonner";
import { CreateOrder } from "@/schemas/order-schema";

// Hook to create a new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newOrder: CreateOrder) => orderService.createOrder(newOrder),
    onSuccess: (response) => {
      toast.success(response.message || "Order created successfully!");
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order.");
    },
  });
};

// Hook to update an order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrder }) =>
      orderService.updateOrder(id, data),
    onSuccess: (response, { id }) => {
      toast.success(response.message || "Order updated successfully!");
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order.");
    },
  });
};

// Hook to delete an order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      toast.success("Order deleted successfully!");
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete order.");
    },
  });
};
