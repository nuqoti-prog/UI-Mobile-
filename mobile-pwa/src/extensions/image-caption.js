export function normalizeCaption(caption) {
  return caption?.trim()?.replace(/\s+/g, ' ') || '';
}
