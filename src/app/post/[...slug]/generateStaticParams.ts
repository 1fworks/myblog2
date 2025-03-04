import { getAllPosts, BASE_PATH } from '@/libs/post';

export function generateStaticParams() {
  const posts = getAllPosts(['_description.mdx']);

  const slugs = posts.map((post) => {
    const slug = post.slug.replace(BASE_PATH, '/post').split('/').slice(2);
    return slug.length > 0 ? { slug } : undefined;
  }).filter((element)=>element !== undefined)
  
  return slugs;
};