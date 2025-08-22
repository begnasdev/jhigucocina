
import { create } from 'zustand';
import { Tables } from '@/types/database';

export type CartItem = {
  item: Tables<'menu_items'>;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Tables<'menu_items'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    const { items } = get();
    const existingItem = items.find((cartItem) => cartItem.item.item_id === item.item_id);

    if (existingItem) {
      const updatedItems = items.map((cartItem) =>
        cartItem.item.item_id === item.item_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      set({ items: updatedItems });
    } else {
      set({ items: [...items, { item, quantity: 1 }] });
    }
  },
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((cartItem) => cartItem.item.item_id !== itemId),
    }));
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity < 1) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((cartItem) =>
        cartItem.item.item_id === itemId ? { ...cartItem, quantity } : cartItem
      ),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
  totalItems: () => {
    return get().items.reduce((total, cartItem) => total + cartItem.quantity, 0);
  },
  totalPrice: () => {
    return get().items.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
  },
}));
