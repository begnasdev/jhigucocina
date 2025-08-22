'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/useCartStore';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

const CartView = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  const handlePlaceOrder = () => {
    console.log('Placing order with:', items);
    // Here we will later call the API to place the order
    alert('Order placed successfully! (Check console for details)');
    clearCart();
  };

  if (items.length === 0) {
    return <div className="p-4 text-center">{en.PAGE.CART_EMPTY}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        {items.map(({ item, quantity }) => (
          <div key={item.item_id} className="flex items-center gap-4">
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            )}
            <div className="flex-grow">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.item_id, quantity - 1)}
              >
                -
              </Button>
              <span>{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item.item_id, quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500"
              onClick={() => removeItem(item.item_id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>{en.PAGE.TOTAL}</span>
          <span>${totalPrice().toFixed(2)}</span>
        </div>
        <Button onClick={handlePlaceOrder} className="w-full mt-4">
          {en.PAGE.PLACE_ORDER}
        </Button>
      </div>
    </div>
  );
};

export default CartView;
