'use client'

import { useEffect, useRef, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { default as NextImage } from "next/image";

export default function MikuCursorProvider({children}:{children: React.ReactNode}) {
  const [ miku ] = useLocalStorage<boolean>('miku-cursor', false)
  const [ mounted, setMounted ] = useState<boolean>(false)
  const [ imgNum, setImgNum ] = useState<number>(0)
  const imgData = [
    { src: 'normal', pos: [2, 2] },
    { src: 'pointer', pos: [22, 14] },
    { src: 'progress', pos: [1, 1] },
    { src: 'wait', pos: [20, 20] },
    { src: 'loading', pos: [20, 20] }, // wait2
    { src: 'not-allowed', pos: [18, 18] },
    { src: 'help', pos: [2, 10] },
    { src: 'text', pos: [8, 16] },
    { src: 'move', pos: [2, 2] },
  ]
  const cursor = useRef(null)
  const lostFocusEvent = ()=>{
    if(cursor.current === null) return;
    (cursor.current as HTMLDivElement).style.left = `${-128}px`;
  }
  const checkClassAndTagName = ( e: Element, firstTag: string|undefined )=>{
    if(e.classList.contains('cursor-my-default')
      // || window.getComputedStyle(e).userSelect === 'none'
      // || e.classList.contains('select-none')
    ) {
      setImgNum(0)
      return true
    }
    if(e.classList.contains('cursor-my-pointer')
      || (firstTag !== undefined && firstTag.toLowerCase() === 'a' || e.tagName.toLowerCase() === 'a')
      || (firstTag !== undefined && firstTag.toLowerCase() === 'button')
      || e.classList.contains('img-modal-active')
      || e.classList.contains('img-zoom')
      || (firstTag !== undefined && firstTag.toLowerCase() === 'img' && e.classList.contains('img-focus'))
      || (firstTag !== undefined && firstTag.toLowerCase() === 'svg' && e.classList.contains('mode'))
    ) {
      setImgNum(1)
      return true
    }
    if(e.classList.contains('cursor-my-text') || e.tagName.toUpperCase() === 'INPUT') {
      setImgNum(7)
      return true
    }
    if(e.classList.contains('cursor-my-progress')) {
      setImgNum(2)
      return true
    }
    if(e.classList.contains('cursor-my-wait')) {
      setImgNum(3)
      return true
    }
    if(e.classList.contains('cursor-my-wait2')) {
      setImgNum(4)
      return true
    }
    if(e.classList.contains('cursor-my-not-allowed')) {
      setImgNum(5)
      return true
    }
    if(e.classList.contains('cursor-my-help')) {
      setImgNum(6)
      return true
    }
    if(e.classList.contains('cursor-my-move')) {
      setImgNum(8)
      return true
    }
    return false
  }
  useEffect(()=>{
    const mouseMoveEvent = (e: MouseEvent)=>{
      if(cursor.current === null || miku !== true) return;
      (cursor.current as HTMLDivElement).style.left = `${e.clientX}px`;
      (cursor.current as HTMLDivElement).style.top = `${e.clientY}px`;
      let el = document.elementFromPoint(e.clientX, e.clientY)
      const firstTag = el?.tagName
      let change = false
      while(el) {
        if(el.classList.contains('uwu')) break;
        if(checkClassAndTagName(el, firstTag)){
          change = true
          break;
        }
        el = el?.parentElement
      }
      if(!change) setImgNum(0)
    }
    setMounted(true)
    if(miku) {
      window.addEventListener('mousemove', mouseMoveEvent)
      document.body.addEventListener('mouseleave', lostFocusEvent)
    }
    else {
      window.removeEventListener('mousemove', mouseMoveEvent)
      document.body.removeEventListener('mouseleave', lostFocusEvent)
    }
    return ()=>{
      if(miku) {
        window.removeEventListener('mousemove', mouseMoveEvent)
        document.body.removeEventListener('mouseleave', lostFocusEvent)
      }
    }
  }, [miku])

  return (
    <div className={ mounted && miku ? 'miku-cursor' : '' }>
      { mounted && miku &&
        <div ref={cursor} className={`fixed -left-full min-w-[128px] min-h-[128px] z-[1000] pointer-events-none`} style={{ transform: `translateX(-${imgData[imgNum].pos[0]}px) translateY(-${imgData[imgNum].pos[1]}px)` }}>
          <NextImage className="img-shadowless" style={{ imageRendering: 'pixelated' }} src={`/assets/img/miku_cursor/${imgData[imgNum].src}.webp`} alt={imgData[imgNum].src} width={128} height={128} sizes="100vw" quality={100} unoptimized={true}/>
        </div>
      }
      { children }
    </div>
  )
}