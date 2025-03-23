import { getAllSpecificFolderForFile } from "./post"

export const findFile = (
  filename: string,
  slugs: string[],
  notfound: string|undefined = undefined)
: string | undefined => {
  
  const files = getAllSpecificFolderForFile(filename, slugs)
  if(files.length === 0){
    return notfound ? notfound : undefined
  }
  return files[0]
}