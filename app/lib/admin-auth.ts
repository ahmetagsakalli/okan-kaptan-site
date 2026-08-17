import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getAdminSessionVersion, verifyStoredPassword } from "./admin-settings";

export const adminCookieName = "okan_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  exp: number;
  iat: number;
  role: "admin";
  sessionVersion: string;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminConfigured() {
  return getAdminPassword().length >= 12 && getSessionSecret().length >= 32;
}

export async function verifyAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();
  const storedPasswordMatches = await verifyStoredPassword(password);

  if (!isAdminConfigured()) {
    return false;
  }

  if (storedPasswordMatches === true) {
    return true;
  }

  if (storedPasswordMatches === false) {
    return false;
  }

  return safeCompare(password, configuredPassword);
}

export async function createAdminToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + sessionMaxAgeSeconds,
    role: "admin",
    sessionVersion: await getAdminSessionVersion(),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));

  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export async function verifyAdminToken(token?: string) {
  if (!token || !isAdminConfigured()) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !safeCompare(signature, signPayload(encodedPayload))) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    const currentSessionVersion = await getAdminSessionVersion();

    return payload.role === "admin" && payload.exp > now && payload.sessionVersion === currentSessionVersion;
  } catch {
    return false;
  }
}

export async function hasAdminSession() {
  const cookieStore = await cookies();

  return await verifyAdminToken(cookieStore.get(adminCookieName)?.value);
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const host = request.headers.get("host");

  return host ? origin === `${request.nextUrl.protocol}//${host}` : false;
}

export async function isAdminApiRequest(request: NextRequest) {
  return (await verifyAdminToken(request.cookies.get(adminCookieName)?.value)) && isSameOriginRequest(request);
}

export const adminCookieOptions = {
  httpOnly: true,
  maxAge: sessionMaxAgeSeconds,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
