import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

const TOPIC_LABEL: Record<BlogPost['data']['topic'], string> = {
  strategy: 'STRATEGIA',
  production: 'PRODUKCJA',
  social: 'SOCIAL',
};

export function topicLabel(post: BlogPost): string {
  return post.data.topicLabel || TOPIC_LABEL[post.data.topic];
}

/** Format date as DD.MM.YYYY for blog meta rows. */
export function formatBlogDate(date: Date): string {
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const y = date.getUTCFullYear();
  return `${d}.${m}.${y}`;
}

export function blogMetaLine(post: BlogPost): string {
  const mins = post.data.readingTime
    ? `${String(post.data.readingTime).padStart(2, '0')} MIN`
    : null;
  const parts = [topicLabel(post), mins, formatBlogDate(post.data.date)].filter(Boolean);
  return parts.join(' · ');
}

export function blogPath(post: BlogPost): string {
  return `/${post.id}/`;
}

export async function getPublishedBlogPosts(lang?: 'pl' | 'en'): Promise<BlogPost[]> {
  const all = await getCollection('blog', ({ data }) => {
    if (data.draft) return false;
    if (data.listed === false) return false;
    if (lang && data.lang !== lang) return false;
    return true;
  });
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
