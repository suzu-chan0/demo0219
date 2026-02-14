import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { Lead, CreateLeadRequest } from "@/types/lead";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query<Lead>("SELECT id, name, created_at FROM leads ORDER BY created_at DESC");

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLeadRequest = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", body.name.trim())
      .query<Lead>(
        "INSERT INTO leads (name) OUTPUT INSERTED.id, INSERTED.name, INSERTED.created_at VALUES (@name)"
      );

    return NextResponse.json(result.recordset[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
