"use client";

import { useQuery } from "@tanstack/react-query";
import { tableService } from "@/services/table-service";
import { tableKeys } from "@/constants/queryKeys";

/**
 * Hook to fetch all tables
 * @returns Query for all tables
 */
export const useGetTables = () =>
  useQuery({
    queryKey: tableKeys.all,
    queryFn: tableService.getAllTables,
  });

/**
 * Hook to fetch a table by ID
 * @param id - Table ID
 * @returns Query for specific table
 */
export const useGetTableById = (id: string) =>
  useQuery({
    queryKey: tableKeys.detail(id),
    queryFn: () => tableService.getTableById(id),
    enabled: !!id,
  });
