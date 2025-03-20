import { Metadata } from "next";
import { siteSetting } from "../site.setting";
import UWU from './about.mdx'

import path from "path";
import imageSize from "image-size";

const img_data = imageSize(path.join('public/', siteSetting.site.image_relative))

export const metadata: Metadata = {
  title: 'About',
  alternates: {
    canonical: `/about`,
  },
  openGraph: {
    siteName: siteSetting.site.title,
    title: `About | ${siteSetting.site.title}`,
    description: siteSetting.site.description,
    type: 'website',
    url: `${siteSetting.site.url}/about`,
    images: [
      {
        width: img_data.width,
        height: img_data.height,
        url: siteSetting.site.image
      }
    ]
  },
  twitter: {
    title: `About | ${siteSetting.site.title}`,
    description: siteSetting.site.description,
    card: "summary",
    site: `@${siteSetting.author.twitter}`,
    creator: `@${siteSetting.author.twitter}`,
    images: siteSetting.site.image,
  },
}
export const dynamic = 'force-static'

export default function About() {
  return (
    <div className="about-box mini-spotlight">
      <h1 className="about flex flex-row w-fit overflow-hidden opacity-70">
        {
          ['A','B','O','U','T'].map((text, i)=>{
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
      </h1>
      <UWU/>
    </div>
  )
}