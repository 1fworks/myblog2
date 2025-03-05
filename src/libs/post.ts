import { sync } from 'glob';
import fs from "fs";
import path from 'path';
import matter from 'gray-matter';
import imageSize from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

export interface frontmatter_type {
  title?: string;
  description?: string;
  short_description?: string;
  date?: string;
  update?: string;
  tags?: string[];
  order?: boolean;
  preview?: string;
}

export const BASE_PATH = '/public/posts';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

const image_files = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

// generateMetadata
export const readDescription = (filename:string) => {
  const mdxFilePath = `${POSTS_PATH}${filename}`
  if(!fs.existsSync(mdxFilePath)) return { content:undefined, data:undefined }
  return matter.read(mdxFilePath);
}

// generateMetadata
export const readContentAndFrontMatterFromMdxfile = (slug:string[]) => {
  const filename = `${BASE_PATH}/${slug.join("/")}.mdx`;
  const mdxFilePath = path.join(process.cwd(), filename);
  return matter.read(mdxFilePath);
}

// getAllPosts(['_description.mdx']);
export const getAllPosts = (except:undefined|string[] = undefined) => {
  const postPaths: string[] = sync(`${POSTS_PATH}/**/*.mdx`, { posix: true, dotRelative: true } );
  return postPaths.map((path) => {
    const postPath = path.slice(path.indexOf(BASE_PATH))
    if(postPath[BASE_PATH.length+1] === '_') return undefined;
    if(except !== undefined){
      if(except.find((word:string)=>
          postPath.indexOf(word) > -1
        ) !== undefined){
        return undefined
      }
    }
    return {
      slug: postPath.replace('.mdx', ''),
    };
  }).filter((element)=>element !== undefined);
};

// for sitemap
// getAllPostsWithFrontMatter(['_description.mdx'])
export const getAllPostsWithFrontMatter = (except:undefined|string[] = undefined, withContent:boolean=false) => {
  const posts = getAllPosts();
  return posts.map((post)=>{
    const mdxFilePath = path.join(process.cwd(), `${post.slug}.mdx`);
    if(except !== undefined){
      if(except.find((word:string)=>
          mdxFilePath.indexOf(word) > -1
        ) !== undefined){
        return undefined
      }
    }
    const { content, data } : { content:string, data:frontmatter_type } = matter.read(mdxFilePath);
    return {
      url: post.slug,
      frontmatter: data,
      content: withContent ? content : undefined
    };
  }).filter((element)=>element !== undefined)
};

// for feed.xml
// getAllPostsWithContent(['_description.mdx'])
export const getAllPostsWithContent = (except:undefined|string[] = undefined) => {
  const posts = getAllPostsWithFrontMatter(except, true)
  return posts;
}

// only archive folder
export const getAllFolder = () => {
  const files: string[] = sync(`${POSTS_PATH}/**/*.mdx`, { posix: true, dotRelative: true } );
  const folderPaths: string[] = files.map(file=>{
    if(file.split('/').slice(-1)[0][0] !== '_') {
      const tmp = file.split('/')
      tmp.pop()
      return tmp.join('/')
    }
  }).filter(element=>element !== undefined)

  return folderPaths.filter((v, i) => folderPaths.indexOf(v) === i).map((path) => {
    return {
      slug: path.slice(path.indexOf(BASE_PATH)),
    };
  });
};

export const getAllSpecificFolder = (slug: string[]) => {
  const folderPaths: string[] = sync(`${POSTS_PATH}/${slug.join("/")}/**/`, { posix: true, dotRelative: true } );
  return folderPaths.map((path) => {
    return {
      slug: path.slice(path.indexOf(BASE_PATH)).replace(BASE_PATH, ""),
    };
  });
}

// for findImage
export const getAllSpecificFolderForFile = (filename: string, slugs: string[] = [], imgPath: string = "/public") : string[] => {
  const publicFolder = `${path.join(process.cwd(), imgPath)}`
  let folderPaths: string[] = []
  
  if(slugs.length > 0)
    folderPaths = sync(`${publicFolder}/${slugs.join("/")}/${filename}`)
  if(folderPaths.length === 0)
    folderPaths = sync(`${publicFolder}/${filename}`, { posix: true, dotRelative: true } );
  if(folderPaths.length === 0)
    folderPaths = sync(`${publicFolder}/**/${filename}`, { posix: true, dotRelative: true } );

  return folderPaths.map(path => {
    return path.slice(path.indexOf(imgPath)).replace("/public", "")
  });
}

// for archive
export const getDescription = (slugs:string[])=>{
  const slugPath = `${BASE_PATH}/${slugs.join("/")}`;
  const currFolder = path.join(process.cwd(), `${slugPath}`)
  const folder = sync(`${currFolder}/*/`, { posix: true, dotRelative: true }).filter((path)=>{
    if(sync(`${path}/*.mdx`).length > 0) return true;
  })
  const folder_n = folder.length
  const file_n = sync(`${currFolder}/*.mdx`, { posix: true, dotRelative: true })
    .map((file)=>{if(file.split('/').slice(-1)[0][0] !== '_') return file})
    .filter((element)=>element !== undefined)
    .length;
  try{
    const mdxFilePath = path.join(process.cwd(), `${slugPath}/_description.mdx`);
    const { data } = matter.read(mdxFilePath);
    return {
      title: `Things about "${slugs.slice(-1)[0]}"`, description: 'uwu', order: true,
      ...data,
      folder: folder_n,
      file: file_n,
    }
  }
  catch(err){
    console.log(err)
    return {
      title: `Things about "${slugs.slice(-1)[0]}"`, description: 'uwu', order: true,
      folder: folder_n,
      file: file_n,
    }
  }
}

export const getImgDataList = () => {
  const imgPaths: string[] =
    sync(`${POSTS_PATH}/**/*.*`, { posix: true, dotRelative: true } )
    .map((file)=>{
      const tmp = file.split('.')
      if(image_files.includes(tmp[tmp.length-1])) return file
    })
    .filter((element)=>element!==undefined)

  const result : { [key:string]: ISizeCalculationResult } = {}
  
  imgPaths.forEach((img)=>{
    result[img.slice(img.indexOf(BASE_PATH)).replace('/public', '')] = imageSize(img) as ISizeCalculationResult
  })

  return result
}