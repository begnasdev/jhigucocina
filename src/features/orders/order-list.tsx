"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/order";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
}

export default function OrderList({ orders, isLoading }: OrderListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Restaurant ID</TableHead>
          <TableHead>Table ID</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.order_id}>
            <TableCell>{order.order_id}</TableCell>
            <TableCell>{order.restaurant_id}</TableCell>
            <TableCell>{order.table_id}</TableCell>
            <TableCell>{order.customer_id}</TableCell>
            <TableCell>{order.total_amount}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
