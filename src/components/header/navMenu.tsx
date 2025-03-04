"use client"

import ThemeSwitch from "./themeSwitcher"
import { closeImgModal, style_init } from "../image/mynextImage";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export const NavMenu = () => {
  const [ animate, setAnimate ] = useState(false)
  const MenuLink = ({ link, linktext, isSelected, delay }
    : { link:string, linktext:string, isSelected:boolean, delay:number }) => {

    useEffect(()=>{
      const handleResize = () => {
        const windowWidth = window.innerWidth
        if(windowWidth < 768 && animate === false){
          setAnimate(true)
        }
        if(windowWidth >= 768 && animate === true){
          setAnimate(false)
          if(hamburger) {
            setHamburger(false)
          }
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [])
  
    return (
      <div
        className={`${isSelected?"menulink-active":"menulink"} ${animate ? 'animate-stair-animation':'animate-none'}`}
        style={{animationDelay: `${delay}ms`}}>
        <Link id={`link-${link}`} href={`/${link}`}>
          {linktext}
        </Link>
      </div>
    )
  }

  const path = usePathname()
  useEffect(()=>{
    if(hamburger) setHamburger(false)
    closeImgModal()
    style_init()
  }, [path])
  const current = path.split('/')
  const page = (current.length > 1 && current[1] === '' ? '/' : current[1]).toLowerCase()

  const [ hamburger, setHamburger ] = useState(false)
  const HamburgerMenu = () => {
    return (
      <div className="mode" onClick={()=>{
        setHamburger(!hamburger)
      }}>
        {
          // Image by Dazzle UI, licensed under CC Attribution License
          // https://www.svgrepo.com/collection/dazzle-line-icons
        }
        <svg className="hamburger" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
            <path d="M4 6H20M4 12H20M4 18H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </g>
        </svg>
      </div>
    )
  }
  
  return (
    <>
      <div className={(animate && hamburger)?'modal-active':'modal'}>
        <div className='modal-darker'></div>
      </div>
      <div className="navmenu">
        <ThemeSwitch/>
        <div className={`menulist ${hamburger?'hamburger-menu':''} self-center`}>
          <MenuLink link={''}        linktext={'Home'}    isSelected={('/'        === page)} delay={0} />
          <MenuLink link={'archive'} linktext={'Archive'} isSelected={('post'     === page || 'archive' === page)} delay={100} />
          <MenuLink link={'art'}     linktext={'Art'}     isSelected={('art'      === page)} delay={200} />
          <MenuLink link={'project'} linktext={'Project'} isSelected={('project'  === page)} delay={300} />
          <MenuLink link={'about'}   linktext={'About'}   isSelected={('about'    === page)} delay={400} />
        </div>
        <HamburgerMenu/>
      </div>
    </>
  )
}