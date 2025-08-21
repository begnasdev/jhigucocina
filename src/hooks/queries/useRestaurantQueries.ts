"use client";

import { useQuery } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant-service";
import { restaurantKeys } from "@/constants/queryKeys";

/**
 * Hook to fetch all restaurants
 * @returns Query for all restaurants
 */
export const useGetRestaurants = () =>
  useQuery({
    queryKey: restaurantKeys.all,
    queryFn: restaurantService.getAllRestaurants,
  });

/**
 * Hook to fetch a restaurant by ID
 * @param id - Restaurant ID
 * @returns Query for specific restaurant
 */
export const useGetRestaurantById = (id: string) =>
  useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => restaurantService.getRestaurantById(id),
    enabled: !!id,
  });
