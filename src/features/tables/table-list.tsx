"use client";

import { useState } from "react";
import { Table } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCodeDialog } from "./qr-code-dialog";
import { useGetTables } from "@/hooks/queries/useTableQueries";
import { useSheet } from "@/stores/useSheet";
import { en } from "@/languages/en";
import { TableForm } from "./table-form";

export default function TableList() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { data: tablesResponse, isLoading, isError, error } = useGetTables();
  const { openSheet, closeSheet } = useSheet();

  const tables = tablesResponse?.data || [];

  const getQrUrl = (tableId: string, restaurantId: string) => {
    if (typeof window !== "undefined") {
      const { protocol, host } = window.location;
      return `${protocol}//${host}/menu?restaurantId=${restaurantId}&tableId=${tableId}`;
    }
    return "";
  };

  const handleEditTable = (table: Table) => {
    openSheet({
      title: `${en.FORM.TABLE.EDIT_TITLE} ${table.table_number}`,
      content: (
        <TableForm
          table={table}
          restaurant_id={table.restaurant_id!}
          onSuccess={() => closeSheet()}
        />
      ),
    });
  };

  if (isLoading) {
    return <div>Loading tables...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={(table.table_id, table.restaurant_id)}>
            <CardHeader>
              <CardTitle>Table {table.table_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Capacity: {table.capacity}</p>
              <p>Status: {table.status}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => setSelectedTable(table)}
              >
                {en.BUTTON.GENERATE_QR_CODE}
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => handleEditTable(table)}
              >
                {en.BUTTON.EDIT}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedTable && (
        <QrCodeDialog
          table={selectedTable}
          qrUrl={getQrUrl(selectedTable.table_id, selectedTable.restaurant_id!)}
          onOpenChange={(isOpen) => !isOpen && setSelectedTable(null)}
        />
      )}
    </>
  );
}
