"use client";

import { Button } from "@/components/ui/button";
import { en } from "@/languages/en";
import React from "react";
import MenuList from "./menu-list";
import { useSheet } from "@/stores/useSheet";
import { MenuForm } from "./menu-form";

function Menu() {
  const { openSheet, closeSheet } = useSheet();

  const onAddMenu = () => {
    openSheet({
      title: en.FORM.MENU_ITEM.ADD_TITLE,
      description: en.FORM.MENU_ITEM.DESCRIPTION,
      content: (
        <MenuForm
          restaurant_id="b075da2b-d9c5-47e9-ad96-ab3f6bee3ce6"
          onSuccess={() => closeSheet()}
        />
      ),
    });
  };

  return (
    <div className="p-6">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">{en.PAGE.MANAGE_MENU}</h1>

        <Button onClick={onAddMenu}>{en.BUTTON.ADD_MENU_ITEM}</Button>
      </section>

      <MenuList />
    </div>
  );
}

export default Menu;
