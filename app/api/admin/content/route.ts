import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "../../../lib/cms-content";
import { isAdminApiRequest } from "../../../lib/admin-auth";
import type { CmsContent } from "../../../lib/cms-types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await isAdminApiRequest(request))) {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
  }

  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminApiRequest(request))) {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CmsContent | null;

  if (!body) {
    return NextResponse.json({ message: "Geçersiz içerik verisi." }, { status: 400 });
  }

  const content = await saveSiteContent(body);

  ["/", "/galeri", "/hakkimizda", "/turlar", "/rota"].forEach((path) => {
    revalidatePath(path);
  });

  return NextResponse.json(content);
}
