/**
 * Add `reveal` class to headings so blog MD matches site scroll animation.
 */
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export function rehypeRevealHeadings() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      const raw = node.properties.className;
      const list = Array.isArray(raw)
        ? raw.map(String)
        : raw != null && raw !== true
          ? [String(raw)]
          : [];
      if (!list.includes('reveal')) list.push('reveal');
      node.properties.className = list;
    });
  };
}
