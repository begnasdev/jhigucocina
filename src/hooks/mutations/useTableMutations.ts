// src/hooks/mutations/useTableMutations.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tableService } from "@/services/table-service";
import { InsertTable, UpdateTable } from "@/types/table";
import { tableKeys } from "@/constants/queryKeys";
import { toast } from "sonner";

// Hook to create a new table
export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTable: InsertTable) => tableService.createTable(newTable),
    onSuccess: (response) => {
      toast.success(response.message || "Table created successfully!");
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create table.");
    },
  });
};

// Hook to update a table
export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTable }) =>
      tableService.updateTable(id, data),
    onSuccess: (response, { id }) => {
      toast.success(response.message || "Table updated successfully!");
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
      queryClient.invalidateQueries({ queryKey: tableKeys.detail(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update table.");
    },
  });
};

// Hook to delete a table
export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tableService.deleteTable(id),
    onSuccess: (response) => {
      toast.success(response.message || "Table deleted successfully!");
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete table.");
    },
  });
};
