// src/app/api/restaurants/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import {
  deleteRestaurant,
  getRestaurantById,
  updateRestaurant,
} from "@/lib/supabase/api/restaurants";
import { updateRestaurantSchema } from "@/schemas/restaurant-schema";
import { z, ZodError } from "zod";

const paramsSchema = z.object({
  id: z.uuid({ message: "Invalid UUID format" }),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const restaurant = await getRestaurantById(id);

    if (!restaurant) {
      return NextResponse.json({
        data: null,
        message: "Restaurant not found",
        status: 404,
      });
    }

    return NextResponse.json({
      data: restaurant,
      message: "Restaurant retrieved successfully",
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
    const data = updateRestaurantSchema.parse(json);
    const updatedRestaurant = await updateRestaurant(id, data);

    return NextResponse.json({
      data: updatedRestaurant,
      message: "Restaurant updated successfully",
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
    await deleteRestaurant(id);

    return NextResponse.json({
      data: null,
      message: "Restaurant deleted successfully",
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
