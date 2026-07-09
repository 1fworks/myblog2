import { getAllPostsWithContent, getDescription, frontmatter_type } from "@/libs/post";
import { ArchivePageWithSearchBar } from "./components/archivepage";
import dayjs from "@/libs/myDayjs";

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
  })
  .filter((element)=>element !== undefined)
  .sort((a, b)=>{
    if(a.date === undefined) return 1
    else if(b.date === undefined) return -1
    return (dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
  })

  return { postdata: postdata, files: files }
}

export default async function Archive({ params }: { params : Promise<{slug: string[]}> }) {
  const slugs = (await params).slug ? (await params).slug : []
  const { postdata, files } = await getFiles(slugs)
  
  const tmp = postdata.map((post:{frontmatter:frontmatter_type, url:string})=>{
    const tmp = post.url.split('/').slice(3)
    if(tmp.length < slugs.length + 2) return undefined
    for(let i=0;i<slugs.length;i++){
      if(slugs[i] !== tmp[i]) return undefined
    }
    const date = post.frontmatter.date ? post.frontmatter.date : post.frontmatter.update;
    const title = post.frontmatter.title
    return {
      date: date,
      title: title,
      url: `/archive/${tmp.slice(0, tmp.length-1).join('/')}`,
      nestedFolderFile: (tmp.length > slugs.length + 2)
    }
  })
  .filter((element)=>element !== undefined)
  .map((data:{
    url:string,
    date:string|undefined,
    nestedFolderFile: boolean
  })=>{
    return {
      url: data.url,
      last_update: data.date ? data.date : '1000-01-01',
      nestedFolderFile: data.nestedFolderFile
    }
  })
  
  const tmp_folders = tmp.map((v:{url:string, last_update:string, nestedFolderFile:boolean}, i:number)=>{
    let last_update = v.last_update
    for(let j=0;j<tmp.length;j+=1){
      if(i === j) continue
      if(tmp[j].url.indexOf(v.url) === 0) {
        if(dayjs(tmp[j].last_update).valueOf() > dayjs(last_update).valueOf()) last_update = tmp[j].last_update
      }
    }
    return {
      url: v.url,
      last_update: last_update
    }
  })
  .sort((a, b)=>{
    if(a.last_update === undefined) return 1
    else if(b.last_update === undefined) return -1
    return (dayjs(b.last_update).valueOf() - dayjs(a.last_update).valueOf())
  })
  .map((element)=>{
    const tmp = element.url.split('/')
    const folder_path = [...tmp.slice(2, 2+slugs.length+1)]
    const result = {
      ...element,
      folder_path: folder_path,
    }
    result.url = `/archive/${folder_path.join("/")}`
    return result
  })

  const folders = tmp_folders.filter((v, i) => { // tmp.indexOf(v) === i
    for(let j=0;j<i;j+=1){
      if(tmp_folders[j].folder_path.join("/") === v.folder_path.join("/")) return false
    }
    return true
  })
  .map((element)=>{
    return {
      ...getDescription(element.folder_path),
      url: element.url,
      last_update: element.last_update,
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