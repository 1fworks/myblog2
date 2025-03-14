'use client'

import Link from "next/link"

export const folderListItem = (folder: {url:string, description:string, folder:number, file:number}, key:string, delay:number) => {
  return (
    <Link className="no-style" href={folder.url} key={key}>
      <article
        className="archive-list folder opacity-0 animate-climb100-animation"
        style={{animationDelay: `${delay}ms`}}
      >
        {
          // Zwicon Line Icons by zwicon, licensed under CC Attribution License
          // https://www.svgrepo.com/collection/zwicon-line-icons
        }
        <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M21,10.4998169 L21,9.5 C21,8.67157288 20.3284271,8 19.5,8 L14,8 C12.8954305,8 12,7.1045695 12,6 C12,5.44771525 11.5522847,5 11,5 L4.5,5 C3.67157288,5 3,5.67157288 3,6.5 L3,17.5 C3,18.3284271 3.67157288,19 4.5,19 L5.50000026,19 C6.32842712,19 7,18.3284271 7,17.5 L7,12.5 C7,11.1192881 8.11928813,10 9.5,10 L19.5,10 C20.062803,10 20.5821697,10.1859724 21,10.4998169 L21,10.4998169 Z M21,12.5 C21,11.6715729 20.3284271,11 19.5,11 L9.5,11 C8.67157288,11 8,11.6715729 8,12.5 L8,17.5 C8,18.062803 7.81402759,18.5821697 7.50018309,19 L19.5,19 C20.3284271,19 21,18.3284271 21,17.5 L21,12.4999997 L21,12.5 Z M4.5,4 L11,4 C12.1045695,4 13,4.8954305 13,6 C13,6.55228475 13.4477153,7 14,7 L19.5,7 C20.8807119,7 22,8.11928813 22,9.5 L22,17.5 C22,18.8807119 20.8807119,20 19.5,20 L4.5,20 C3.11928813,20 2,18.8807119 2,17.5 L2,6.5 C2,5.11928813 3.11928813,4 4.5,4 Z"></path>
          </g>
        </svg>
        <div className="list-data">
          <div className="title">{folder.description}</div>
          <div className="folder-info">folder: {folder.folder}, file: {folder.file}</div>
        </div>
      </article>
    </Link>
  )
}