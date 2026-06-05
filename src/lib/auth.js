import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/jwt";
import { findUserById, sanitizeUser } from "@/lib/users";

export async function getAuthUser(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = verifyToken(token);

  if (!payload?.sub) {
    return null;
  }

  const user = await findUserById(payload.sub);
  return sanitizeUser(user);
}

export async function requireAuth(request) {
  const user = await getAuthUser(request);

  if (!user) {
    return {
      user: null,
      error: {
        success: false,
        message: "Authentication required",
      },
    };
  }

  return {
    user,
    error: null,
  };
}
