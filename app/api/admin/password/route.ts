import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieName,
  adminCookieOptions,
  createAdminToken,
  isAdminApiRequest,
  verifyAdminPassword,
} from "../../../lib/admin-auth";
import { saveAdminPassword } from "../../../lib/admin-settings";

export const runtime = "nodejs";

type PasswordRequestBody = {
  currentPassword?: string;
  nextPassword?: string;
};

export async function POST(request: NextRequest) {
  if (!(await isAdminApiRequest(request))) {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as PasswordRequestBody | null;
  const currentPassword = body?.currentPassword;
  const nextPassword = body?.nextPassword;

  if (!currentPassword || !nextPassword) {
    return NextResponse.json({ message: "Mevcut şifre ve yeni şifre gerekli." }, { status: 400 });
  }

  if (nextPassword.length < 12) {
    return NextResponse.json({ message: "Yeni şifre en az 12 karakter olmalı." }, { status: 400 });
  }

  if (!(await verifyAdminPassword(currentPassword))) {
    await new Promise((resolve) => setTimeout(resolve, 450));

    return NextResponse.json({ message: "Mevcut şifre hatalı." }, { status: 401 });
  }

  await saveAdminPassword(nextPassword);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createAdminToken(), adminCookieOptions);

  return response;
}
