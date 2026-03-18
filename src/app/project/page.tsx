import { Metadata } from "next";
import { siteSetting } from "../site.setting";
import { getAllPostsWithFrontMatter } from "@/libs/post";
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
                        // Kalai Oval Interface Icons Collection by Ananthanath A X Kalaiism, PD License
                        // https://www.svgrepo.com/collection/kalai-oval-interface-icons/
                        <svg className="size-[24px] my-auto mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path d="M4 15L20 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M4 9L20 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
                            <path fill="#ffffff" d="M12.0004 20.8182L11.2862 21.5181C11.4742 21.7101 11.7317 21.8182 12.0004 21.8182C12.2691 21.8182 12.5265 21.7101 12.7146 21.5181L12.0004 20.8182ZM12.0004 3.18188L12.7146 2.48198C12.5265 2.29005 12.2691 2.18188 12.0004 2.18188C11.7317 2.18188 11.4742 2.29005 11.2861 2.48198L12.0004 3.18188ZM14.6004 12.0001C14.6004 15.1611 13.3373 18.0251 11.2862 20.1183L12.7146 21.5181C15.1173 19.0662 16.6004 15.7053 16.6004 12.0001H14.6004ZM11.2861 3.88178C13.3373 5.97501 14.6004 8.83903 14.6004 12.0001H16.6004C16.6004 8.29478 15.1173 4.93389 12.7146 2.48198L11.2861 3.88178ZM9.40039 12.0001C9.40039 8.83903 10.6634 5.97501 12.7146 3.88178L11.2861 2.48198C8.88347 4.93389 7.40039 8.29478 7.40039 12.0001H9.40039ZM12.7146 20.1183C10.6634 18.0251 9.40039 15.1611 9.40039 12.0001H7.40039C7.40039 15.7053 8.88348 19.0662 11.2862 21.5181L12.7146 20.1183Z"></path>
                          </g>
                        </svg>
                        :
                        // S Collection by Icooon Mono, PD License
                        // https://www.svgrepo.com/collection/sports-and-games-icooon-mono-vectors/
                        <svg className="size-[24px] my-auto mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#ffffff">
                          <path d="M510.441,322.894l-29.76-126.56c-15.073-56.252-66.047-95.363-124.286-95.363H155.604 c-58.239,0-109.212,39.11-124.285,95.363l-29.76,126.56c-7.618,36.303,13.34,72.524,48.626,84.001l1.74,0.558 c32.658,10.632,68.288-3.07,85.429-32.831l25.894-38.289c6.502-11.288,18.538-18.25,31.55-18.25h122.406 c13.012,0,25.048,6.962,31.549,18.25l25.894,38.289c17.142,29.761,52.779,43.463,85.438,32.831l1.732-0.558 C497.1,395.418,518.06,359.197,510.441,322.894z M191.046,238.081h-41.689v41.696h-36.295v-41.696H71.373v-36.279h41.689v-41.68 h36.295v41.68h41.689V238.081z M374.728,151.436c12.626,0,22.847,10.221,22.847,22.848c0,12.61-10.221,22.831-22.847,22.831 c-12.61,0-22.831-10.221-22.831-22.831C351.897,161.656,362.118,151.436,374.728,151.436z M329.049,242.801 c-12.61,0-22.839-10.23-22.839-22.856c0-12.602,10.229-22.831,22.839-22.831c12.618,0,22.839,10.229,22.839,22.831 C351.889,232.572,341.668,242.801,329.049,242.801z M374.728,288.471c-12.61,0-22.831-10.221-22.831-22.831 c0-12.627,10.221-22.848,22.831-22.848c12.626,0,22.847,10.221,22.847,22.848C397.575,278.25,387.354,288.471,374.728,288.471z M420.406,242.801c-12.61,0-22.832-10.23-22.832-22.856c0-12.602,10.222-22.831,22.832-22.831 c12.618,0,22.847,10.229,22.847,22.831C443.253,232.572,433.024,242.801,420.406,242.801z" />
                        </svg>
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