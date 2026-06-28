import type { Root } from "mdast";
import type { Plugin } from "unified";
import type { VFile } from "vfile";

interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: string;
}

interface MdxJsxFlowElement {
  type: "mdxJsxFlowElement";
  name: string;
  attributes: MdxJsxAttribute[];
  children: any[];
}

function createCardDiv(children: any[]): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: "div",
    attributes: [{ type: "mdxJsxAttribute", name: "class", value: "shuoshuo-card" }],
    children,
  };
}

export const remarkShuoshuoSplit: Plugin<[], Root> = () => {
  return (tree: Root, file: VFile) => {
    if (!file?.path?.endsWith("说说.mdx")) return;

    const children = tree.children;
    const head: any[] = [];
    const sections: any[] = [];
    let currentSection: any[] | null = null;

    for (const node of children) {
      const nodeType = (node as any).type;
      if (nodeType === "yaml" || nodeType === "mdxjsEsm") {
        head.push(node);
        continue;
      }

      if (nodeType === "heading" && (node as any).depth === 1) {
        if (currentSection) {
          sections.push(createCardDiv(currentSection));
        }
        currentSection = [node];
      } else if (currentSection) {
        currentSection.push(node);
      } else {
        head.push(node);
      }
    }

    if (currentSection) {
      sections.push(createCardDiv(currentSection));
    }

    tree.children = [...head, ...sections] as any;
  };
};
