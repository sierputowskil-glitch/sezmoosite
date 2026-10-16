/**
 * Resolve public `/assets/...` paths to Astro ImageMetadata via Vite glob.
 * Non-eager: only images actually requested get into the build graph.
 */
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../../assets/{blog,portfolio,work,video/yt/posters}/**/*.{jpeg,jpg,png,webp,avif}',
);

function toGlobKey(publicPath: string): string {
  const cleaned = publicPath.split('?')[0].split('#')[0];
  const rel = cleaned.replace(/^\/assets\//, '');
  return `../../assets/${rel}`;
}

export async function resolveLocalImage(
  publicPath: string | undefined | null,
): Promise<ImageMetadata | undefined> {
  if (!publicPath) return undefined;
  if (!publicPath.startsWith('/assets/')) return undefined;

  const loader = modules[toGlobKey(publicPath)];
  if (!loader) return undefined;

  const mod = await loader();
  return mod.default;
}
