import { NextResponse } from "next/server";
import {
  createShipment,
  addTrackingHistory,
} from "@/lib/firebaseShipments";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName = body.customerName?.trim();
    const origin = body.origin?.trim();
    const destination = body.destination?.trim();
    const status =
      body.status?.trim() || "Shipment Created";

    const originLat = Number(body.originLat);
    const originLng = Number(body.originLng);
    const destinationLat = Number(body.destinationLat);
    const destinationLng = Number(body.destinationLng);

    if (!customerName || !origin || !destination) {
      return NextResponse.json(
        {
          error:
            "Customer name, origin, and destination are required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(originLat) ||
      !Number.isFinite(originLng) ||
      !Number.isFinite(destinationLat) ||
      !Number.isFinite(destinationLng)
    ) {
      return NextResponse.json(
        {
          error:
            "Valid coordinates are required for the origin and destination.",
        },
        { status: 400 }
      );
    }

    /*
     * Get existing shipments to determine the next
     * TrackLink Express tracking number.
     *
     * Example:
     * TLX-2026-100482
     */
    const { db } = await import("@/lib/firebaseAdmin");

    const snapshot = await db
      .collection("shipments")
      .orderBy("trackingNumber", "desc")
      .limit(1)
      .get();

    let nextNumber = 100;

    if (!snapshot.empty) {
      const latestTracking =
        snapshot.docs[0].data().trackingNumber;

      const parts = latestTracking.split("-");
      const lastNumber = Number(parts[parts.length - 1]);

      if (Number.isFinite(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const year = new Date().getFullYear();

    const trackingNumber = `TLX-${year}-${String(
      nextNumber
    ).padStart(6, "0")}`;

    /*
     * Current location starts at the origin.
     */
    const shipmentId = await createShipment({
      trackingNumber,
      customerName,
      origin,
      destination,
      currentStatus: status,

      originLat,
      originLng,

      destinationLat,
      destinationLng,

      currentLat: originLat,
      currentLng: originLng,
    });

    await addTrackingHistory({
      shipmentId,
      status,
      location: origin,
      description:
        `Shipment created and registered at ${origin}.`,
    });

    return NextResponse.json(
      {
        success: true,
        trackingNumber,
        message: "Shipment created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Firebase create shipment error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to create shipment.",
      },
      { status: 500 }
    );
  }
}