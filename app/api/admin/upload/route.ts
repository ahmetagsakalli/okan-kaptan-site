import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { isAdminApiRequest } from "../../../lib/admin-auth";
import { writePrivateBlobBytes } from "../../../lib/blob-storage";

export const runtime = "nodejs";

const maxUploadBytes = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function slugifyFilename(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 58);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminApiRequest(request))) {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Görsel dosyası bulunamadı." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ message: "Sadece JPG, PNG veya WebP yüklenebilir." }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ message: "Görsel 8 MB'tan küçük olmalı." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filename = `${Date.now()}-${slugifyFilename(file.name) || "gorsel"}.webp`;
  const blobPathname = `uploads/${filename}`;
  const outputPath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  const sharp = (await import("sharp")).default;
  const optimized = await sharp(bytes)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();

  if (await writePrivateBlobBytes(blobPathname, optimized, "image/webp")) {
    return NextResponse.json({
      url: `/api/media/${blobPathname}`,
      size: optimized.byteLength,
    });
  }

  await mkdir(uploadDir, { recursive: true });
  await writeFile(outputPath, optimized);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    size: optimized.byteLength,
  });
}
