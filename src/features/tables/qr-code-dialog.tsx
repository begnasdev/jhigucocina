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
import { updateTableWithQrCode } from "./actions";
import { useTransition } from "react";

interface QrCodeDialogProps {
  table: Tables<"tables">;
  qrUrl: string;
  onOpenChange: (isOpen: boolean) => void;
}

export function QrCodeDialog({ table, qrUrl, onOpenChange }: QrCodeDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateTableWithQrCode(table.table_id, qrUrl);
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code for Table {table.table_number}</DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-white rounded-lg">
          <QRCode value={qrUrl} size={256} viewBox={`0 0 256 256`} />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save QR Code URL"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
