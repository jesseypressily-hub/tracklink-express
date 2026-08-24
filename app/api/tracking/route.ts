import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("number");

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required." },
        { status: 400 }
      );
    }

    const [shipmentRows] = await pool.execute(
      `
      SELECT
  id,
  tracking_number,
  customer_name,
  origin,
  destination,
  current_status,
  created_at,
  origin_lat,
  origin_lng,
  destination_lat,
  destination_lng,
  current_lat,
  current_lng
FROM shipments
      WHERE tracking_number = ?
      LIMIT 1
      `,
      [trackingNumber.trim()]
    );

    const shipments = shipmentRows as any[];

    if (shipments.length === 0) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    const shipment = shipments[0];

    const [historyRows] = await pool.execute(
      `
      SELECT
        id,
        status,
        location,
        description,
        created_at
      FROM tracking_history
      WHERE shipment_id = ?
      ORDER BY created_at ASC
      `,
      [shipment.id]
    );

    return NextResponse.json({
      shipment,
      history: historyRows,
    });
  } catch (error) {
    console.error("Tracking API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve shipment." },
      { status: 500 }
    );
  }
}