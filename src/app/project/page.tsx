import { Metadata } from "next";
import { siteSetting } from "../site.setting";
import { getAllPostsWithFrontMatter } from "@/libs/post";
import { default as NextImage } from "next/image";
import { MyNextImage } from "@/components/image/mynextImage";
import { findFile } from "@/libs/findFile";
import dayjs from "@/libs/myDayjs";
import Link from "next/link";

import path from "path";
import imageSize from "image-size";

const img_data = imageSize(path.join('public/', siteSetting.site.image_relative))

export const metadata: Metadata = {
  title: 'Project',
  alternates: {
    canonical: `/project`,
  },
  openGraph: {
    siteName: siteSetting.site.title,
    title: `Project | ${siteSetting.site.title}`,
    description: siteSetting.site.description,
    type: 'website',
    url: `${siteSetting.site.url}/project`,
    images: [
      {
        width: img_data.width,
        height: img_data.height,
        url: siteSetting.site.image
      }
    ]
  },
  twitter: {
    title: `Project | ${siteSetting.site.title}`,
    description: siteSetting.site.description,
    card: "summary",
    site: `@${siteSetting.author.twitter}`,
    creator: `@${siteSetting.author.twitter}`,
    images: siteSetting.site.image,
  },
}
export const dynamic = 'force-static'

export default function Project() {
  const posts = getAllPostsWithFrontMatter().filter((post)=>{
    if(post.frontmatter.tags && post.frontmatter.tags.indexOf('project') > -1) return true;
  })
  .sort((a, b)=>{
    if(a.frontmatter.date === undefined) return 1
    else if(b.frontmatter.date === undefined) return -1
    return (dayjs(b.frontmatter.date).valueOf() - dayjs(a.frontmatter.date).valueOf())
  }).filter((post)=>{
    if(post.frontmatter.preview !== undefined) return true;
  })
  
  return (
    <>
      <div className="project mx-auto w-full mt-5 mb-5">
        <div className="flex flex-row w-full h-fit mx-auto opacity-70 justify-between overflow-hidden">
          {
            ['P','R','O','J','E','C','T'].map((text, i)=>{
              return (
                <span
                  className="h1-style large opacity-0 animate-climb100-animation"
                  key={`text ${i}`}
                  style={{
                    animationDelay:`${i*50}ms`,
                    animationDuration:`${1000}ms`
                  }}
                >
                  {text}
                </span>
              )
            })
          }
        </div>
      </div>
      {
        posts.map((post, i)=>{
          const post_year = dayjs(post.frontmatter.date).format('YYYY')
          const previous_post_year = dayjs(posts[Math.max(i-1, 0)].frontmatter.date).format('YYYY')
          const preview = {
            filename: (post.frontmatter.preview as string).split('/').slice(-1)[0],
            src: findFile((post.frontmatter.preview as string), ['projects']),
          }
          if(!post.frontmatter.date || !preview.src) return null;
          return (
            <article key={`project ${i}`}>
              <Link
                className="no-style"
                href={post.url.replace('/public/posts', '/post')}
              >
                <div
                  className="proj-item opacity-0 animate-climb100-animation"
                  style={{animationDelay:`${(i+1)*200}ms`}}
                >
                  <div className="proj-text">
                    <div className="flex">
                      { post.frontmatter.proj_icon && post.frontmatter.proj_icon === 'webpage' ?
                        <NextImage
                          className="w-fit h-fit my-auto pr-2"
                          src='/assets/img/icon/internet.png'
                          alt="controller icon"
                          unoptimized={true}
                          width={22}
                          height={22}
                        />
                        :
                        <NextImage
                          className="w-fit h-fit my-auto pr-2"
                          src='/assets/img/icon/controller.png'
                          alt="controller icon"
                          unoptimized={true}
                          width={22}
                          height={22}
                        />
                      }
                      <div className="proj-title">{post.frontmatter.title}</div>
                    </div>
                    <p>{i == 0 || post_year != previous_post_year ? post_year : ''}</p>
                  </div>
                  { post.frontmatter.short_description &&
                    <p className="short-description">{post.frontmatter.short_description}</p>
                  }
                  <div className="skeleton">
                    <MyNextImage
                      filename={preview.filename}
                      src={preview.src}
                      clickable={false}
                      ratio={16/5}
                      cover={true}
                      animate={false}
                      imgWidth={750}
                      imgHeight={234}
                    />
                  </div>
                </div>
              </Link>
            </article>
          )
        })
      }
    </>
  )
}