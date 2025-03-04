import { visit } from "unist-util-visit";
import { Node } from 'unist';
import { Element } from "mdx/types";

const hasImglistClass = (node: Element): boolean => {
  return node.attributes?.some(
    (attr: any) =>
      attr.type === "mdxJsxAttribute"
    && attr.name === "className"
    && attr.value === "post-img-list"
  );
};

export function rehypeRemovePtagInSideList() {
  return (tree: Node) => {
    visit(tree, 'mdxJsxFlowElement', (node:Element, /*index, parent*/) => {
      if(node.name === 'div' && hasImglistClass(node)){
        node.children = node.children.filter((child: Element) => child.tagName !== "p")
      }
    })
  };
}