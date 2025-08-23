"use client";

import { useGetOrders } from "@/hooks/queries/useOrderQueries";
import OrderList from "./order-list";

export default function Orders() {
  const { data, isLoading } = useGetOrders();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <OrderList orders={data?.data ?? []} isLoading={isLoading} />
    </div>
  );
}
