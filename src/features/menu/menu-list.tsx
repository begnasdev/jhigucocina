"use client";

import { useState } from "react";
import { MenuItem } from "@/types/menu_item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMenuItems } from "@/hooks/queries/useMenuItemQueries";
import { useSheet } from "@/stores/useSheet";
import { MenuForm } from "./menu-form";
import { en } from "@/languages/en";

export default function MenuList() {
  const {
    data: menuItemsResponse,
    isLoading,
    isError,
    error,
  } = useGetMenuItems();
  const { openSheet, closeSheet } = useSheet();

  const menuItems = menuItemsResponse?.data || [];

  const handleEditMenu = (menuItem: MenuItem) => {
    openSheet({
      title: `${en.FORM.MENU_ITEM.EDIT_TITLE} ${menuItem.name}`,
      content: (
        <MenuForm
          menuItem={menuItem}
          restaurant_id={menuItem.restaurant_id!}
          onSuccess={() => closeSheet()}
        />
      ),
    });
  };

  if (isLoading) {
    return <div>Loading menu items...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {menuItems.map((menuItem) => (
        <Card key={menuItem.item_id}>
          <CardHeader>
            <CardTitle>{menuItem.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Price: ${menuItem.price}</p>
            <p>Description: {menuItem.description}</p>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => handleEditMenu(menuItem)}
            >
              {en.BUTTON.EDIT}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
