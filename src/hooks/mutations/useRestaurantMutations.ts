"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant-service";
import { InsertRestaurant, UpdateRestaurant } from "@/types/restaurant";
import { restaurantKeys } from "@/constants/queryKeys";
import { toast } from "sonner";

/**
 * Hook to create a new restaurant
 * @returns Mutation for creating restaurant
 */
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newRestaurant: InsertRestaurant) =>
      restaurantService.createRestaurant(newRestaurant),
    onSuccess: (response) => {
      toast.success(response.message || "Restaurant created successfully!");
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create restaurant.");
    },
  });
};

/**
 * Hook to update a restaurant
 * @returns Mutation for updating restaurant
 */
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRestaurant }) =>
      restaurantService.updateRestaurant(id, data),
    onSuccess: (response, { id }) => {
      toast.success(response.message || "Restaurant updated successfully!");
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update restaurant.");
    },
  });
};

/**
 * Hook to delete a restaurant
 * @returns Mutation for deleting restaurant
 */
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restaurantService.deleteRestaurant(id),
    onSuccess: (response) => {
      toast.success(response.message || "Restaurant deleted successfully!");
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete restaurant.");
    },
  });
};
