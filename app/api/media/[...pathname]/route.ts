import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { readPrivateBlob } from "../../../lib/blob-storage";

export const runtime = "nodejs";

type MediaRouteContext = {
  params: Promise<{
    pathname?: string[];
  }>;
};

function sanitizePathname(parts: string[]) {
  return parts.filter((part) => part && part !== "." && part !== "..").join("/");
}

function getLocalContentType(pathname: string) {
  const extension = path.extname(pathname).toLowerCase();

  if (extension === ".mp4") {
    return "video/mp4";
  }

  if (extension === ".webm") {
    return "video/webm";
  }

  if (extension === ".mov") {
    return "video/quicktime";
  }

  return "image/webp";
}

export async function GET(request: NextRequest, context: MediaRouteContext) {
  const { pathname = [] } = await context.params;
  const blobPathname = sanitizePathname(pathname);

  if (!blobPathname) {
    return NextResponse.json({ message: "Medya bulunamadı." }, { status: 404 });
  }

  const etag = request.headers.get("if-none-match") ?? undefined;
  const blob = await readPrivateBlob(blobPathname);

  if (blob?.statusCode === 304) {
    return new NextResponse(null, { status: 304 });
  }

  if (blob?.statusCode === 200 && blob.stream) {
    return new NextResponse(blob.stream, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": blob.blob.contentType,
        ETag: blob.blob.etag,
      },
    });
  }

  if (blobPathname.startsWith("uploads/")) {
    const localPath = path.join(process.cwd(), "public", blobPathname);

    try {
      const file = await readFile(localPath);

      return new NextResponse(file, {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": getLocalContentType(blobPathname),
          ...(etag ? { ETag: etag } : {}),
        },
      });
    } catch {
      return NextResponse.json({ message: "Medya bulunamadı." }, { status: 404 });
    }
  }

  return NextResponse.json({ message: "Medya bulunamadı." }, { status: 404 });
}
