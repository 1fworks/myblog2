import { serialize } from 'next-mdx-remote/serialize';
import { marked } from 'marked';
import striptags from 'striptags';

export const getTextFromContext = async(content: string|undefined, len: number = -1) => {
  let description = content ? content : "uwu";
  if(content){
    let html = marked(content);
    let text = ""
    if(typeof(html) !== "string"){
        html = await Promise.resolve(html);
    }
    html = html.replaceAll("\n"," ")
    .replace(/<code[^>]*>.*?<\/code>/g, "")
    text = striptags(html)
    .replace(/!\[\[.*?\]\]/g, "")
    .replaceAll('/imglist open', '')
    .replaceAll('/imglist close', '')
    description = text.trim().replace(/\s+/g, " ");
    if(len > 0 && description.length > len) description = `${description.slice(0, len)}...`
  }
  return description;
}

// not used... but useful
export const serializeMdx = (source: string|undefined) => {
  if(source === undefined) return undefined;
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        // plugins
      ],
      rehypePlugins: [
        // plugins
      ],
      format: 'mdx',
    },
  })
};