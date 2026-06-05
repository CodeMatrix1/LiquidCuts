import crypto from "crypto";

export const AUTH_COOKIE_NAME = "liquidcuts_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decodeBase64url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sign(value) {
  return crypto
    .createHmac("sha256", getJwtSecret())
    .update(value)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const body = {
    ...payload,
    iat: now,
    exp: now + AUTH_COOKIE_MAX_AGE,
  };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedBody = base64url(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedBody}`);

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

export function verifyToken(token) {
  if (!token) return null;

  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;

  const expectedSignature = sign(`${header}.${body}`);
  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(decodeBase64url(body));
  } catch {
    return null;
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
