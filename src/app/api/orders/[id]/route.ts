import { NextResponse, NextRequest } from "next/server";
import {
  deleteOrder,
  getOrderById,
  updateOrder,
} from "@/lib/supabase/api/orders";
import { updateOrderSchema } from "@/schemas/order-schema";
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
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({
        data: null,
        message: "Order not found",
        status: 404,
      });
    }

    return NextResponse.json({
      data: order,
      message: "Order retrieved successfully",
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
    const data = updateOrderSchema.parse(json);
    const updatedOrder = await updateOrder(id, data);

    return NextResponse.json({
      data: updatedOrder,
      message: "Order updated successfully",
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
    await deleteOrder(id);

    return NextResponse.json({
      data: null,
      message: "Order deleted successfully",
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
