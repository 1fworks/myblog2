import { visit } from "unist-util-visit";
import { Node } from 'unist';
import { Element } from "mdx/types";

export function rehypeUnwrapMyNextImagesFromParagraph() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element, index, parent)=>{
      if(node.tagName !== 'p') return;

      const children = node.children
      const newNodes: Element = []

      children.forEach((child: Element) => {
        if(child.type === 'element' && child.tagName === 'MyNextImage') {
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