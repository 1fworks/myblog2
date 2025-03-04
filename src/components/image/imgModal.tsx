'use client'

import { closeImgModal } from '@/components/image/mynextImage';
import { useEffect, useRef } from 'react';

export default function ImgModal() {
  const divRef = useRef(null)
  const scrollRef = useRef(0)
  const distance = 123//px
  
  useEffect(()=>{
    window.addEventListener("resize", ()=>{
      if(!divRef.current) return;
      const modal = divRef.current as Element
      if(modal.classList.contains('img-modal-active')){
        closeImgModal()
        scrollRef.current = window.scrollY
      }
    })
    window.addEventListener("scroll", ()=>{
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
    })
  }, [])

  return (
    <div ref={divRef} className='img-modal' onClick={closeImgModal}>
      <div className='modal-darker'></div>
    </div>
  )
}