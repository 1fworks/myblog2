import path from "path";
import fs from "fs";

import { siteSetting } from "@/app/site.setting";

import { MDXContent } from "@/components/mdx/mdxContent";
import { notFound } from "next/navigation";
import { BASE_PATH, getDescription } from "@/libs/post";
import { getFiles } from "@/app/archive/[[...slug]]/page";

import { Comment } from "./components/comment";
import matter from "gray-matter";

import { generateMetadata } from "./generateMetadata";
export { generateMetadata };
import { generateStaticParams } from "./generateStaticParams";
export { generateStaticParams };
export const dynamicParams = false;
export const dynamic = 'force-static'

import Link from "next/link";
import dayjs from "dayjs";
import { MiniArchive } from "./components/miniArchive";

export default async function PostPage({ params }: { params : Promise<{ slug: string[] }> }) {
  const slugs = (await params).slug
  if(slugs === undefined) notFound()
  const slugPath = `${BASE_PATH}/${slugs.join("/")}.mdx`;
  const mdxFilePath = path.join(process.cwd(), slugPath);
  
  if(fs.existsSync(mdxFilePath)){
    try{
      const { data, content } = matter.read(mdxFilePath);
      const postdate: string = dayjs(data.date ? data.date : data.update).format('MMM DD, YYYY')
      const title: string = data.title
      // const tags: string[] = data.tags
      const description = getDescription(slugs.slice(0, slugs.length-1))
      const folder: string = description.description
      const folder_link: string = `/archive/${slugs.slice(0, slugs.length-1).join('/')}`
      const order = description.order
      const current = slugs.slice(-1)
      
      const { files } : { files: {
        date: string;
        title: string;
        url: string;
      }[]} = await getFiles(slugs.slice(0, slugs.length - 1))

      if(!order)
        files.reverse()

      const list_curr = files.findIndex((file)=>{
        return file.url.split('/').slice(-1).pop() === current[0]
      })

      return (
        <>
          <div className="post">
            <div className="post-data">
              <Link className="link-color no-style" href={folder_link}>
                <button className="button-disable">← {folder}</button>
              </Link>
              <h1>{title}</h1>
              <div className="flex flex-row gap-4">
                <p>{postdate}</p>
                <p>{siteSetting.author.name}</p>
              </div>
            </div>
            <div className="post-content">
              <MDXContent source={content} slugs={slugs}/>
            </div>
          </div>
          <div className="postnav">
            <div className="post-data">
              <Link className="link-color no-style" href={folder_link}>
                <button className="button-disable">← back to &apos;{folder}&apos;</button>
              </Link>
            </div>
            <MiniArchive files={files} l_curr={list_curr} />
          </div>
          <div className="w-full mt-14 mb-20">
            <Comment customTheme={`${siteSetting.site.url}/assets/styles/giscus-theme.css`}/>
          </div>
        </>
      )
    }
    catch(err){
      console.log(err);
      notFound();
    }
  }
  notFound();
}