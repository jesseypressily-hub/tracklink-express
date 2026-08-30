import { NextResponse } from "next/server";
import {
  getShipmentById,
  updateShipment,
  addTrackingHistory,
} from "@/lib/firebaseShipments";

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

    const shipment = await getShipmentById(id);

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shipment,
    });
  } catch (error) {
    console.error(
      "Firebase get shipment error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to load shipment." },
      { status: 500 }
    );
  }
}

// PATCH — Update shipment
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const status = body.status?.trim();
    const location = body.location?.trim();
    const description = body.description?.trim();

    const currentLat =
      typeof body.currentLat === "number"
        ? body.currentLat
        : undefined;

    const currentLng =
      typeof body.currentLng === "number"
        ? body.currentLng
        : undefined;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    const shipment = await getShipmentById(id);

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found." },
        { status: 404 }
      );
    }

    await updateShipment(id, {
      currentStatus: status,
      currentLat,
      currentLng,
    });

    await addTrackingHistory({
      shipmentId: id,
      status,
      location: location || shipment.origin,
      description:
        description ||
        `Shipment status updated to ${status}.`,
    });

    return NextResponse.json({
      success: true,
      message: "Shipment updated successfully.",
    });
  } catch (error) {
    console.error(
      "Firebase update shipment error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update shipment.",
      },
      { status: 500 }
    );
  }
}