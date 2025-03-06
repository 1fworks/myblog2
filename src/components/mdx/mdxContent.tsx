import { VFileCompatible } from 'vfile';
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
// import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeReact from 'rehype-react';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import { rehypeObsidianImage } from "@/libs/rehypeObsidianImage";
import { rehypeUnwrapMyNextImagesFromParagraph } from "@/libs/rehypeUnwrapMyNextImagesFromParagraph";
import { rehypeRemovePtagInSideList } from '@/libs/rehypeRemovePtagInList';
import { MyNextImage } from "../image/mynextImage";
import { findFile } from "@/libs/findFile";
import { siteSetting } from "@/app/site.setting";
import { getImgDataList } from '@/libs/post';

const file_type = {
  image_files: ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'],
  audio_files: ['mp3', 'wav', 'm4a', 'ogg', '3gp', 'flac'], // ,'webm'
  video_files: ['mp4', 'webm', 'ogv', 'mov', 'mkv']
}

export const MDXContent = async(props : { source:string, slugs?: string[] }) => {
  const content = props.source
  const markdownsource: VFileCompatible = content.split('```').map((text, num) => {
    if(num%2 === 1) return text
    
    // for multiple breaks
    text = text.replace(/\n{2,}/g, (match) => "\n<p>" + "<br/>\n".repeat(match.length - 2) + "<br/>\n</p>\n")
    // image group
    text = text.split(/\/imglist open/g).join(`<div className="post-img-list">`)
    text = text.split(/\/imglist close/g).join(`</div>`)
    // remark_breaks
    text = text.replace(/(?<!  |!\[\[(.+?)\]\]|!\[(.+?)\]\(.*?\))\n/g, "  \n")
    // wikilink [[]] ![[]]
    text = text.replace(/\[\[(.+?)\]\]/g, (_, text)=>{
      const check_alias = text.split('|')
      if(check_alias.length < 2) {
        return `[${text}](${text})`;
      }
      else {
        return `[${check_alias[1]}](${check_alias[0]})`;
      }
    })
    // [text](link)
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, (source, text1, text2)=>{
      const file = findFile(text2, props.slugs ? props.slugs : [])
      if(file === undefined) return source;
      
      const modified_filename = file.replaceAll(' ','%20')
      const filetype = modified_filename.slice(-4)
      if(filetype === '.mdx') {
        return `[${text1}](${siteSetting.site.url}${modified_filename.replace('/posts/', '/post/').replace('.mdx', '')})`
      }
      else if(file_type.image_files.indexOf(filetype.slice(1, 4)) > -1){
        // myNextImages
      }
      else if(file_type.audio_files.indexOf(filetype.slice(1, 4)) > -1){
        // TODO
      }
      else if(file_type.video_files.indexOf(filetype.slice(1, 4)) > -1){
        // For videos, please try to use YouTube whenever possible.
        return `[${text1}](${siteSetting.site.url}${modified_filename})`
      }
      else { // (ex. zip)
        return `[${text1}](${siteSetting.site.url}${modified_filename})`
      }
      // const url = `${siteSetting.site.url}/${file[0]==='/'?file.slice(1):file}`
      return `[${text1}](${modified_filename})`
    })
    
    
    // for DOM property
    const properties = [
      // youtube
      ['frameborder', 'frameBorder'],
      ['referrerpolicy', 'referrerPolicy'],
      ['allowfullscreen', 'allowFullScreen']
    ]
    properties.forEach(property => {
      const regex = new RegExp(`<iframe(.+?)${property[0]}(.+?)>`, 'g')
      text = text.replace(regex, (_, text1, text2)=>{
        return `<iframe${text1}${property[1]}${text2}>`
      })
    })
    
    return text
  }).join('```')

  const imgInfoList = getImgDataList() as { [key:string]:{width:number, height:number, type:string} }
  
  return (
    <div>
      <MDXRemote
        source={markdownsource}
        components={{MyNextImage}}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [
              remarkMdx,
              remarkGfm,
            ],
            rehypePlugins: [
              rehypeSlug, [
              rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
              rehypePrism, [
              rehypeToc,
                {
                  headings: ["h1", "h2"],
                }
              ],
              // rehypeUnwrapImages,
              () => rehypeObsidianImage(imgInfoList),
              rehypeUnwrapMyNextImagesFromParagraph,
              rehypeRemovePtagInSideList,
              rehypeReact,
            ],
            format: 'mdx',
          },
        }}
      />
    </div>
  )
}