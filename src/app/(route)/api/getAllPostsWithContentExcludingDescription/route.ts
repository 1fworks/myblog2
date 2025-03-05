import { getAllPostsWithContent } from "@/libs/post"

export const dynamic = 'force-static'

export async function GET(){
    const data = getAllPostsWithContent(['_description.mdx'])
    return Response.json(data)
}