// src/services/tableService.ts

import { apiClient } from "@/utils/axios";
import { config } from "@/config";
import { ApiResponse, Table, InsertTable, UpdateTable } from "@/types/table";

const { endpoints } = config;

export const tableService = {
  /**
   * Get all tables
   * @returns Promise resolving to all tables
   */
  async getAllTables(): Promise<ApiResponse<Table[]>> {
    const response = await apiClient.get(endpoints.tables.root);
    return response.data;
  },

  /**
   * Get table by ID
   * @param id - Table ID
   * @returns Promise resolving to table data
   */
  async getTableById(id: string): Promise<ApiResponse<Table>> {
    const response = await apiClient.get(endpoints.tables.byId(id));
    return response.data;
  },

  /**
   * Create new table
   * @param tableData - Table creation data
   * @returns Promise resolving to created table
   */
  async createTable(tableData: InsertTable): Promise<ApiResponse<Table>> {
    const response = await apiClient.post(endpoints.tables.root, tableData);
    return response.data;
  },

  /**
   * Update table
   * @param id - Table ID
   * @param updateData - Table update data
   * @returns Promise resolving to updated table
   */
  async updateTable(
    id: string,
    updateData: UpdateTable
  ): Promise<ApiResponse<Table>> {
    const response = await apiClient.put(endpoints.tables.byId(id), updateData);
    return response.data;
  },

  /**
   * Delete table
   * @param id - Table ID
   * @returns Promise resolving to the deleted table data
   */
  async deleteTable(id: string) {
    const response = await apiClient.delete(endpoints.tables.byId(id));
    return response.data;
  },
};
