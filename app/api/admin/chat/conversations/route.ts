import { NextResponse } from "next/server";
import { getChatConversations } from "@/lib/firebaseChat";

export async function GET() {
  try {
    const conversations = await getChatConversations();

    return NextResponse.json(conversations);
  } catch (error) {
    console.error(
      "Get admin chat conversations error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load chat conversations.",
      },
      { status: 500 }
    );
  }
}