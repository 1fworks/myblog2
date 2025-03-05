import type { MetadataRoute } from 'next'
import { siteSetting } from './site.setting'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSetting.site.title,
    short_name: siteSetting.site.short_name,
    description: siteSetting.site.description,
    start_url: '/',
    display: 'standalone',
    background_color: siteSetting.pwa.background_color,
    theme_color: siteSetting.pwa.theme_color,
    icons: siteSetting.pwa.pwa_icons,
  }
}