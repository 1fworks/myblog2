import { Metadata } from "next";
import { siteSetting } from "../site.setting";
import { GET as getImageData } from "../(route)/api/getAllArtImages/route";
import { Gallery } from "./components/gallery";

export const metadata: Metadata = {
  title: 'Art',
  alternates: {
    canonical: `/art`,
  },
  openGraph: {
    siteName: `Art | ${siteSetting.site.title}`,
    title: `Art | ${siteSetting.site.title}`,
    description: siteSetting.site.description,
    type: 'website',
    url: `${siteSetting.site.url}/art`,
    images: siteSetting.site.image,
  }
}
export const dynamic = 'force-static'

export default async function Art() {
  const galleryData = await (await getImageData()).json()
  const keys = Object.keys(galleryData).sort((a, b)=>{
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
  return (
    <div>
      {keys.map((key, i)=>{
        return (
          <Gallery
            className={i==0?'mt5':''}
            key={`img-${i}`}
            listName={`${key.slice(2)}`}
            imageList={galleryData[key].reverse()}
          />
        )
      })}
    </div>
  )
}