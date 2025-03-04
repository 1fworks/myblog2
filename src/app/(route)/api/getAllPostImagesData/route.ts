export const dynamic = 'force-static'
import { sync } from 'glob';
import path from "path";
import imageSize from 'image-size'

const BASE_PATH = '/public/posts';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

const image_files = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

export const getImgDataList = ()=>{
  const imgPaths: string[] =
    sync(`${POSTS_PATH}/**/*.*`, { posix: true, dotRelative: true } )
    .map((file)=>{
      const tmp = file.split('.')
      if(image_files.includes(tmp[tmp.length-1])) return file
    })
    .filter((element)=>element!==undefined)

  const result: { [key:string]:object } = {}
  
  imgPaths.forEach((img)=>{
    result[img.replace('./public', '')] = imageSize(img)
  })

  return result
}

export async function GET(){
  return Response.json(getImgDataList())
}