import { NextResponse } from "next/server";
import pool from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET — Get one shipment
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const shipmentId = Number(id);

    if (!Number.isInteger(shipmentId)) {
      return NextResponse.json(
        { error: "Invalid shipment ID." },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        tracking_number,
        customer_name,
        origin,
        destination,
        current_status,
        created_at
      FROM shipments
      WHERE id = ?
      LIMIT 1
      `,
      [shipmentId]
    );

    const shipments = rows as any[];

    if (shipments.length === 0) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shipment: shipments[0],
    });
  } catch (error) {
    console.error("Get shipment error:", error);

    return NextResponse.json(
      { error: "Unable to load shipment." },
      { status: 500 }
    );
  }
}

// PATCH — Update shipment status
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const connection = await pool.getConnection();

  try {
    const { id } = await context.params;

    const shipmentId = Number(id);

    if (!Number.isInteger(shipmentId)) {
      return NextResponse.json(
        { error: "Invalid shipment ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const status = body.status?.trim();
    const location = body.location?.trim();
    const description = body.description?.trim();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // Check that shipment exists
    const [shipmentRows] = await connection.execute(
      `
      SELECT
        id,
        tracking_number,
        origin,
        destination
      FROM shipments
      WHERE id = ?
      LIMIT 1
      `,
      [shipmentId]
    );

    const shipments = shipmentRows as any[];

    if (shipments.length === 0) {
      await connection.rollback();

      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    const shipment = shipments[0];

    // Update current shipment status
    await connection.execute(
      `
      UPDATE shipments
      SET current_status = ?
      WHERE id = ?
      `,
      [status, shipmentId]
    );

    // Add tracking history event
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
        location || shipment.origin,
        description ||
          `Shipment status updated to ${status}.`,
      ]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Shipment updated successfully.",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Update shipment error:", error);

    return NextResponse.json(
      {
        error: "Unable to update shipment.",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}