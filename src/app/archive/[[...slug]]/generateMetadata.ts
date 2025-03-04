import type { Metadata } from 'next'
import { editMetadata } from '@/libs/metadata';
import { readDescription } from '@/libs/post';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slugs = (await params).slug
  let path = "/"
  if(slugs !== undefined){
    path = `/${slugs.join("/")}`
  }
  const { data } = readDescription(`${path}/_description.mdx`)
  path = `archive${path === "/" ? "" : path}`
  if(data === undefined) return editMetadata(path, 'Archive')
  return editMetadata(path, data.title ? data.title : 'Archive')
}