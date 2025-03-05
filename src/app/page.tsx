import { getFiles } from "./archive/[[...slug]]/page";
import { GET as getImageData } from "./(route)/api/getAllArtImages/route";
import { RecentPostAndArt } from "@/components/recent/recent";

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
                <h2 className="pl-1">F</h2><h2>&apos;</h2><h2>s</h2>
              </div>
              <div className="flex flex-row -mt-1 overflow-hidden">
                {
                  ['B', 'L', 'O', 'G'].map((text, i)=>{
                    return (
                      <h1
                        className="opacity-0 animate-climb70-animation"
                        style={{
                          animationDelay: `${(i+1)*100}ms`,
                          animationDuration: `${1000}ms`
                        }}
                        key={`text ${text}`}
                      >
                        {text}
                      </h1>
                    )
                  })
                }
              </div>
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