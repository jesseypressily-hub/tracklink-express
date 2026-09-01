import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const conversationRef = await db
      .collection("chatConversations")
      .add({
        name,
        email,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      conversationId: conversationRef.id,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return NextResponse.json(
      { error: "Unable to create conversation." },
      { status: 500 }
    );
  }
}