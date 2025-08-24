"use client";

import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database";
import { useUpdateTable } from "@/hooks/mutations/useTableMutations";

interface QrCodeDialogProps {
  table: Tables<"tables">;
  qrUrl: string;
  onOpenChange: (isOpen: boolean) => void;
}

export function QrCodeDialog({
  table,
  qrUrl,
  onOpenChange,
}: QrCodeDialogProps) {
  const updateTable = useUpdateTable();
  const hasExistingQrUrl = !!table.qr_code_url;
  const displayUrl = qrUrl || table.qr_code_url || "";

  const handleSave = () => {
    const payload = {
      restaurant_id: table.restaurant_id,
      qr_code_url: qrUrl,
    };

    updateTable.mutate(
      { id: table.table_id, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code for Table {table.table_number}</DialogTitle>
        </DialogHeader>
        <div className="p-6 bg-white rounded-lg flex items-center justify-center">
          <QRCode value={displayUrl} size={256} viewBox={`0 0 256 256`} />
        </div>
        <DialogFooter>
          {!hasExistingQrUrl && (
            <Button onClick={handleSave} disabled={updateTable.isPending}>
              {updateTable.isPending ? "Saving..." : "Save QR Code URL"}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
