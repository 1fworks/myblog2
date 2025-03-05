'use client'

import { FileListItem } from "@/app/archive/[[...slug]]/components/filelistitem";
import { useState } from "react";

export const MiniArchive = ({ files, l_curr }:{
  files:{
    date: string;
    title: string;
    url: string;
  }[],
  l_curr: number
}) => {
  
  const list_length = 5
  const list_plus = 5
  
  const [ l_start, setLStart ] = useState<number>(Math.max(0, l_curr - list_length))
  const [ l_end, setLEnd ] = useState<number>(Math.min(files.length - 1, l_curr + list_length))

  return (
    <div className="archive mini-archive">
      { l_start > 0 &&
        <div className="archive-list px-3" onClick={()=>{setLStart(Math.max(0, l_start - list_plus))}}>
          ↑ more
        </div>
      }
      {
        files.map((file, i)=>{
          if(i >= l_start && i <= l_end) {
            return (
              <div className="animate-stair-animation opacity-0" key={`mini-list-item ${i}`}>
                <FileListItem file={file} key_string={`mini-list-item ${i}`} delay={-1} year={true}
                  current={(i === l_curr)}
                />
              </div>
            )
          }
        })
      }
      { l_end < files.length - 1 &&
        <div className="archive-list px-3" onClick={()=>{setLEnd(Math.min(files.length - 1, l_end + list_plus))}}>
          ↓ more
        </div>
      }
    </div>
  )
}