import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { locationCoordinates } from "@/lib/locationCoordinates";

export async function POST(request: Request) {
  const connection = await pool.getConnection();

  try {
    const body = await request.json();

    const customerName = body.customerName?.trim();
    const origin = body.origin?.trim();
    const destination = body.destination?.trim();
    const status = body.status?.trim() || "Shipment Created";
    const originCoordinates = locationCoordinates[origin];
const destinationCoordinates = locationCoordinates[destination];

if (!originCoordinates || !destinationCoordinates) {
  return NextResponse.json(
    {
      error:
        "Location not supported yet. Please use a supported location.",
    },
    { status: 400 }
  );
}

    if (!customerName || !origin || !destination) {
      return NextResponse.json(
        {
          error:
            "Customer name, origin, and destination are required.",
        },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // Get the latest tracking number
    const [rows] = await connection.execute(`
      SELECT tracking_number
      FROM shipments
      WHERE tracking_number LIKE 'TLX-%'
      ORDER BY id DESC
      LIMIT 1
      FOR UPDATE
    `);

    const latest = rows as {
      tracking_number: string;
    }[];

    let nextNumber = 1;

    if (latest.length > 0) {
      const parts = latest[0].tracking_number.split("-");
      const lastNumber = Number(parts[parts.length - 1]);

      if (!Number.isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const year = new Date().getFullYear();

    const trackingNumber = `TLX-${year}-${String(
      nextNumber
    ).padStart(6, "0")}`;

    // Create shipment
    const [result] = await connection.execute(
      `
      INSERT INTO shipments
(
  tracking_number,
  customer_name,
  origin,
  destination,
  current_status,
  origin_lat,
  origin_lng,
  destination_lat,
  destination_lng,
  current_lat,
  current_lng
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
  trackingNumber,
  customerName,
  origin,
  destination,
  status,
  originCoordinates.lat,
  originCoordinates.lng,
  destinationCoordinates.lat,
  destinationCoordinates.lng,
  originCoordinates.lat,
  originCoordinates.lng,
]
    );

    const shipmentId = (result as any).insertId;

    // Create first tracking history event
    await connection.execute(
      `
      INSERT INTO tracking_history
      (
        shipment_id,
        status,
        location,
        description
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        shipmentId,
        status,
        origin,
        `Shipment created and registered at ${origin}.`,
      ]
    );

    await connection.commit();

    return NextResponse.json(
      {
        success: true,
        trackingNumber,
        message: "Shipment created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();

    console.error("Create shipment error:", error);

    return NextResponse.json(
      {
        error: "Unable to create shipment.",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}