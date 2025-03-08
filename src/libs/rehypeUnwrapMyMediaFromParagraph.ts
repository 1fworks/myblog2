import { visit } from "unist-util-visit";
import { Node } from 'unist';
import { Element } from "mdx/types";

const myMedia = ['MyNextImage', 'WavePlayer2024', 'MyAudio', 'MyVideo', 'iframe']

export function rehypeUnwrapMyMediaFromParagraph() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element, index, parent)=>{
      if(node.tagName !== 'p') return;

      const children = node.children
      const newNodes: Element = []

      children.forEach((child: Element) => {
        if(child.type === 'element' && myMedia.indexOf(child.tagName) > -1) {
          // If there's something else in front of the image node, make it a p tag
          if (newNodes.length > 0) {
            parent.children.splice(index++, 0, {
              type: 'element',
              tagName: 'p',
              children: [...newNodes],
            });
            newNodes.length = 0; // init array
          }
          // Subtract the image node out of p.
          parent.children.splice(index++, 0, child);
        } else {
          // Keep collecting non-image nodes.
          newNodes.push(child);
        }
      });

      // Processing the last remaining text.
      if (newNodes.length > 0) {
        parent.children.splice(index++, 0, {
          type: 'element',
          tagName: 'p',
          children: newNodes,
        });
      }
      // Delete the original p tag.
      parent.children.splice(parent.children.indexOf(node), 1);
    })
  }
}