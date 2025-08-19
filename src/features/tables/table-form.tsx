"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { CreateTable, createTableSchema } from "@/schemas/table-schema";
import { Tables } from "@/types/database";
import {
  useCreateTable,
  useUpdateTable,
} from "@/hooks/mutations/useTableMutations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Constants } from "@/types/database";

interface TableFormProps {
  table?: Tables<"tables">;
  onSuccess?: () => void;
  restaurant_id: string;
}

export function TableForm({ table, onSuccess, restaurant_id }: TableFormProps) {
  const createTable = useCreateTable();

  const updateTable = useUpdateTable();

  const form = useForm<CreateTable>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      restaurant_id: restaurant_id,
      table_number: table?.table_number || "",
      capacity: table?.capacity || 1,
      status: table?.status || "available",
      is_active: table?.is_active ?? true,
    },
  });

  const isSubmitting = createTable.isPending || updateTable.isPending;

  const onSubmit = (values: CreateTable) => {
    console.log("values", values);

    const payload = {
      ...values,
      qr_code_url: "http://localhost:3000/tables",
    };

    if (table) {
      updateTable.mutate(
        { id: table.table_id, data: payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createTable.mutate(values, {
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
          name="table_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., T1, Patio 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 4"
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Constants.public.Enums.table_status.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : table ? "Update Table" : "Create Table"}
        </Button>
      </form>
    </Form>
  );
}
