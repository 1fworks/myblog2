'use client'

import { FileListItem } from "@/app/archive/[[...slug]]/components/filelistitem";
import { useState } from "react";
// import { useEffect } from "react";
// import dayjs from "@/libs/myDayjs";
// import { Dayjs } from "dayjs";

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

  // const [ now, setNow ] = useState<Dayjs|undefined>(undefined)
  // useEffect(()=>{
  //   setNow(dayjs())
  // }, [])

  return (
    <div className="archive mini-archive">
      { l_start > 0 &&
        <div className="archive-list overflow-hidden px-3" onClick={()=>{setLStart(Math.max(0, l_start - list_plus))}}>
          ↑ more
        </div>
      }
      {
        files.map((file, i)=>{
          if(i >= l_start && i <= l_end) {
            const isRecent = false//now ? (now.subtract(2, 'week').valueOf() - dayjs(file.date).valueOf() < 0) : false
            return (
              <div className="animate-stair-animation opacity-0" key={`mini-list-item ${i}`}>
                <FileListItem file={file} key_string={`mini-list-item ${i}`} delay={-1} year={true} isRecent={isRecent}
                  current={(i === l_curr)}
                />
              </div>
            )
          }
        })
      }
      { l_end < files.length - 1 &&
        <div className="archive-list overflow-hidden px-3" onClick={()=>{setLEnd(Math.min(files.length - 1, l_end + list_plus))}}>
          ↓ more
        </div>
      }
    </div>
  )
}