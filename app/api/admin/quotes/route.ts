import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await db
      .collection("quoteRequests")
      .orderBy("createdAt", "desc")
      .get();

    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Firebase get quotes error:", error);

    return NextResponse.json(
      {
        error: "Unable to load quote requests.",
      },
      { status: 500 }
    );
  }
}
