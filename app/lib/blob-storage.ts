import { get, put } from "@vercel/blob";

export function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function requiresPersistentBlobStorage() {
  return process.env.VERCEL === "1";
}

export async function readPrivateBlobText(pathname: string) {
  if (!hasBlobStorage()) {
    return null;
  }

  const blob = await get(pathname, { access: "private", useCache: false }).catch(() => null);

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return null;
  }

  return new Response(blob.stream).text();
}

export async function writePrivateBlobText(pathname: string, text: string, contentType = "application/json") {
  if (!hasBlobStorage()) {
    return false;
  }

  try {
    await put(pathname, text, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType,
    });
  } catch {
    return false;
  }

  return true;
}

export async function writePrivateBlobBytes(pathname: string, bytes: Buffer, contentType: string) {
  if (!hasBlobStorage()) {
    return false;
  }

  try {
    await put(pathname, bytes, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 31_536_000,
      contentType,
    });
  } catch {
    return false;
  }

  return true;
}

export async function readPrivateBlob(pathname: string) {
  if (!hasBlobStorage()) {
    return null;
  }

  return get(pathname, { access: "private" }).catch(() => null);
}
