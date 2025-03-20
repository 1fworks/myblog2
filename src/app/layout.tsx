import localFont from 'next/font/local'
import { Anton } from 'next/font/google'
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { siteSetting } from './site.setting'
import { URL } from "url";
import './globals.css';
// import 'assets/styles/font.scss';
import styles from 'assets/styles/main.module.scss'
import { NavMenu } from '@/components/header/navMenu';
import ImgModal from '@/components/image/imgModal';
import { Wrapper } from '@/components/wrapper/wrapper';
import { BgImage } from '@/components/image/bgImage';
import { basePath } from './site.setting';
import { getFiles } from "./archive/[[...slug]]/page";

import path from 'path';
import imageSize from 'image-size';

const img_data = imageSize(path.join('public/', siteSetting.site.image_relative))

const anton = Anton({
  subsets: ['latin'],
  preload: true,
  display: 'block',
  weight: '400',
  style: 'normal',
  variable: '--anton-font'
})

const pretendard = localFont({
  src: '../../public/assets/fonts/PretendardVariable.woff2',
  display: 'block',
  weight: '45 920',
  style: 'normal',
  variable: '--pretendard-font'
})

const wantedsans = localFont({
  src: '../../public/assets/fonts/WantedSansStdVariable.woff2',
  display: 'block',
  weight: '400 1000',
  style: 'normal',
  variable: '--wantedsans-font'
})

export const metadata: Metadata = {
  title:{
    template: `%s | ${siteSetting.site.title}`,
    default: siteSetting.site.title,
  },
  description: siteSetting.site.description,
  
  generator: 'Next.js',
  applicationName: siteSetting.site.title,
  
  keywords: [siteSetting.site.title, siteSetting.author.name],
  authors: [{ name: siteSetting.author.name, url: siteSetting.author.url }],
  creator: siteSetting.author.name,
  publisher: 'uwu',
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
  // },

  icons: siteSetting.site.icons,

  metadataBase: new URL(siteSetting.site.url),
  alternates: {
    canonical: '/',
    // languages: {
    //   'en-US': '/en-US',
    //   'ko-KR' : '/ko-KR'
    // },
  },

  openGraph: {
    siteName: siteSetting.site.title,
    title: siteSetting.site.title,
    description: siteSetting.site.description,
    type: 'website',
    url: siteSetting.site.url,
    images: [
      {
        width: img_data.width,
        height: img_data.height,
        url: siteSetting.site.image
      }
    ]
  },

  twitter: {
    title: siteSetting.site.title,
    description: siteSetting.site.description,
    card: "summary",
    site: `@${siteSetting.author.twitter}`,
    creator: `@${siteSetting.author.twitter}`,
    images: siteSetting.site.image,
  },

  verification: {
    // google: 
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const recent_file = (await getFiles(undefined)).files[0]
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
      <body className={`relative ${pretendard.variable} ${wantedsans.variable} ${anton.variable} ${styles.mytheme}`}>
        <ThemeProvider defaultTheme='dark'>
          <BgImage basePath={basePath}/>
          <ImgModal/>
          <NavMenu recent_file={recent_file}/>
          <Wrapper>{children}</Wrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
