import { Metadata } from "next";
import path from "path";
import { metadata as layoutMetadata } from "@/app/layout";
import lodash from 'lodash';
import { siteSetting } from "@/app/site.setting";
import imageSize from "image-size";

export const myOpenGraph = (
  url:string|undefined = undefined,
  title:string|undefined = undefined,
  description:string|undefined = undefined)
: Metadata => {
  const img_data = imageSize(path.join('public/', siteSetting.site.image_relative))
  return ({
    openGraph: {
      siteName: siteSetting.site.title,
      title: title ? title : siteSetting.site.title,
      description: description ? description : siteSetting.site.description,
      type: 'website',
      url: url ? url : siteSetting.site.url,
      images: [
        {
          width: img_data.width,
          height: img_data.height,
          url: siteSetting.site.image
        }
      ]
    },
    twitter: {
      title: title ? title : siteSetting.site.title,
      description: description ? description : siteSetting.site.description,
      card: "summary",
      site: `@${siteSetting.author.twitter}`,
      creator: `@${siteSetting.author.twitter}`,
      images: siteSetting.site.image,
    },
  })
}

export function editMetadata(
  url:string,
  title:undefined|string=undefined,
  description:undefined|string=undefined)
  : Metadata {
  const data = lodash.merge(Object.assign({}, layoutMetadata), {
    title: title ? title : url,
    description: description ? description : siteSetting.site.description,
    alternates: {
      canonical: `/${url.toLowerCase()}`,
    },
    ...myOpenGraph(
      `${siteSetting.site.url}/${url.toLowerCase()}`,
      `${title ? title : url} | ${siteSetting.site.title}`,
      description
    )
  })
  return data
}