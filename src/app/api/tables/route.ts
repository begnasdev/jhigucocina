import { NextResponse, NextRequest } from "next/server";
import { createTable, getAllTables } from "@/lib/supabase/api/tables";
import { createTableSchema } from "@/schemas/table-schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const tables = await getAllTables();

    return NextResponse.json({
      data: tables,
      message: "Tables retrieved successfully",
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
    const data = createTableSchema.parse(json);
    const newTable = await createTable(data);

    return NextResponse.json({
      data: newTable,
      message: "Table created successfully",
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
