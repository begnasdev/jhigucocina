"use client";

import { useState } from "react";
import { Tables } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCodeDialog } from "./qr-code-dialog";

interface TableListProps {
  tables: Tables<"tables">[];
  restaurantId: string;
}

export default function TableList({ tables, restaurantId }: TableListProps) {
  const [selectedTable, setSelectedTable] = useState<Tables<"tables"> | null>(null);

  const getQrUrl = (tableId: string) => {
    if (typeof window !== "undefined") {
      const { protocol, host } = window.location;
      return `${protocol}//${host}/menu?restaurantId=${restaurantId}&tableId=${tableId}`;
    }
    return "";
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.table_id}>
            <CardHeader>
              <CardTitle>Table {table.table_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Capacity: {table.capacity}</p>
              <p>Status: {table.status}</p>
              <Button className="mt-4 w-full" onClick={() => setSelectedTable(table)}>
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedTable && (
        <QrCodeDialog
          table={selectedTable}
          qrUrl={getQrUrl(selectedTable.table_id)}
          onOpenChange={(isOpen) => !isOpen && setSelectedTable(null)}
        />
      )}
    </>
  );
}
