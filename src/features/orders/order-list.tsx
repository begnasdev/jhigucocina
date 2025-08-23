"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Order, OrderWithItems } from "@/types/order";
import { useUpdateOrder } from "@/hooks/mutations/useOrderMutations";
import { useState } from "react";
import { en } from "@/languages/en";

interface OrderListProps {
  orders: OrderWithItems[];
  isLoading: boolean;
}

export default function OrderList({ orders, isLoading }: OrderListProps) {
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const updateOrderMutation = useUpdateOrder();

  const handleApproveOrder = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      await updateOrderMutation.mutateAsync({
        id: orderId,
        data: { status: "accepted" },
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      await updateOrderMutation.mutateAsync({
        id: orderId,
        data: { status: "cancelled" },
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  const canApprove = (status: string) => status === "pending";
  const canCancel = (status: string) =>
    ["pending", "accepted", "preparing", "ready"].includes(status);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary" as const;
      case "accepted":
        return "success" as const;
      case "preparing":
        return "warning" as const;
      case "ready":
        return "success" as const;
      case "served":
        return "success" as const;
      case "cancelled":
        return "error" as const;
      default:
        return "secondary" as const;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Restaurant</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.order_id}>
            <TableCell>{order.order_number}</TableCell>
            <TableCell>{order.restaurant.name}</TableCell>
            <TableCell>{order?.customer?.name}</TableCell>
            <TableCell>{order.total_amount}</TableCell>
            <TableCell>
              <Badge
                variant={getStatusVariant(order.status!)}
                className="capitalize"
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {canApprove(order.status!) && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleApproveOrder(order.order_id)}
                    disabled={loadingOrderId === order.order_id}
                  >
                    {loadingOrderId === order.order_id
                      ? en.BUTTON.LOADING
                      : en.BUTTON.APPROVE}
                  </Button>
                )}
                {canCancel(order.status!) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loadingOrderId === order.order_id}
                      >
                        {en.BUTTON.CANCEL}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {en.DIALOG.CANCEL_ORDER_TITLE}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {en.DIALOG.CANCEL_ORDER_DESCRIPTION.replace(
                            "{orderNumber}",
                            order.order_number
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {en.BUTTON.CANCEL}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {en.BUTTON.YES_CANCEL_ORDER}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
