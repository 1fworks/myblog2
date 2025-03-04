import type { MetadataRoute } from 'next'
import { siteSetting } from './site.setting'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteSetting.robots.rules
  }
}