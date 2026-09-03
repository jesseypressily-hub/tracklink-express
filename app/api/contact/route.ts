import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      subject,
      trackingNumber,
      message,
    } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const contactRef = await db.collection("contactMessages").add({
      name,
      email,
      phone: phone || "",
      subject,
      trackingNumber: trackingNumber || "",
      message,
      status: "unread",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: contactRef.id,
    });
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      {
        error: "Unable to send your message.",
      },
      { status: 500 }
    );
  }
}