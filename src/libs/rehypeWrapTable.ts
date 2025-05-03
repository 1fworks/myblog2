import { visit } from 'unist-util-visit';
import { Node } from 'unist';
import { Element } from "mdx/types";
import { h } from 'hastscript';

export const rehypeWrapTables = () => {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element, index: number, parent) => {
      if (node.tagName === 'table' && typeof index === 'number') {
        const wrapperNode = h('div.table-wrapper', [node])
        parent.children[index] = wrapperNode
      }
    })
  }
}