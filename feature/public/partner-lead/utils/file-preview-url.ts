const previewUrlCache = new Map<string, File>();

const createPreviewUrl = (file: File) => URL.createObjectURL(file);

export function getFilePreviewUrl(file: File) {
  for (const [cachedUrl, cachedFile] of previewUrlCache) {
    if (cachedFile === file) return cachedUrl;
  }
  const url = createPreviewUrl(file);
  previewUrlCache.set(url, file);
  return url;
}

export function revokeFilePreviewUrls() {
  previewUrlCache.forEach((_file, url) => URL.revokeObjectURL(url));
  previewUrlCache.clear();
}
