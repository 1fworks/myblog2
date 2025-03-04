import { getAllSpecificFolderForFile } from "./post"

export const findFile = (
  filename: string,
  slugs: string[],
  notfound: string|undefined = undefined)
: string | undefined => {
  
  const file = filename.split('/')
  
  let files: string[] = []
  if(file.length === 1){
    files = getAllSpecificFolderForFile(filename, slugs)
  } else files = getAllSpecificFolderForFile(filename)
  if(files.length === 0){
    return notfound ? notfound : undefined
  }
  return files[0]
}