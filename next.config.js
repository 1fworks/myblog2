import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  reactStrictMode: false,
  output: process.env.NODE_ENV === 'production' ? "export" : undefined,
  images: {
    loader: process.env.NODE_ENV === 'production' ? "custom" : "default",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/posts",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "100",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "false",
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
  // eslint: {
  //   ignoreDuringBuilds: true
  // }
}

import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const withMDX = createMDX({
  options:{
    remarkPlugins:[
      remarkMdx,
      remarkBreaks,
      remarkGfm,
    ],
    rehypePlugins:[
    ],
  }
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)