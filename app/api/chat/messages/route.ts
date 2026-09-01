import { NextResponse } from "next/server";
import {
  addChatMessage,
  getChatMessages,
} from "@/lib/firebaseChat";
import { db } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId =
      searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const messages = await getChatMessages(
      conversationId
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get chat messages error:", error);

    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const conversationId =
      body.conversationId?.trim();

    const sender = body.sender;

    const message = body.message?.trim();

    if (!conversationId || !message) {
      return NextResponse.json(
        {
          error:
            "Conversation ID and message are required.",
        },
        { status: 400 }
      );
    }

    if (
      sender !== "customer" &&
      sender !== "admin"
    ) {
      return NextResponse.json(
        { error: "Invalid sender." },
        { status: 400 }
      );
    }

    const conversation = await db
      .collection("chatConversations")
      .doc(conversationId)
      .get();

    if (!conversation.exists) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    const messageId = await addChatMessage({
      conversationId,
      sender,
      message,
    });

    await db
      .collection("chatConversations")
      .doc(conversationId)
      .update({
        updatedAt: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      messageId,
    });
  } catch (error) {
    console.error("Send chat message error:", error);

    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 500 }
    );
  }
}