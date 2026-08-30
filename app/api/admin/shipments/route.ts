import { NextResponse } from "next/server";
import { getShipments } from "@/lib/firebaseShipments";

export async function GET() {
  try {
    const shipments = await getShipments();

    return NextResponse.json(shipments);
  } catch (error) {
    console.error("Firebase admin shipments error:", error);

    return NextResponse.json(
      {
        error: "Unable to load shipments.",
      },
      { status: 500 }
    );
  }
}