import { visit } from "unist-util-visit";
import { Node } from 'unist';
import { Element } from "mdx/types";

const page_width = 750

const custom_img_attr = (url: string, alt: string|undefined = undefined, imgInfo: {width:number, height:number}|undefined=undefined) => {
  const tmp = url.split('/')
  const filename = tmp[tmp.length - 1]
  
  const attr = {
    filename: filename,
    src: url,
    alt: alt,
    imgWidth: -1,
    imgHeight: -1,
  }
  if(imgInfo !== undefined){
    let w = imgInfo.width
    let h = imgInfo.height
    if(w > page_width){
      h = Math.round(h * page_width / w)
      w = page_width
    }
    attr.imgWidth = w
    attr.imgHeight = h
  }
  else{
    attr.imgWidth = 0
    attr.imgHeight = 0
  }
  return attr
}

export function rehypeObsidianMedia(imgInfoList:{[key:string]:{width:number, height:number, type:string}}) {
  return (tree: Node) => {
    visit(tree, 'element', (node:Element, /*index, parent*/) => {
      const alt:string = node.properties.alt
      if(alt) {
        if(alt === 'waveplayer-2024') {
          node.tagName = 'WavePlayer2024'
          node.properties = {
            audioUrl: node.properties.src
          }
        }
        else if(alt.indexOf('audiofile-') === 0) {
          node.tagName = 'MyAudio'
          node.properties = {
            audioUrl: node.properties.src
          }
        }
        else if(alt.indexOf('videofile-') === 0) {
          node.tagName = 'video'
          node.properties = {
            src: node.properties.src
          }
        }
        else if(alt.indexOf('file-') === 0) {
          
        }
        else if(node.tagName === 'img') {
          node.tagName = 'MyNextImage'
          node.properties = custom_img_attr(node.properties.src, node.properties.alt, imgInfoList[node.properties.src])
        }
      }
    })
  };
}