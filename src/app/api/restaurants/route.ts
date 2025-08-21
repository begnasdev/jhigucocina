// src/app/api/restaurants/route.ts
import { NextResponse, NextRequest } from "next/server";
import {
  createRestaurant,
  getAllRestaurants,
} from "@/lib/supabase/api/restaurants";
import { createRestaurantSchema } from "@/schemas/restaurant-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const restaurants = await getAllRestaurants();
    return NextResponse.json({
      data: restaurants,
      message: "Restaurants retrieved successfully",
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
    const data = createRestaurantSchema.parse(json);
    const newRestaurant = await createRestaurant(data);

    return NextResponse.json({
      data: newRestaurant,
      message: "Restaurant created successfully",
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.errors,
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
