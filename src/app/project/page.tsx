import { Metadata } from "next";
import { editMetadata } from "@/libs/metadata";
import { getAllPostsWithFrontMatter } from "@/libs/post";
import { MyNextImage } from "@/components/image/mynextImage";
import { findFile } from "@/libs/findFile";
import dayjs from "dayjs";
import Link from "next/link";

export const metadata: Metadata = editMetadata('Project');
export const dynamic = 'force-static'

export default function Project() {
  const posts = getAllPostsWithFrontMatter().filter((post)=>{
    if(post.frontmatter.tags && post.frontmatter.tags.indexOf('project') > -1) return true;
  })
  .sort((a, b)=>{
    if(a.frontmatter.date === undefined) return 1
    else if(b.frontmatter.date === undefined) return -1
    return (new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
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
            src: findFile((post.frontmatter.preview as string), []),
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
                    <div className="proj-title">{post.frontmatter.title}</div>
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