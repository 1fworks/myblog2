'use client'

import { useState } from "react"

export const Spoiler = ({children}:{children:React.ReactNode})=>{
  const [state, setState] = useState<boolean>(false)
  return (
    <div className="spoiler relative overflow-hidden">
      { !state &&
        <div className="z-[1] left-0 top-0 bottom-0 right-0 absolute backdrop-blur-lg backdrop-grayscale">
          <button className="absolute left-0 top-0 bottom-0 right-0" onClick={() => {setState(true)}}></button>
          <div className="absolute spoiler-warning -top-10 left-1/2 -translate-x-1/2 w-fit mx-auto my-10 pointer-events-none text-7xl">SPOILER</div>
          <div className="spoiler-text translate-y-10 w-fit mx-auto my-5 pointer-events-none">Click to view</div>
        </div>
      }
      {children}
    </div>
  )
}