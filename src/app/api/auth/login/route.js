import { NextResponse } from "next/server";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME, signToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { findUserByEmail, sanitizeUser } from "@/lib/users";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to log in", error: error.message },
      { status: 500 }
    );
  }
}
