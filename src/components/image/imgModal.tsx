'use client'

import { closeImgModal } from '@/components/image/mynextImage';
import { useEffect, useRef } from 'react';

export default function ImgModal() {
  const divRef = useRef(null)
  const scrollRef = useRef(0)
  const distance = 123//px
  
  useEffect(()=>{
    const resizeEvent = () => {
      if(!divRef.current) return;
      const modal = divRef.current as Element
      if(modal.classList.contains('img-modal-active')){
        closeImgModal()
        scrollRef.current = window.scrollY
      }
    }
    const scrollEvent = ()=>{
      if(!divRef.current) return;
      const modal = divRef.current as Element
      if(modal.classList.contains('img-modal-active')){
        if(Math.abs(scrollRef.current - window.scrollY) > distance) {
          closeImgModal()
          scrollRef.current = window.scrollY
        }
      }
      else{
        scrollRef.current = window.scrollY
      }
    }

    window.addEventListener("resize", resizeEvent)
    window.addEventListener("scroll", scrollEvent)
    
    return () => {
      window.removeEventListener("resize", resizeEvent)
      window.removeEventListener("scroll", scrollEvent)
    }
  }, [])

  return (
    <div ref={divRef} className='img-modal' onClick={closeImgModal}>
      <div className='modal-darker'></div>
    </div>
  )
}