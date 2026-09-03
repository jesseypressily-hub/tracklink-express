import { NextResponse } from "next/server";
import { getShipments } from "@/lib/firebaseShipments";

export async function GET() {
  try {
    console.log("GET /api/admin/shipments - fetching shipments...");

    const shipments = await getShipments();

    console.log(
      "GET /api/admin/shipments - found:",
      shipments.length,
      "shipments"
    );

    console.log("Shipments:", shipments);

    return NextResponse.json(shipments);
  } catch (error) {
    console.error("GET /api/admin/shipments ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to load shipments.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}