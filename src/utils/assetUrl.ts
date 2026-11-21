export function withBaseUrl(assetPath: string): string {
  if (!assetPath || /^(?:https?:|data:|blob:)/i.test(assetPath)) {
    return assetPath;
  }
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${assetPath.replace(/^\.?\//, '')}`;
}

export function toAbsoluteAssetUrl(assetPath: string): string {
  const resolved = withBaseUrl(assetPath);
  if (typeof window === 'undefined') {
    return resolved;
  }
  return new URL(resolved, window.location.href).href;
}
