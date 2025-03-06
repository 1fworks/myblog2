"use client"

import Fuse from "fuse.js";
import { FuseResult } from "fuse.js";
import { searchwithfuse } from "@/libs/searchwithfuse";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { getTextFromContext } from "@/libs/mdx";
// import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import Link from "next/link";
import { DividingLine, fileListItem } from "./filelistitem";
import { folderListItem } from "./folderlistitem";
import { frontmatter_type } from "@/libs/post";

export const ArchivePageWithSearchBar = ({
  data
}:{
  data:{
    postdata:{
      frontmatter:frontmatter_type,
      content:string|undefined,
      url:string
    }[],
    archive_route: {
      folder: number;
      file: number;
      title: string;
      description: string;
      url: string;
    }[],
    archive_detail: {
      description: { [key:string]:string|number|boolean },
      folders: {
        url: string;
        description: string;
        folder: number;
        file: number;
      }[],
      files: { date:string, title:string, url:string }[]
    },
  }
})=>{
  const fuseIdx = useRef<Fuse<{[key:string]:string|undefined}>|null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const postdata = data.postdata
  const [sortby, setSortby] = useState(data.archive_detail.description.order?"newest":"oldest")
  const [value, setValue] = useState("")
  const [searchResult, setSearchResult] = useState<FuseResult<{url:string, title:string, date:string}>[]>([])

  useEffect(()=>{
    if(inputRef.current){
      inputRef.current.onfocus = (e:FocusEvent) => {
        const target = e.currentTarget as HTMLElement
        if(!target.parentElement) return;
        target.parentElement.classList.add('searchbox-focus')
      }
      inputRef.current.onblur = (e:FocusEvent) => {
        const target = e.currentTarget as HTMLInputElement
        if(target.value.length === 0) {
          if(!target.parentElement) return;
          target.parentElement.classList.remove('searchbox-focus')
        }
      }
    }
  }, [])

  useEffect(()=>{
    if(!fuseIdx.current){
      if(postdata.length > 0){
        const inputFuseDataList = async() => {
          const promises = postdata.map(async (post:{frontmatter: frontmatter_type, content:string|undefined, url:string})=>{
            const content = await getTextFromContext(post.content)
            return {
              url: post.url,
              title: post.frontmatter.title,
              body: content,
              date: post.frontmatter.date ? post.frontmatter.date : post.frontmatter.update,
            }
          })
          fuseIdx.current = searchwithfuse(await Promise.all(promises))
        }
        inputFuseDataList()
      }
    }
  }, [postdata])
  
  const searchPosts = (event : ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutRef.current)
    let value = event.target.value
    setValue(value)
    if(value.length > 0 && value[value.length-1] === ' ') {
      value = value.slice(0, value.length - 1)
    }
    const timeoutId = setTimeout(()=>{
      if(fuseIdx.current !== null){
        if(value === "") setSearchResult([])
        else setSearchResult(fuseIdx.current.search(value))
      }
    }, 150)
    timeoutRef.current = timeoutId
  }

  // useEffect(()=>{
  //   console.log(data.archive_route) // > archive > folder1 > folder2 ...
  //   console.log(data.archive_detail)
  // }, [])

  dayjs.extend(localizedFormat)
  const last_updated = data.archive_detail.files[0]?.date
  const files = sortby === 'newest' ? data.archive_detail.files : Object.assign([], data.archive_detail.files).reverse()

  return (
    <div>
      <div className="text-change relative overflow-hidden">
        <div className={`absolute transition-transform duration-500 ease-[cubic-bezier(.68,-0.55,.15,.99)] inset-0 flex flex-col justify-center items-center ${value.length > 0?'':'translate-y-full'}`}>
          <div className='archive w-fit m-auto'>
            <h1 className='mx-auto large text-center opacity-70'>Search</h1>
          </div>
        </div>
        <div className={`transition-transform duration-500 ease-[cubic-bezier(.68,-0.55,.15,.99)] ${value.length > 0?'-translate-y-full':''}`}>
          <div className="p-2">
            { data.archive_route.length > 0 &&
              data.archive_route.map((path)=>{
                return (
                  <Link className="link-color inline-block no-style" key={path.title} href={path.url}>
                    <button key={path.title} className="button-disable">/ {path.description}</button>
                  </Link>
                )
              })
            }
          </div>
          <div
            className="archive grid grid-cols-1 justify-items-center mb-4 animate-climb100-animation"
            style={{animationDuration:`${500}ms`}}
          >
            { data.archive_route.length === 0 && 
              <div className="flex flex-row w-fit mx-auto overflow-hidden">
              {
                ['A','R','C','H','I','V','E'].map((text, i)=>{
                  return (
                    <h1
                      className='large opacity-0 animate-climb70-animation'
                      key={`text ${i}`}
                      style={{
                        animationDelay: `${i*50}ms`,
                        animationDuration:`${700}ms`
                      }}
                    >
                      {text}
                    </h1>
                  )
                })
              }
              </div>
            }
            { data.archive_route.length !== 0 &&
              <h1>{data.archive_detail.description.description}</h1>
            }
            <p className="opacity-40">last updated: {last_updated ? dayjs(last_updated).format('LL') : 'uwu'}</p>
            <p className="opacity-40">folder {data.archive_detail.description.folder}, file {data.archive_detail.description.file}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-4 animate-climb100-animation mini-spotlight">
        <div className="searchbar">
          <div className="searchbox">
            <input ref={inputRef} id="search" autoComplete="off" type="text" name="search" placeholder="Search..." onChange={searchPosts}></input>
          </div>
          {
            // Image by Dazzle UI, licensed under CC Attribution License
            // https://www.svgrepo.com/collection/dazzle-line-icons
          }
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              </path>
            </g>
          </svg>
        </div>
        { value.length === 0 &&
          <div className={`flex flex-row ml-auto items-center my-2 transition-opacity ${value.length > 0?'opacity-0':'opacity-100'}`}>
            <button
              className={`${sortby==="oldest"?undefined:"button-disable"} ${value.length > 0?'cursor-default':''}`}
              onClick={()=>{if(value.length === 0 && sortby !== "oldest"){setSortby("oldest")}}}>
                오름차순
            </button>
            <p className="select-none opacity-30">/</p>
            <button
              className={`${sortby==="newest"?undefined:"button-disable"} ${value.length > 0?'cursor-default':''}`}
              onClick={()=>{if(value.length === 0 && sortby !== "newest"){setSortby("newest")}}}>
                내림차순
            </button>
          </div>
        }
      </div>
      <div className="mini-spotlight">
        { value.length > 0 && searchResult.length > 0 &&
          searchResult.map((element, id: number)=>{
            return (
              fileListItem({
                url: element.item.url.replace('/public/posts','/post'),
                title: element.item.title, 
                date: element.item.date,
              }, `search_result_${id}`, id * 100, false, true)
            )
          })
        }
        { value.length === 0 &&
          <>
            { data.archive_detail.folders.length > 0 &&
              data.archive_detail.folders.map((folder, i)=>{
                return folderListItem(folder, `folder ${i}`, (i+1)*100)
              })
            }
            { files.length > 0 &&
              files.map((file, i)=>{
                const delay = (data.archive_detail.folders.length + 1) * 100 + i * 100;
                const view = (i == 0 || dayjs(files[Math.max(i-1, 0)].date).format('YYYY') !== dayjs(files[Math.max(i, 0)].date).format('YYYY'))
                return (
                  <div className="w-full" key={`file ${i}`}>
                    <DividingLine view={view} key={`line ${i}`} text={dayjs(files[Math.max(i, 0)].date).format('YYYY')} delay={delay}/>
                    {
                      fileListItem(file, `file ${i}`, delay)
                    }
                  </div>
                )
              })
            }
          </>
        }
      </div>
    </div>
  )
}