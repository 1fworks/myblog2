'use client'

import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export function MikuCursor() {
  const [ miku, setMiku ] = useLocalStorage<boolean>('miku-cursor', false)
  const [ mounted, setMounted ] = useState<boolean>(false)
  useEffect(()=>{
    setMounted(true)
  }, [])

  return (
    <div>
      <div className='flex items-center justify-center font-bold'>
        YY 미쿠 커서 버튼 YY
      </div>
      <div className='flex items-center justify-center'>
        { mounted &&
          <button onClick={()=>{setMiku(!miku)}} className='btn-miku h1-style'>{ miku?'3939-!':'3939..?' }</button>
        }
        { !mounted &&
          <button className='btn-miku h1-style'>YY</button>
        }
      </div>
    </div>
  )
}