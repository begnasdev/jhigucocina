// src/app/api/menu_items/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import {
  deleteMenuItem,
  getMenuItemById,
  updateMenuItem,
} from "@/lib/supabase/api/menu_items";
import { updateMenuItemSchema } from "@/schemas/menu_item-schema";
import { z, ZodError } from "zod";

const paramsSchema = z.object({
  id: z.uuid({ message: "Invalid ID format" }),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const menuItem = await getMenuItemById(id);

    if (!menuItem) {
      return NextResponse.json({
        data: null,
        message: "Menu item not found",
        status: 404,
      });
    }

    return NextResponse.json({
      data: menuItem,
      message: "Menu item retrieved successfully",
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.issues,
      });
    }
    return NextResponse.json({
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const json = await req.json();
    const data = updateMenuItemSchema.parse(json);
    const updatedMenuItem = await updateMenuItem(id, data);

    return NextResponse.json({
      data: updatedMenuItem,
      message: "Menu item updated successfully",
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.issues,
      });
    }
    return NextResponse.json({
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    await deleteMenuItem(id);

    return NextResponse.json({
      data: null,
      message: "Menu item deleted successfully",
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.issues,
      });
    }
    return NextResponse.json({
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}
