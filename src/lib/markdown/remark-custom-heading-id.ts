/**
 * Support `## Heading {#custom-id}` in blog Markdown (preserve TOC anchors).
 */
import { visit } from 'unist-util-visit';
import type { Root, Heading, PhrasingContent, Text } from 'mdast';

const ID_RE = /\s*\{#([A-Za-z][\w:-]*)\}\s*$/;

function trimTrailingEmpty(children: PhrasingContent[]) {
  while (children.length) {
    const last = children[children.length - 1];
    if (last.type === 'text' && !last.value.trim()) {
      children.pop();
      continue;
    }
    break;
  }
}

export function remarkCustomHeadingId() {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      if (!node.children.length) return;
      const last = node.children[node.children.length - 1];
      if (last.type !== 'text') return;
      const match = last.value.match(ID_RE);
      if (!match) return;

      const id = match[1];
      const next = last.value.replace(ID_RE, '');
      if (next) {
        (last as Text).value = next;
      } else {
        node.children.pop();
      }
      trimTrailingEmpty(node.children);

      node.data ??= {};
      node.data.hProperties = { ...(node.data.hProperties as object), id };
      // Used by some remark → rehype bridges / TOC helpers
      (node.data as { id?: string }).id = id;
    });
  };
}
