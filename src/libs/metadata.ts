import { Metadata } from "next";
import { metadata as layoutMetadata } from "@/app/layout";
import lodash from 'lodash';
import { siteSetting } from "@/app/site.setting";

export function editMetadata(
  url:string,
  title:undefined|string=undefined,
  description:undefined|string=undefined)
  : Metadata {
  const data = lodash.merge(Object.assign({}, layoutMetadata), {
    title: title ? title : url,
    alternates: {
      canonical: `/${url.toLowerCase()}`,
    },
    openGraph: {
      title: `${title ? title : url} | ${siteSetting.site.title}`,
      siteName: `${title ? title : url} | ${siteSetting.site.title}`,
      url: `${siteSetting.site.url}/${url.toLowerCase()}`,
    }
  })
  if(!description) return data
  return lodash.merge(data, {
    description: description,
    openGraph: {
      description: description
    }
  })
}