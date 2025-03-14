import { Metadata } from "next";
import { siteSetting } from "../site.setting";
import UWU from './about.mdx'

export const metadata: Metadata = {
  title: 'About',
  alternates: {
    canonical: `/about`,
  },
  openGraph: {
    siteName: `About | ${siteSetting.site.title}`,
    title: `About | ${siteSetting.site.title}`,
    description: siteSetting.site.description,
    type: 'website',
    url: `${siteSetting.site.url}/about`,
    images: siteSetting.site.image,
  }
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