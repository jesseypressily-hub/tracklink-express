import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        tracking_number,
        customer_name,
        origin,
        destination,
        current_status,
        created_at
      FROM shipments
      ORDER BY created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin shipments error:", error);

    return NextResponse.json(
      { error: "Unable to load shipments." },
      { status: 500 }
    );
  }
}