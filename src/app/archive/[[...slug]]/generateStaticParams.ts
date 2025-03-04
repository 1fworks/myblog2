import { getAllFolder, BASE_PATH } from '@/libs/post';

export function generateStaticParams() {
  const posts = getAllFolder();
  
  const slugs = posts.map((post) => {
    const slug = post.slug.replace(BASE_PATH, '/archive').split('/').slice(2);
    return slug.length > 0 ? { slug } : undefined;
  }).filter((element)=>element !== undefined)
  slugs.push({slug:[]});
  
  return slugs;
};