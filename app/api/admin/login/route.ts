import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    console.log("ADMIN_USERNAME loaded:", !!adminUsername);
console.log("ADMIN_PASSWORD loaded:", !!adminPassword);
console.log(
  "Username match:",
  username === adminUsername
);
console.log(
  "Password length match:",
  password.length === adminPassword?.length
);
    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials are not configured.");

      return NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 500 }
      );
    }

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Unable to process login." },
      { status: 500 }
    );
  }
}