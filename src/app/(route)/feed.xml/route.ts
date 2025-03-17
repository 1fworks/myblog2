import { BASE_PATH, getAllPostsWithContent } from "@/libs/post";
import { siteSetting } from "@/app/site.setting";
import { getTextFromContext } from "@/libs/mdx";
import { sortPost } from "@/app/sitemap";
import { findFile } from "@/libs/findFile"

import RSS from 'rss';

export const dynamic = 'force-static'

const image_files = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

export const getFirstImageFromContext = (content: string|undefined, url: string|undefined) => {
  if(!content) return undefined
  const slugs = url?.replace('/public/posts/', '').split('/')
  slugs?.pop()
  const regex = /!\[\[(.+?)\]\]|!\[.*?\]\((.+?)\)/g
  const images = [...content.matchAll(regex)]
  for(let i=0;i<images.length;i+=1){
    const filename: string|undefined = (images[i][1] as string|undefined) || (images[i][2] as string|undefined)
    if(filename) {
      const type = filename.split('.').slice(-1)[0].toLowerCase()
      if(image_files.includes(type)){
        const filepath = findFile(filename, slugs?slugs:[])
        if(filepath) {
          return {
            filepath: filepath,
            type: `image/${type}`
          }
        }
      }
    }
  }
  return undefined
}

export async function GET(){
    const posts = getAllPostsWithContent(['_description.mdx'])
    const orderedDate = sortPost(posts)
    const recentPost = orderedDate[0].frontmatter;

    const feed = new RSS({
        title: siteSetting.site.title,
        description: siteSetting.site.description,
        site_url: siteSetting.site.url,
        feed_url: `${siteSetting.site.url}/feed.xml`,
        image_url: siteSetting.author.avatar,
        copyright: siteSetting.author.name,
        language: siteSetting.site.lang,
        pubDate: recentPost.update ? recentPost.update : recentPost.date,
    })

    const promises = orderedDate.map(async (element)=>{
        const description = await getTextFromContext(element.content);
        const preview_img = getFirstImageFromContext(element.content, element.url);
        if(element.frontmatter.title) {
            const item: RSS.ItemOptions = {
                title: element.frontmatter.title,
                description: description.length < 200 ? description : `${description.slice(0, 150)}...`,
                url: `${siteSetting.site.url}${element.url.replace(BASE_PATH, '/post')}`,
                date: element.frontmatter.date ? element.frontmatter.date : (element.frontmatter.update ? element.frontmatter.update : new Date())
            }
            if(preview_img) {
                item.description = `<img src="${siteSetting.site.url}${preview_img.filepath}"/><br />${item.description}`
            }
            feed.item(item)
        }
    })
    await Promise.all(promises)
    
    return new Response(feed.xml(/*{indent:true}*/), {
        headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
        },
    })
}