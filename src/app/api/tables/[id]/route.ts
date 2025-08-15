import { NextResponse, NextRequest } from "next/server";
import {
  deleteTable,
  getTableById,
  updateTable,
} from "@/lib/supabase/api/tables";
import { updateTableSchema } from "@/schemas/table-schema";
import { z, ZodError } from "zod";

const paramsSchema = z.object({
  id: z.uuid({ message: "Invalid table ID format" }),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const table = await getTableById(id);

    if (!table) {
      return NextResponse.json({
        data: null,
        message: "Table not found",
        status: 404,
      });
    }

    return NextResponse.json({
      data: table,
      message: "Table retrieved successfully",
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
    const data = updateTableSchema.parse(json);
    const updatedTable = await updateTable(id, data);

    return NextResponse.json({
      data: updatedTable,
      message: "Table updated successfully",
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
    await deleteTable(id);

    return NextResponse.json({
      data: null,
      message: "Table deleted successfully",
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
