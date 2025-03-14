import { getFiles } from "./archive/[[...slug]]/page";
import { GET as getImageData } from "./(route)/api/getAllArtImages/route";
import { RecentPostAndArt } from "@/components/recent/recent";
import { siteSetting } from "./site.setting";
import type { Metadata } from 'next'

export const metadata : Metadata = {
  title: siteSetting.site.title,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: siteSetting.site.title,
    title: siteSetting.site.title,
    description: siteSetting.site.description,
    type: 'website',
    url: siteSetting.site.url,
    images: siteSetting.site.image,
  },
}
export const dynamic = 'force-static';

export default async function Home() {
  const files = (await getFiles(undefined)).files.slice(0, 2)
  const galleryData = await (await getImageData()).json()
  const keys = Object.keys(galleryData).sort((a, b)=>{
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
  const images = galleryData[keys[0]].reverse().slice(0, 4)
  return (
      <div className="main-wrapper">
        <div className="item item-left relative">
          <div>
            <div>
              <div
                className="flex flex-row opacity-0 animate-climb70-animation"
                style={{animationDuration:`${1000}ms`}}
              >
                <h2>
                  <span className="h2-style pl-1 transition-text">F</span>
                  <span className="h2-style pl-1 transition-text">&apos;</span>
                  <span className="h2-style pl-1 transition-text">s</span>
                </h2>
              </div>
              <h1 className="flex flex-row -mt-1 overflow-hidden">
                {
                  ['B', 'L', 'O', 'G'].map((text, i)=>{
                    return (
                      <span
                        className="h1-style opacity-0 animate-climb70-animation"
                        style={{
                          animationDelay: `${(i+1)*100}ms`,
                          animationDuration: `${1000}ms`
                        }}
                        key={`text ${text}`}
                      >
                        {text}
                      </span>
                    )
                  })
                }
              </h1>
            </div>
            <div
              className="blog-description opacity-0 animate-climb70-animation"
              style={{
                animationDelay: `${(5)*100}ms`,
                animationDuration: `${500}ms`
              }}
            >
              <p className="pr-1">작업물과 공부한 것들을</p><p>소소하게 올리는 곳</p>
            </div>
          </div>
        </div>
        <RecentPostAndArt className="item item-right" posts={files} images={images} />
      </div>
  );
}