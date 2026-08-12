export function isDynamicMediaSource(src?: string) {
  return Boolean(src?.startsWith("/api/media/"));
}
