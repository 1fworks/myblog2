import { getImgDataList } from "@/libs/post"

export const dynamic = 'force-static'

export async function GET(){
  return Response.json(getImgDataList())
}