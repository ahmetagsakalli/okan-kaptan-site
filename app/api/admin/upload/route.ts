import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { isAdminApiRequest } from "../../../lib/admin-auth";
import { writePrivateBlobBytes } from "../../../lib/blob-storage";

export const runtime = "nodejs";

const maxImageUploadBytes = 8 * 1024 * 1024;
const maxVideoUploadBytes = 120 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedVideoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const videoExtensions = new Map([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
  ["video/quicktime", "mov"],
]);

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
    return NextResponse.json({ message: "Medya dosyası bulunamadı." }, { status: 400 });
  }

  const isImage = allowedImageTypes.has(file.type);
  const isVideo = allowedVideoTypes.has(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { message: "Sadece JPG, PNG, WebP, MP4, WebM veya MOV yüklenebilir." },
      { status: 400 },
    );
  }

  if (isImage && file.size > maxImageUploadBytes) {
    return NextResponse.json({ message: "Görsel 8 MB'tan küçük olmalı." }, { status: 400 });
  }

  if (isVideo && file.size > maxVideoUploadBytes) {
    return NextResponse.json({ message: "Video 120 MB'tan küçük olmalı." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const bytes = Buffer.from(await file.arrayBuffer());

  if (isImage) {
    const filename = `${Date.now()}-${slugifyFilename(file.name) || "gorsel"}.webp`;
    const blobPathname = `uploads/${filename}`;
    const outputPath = path.join(uploadDir, filename);
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
        kind: "image",
        contentType: "image/webp",
      });
    }

    await mkdir(uploadDir, { recursive: true });
    await writeFile(outputPath, optimized);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      size: optimized.byteLength,
      kind: "image",
      contentType: "image/webp",
    });
  }

  const extension = videoExtensions.get(file.type) ?? "mp4";
  const filename = `${Date.now()}-${slugifyFilename(file.name) || "video"}.${extension}`;
  const blobPathname = `uploads/${filename}`;
  const outputPath = path.join(uploadDir, filename);

  if (await writePrivateBlobBytes(blobPathname, bytes, file.type)) {
    return NextResponse.json({
      url: `/api/media/${blobPathname}`,
      size: bytes.byteLength,
      kind: "video",
      contentType: file.type,
    });
  }

  await mkdir(uploadDir, { recursive: true });
  await writeFile(outputPath, bytes);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    size: bytes.byteLength,
    kind: "video",
    contentType: file.type,
  });
}
