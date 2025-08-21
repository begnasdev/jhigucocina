"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createMenuItemSchema } from "@/schemas/menu_item-schema";
import { MenuItem } from "@/types/menu_item";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from "@/hooks/mutations/useMenuItemMutations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetRestaurants } from "@/hooks/queries/useRestaurantQueries";

type CreateMenuItem = z.infer<typeof createMenuItemSchema>;

interface MenuFormProps {
  menuItem?: MenuItem;
  onSuccess?: () => void;
  restaurant_id: string;
}

export function MenuForm({
  menuItem,
  onSuccess,
  restaurant_id,
}: MenuFormProps) {
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const { data: restaurants, isLoading: isLoadingRestaurants } =
    useGetRestaurants();

  const form = useForm<CreateMenuItem>({
    resolver: zodResolver(createMenuItemSchema),
    defaultValues: {
      restaurant_id: menuItem?.restaurant_id || restaurant_id || "",
      name: menuItem?.name || "",
      price: menuItem?.price || 0,
      description: menuItem?.description || "",
      is_available: menuItem?.is_available ?? true,
    },
  });

  const isSubmitting = createMenuItem.isPending || updateMenuItem.isPending;

  const onSubmit = (values: CreateMenuItem) => {
    if (menuItem) {
      updateMenuItem.mutate(
        { id: menuItem.item_id, data: values },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createMenuItem.mutate(values, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="restaurant_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingRestaurants || !!menuItem?.restaurant_id}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a restaurant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {restaurants?.data?.map((restaurant) => (
                    <SelectItem
                      key={restaurant.restaurant_id}
                      value={restaurant.restaurant_id}
                    >
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Pizza, Burger" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 12.99"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., A delicious cheese pizza"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Available</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : menuItem
            ? "Update Menu Item"
            : "Create Menu Item"}
        </Button>
      </form>
    </Form>
  );
}
