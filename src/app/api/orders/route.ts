import { NextResponse, NextRequest } from "next/server";
import { createOrder, getAllOrders } from "@/lib/supabase/api/orders";
import { createOrderSchema } from "@/schemas/order-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({
      data: orders,
      message: "Orders retrieved successfully",
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
    const data = createOrderSchema.parse(json);
    const newOrder = await createOrder(data);

    return NextResponse.json({
      data: newOrder,
      message: "Order created successfully",
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        data: null,
        message: "Validation failed",
        status: 400,
        errors: error.issues, // Use .issues for a more detailed error structure
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
