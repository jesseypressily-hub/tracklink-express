import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const testRef = db.collection("system").doc("firebaseTest");

    await testRef.set({
      connected: true,
      message: "TrackLink Express Firebase is working.",
      testedAt: new Date(),
    });

    const snapshot = await testRef.get();

    return NextResponse.json({
      success: true,
      message: snapshot.data()?.message,
    });
  } catch (error) {
    console.error("Firebase test error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Firebase connection failed.",
      },
      { status: 500 }
    );
  }
}