import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
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

function streamFile(pathname: string, start?: number, end?: number) {
  return Readable.toWeb(createReadStream(pathname, { start, end })) as ReadableStream<Uint8Array>;
}

function parseRangeHeader(range: string | null, size: number) {
  const match = range?.match(/^bytes=(\d*)-(\d*)$/);

  if (!match) {
    return null;
  }

  const [, startValue, endValue] = match;
  const fallbackStart = startValue ? Number.parseInt(startValue, 10) : 0;
  const fallbackEnd = endValue ? Number.parseInt(endValue, 10) : size - 1;
  const start = Number.isFinite(fallbackStart) ? fallbackStart : 0;
  const end = Number.isFinite(fallbackEnd) ? Math.min(fallbackEnd, size - 1) : size - 1;

  if (start < 0 || end < start || start >= size) {
    return null;
  }

  return { start, end };
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
      const fileStat = await stat(localPath);
      const contentType = getLocalContentType(blobPathname);
      const range = parseRangeHeader(request.headers.get("range"), fileStat.size);

      if (range) {
        const contentLength = range.end - range.start + 1;

        return new NextResponse(streamFile(localPath, range.start, range.end), {
          status: 206,
          headers: {
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Length": String(contentLength),
            "Content-Range": `bytes ${range.start}-${range.end}/${fileStat.size}`,
            "Content-Type": contentType,
          },
        });
      }

      return new NextResponse(streamFile(localPath), {
        headers: {
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": String(fileStat.size),
          "Content-Type": contentType,
          ...(etag ? { ETag: etag } : {}),
        },
      });
    } catch {
      return NextResponse.json({ message: "Medya bulunamadı." }, { status: 404 });
    }
  }

  return NextResponse.json({ message: "Medya bulunamadı." }, { status: 404 });
}
