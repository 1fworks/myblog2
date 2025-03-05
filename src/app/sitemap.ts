import type { MetadataRoute } from 'next'
import { siteSetting } from './site.setting'
import { getAllPostsWithFrontMatter } from '@/libs/post'
import { BASE_PATH, frontmatter_type } from '@/libs/post'

export const dynamic = 'force-static'

export function sortPost(posts
  :{
    url: string,
    frontmatter: frontmatter_type,
    content: string | undefined
  }[]
) {
  return posts.sort((a, b) => {
    const val_a = a.frontmatter;
    const val_b = b.frontmatter;
    const val1 = val_a.date ? val_a.date : val_a.update
    const val2 = val_b.date ? val_b.date : val_b.update
    if(val1 === undefined)
        return 1
    else if(val2 === undefined)
        return -1
    return (new Date(val2).getTime() - new Date(val1).getTime())
  })
}

export default function sitemap(): MetadataRoute.Sitemap {
  const frontMatter = sortPost(getAllPostsWithFrontMatter(['_description.mdx']))
  frontMatter.forEach((data)=>{
    data.url = `${siteSetting.site.url}/${data.url.replace(BASE_PATH, 'post')}`
  })
  const sitemapFromPosts: MetadataRoute.Sitemap = frontMatter.map((data)=>{
    return {
      url: data.url,
      lastModified: data.frontmatter.date ? data.frontmatter.date : data.frontmatter.update,
      priority: 0.5,
    }
  })
  const sitemapDefault: MetadataRoute.Sitemap = siteSetting.site.sitemap_default.map((data)=>(
    {
      url: `${siteSetting.site.url}${data}`,
    }
  )).reverse()
  return (
    [
      ...sitemapFromPosts,
      ...sitemapDefault,
      {
        url: `${siteSetting.site.url}`,
      }
    ]
  )
}