'use client'

import Link from "next/link";

// import 'dayjs/locale/ko';
import dayjs from 'dayjs';
// import localizedFormat from 'dayjs/plugin/localizedFormat';
// dayjs.extend(localizedFormat)

export const DividingLine = ({text, delay}:{text:string, delay:number}) => {
  return (
    <div
      className="w-full my-2 flex flex-row gap-2 items-center opacity-0 animate-climb100-animation"
      style={{animationDelay:`${delay}ms`}}
    >
      <div className="opacity-50 text-sm">{text}</div>
      <hr className="w-full"/>
    </div>
  )
}

export const FileListItem = ({file, key, delay, current=false, year=false}:{file: {url:string, title: string, date:string}, key:string, delay:number, current?:boolean, year?:boolean}) => {
  return fileListItem(file, key, delay, current, year)
}

export const fileListItem = (file: {url:string, title: string, date:string}, key:string, delay:number, current?:boolean, year?:boolean) => {
  return (
    <Link className="no-style" href={file.url} key={key}>
      <div
        className={`archive-list file ${delay >= 0?'animate-climb100-animation':''} ${current?'current-post':''}`}
        style={{animationDelay: `${Math.max(delay, 0)}ms`}}
      >
        {
          // Zwicon Line Icons by zwicon, licensed under CC Attribution License
          // https://www.svgrepo.com/collection/zwicon-line-icons
        }
        <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M20,6.52897986 L20,19.5010024 C20,20.8817143 18.8807119,22.0010024 17.5,22.0010024 L6.5,22.0010024 C5.11928813,22.0010024 4,20.8817143 4,19.5010024 L4,4.50100238 C4,3.1202905 5.11928813,2.00100238 6.5,2.00100238 L15.4720225,2.00100238 C15.6047688,1.99258291 15.7429463,2.03684187 15.8535534,2.14744899 L19.8535534,6.14744899 C19.9641605,6.25805611 20.0084195,6.39623363 20,6.52897986 Z M15,3.00100238 L6.5,3.00100238 C5.67157288,3.00100238 5,3.67257525 5,4.50100238 L5,19.5010024 C5,20.3294295 5.67157288,21.0010024 6.5,21.0010024 L17.5,21.0010024 C18.3284271,21.0010024 19,20.3294295 19,19.5010024 L19,7.00100238 L15.5,7.00100238 C15.2238576,7.00100238 15,6.77714475 15,6.50100238 L15,3.00100238 Z M16,3.70810916 L16,6.00100238 L18.2928932,6.00100238 L16,3.70810916 Z M8.5,10 C8.22385763,10 8,9.77614237 8,9.5 C8,9.22385763 8.22385763,9 8.5,9 L15.5,9 C15.7761424,9 16,9.22385763 16,9.5 C16,9.77614237 15.7761424,10 15.5,10 L8.5,10 Z M8.5,13 C8.22385763,13 8,12.7761424 8,12.5 C8,12.2238576 8.22385763,12 8.5,12 L15.5,12 C15.7761424,12 16,12.2238576 16,12.5 C16,12.7761424 15.7761424,13 15.5,13 L8.5,13 Z M8.5,16 C8.22385763,16 8,15.7761424 8,15.5 C8,15.2238576 8.22385763,15 8.5,15 L13.5,15 C13.7761424,15 14,15.2238576 14,15.5 C14,15.7761424 13.7761424,16 13.5,16 L8.5,16 Z"></path>
          </g>
        </svg>
        <div className="list-data">
          <div className="title">{file.title}</div>
          <div className="date">{dayjs(file.date).format(`MMM DD${year?', YYYY':''}`)}</div>
        </div>
      </div>
    </Link>
  )
}