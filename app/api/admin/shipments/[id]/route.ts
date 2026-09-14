import { NextResponse } from "next/server";
import {
  getShipmentById,
  updateShipment,
  addTrackingHistory,
  deleteShipment,
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
    console.error("Firebase get shipment error:", error);

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

    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const exceptionReason =
      typeof body.exceptionReason === "string"
        ? body.exceptionReason.trim()
        : "";

    const customerInstruction =
      typeof body.customerInstruction === "string"
        ? body.customerInstruction.trim()
        : "";

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

    // Coordinates
    const currentLat =
      typeof body.currentLat === "number"
        ? body.currentLat
        : undefined;

    const currentLng =
      typeof body.currentLng === "number"
        ? body.currentLng
        : undefined;

    // Event date/time
    // This represents when the shipment event actually happened.
    let eventDateTime = new Date().toISOString();

    if (body.eventDateTime) {
      const parsedEventDate = new Date(
        body.eventDateTime
      );

      if (Number.isNaN(parsedEventDate.getTime())) {
        return NextResponse.json(
          {
            error:
              "Invalid tracking event date and time.",
          },
          { status: 400 }
        );
      }

      eventDateTime =
        parsedEventDate.toISOString();
    }

    // Estimated delivery
    let estimatedDelivery:
      | string
      | null
      | undefined = undefined;

    if (
      body.estimatedDelivery !== undefined
    ) {
      if (
        body.estimatedDelivery === null ||
        body.estimatedDelivery === ""
      ) {
        estimatedDelivery = null;
      } else {
        const parsedEstimatedDelivery =
          new Date(body.estimatedDelivery);

        if (
          Number.isNaN(
            parsedEstimatedDelivery.getTime()
          )
        ) {
          return NextResponse.json(
            {
              error:
                "Invalid estimated delivery date and time.",
            },
            { status: 400 }
          );
        }

        estimatedDelivery =
          parsedEstimatedDelivery.toISOString();
      }
    }

    // This is when the administrator actually saved
    // the update in the system.
    const lastUpdatedAt =
      new Date().toISOString();

    const finalLocation =
      location || shipment.origin;

    const finalDescription =
      description ||
      `Shipment status updated to ${status}.`;

    // Update the current shipment state.
    await updateShipment(id, {
      currentStatus: status,

      currentLat,
      currentLng,

      estimatedDelivery,

      latestUpdateDescription:
        finalDescription,

      exceptionReason:
        exceptionReason || null,

      customerInstruction:
        customerInstruction || null,

      lastUpdatedAt,
    });

    // Add a separate tracking event.
    // This preserves the shipment's historical record.
    await addTrackingHistory({
      shipmentId: id,
      status,

      location: finalLocation,

      description: finalDescription,

      createdAt: eventDateTime,

      estimatedDelivery:
        estimatedDelivery || undefined,

      exceptionReason:
        exceptionReason || undefined,

      customerInstruction:
        customerInstruction || undefined,

      currentLat:
        currentLat ?? null,

      currentLng:
        currentLng ?? null,
    });

    return NextResponse.json({
      success: true,
      message:
        "Shipment updated successfully.",
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

// DELETE — Delete shipment
export async function DELETE(
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

    await deleteShipment(id);

    return NextResponse.json({
      success: true,
      message:
        "Shipment deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Firebase delete shipment error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to delete shipment.",
      },
      { status: 500 }
    );
  }
}