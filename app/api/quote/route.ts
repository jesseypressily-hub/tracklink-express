import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      service,
      origin,
      destination,
      packageType,
      weight,
      message,
    } = body;

    if (
      !name ||
      !email ||
      !service ||
      !origin ||
      !destination
    ) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const quoteRef = await db.collection("quoteRequests").add({
      name,
      email,
      phone: phone || "",
      service,
      origin,
      destination,
      packageType: packageType || "",
      weight: weight || "",
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: quoteRef.id,
    });
  } catch (error) {
    console.error("Quote submission error:", error);

    return NextResponse.json(
      {
        error: "Unable to submit quote request.",
      },
      { status: 500 }
    );
  }
}