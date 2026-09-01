import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const status = body.status?.trim();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "pending",
      "contacted",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid quote status." },
        { status: 400 }
      );
    }

    const quoteRef = db
      .collection("quoteRequests")
      .doc(id);

    const quote = await quoteRef.get();

    if (!quote.exists) {
      return NextResponse.json(
        { error: "Quote request not found." },
        { status: 404 }
      );
    }

    await quoteRef.update({
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Quote status updated successfully.",
    });
  } catch (error) {
    console.error(
      "Firebase update quote error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update quote request.",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const quoteRef = db
      .collection("quoteRequests")
      .doc(id);

    const quote = await quoteRef.get();

    if (!quote.exists) {
      return NextResponse.json(
        { error: "Quote request not found." },
        { status: 404 }
      );
    }

    await quoteRef.delete();

    return NextResponse.json({
      success: true,
      message: "Quote request deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Firebase delete quote error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to delete quote request.",
      },
      { status: 500 }
    );
  }
}