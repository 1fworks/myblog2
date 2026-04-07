'use client'

import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import 'assets/styles/miku/miku.css';
import mikucursor from 'assets/styles/miku/miku.module.scss';

export default function MikuCursorProvider({children}:{children: React.ReactNode}) {
  const [ miku ] = useLocalStorage<boolean>('miku-cursor', false)
  const [ mounted, setMounted ] = useState<boolean>(false)
  useEffect(()=>{
    setMounted(true)
  }, [])

  return (
    <div data-miku={mounted?miku:false}>
      <div className={`${mikucursor.mikucursor}`}>
        { children }
      </div>
    </div>
  )
}