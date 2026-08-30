import { NextResponse } from "next/server";
import {
  getShipmentByTrackingNumber,
  getTrackingHistory,
} from "@/lib/firebaseShipments";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("number")?.trim();

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required." },
        { status: 400 }
      );
    }

    const shipment =
      await getShipmentByTrackingNumber(trackingNumber);

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    const history = await getTrackingHistory(shipment.id);

    return NextResponse.json({
      shipment,
      history,
    });
  } catch (error) {
    console.error("Tracking API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve shipment." },
      { status: 500 }
    );
  }
}