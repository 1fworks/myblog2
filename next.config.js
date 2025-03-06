import createMDX from '@next/mdx'

const isProduction = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: isProduction ? '/myblog2' : '',
  // assetPrefix: isProduction ? '/myblog2/' : '',
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  reactStrictMode: false,
  output: "export",
  images: {
    loader: isProduction ? "custom" : "default",
    imageSizes: [32, 64, 128, 256],
    deviceSizes: [640, 828, 1080, 1920],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/posts",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
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