"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/useCartStore";
import { useSheet } from "@/stores/useSheet";
import CartView from "./CartView";
import { en } from "@/languages/en";
import { useSearchParams } from "next/navigation";

const CartIcon = () => {
  const totalItems = useCartStore((state) => state.totalItems());
  const { openSheet } = useSheet();

  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  const handleOpenCart = () => {
    openSheet({
      title: en.PAGE.YOUR_CART,
      content: (
        <CartView
          restaurantId={restaurantId as string}
          tableId={tableId as string}
        />
      ),
    });
  };

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={handleOpenCart}>
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
      <span className="sr-only">Shopping Cart</span>
    </Button>
  );
};

export default CartIcon;
