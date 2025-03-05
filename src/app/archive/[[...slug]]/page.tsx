import { getAllPostsWithContent, getDescription, frontmatter_type } from "@/libs/post";
import { ArchivePageWithSearchBar } from "./components/archivepage";

import { generateMetadata } from "./generateMetadata";
export { generateMetadata };
import { generateStaticParams } from "./generateStaticParams";
export { generateStaticParams };
export const dynamicParams = false;
export const dynamic = 'force-static'

export const getFiles = async(slugs: string[]|undefined) => {
  const postdata = getAllPostsWithContent(['_description.mdx'])
  
  const files = postdata.map((post:{frontmatter:frontmatter_type, url:string})=>{
    const tmp = post.url.split('/').slice(3)
    if(slugs !== undefined){
      if(tmp.length !== slugs.length + 1) return undefined
      for(let i=0;i<tmp.length-1;i+=1){
        if(tmp[i] !== slugs[i]) return undefined
      }
    }
    const date = post.frontmatter.date ? post.frontmatter.date : post.frontmatter.update;
    const title = post.frontmatter.title
    if(date && title){
      return {
        date: date,
        title: title,
        url: `/post/${tmp.join('/')}`,
      }
    }
  }).filter((element)=>element !== undefined)
  .sort((a, b)=>{
    if(a.date === undefined) return 1
    else if(b.date === undefined) return -1
    return (new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  return { postdata: postdata, files: files }
}

export default async function Archive({ params }: { params : Promise<{slug: string[]}> }) {
  const slugs = (await params).slug ? (await params).slug : []
  const { postdata, files } = await getFiles(slugs)
  
  const tmp = postdata.map((post:{frontmatter:frontmatter_type, url:string})=>{
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
  }).filter((element)=>element !== undefined)
  .sort((a, b)=>{
    if(a.date === undefined) return 1
    else if(b.date === undefined) return -1
    return (new Date(b.date).getTime() - new Date(a.date).getTime())
  }).map((data:{url:string})=>data.url)

  const folders = tmp.filter((v:string, i:number) => tmp.indexOf(v) === i).map((element:string)=>{
    const folder_path = [...slugs, ...element.split('/').slice(-1)]
    return {url: element, description:getDescription(folder_path)}
  }).map((element)=>{
    return {
      ...element.description,
      url: element.url
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