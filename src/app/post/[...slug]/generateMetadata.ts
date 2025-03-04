import type { Metadata } from 'next'
import { readContentAndFrontMatterFromMdxfile } from '@/libs/post';
import { editMetadata } from '@/libs/metadata';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slugs = (await params).slug
  const { data } = readContentAndFrontMatterFromMdxfile(slugs)
  return editMetadata(slugs.join('/'), data.title)
}