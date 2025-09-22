import { visit } from "unist-util-visit";
import { Node } from 'unist';
import type { Code } from 'mdast';

export const remarkVue2Html = () => {
  return (tree: Node) => {
    visit(tree, "code", (node: Code)=>{
      if(node.lang === "vue") {
        node.lang = "html"
      }
    })
  }
}