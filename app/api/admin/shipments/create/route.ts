import { NextResponse } from "next/server";
import {
  createShipment,
  addTrackingHistory,
} from "@/lib/firebaseShipments";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // -----------------------------
    // Sender
    // -----------------------------
    const senderName = body.senderName?.trim();
    const senderPhone = body.senderPhone?.trim();
    const senderAddress = body.senderAddress?.trim();

    // -----------------------------
    // Recipient
    // -----------------------------
    const recipientName = body.recipientName?.trim();
    const recipientPhone = body.recipientPhone?.trim();
    const recipientAddress = body.recipientAddress?.trim();

    // -----------------------------
    // Shipment
    // -----------------------------
    const origin = body.origin?.trim();
    const destination = body.destination?.trim();

    const status =
      body.status?.trim() || "Shipment Created";

    // -----------------------------
    // Package
    // -----------------------------
    const serviceType =
      body.serviceType?.trim() || "Standard";

    const packageType =
      body.packageType?.trim() || "Parcel";

    const weight = Number(body.weight);
    const numberOfPackages = Number(body.numberOfPackages);

    // -----------------------------
    // Optional fields
    // -----------------------------
    const estimatedDelivery =
      body.estimatedDelivery?.trim() || "";

    const shippingCost =
      body.shippingCost !== undefined &&
      body.shippingCost !== ""
        ? Number(body.shippingCost)
        : undefined;

    const otherFees =
      body.otherFees !== undefined &&
      body.otherFees !== ""
        ? Number(body.otherFees)
        : undefined;

    const totalAmount =
      body.totalAmount !== undefined &&
      body.totalAmount !== ""
        ? Number(body.totalAmount)
        : undefined;

    // -----------------------------
    // Coordinates
    // -----------------------------
    const originLat = Number(body.originLat);
    const originLng = Number(body.originLng);

    const destinationLat = Number(
      body.destinationLat
    );
    const destinationLng = Number(
      body.destinationLng
    );

    // -----------------------------
    // Required field validation
    // -----------------------------
    if (
      !senderName ||
      !senderPhone ||
      !senderAddress ||
      !recipientName ||
      !recipientPhone ||
      !recipientAddress ||
      !origin ||
      !destination
    ) {
      return NextResponse.json(
        {
          error:
            "Sender, recipient, origin, and destination information are required.",
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

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid package weight is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(numberOfPackages) ||
      numberOfPackages < 1
    ) {
      return NextResponse.json(
        {
          error:
            "At least one package is required.",
        },
        { status: 400 }
      );
    }

    if (
      shippingCost !== undefined &&
      !Number.isFinite(shippingCost)
    ) {
      return NextResponse.json(
        {
          error: "Invalid shipping cost.",
        },
        { status: 400 }
      );
    }

    if (
      otherFees !== undefined &&
      !Number.isFinite(otherFees)
    ) {
      return NextResponse.json(
        {
          error: "Invalid additional fees.",
        },
        { status: 400 }
      );
    }

    if (
      totalAmount !== undefined &&
      !Number.isFinite(totalAmount)
    ) {
      return NextResponse.json(
        {
          error: "Invalid total amount.",
        },
        { status: 400 }
      );
    }

    /*
     * Get existing shipments to determine
     * the next TrackLink Express tracking number.
     *
     * Example:
     * TLX-2026-000101
     */
    const { db } = await import(
      "@/lib/firebaseAdmin"
    );

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
      const lastNumber = Number(
        parts[parts.length - 1]
      );

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

      // Sender
      senderName,
      senderPhone,
      senderAddress,

      // Recipient
      recipientName,
      recipientPhone,
      recipientAddress,

      // Shipment
      origin,
      destination,
      currentStatus: status,

      // Coordinates
      originLat,
      originLng,
      destinationLat,
      destinationLng,

      currentLat: originLat,
      currentLng: originLng,

      // Package
      serviceType,
      packageType,
      weight,
      numberOfPackages,

      // Optional
      estimatedDelivery:
        estimatedDelivery || undefined,
      shippingCost,
      otherFees,
      totalAmount,
    });

    /*
     * Create the first tracking event automatically.
     */
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
        shipmentId,
        message:
          "Shipment created successfully.",
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