import { getDescription } from "@/libs/post";
import { ArchivePageWithSearchBar } from "./components/archivepage";

import { generateMetadata } from "./generateMetadata";
export { generateMetadata };
import { generateStaticParams } from "./generateStaticParams";
import { siteSetting } from "@/app/site.setting";
export { generateStaticParams };
export const dynamicParams = false;
export const dynamic = 'force-static'

export const getFiles = async(slugs: string[]|undefined) => {
  const postdata = await fetch(`${siteSetting.site.url}/api/getAllPostsWithContentExcludingDescription`)
  .then((res) => res.json())
  .then((data) => { return data })
  
  const files = postdata.map((post:{frontmatter:{[key: string]:string}, url:string})=>{
    const tmp = post.url.split('/').slice(3)
    if(slugs !== undefined){
      if(tmp.length !== slugs.length + 1) return undefined
      for(let i=0;i<tmp.length-1;i+=1){
        if(tmp[i] !== slugs[i]) return undefined
      }
    }
    const date = post.frontmatter.date ? post.frontmatter.date : post.frontmatter.update;
    const title = post.frontmatter.title
    return {
      date: date,
      title: title,
      url: `/post/${tmp.join('/')}`,
    }
  }).filter((element:{[key:string]:string})=>element !== undefined)
  .sort((a:{date:string}, b:{date:string})=>{
    if(a.date === undefined) return 1
    else if(b.date === undefined) return -1
    return (new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  return { postdata: postdata, files: files }
}

export default async function Archive({ params }: { params : Promise<{slug: string[]}> }) {
  const slugs = (await params).slug ? (await params).slug : []
  const { postdata, files } = await getFiles(slugs)
  
  const tmp = postdata.map((post:{frontmatter:{[key: string]:string}, url:string})=>{
    const tmp = post.url.split('/').slice(3)
    if(tmp.length !== slugs.length + 2) return undefined
    for(let i=0;i<slugs.length;i++){
      if(slugs[i] !== tmp[i]) return undefined
    }
    const date = post.frontmatter.date ? post.frontmatter.date : post.frontmatter.update;
    const title = post.frontmatter.title
    return {
      date: date,
      title: title,
      url: `/archive/${tmp.slice(0, tmp.length-1).join('/')}`,
    }
  }).filter((element:{[key:string]:string})=>element !== undefined)
  .sort((a:{date:string}, b:{date:string})=>{
    if(a.date === undefined) return 1
    else if(b.date === undefined) return -1
    return (new Date(b.date).getTime() - new Date(a.date).getTime())
  }).map((data:{url:string})=>data.url)

  const folders = tmp.filter((v:string, i:number) => tmp.indexOf(v) === i).map((element:string)=>{
    const folder_path = [...slugs, ...element.split('/').slice(-1)]
    return [element, getDescription(folder_path)]
  }).map((element:[url:string, {[key:string]:string|number}])=>{
    return {
      ...element[1],
      url: element[0]
    }
  })

  const archive_route = []
  for(let i=1;i<=slugs.length;i++) {
    const detail = getDescription(slugs.slice(0, slugs.length-i))
    archive_route.push({...detail, url: `/archive/${slugs.slice(0, slugs.length-i).join('/')}`})
  }
  archive_route.reverse()
  const description = getDescription(slugs)

  return (
    <div>
      <ArchivePageWithSearchBar
        data={
          {
            postdata: postdata,
            archive_route: archive_route,
            archive_detail: {
              description: description,
              folders: folders,
              files: files,
            }
          }
        }
      >
      </ArchivePageWithSearchBar>
    </div>
  );
}