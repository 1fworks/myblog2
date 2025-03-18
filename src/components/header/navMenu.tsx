"use client"

import ThemeSwitch from "./themeSwitcher"
import { closeImgModal, style_init } from "../image/mynextImage";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from "@/libs/myDayjs";
import { Dayjs } from "dayjs";

export const NavMenu = ({recent_file}:
{
  recent_file:{
    date: string;
  }
}) => {
  const [ animate, setAnimate ] = useState(false)
  const [ hamburger, setHamburger ] = useState(false)
  
  const [ now, setNow ] = useState<Dayjs|undefined>(undefined)
  useEffect(()=>{
    setNow(dayjs())
  }, [])

  const isRecent = now ? (now.subtract(2, 'week').valueOf() - dayjs(recent_file.date).valueOf() < 0) : false

  const MenuLink = ({ link, linktext, isSelected, delay, isRecent = false }:
    { link:string, linktext:string, isSelected:boolean, delay:number, isRecent?:boolean }) => {

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
        className={`${isSelected?"menulink-active":"menulink"} ${animate ? 'opacity-0 animate-stair-animation':'animate-none'}`}
        style={{animationDelay: `${delay}ms`}}>
        { isRecent &&
          <div className="notification-badge absolute left-0 top-0 opacity-0 animate-fade-in-animation z-[1]" style={{animationDuration:'100ms'}}>
            <div className="rounded-full absolute -translate-x-full size-2">
              <div className="rounded-full w-full h-full animate-ping"></div>
            </div>
          </div>
        }
        <Link id={`link-${link}`} href={`/${link}`}>
          {linktext}
        </Link>
      </div>
    )
  }
  
  const path = usePathname()
  useEffect(()=>{
    setHamburger(false)
    closeImgModal()
    style_init()
  }, [path])
  const current = path.split('/')
  const page = (current.length > 1 && current[1] === '' ? '/' : current[1]).toLowerCase()
  
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
          <MenuLink link={''}        linktext={'Home'}    isSelected={('/'        === page)} delay={50} />
          <MenuLink link={'archive'} linktext={'Archive'} isSelected={('post'     === page || 'archive' === page)} delay={150} isRecent={isRecent}/>
          <MenuLink link={'art'}     linktext={'Art'}     isSelected={('art'      === page)} delay={250} />
          <MenuLink link={'project'} linktext={'Project'} isSelected={('project'  === page)} delay={350} />
          <MenuLink link={'about'}   linktext={'About'}   isSelected={('about'    === page)} delay={450} />
        </div>
        <HamburgerMenu/>
      </div>
    </>
  )
}