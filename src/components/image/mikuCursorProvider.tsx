'use client'

import { useEffect, useRef, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { default as NextImage } from "next/image";
import ExportedImage from "next-image-export-optimizer";
import { basePath } from "@/app/site.setting";
import Link from "next/link";
import path from "path";

export default function MikuCursorProvider({children}:{children: React.ReactNode}) {
  const src_with_basePath = (src: string)=>{ return path.join(`${basePath}/`,`${src}`) }
  const [ touchDevice, setTouchDevice ] = useState<boolean>(false)
  const [ miku ] = useLocalStorage<boolean>('miku-cursor', false)
  const [ mounted, setMounted ] = useState<boolean>(false)
  const [ imgNum, setImgNum ] = useState<number>(0)
  const [ block, setBlock ] = useState<boolean>(false)
  const walkingMiku = useRef<HTMLDivElement>(null)
  const walkingDir = useRef<number>(1)
  const imgRef = useRef<HTMLDivElement>(null)
  const mikuX = useRef<number>(0)
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
    const mouseClickEvent = (e: MouseEvent)=>{
      if(cursor.current !== null) {
        (cursor.current as HTMLDivElement).style.left = `${e.clientX}px`;
        (cursor.current as HTMLDivElement).style.top = `${e.clientY}px`;
      }
    }
    setMounted(true)
    if(miku) {
      window.addEventListener('mousemove', mouseMoveEvent)
      window.addEventListener('click', mouseClickEvent)
      document.body.addEventListener('mouseleave', lostFocusEvent)
    }
    else {
      window.removeEventListener('mousemove', mouseMoveEvent)
      window.removeEventListener('click', mouseClickEvent)
      document.body.removeEventListener('mouseleave', lostFocusEvent)
    }
    return ()=>{
      if(miku) {
        window.removeEventListener('mousemove', mouseMoveEvent)
        window.removeEventListener('click', mouseClickEvent)
        document.body.removeEventListener('mouseleave', lostFocusEvent)
      }
    }
  }, [miku])

  useEffect(()=>{
    let frameId: number
    let now: number = performance.now()
    const animation = ()=>{
      const last = performance.now()
      if(walkingMiku.current !== null){
        if(mikuX.current >= window.innerWidth - 128) {
          walkingDir.current = -1
        }
        else if(mikuX.current <= 0) {
          walkingDir.current = 1
        }
        if(imgRef.current !== null) {
          if(walkingDir.current > 0) imgRef.current.style.scale = '1 1'
          else imgRef.current.style.scale = '-1 1'
        }
        if(!block) mikuX.current = Math.max(0, Math.min(window.innerWidth - 128, mikuX.current + walkingDir.current * (last - now) / 1000 * 30))
        walkingMiku.current.style.left = `${mikuX.current}px`
      }
      now = last
      frameId = requestAnimationFrame(animation)
    }
    if(miku && !touchDevice) frameId = requestAnimationFrame(animation)
    return ()=>{
      cancelAnimationFrame(frameId)
    }
  }, [miku, touchDevice, block])

  useEffect(()=>{
    if(mounted) setTouchDevice(!window.matchMedia('(hover: hover)').matches)
  }, [mounted])

  return (
    <div className={ mounted && miku && !block && !touchDevice? 'miku-cursor' : '' }>
      { mounted && miku && !touchDevice &&
        <>
          { !block &&
            <div ref={cursor} className={`fixed -left-full min-w-[128px] min-h-[128px] z-[1000] pointer-events-none`} style={{ transform: `translateX(-${imgData[imgNum].pos[0]}px) translateY(-${imgData[imgNum].pos[1]}px)` }}>
              { process.env.NODE_ENV === 'production' &&
                <ExportedImage className="img-shadowless" style={{ imageRendering: 'pixelated' }}
                  data-src={src_with_basePath(`/assets/img/miku_cursor/${imgData[imgNum].src}.webp`)}
                  src={src_with_basePath(`/assets/img/miku_cursor/${imgData[imgNum].src}.webp`)}
                  alt={imgData[imgNum].src} width={128} height={128} sizes="100vw" unoptimized={true}
                />
              }
              { process.env.NODE_ENV !== 'production' &&
                <NextImage className="img-shadowless" style={{ imageRendering: 'pixelated' }}
                  data-src={src_with_basePath(`/assets/img/miku_cursor/${imgData[imgNum].src}.webp`)}
                  src={src_with_basePath(`/assets/img/miku_cursor/${imgData[imgNum].src}.webp`)}
                  alt={imgData[imgNum].src} width={128} height={128} sizes="100vw" quality={100} unoptimized={true}
                />
              }
            </div>
          }
          <div ref={walkingMiku} className="walking-miku">
            <Link
              className="absolute left-0 top-0 right-0 bottom-0 rounded-full"
              href='/post/projects/side_projects/miku_cursor'
              onMouseEnter={()=>{ setBlock(true) }}
              onMouseLeave={()=>{ setBlock(false) }}
            >
              <div className={`miku-field ${block?'miku-field-active':''} cursor-my-pointer`}></div>
            </Link>
            <div ref={imgRef} className={`-scale-x-100 pointer-events-none`}>
              { process.env.NODE_ENV === 'production' &&
                <ExportedImage
                  className="miku-img pointer-events-none img-shadowless animate-climb100-animation"
                  style={{ imageRendering: 'pixelated' }}
                  data-src={src_with_basePath(`/assets/img/miku_cursor/${block?'jumping':'walk'}.webp`)}
                  src={src_with_basePath(`/assets/img/miku_cursor/${block?'jumping':'walk'}.webp`)}
                  alt={"miku walking"}
                  width={96} height={96} sizes="100vw" unoptimized={true}
                />
              }
              { process.env.NODE_ENV !== 'production' &&
                <NextImage
                  className="miku-img pointer-events-none img-shadowless animate-climb100-animation"
                  style={{ imageRendering: 'pixelated' }}
                  data-src={src_with_basePath(`/assets/img/miku_cursor/${block?'jumping':'walk'}.webp`)}
                  src={src_with_basePath(`/assets/img/miku_cursor/${block?'jumping':'walk'}.webp`)}
                  alt={"miku walking"}
                  width={96} height={96} sizes="100vw" quality={100} unoptimized={true}
                />
              }
            </div>
          </div>
        </>
      }
      { children }
    </div>
  )
}