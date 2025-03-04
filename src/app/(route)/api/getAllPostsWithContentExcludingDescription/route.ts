export const dynamic = 'force-static'
import { getAllPostsWithContent } from "@/libs/post"

export async function GET(){
    const data = getAllPostsWithContent(['_description.mdx'])
    return Response.json(data)
}