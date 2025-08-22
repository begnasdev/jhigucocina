'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useSheet } from '@/stores/useSheet';
import CartView from './CartView';

const CartIcon = () => {
  const totalItems = useCartStore((state) => state.totalItems());
  const { openSheet } = useSheet();

  const handleOpenCart = () => {
    openSheet({
      title: en.PAGE.YOUR_CART,
      content: <CartView />,
    });
  };

  return (
    <button
      onClick={handleOpenCart}
      className="relative p-2 rounded-full hover:bg-gray-100"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
