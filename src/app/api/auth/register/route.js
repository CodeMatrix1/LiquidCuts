import { NextResponse } from "next/server";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME, signToken } from "@/lib/jwt";
import { createUser, findUserByEmail, sanitizeUser } from "@/lib/users";

function validatePayload({ name, email, password }) {
  if (!name || !email || !password) {
    return "Name, email, and password are required";
  }
  if (!email.includes("@")) {
    return "Enter a valid email address";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validationError = validatePayload(body);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account already exists for this email" },
        { status: 409 }
      );
    }

    const user = await createUser(body);
    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create account", error: error.message },
      { status: 500 }
    );
  }
}
