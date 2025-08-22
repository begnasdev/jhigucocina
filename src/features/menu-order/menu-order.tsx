"use client";

import { useGetMenuItems } from "@/hooks/queries/useMenuItemQueries";
import MenuItemCard from "@/features/cart/MenuItemCard";
import CartIcon from "@/features/cart/CartIcon";

type MenuOrderProps = {
  restaurantId: string;
  tableId?: string;
};

const MenuOrder = ({ restaurantId, tableId }: MenuOrderProps) => {
  const {
    data: menuItemsResponse,
    isLoading,
    isError,
  } = useGetMenuItems({ restaurant_id: restaurantId });

  const menuItems = menuItemsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {en.PAGE.LOADING_MENU}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        {en.PAGE.ERROR_LOADING_MENU}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{en.PAGE.MENU}</h1>
        <CartIcon />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <MenuItemCard key={item.item_id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuOrder;
