const uploadPathPrefix = "/uploads/";
const mediaRoutePrefix = "/api/media/uploads/";

export function toRoutableMediaSource(src: string) {
  if (src.startsWith(uploadPathPrefix)) {
    return `${mediaRoutePrefix}${src.slice(uploadPathPrefix.length)}`;
  }

  return src;
}

export function isDynamicMediaSource(src?: string) {
  return Boolean(src?.startsWith("/api/media/") || src?.startsWith(uploadPathPrefix));
}
