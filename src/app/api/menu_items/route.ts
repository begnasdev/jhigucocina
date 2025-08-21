// src/app/api/menu_items/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createMenuItem, getAllMenuItems } from "@/lib/supabase/api/menu_items";
import { createMenuItemSchema } from "@/schemas/menu_item-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const menuItems = await getAllMenuItems();
    return NextResponse.json({
      data: menuItems,
      message: "Menu items retrieved successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = createMenuItemSchema.parse(json);
    const newMenuItem = await createMenuItem(data);

    return NextResponse.json({
      data: newMenuItem,
      message: "Menu item created successfully",
      status: 201,
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
