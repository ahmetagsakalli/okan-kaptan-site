import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminCookieOptions,
  createAdminToken,
  isAdminConfigured,
  verifyAdminPassword,
} from "../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { message: "Admin şifresi veya oturum anahtarı yapılandırılmamış." },
      { status: 503 },
    );
  }

  if (!body?.password || !(await verifyAdminPassword(body.password))) {
    await new Promise((resolve) => setTimeout(resolve, 450));

    return NextResponse.json({ message: "Şifre hatalı." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createAdminToken(), adminCookieOptions);

  return response;
}
