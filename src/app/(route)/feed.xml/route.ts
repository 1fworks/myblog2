import { BASE_PATH, getAllPostsWithContent } from "@/libs/post";
import { siteSetting } from "@/app/site.setting";
import { getTextFromContext } from "@/libs/mdx";
import { sortPost } from "@/app/sitemap";

import RSS from 'rss';

export const dynamic = 'force-static'

export async function GET(){
    const posts = getAllPostsWithContent(['_description.mdx'])
    const orderedDate = sortPost(posts)
    const recentPost = orderedDate[0].frontmatter;

    const feed = new RSS({
        title: siteSetting.site.title,
        description: siteSetting.site.description,
        site_url: siteSetting.site.url,
        feed_url: `${siteSetting.site.url}/feed.xml`,
        copyright: siteSetting.author.name,
        language: siteSetting.site.lang,
        pubDate: recentPost.update ? recentPost.update : recentPost.date,
    })

    const promises = orderedDate.map(async (element)=>{
        const description = await getTextFromContext(element.content);
        if(element.frontmatter.title) {
            feed.item({
                title: element.frontmatter.title,
                description: description,
                url: `${siteSetting.site.url}${element.url.replace(BASE_PATH, '/post')}`,
                date: element.frontmatter.date ? element.frontmatter.date : (element.frontmatter.update ? element.frontmatter.update : new Date())
            })
        }
    })
    await Promise.all(promises)
    
    return new Response(feed.xml(/*{indent:true}*/), {
        headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
        },
    }
)
}