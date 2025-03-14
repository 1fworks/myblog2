import { Metadata } from "next";
import { editMetadata } from "@/libs/metadata";
import UWU from './about.mdx'

export const metadata: Metadata = editMetadata('About');
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