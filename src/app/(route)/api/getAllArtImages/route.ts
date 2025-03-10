export const dynamic = 'force-static'

import { sync } from 'glob';
import path from "path";
import imageSize from 'image-size'

const BASE_PATH = '/public/posts/art';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

const image_files = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

const fileSort = (arr : string[]) => {
  return arr.sort(function (a: string, b: string) {
    let tmp1 : string[]|string = a.split('/')
    let tmp2 : string[]|string = b.split('/')
    tmp1 = tmp1[tmp1.length-1]
    tmp2 = tmp2[tmp2.length-1]
    return tmp1.localeCompare(tmp2, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};

export async function GET(){
  const imgPaths: string[] = fileSort(
    sync(`${POSTS_PATH}/**/*.*`, { posix: true, dotRelative: true } )
    .map((file)=>{
      const tmp = file.split('.')
      if(image_files.includes(tmp[tmp.length-1].toLowerCase())) return file
    })
    .filter((element)=>element!==undefined)
  )

  const index = BASE_PATH.split('/').length
  
  const tmp = imgPaths.map(path => {
    return path.slice(path.indexOf(BASE_PATH)).split('/')[index]
  })
  const category = tmp.filter((v, i) => tmp.indexOf(v) === i)

  const result: { [key:string]:object[] } = {}
  category.forEach((tag)=>{
    result[tag] = []
  })

  imgPaths.forEach((imgPath)=>{
    result[imgPath.slice(imgPath.indexOf(BASE_PATH)).split('/')[index]].push({
      data: imageSize(imgPath),
      filename: imgPath.slice(imgPath.indexOf(BASE_PATH)).replace('/public', '')
    })
  })

  return Response.json(result)
}