"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { en } from "@/languages/en";
import { useCartStore } from "@/stores/useCartStore";
import { Tables } from "@/types/database";
import { MenuItem } from "@/types/menu_item";
import Image from "next/image";

type MenuItemCardProps = {
  item: MenuItem;
};

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { addItem } = useCartStore();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {item.image_url && (
          <div className="relative w-full h-40 mb-4">
            <Image
              src={item.image_url}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-gray-600">{item.description}</p>
        <p className="mt-4 text-lg font-semibold">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addItem(item)} className="w-full">
          {en.BUTTON.ADD_TO_CART}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
