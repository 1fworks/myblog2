"use client"

import { useEffect, useRef } from "react"

export const PostContent = ({children}:{children: React.ReactNode}) => {
  const curr = useRef<Element>(null)

  function throttle(fn: ()=>void, limit: number) {
    let lastCall = 0
    return () => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now
        setTimeout(fn, 200)
      }
    }
  }

  useEffect(()=>{
    const tocLinks = [...document.querySelectorAll(".toc-link")]
    if(tocLinks.length === 0) return;
    tocLinks[0].classList.add('link-active')

    const contents = [...document.querySelectorAll(".anchor")].map(content=>{
      for(const link of tocLinks) {
        if(link.getAttribute('href') === content.getAttribute('href'))
        return content
      }
    }).filter(element=>element!==undefined)

    const first = contents[0]
    curr.current = first

    const tocCheck = () => {
      let tmp = first
      for(const content of contents) {
        if(content.getBoundingClientRect().top > 60) break
        tmp = content
      }
      if(curr.current !== tmp){
        curr.current = tmp
        tocLinks.forEach(link=>{
          if(link.getAttribute('href') === curr.current?.getAttribute('href')) {
            link.classList.add('link-active')
          }
          else link.classList.remove('link-active')
        })
      }
    }
    tocCheck()
    const scrollEvent = throttle(tocCheck, 100)
    window.addEventListener("scroll", scrollEvent)
    return () => {
      window.removeEventListener("scroll", scrollEvent)
    }
  }, [])

  return (
    <div>
      { children }
    </div>
  )
}