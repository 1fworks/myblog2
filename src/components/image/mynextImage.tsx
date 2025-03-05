"use client"

import ExportedImage from "next-image-export-optimizer";
import { default as NextImage } from "next/image";
import { useState, useEffect, useRef, MouseEvent, TransitionEvent, SyntheticEvent, useCallback } from "react";
import { FileNotFound } from "../mdx/fileNotFound";
import { basePath } from "@/app/site.setting";
import path from "path";

export const closeImgModal = () => {
    const modal = document.querySelector('.img-modal-active') as HTMLElement
    if(modal) {
        modal.classList.add('img-modal')
        modal.classList.remove('img-modal-active')
    }

    const nav = document.querySelector('.navmenu') as HTMLElement
    if(nav) {
        nav.classList.add('navmenu-z30')
        // nav.classList.remove('navmenu-hide')
    }

    const images = document.querySelectorAll('.img-focus-active')
    images.forEach((img)=>{
        if(img instanceof HTMLElement){
            const mark = img.querySelector('.loading-mark') as HTMLElement
            if(mark){
                mark.style.scale = '1'
            }
            img.querySelectorAll('img').forEach(element => {
                element.style.imageRendering = "auto"
            })
            img.style.scale = '1'
            img.style.transform = `translate(0%, 0%)`
            img.classList.add('img-focus')
            const ratio = img.dataset.aspectratio
            if(ratio) img.style.aspectRatio = ratio
            img.classList.remove('img-focus-active')
        }
    })
}

export const style_init = () => {
    const modal = document.querySelector('.img-modal') as HTMLElement
    if(modal)
        modal.style.zIndex = '-10'

    const nav = document.querySelector('.navmenu') as HTMLElement
    if(nav) { nav.classList.remove('navmenu-z30') }
}

// If it is an external image,
// use imgWidth=0, imgHeight=0
export const MyNextImage = (
{filename, src, alt, unoptimized=false, ratio=-1, cover=false, imgWidth=-1, imgHeight=-1, delay=0, clickable=true, animate=true}
:
{
    filename:string, src:string, alt?:string,
    ratio?:number, cover?:boolean, unoptimized?:boolean,
    imgWidth?:number, imgHeight?:number, delay?:number, clickable?:boolean, animate?:boolean}) => {
    
    const src_with_basePath = path.join(`${basePath}/`,`${src}`)

    imgWidth = Number(imgWidth)
    imgHeight = Number(imgHeight)
    
    const animateBoxRef = useRef<HTMLDivElement>(null)
    const imgBoxRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const nextImg = useRef<HTMLImageElement>(null)
    const divZoomRef = useRef<HTMLDivElement>(null)
    const skeletonRef = useRef<HTMLDivElement>(null)
    const [ loadFail, setLoadFail ] = useState<boolean>(false)
    const [ loadOriginalImgFail, setLoadOriginalImgFail ] = useState<boolean>(false)
    const [ animateEnd, setAnimateEnd ] = useState<boolean>(false)
    const [ isLoaded, setIsLoaded ] = useState<boolean>(false)
    const [ isOriginalImage, setIsOriginalImage ] = useState<boolean|undefined>(undefined)
    const [ imgData, setImgData ] = useState<{width:number, height:number}>({width:0, height:0})


    const transitionEndEvent = (e:TransitionEvent) => {
        if(e.currentTarget.classList.contains('img-focus')){
            const target = e.currentTarget as HTMLImageElement
            if(target.style.zIndex === '0') return;
            style_init()
            const toc = document.querySelector('nav.toc') as HTMLElement
            if(toc)
                toc.style.zIndex = '1'
            target.style.zIndex = '0'
            target.classList.add('img-attention')
            const parentTarget = target.parentElement
            if(parentTarget)
                parentTarget.style.zIndex = '1'
        }
    }

    const loadOriginalImage = () => {
        if(isOriginalImage) return;
        const loadComplete = (img: HTMLImageElement|null) => {
            setTimeout(()=>{
                if(!img) return;
                setIsOriginalImage(true)
                if(img.naturalWidth > imgData.width || img.naturalHeight > imgData.height){
                    setImgData({width: img.naturalWidth, height: img.naturalHeight})
                }
            }, 500)
        }
        if(nextImg.current === null) {
            const img = new Image()
            img.src = src_with_basePath
            nextImg.current = img
        }
        else {
            nextImg.current.onload = null
            nextImg.current.onerror = null
        }

        if(nextImg.current.complete) {
            loadComplete(nextImg.current)
        } else {
            nextImg.current.onload = () => {loadComplete(nextImg.current)}
            nextImg.current.onerror = () => {setLoadOriginalImgFail(true)}
        }
    }

    const calculate_scale_and_pos = useCallback((element: HTMLElement) => {
        const margin = window.innerWidth > 768 ? 20 : 0//px
        let original = false

        const parentTarget = element.parentElement
        if(!parentTarget
        || !parentTarget.parentElement
        || !imgBoxRef.current
        || !animateBoxRef.current)
            return { max_scale: null, mov_xy: null };
        
        const rect_w = parentTarget.getBoundingClientRect().width
        const rect_h = parentTarget.getBoundingClientRect().height

        const boxWidth = rect_w
        let boxHeight = rect_h
        
        if(ratio) {
            boxHeight = boxWidth * (imgData.height/imgData.width)
        }

        const img_vw = Math.min(boxWidth, imgData.width)
        const img_vh = Math.min(boxHeight, imgData.height)
        const max_scale = Math.min(
                Math.min(imgData.width, document.body.clientWidth - margin * 2) / img_vw,
                Math.min(imgData.height, window.innerHeight - margin * 2) / img_vh
        );
        if(imgData.width < document.body.clientWidth - margin * 2
        && imgData.height < window.innerHeight - margin * 2) {
            original = true
        }
        
        const pt_end = [
            window.scrollX + document.body.clientWidth/2,
            window.scrollY + window.innerHeight/2
        ]
        const pt_start = [
            animateBoxRef.current.offsetLeft + imgBoxRef.current.offsetLeft + parentTarget.offsetWidth/2,
            animateBoxRef.current.offsetTop + imgBoxRef.current.offsetTop + parentTarget.offsetHeight/2
            + (boxHeight - rect_h)/2
        ]
        const mov_xy = [
            Math.round((pt_end[0]-pt_start[0]) / max_scale),
            Math.round((pt_end[1]-pt_start[1]) / max_scale)
        ]
        
        return { max_scale: max_scale, mov_xy: mov_xy, pixelated: original }
    }, [ratio, imgData])

    const clickEvent = (e:MouseEvent) => {
        e.stopPropagation()
        if(!animateEnd) setAnimateEnd(true)
        loadOriginalImage()

        const target = e.currentTarget as HTMLImageElement
        const mark = target.querySelector('.loading-mark') as HTMLElement
        const parentTarget = target.parentElement
        const toc = document.querySelector('nav.toc') as HTMLElement
        const nav = document.querySelector('.navmenu') as HTMLElement

        if(!parentTarget || !parentTarget.parentElement) return;

        const { max_scale, mov_xy, pixelated } = calculate_scale_and_pos(target)
        if(!max_scale || !mov_xy) return;
        
        if(target.classList.contains('img-focus')){ // zoom
            if(mark){
                mark.style.scale = `${1/max_scale}`
            }
            if(toc)
                toc.style.zIndex = '0'
            if(nav) {
                nav.classList.remove('navmenu-z30')
                // nav.classList.add('navmenu-hide')
            }

            const modal = document.querySelector('.img-modal') as HTMLElement
            if(modal) {
                modal.classList.add('img-modal-active')
                modal.classList.remove('img-modal')
                modal.style.zIndex = '10'
            }

            if(pixelated) {
                target.querySelectorAll('img').forEach(element => {
                    element.style.imageRendering = "pixelated"
                })
            }

            target.classList.add('img-focus-active')
            const ratio = target.dataset.aspectratioactive
            if(ratio) target.style.aspectRatio = ratio
            target.classList.remove('img-attention')
            target.classList.remove('img-focus')
            target.style.zIndex = '100'
            target.style.scale = `${max_scale}`
            target.style.transform = `translate(${mov_xy[0]}px, ${mov_xy[1]}px)` // move
            if(parentTarget)
                parentTarget.style.zIndex = '99'
            const images = document.querySelectorAll('.img-focus')
            images.forEach((img)=>{
                if(img instanceof HTMLElement){
                    const img_parentTarget = img.parentElement
                    if(img_parentTarget)
                        img_parentTarget.style.zIndex = '0'
                }
            })
        } else{ // original
            closeImgModal()
        }
    }

    const onLoadEvent = (e:SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget
        completeLoad(target)
    }

    const completeLoad = useCallback((img: HTMLImageElement) => {
        const timer = setTimeout(()=>{
            if(img.naturalWidth > imgData.width && img.naturalHeight > imgData.height) {
                if(imgWidth > img.naturalWidth && imgHeight > img.naturalWidth){
                    setImgData({width: imgWidth, height: imgHeight})
                } else setImgData({width: img.naturalWidth, height: img.naturalHeight})
            }
            if(!isLoaded) setIsLoaded(true)
        }, 500)
        return ()=>{clearTimeout(timer)}
    }, [isLoaded, imgData, imgWidth, imgHeight])
    
    useEffect(()=>{
        if(isOriginalImage === undefined) {
            if(unoptimized || (imgWidth === 0 && imgHeight === 0)) {
                if(isOriginalImage !== true) setIsOriginalImage(true)
            }
            else if(isOriginalImage !== false) setIsOriginalImage(false)
            return;
        }

        if(!isLoaded) {
            const img = imgRef.current
            if(img && img.complete) { // check cache
                completeLoad(img)
                return;
            }
        }
    }, [isOriginalImage, isLoaded, completeLoad, imgWidth, imgHeight, unoptimized])

    useEffect(()=>{
        if(imgWidth > 0 && imgHeight > 0) { // (recommend)
            if(imgWidth > imgData.width && imgHeight > imgData.height) {
                setImgData({width: imgWidth, height: imgHeight})
            }
        }
        else if(imgWidth == -1 || imgHeight == -1) { // ... If possible, avoid using it. :D
            if(imgData.width === 0 && imgData.height === 0) {
                fetch('/api/getAllPostImagesData')
                .then(res => res.json())
                .then(data => {
                    if(data[src] !== undefined) {
                        if(data[src].width > imgData.width || data[src].height > imgData.height) {
                            setImgData(data[src])
                        }
                    }
                })
            }
        }
    }, [imgWidth, imgHeight, imgData.width, imgData.height, src])

    useEffect(()=>{
        const div = divZoomRef.current
        if(div && div.classList.contains('img-focus-active')){
            const { max_scale, mov_xy, pixelated } = calculate_scale_and_pos(div)
            if(pixelated) {
                div.querySelectorAll('img').forEach(element => {
                    element.style.imageRendering = "pixelated"
                })
            }
            if(max_scale !== null && mov_xy !== null){
                div.style.scale = `${max_scale}`
                div.style.transform = `translate(${mov_xy[0]}px, ${mov_xy[1]}px)`
            }
        }
    }, [calculate_scale_and_pos])
    
    const width = Math.max(imgWidth, imgData.width)
    const height = Math.max(imgHeight, imgData.height)

    const skeleton_div_className = isLoaded?'isLoaded':
        `skeleton ${imgWidth === 0 && imgHeight === 0?'temporary_img':''} animate-shimmer-animation \
        ${cover?
            'w-full h-full':(width > 0 ? `w-fit mx-auto`:'w-1/2 mx-auto')} \
        ${cover?'':
            ratio > 0?
                `aspect-[${ratio}]`:(width > 0 ?`aspect-[${width/height}]`:'aspect-video')}`
    
    if(loadFail)
        return <FileNotFound filename={filename}/>
    
    return (
    <div className={`${cover?'w-full h-full':'my-img'}`}>
        <div
            ref={animateBoxRef}
            className={`${cover?'w-full h-full':''} relative ${!animate || animateEnd || !cover?'':'img-box-wrapping-paper animate-climb100-animation'}`} // relative
            style={{animationDelay: `${Math.max(delay, 0)}ms`}}
            onAnimationEnd={()=>{if(!animateEnd) setAnimateEnd(true)}}
        >
            { isOriginalImage !== undefined &&
                <div ref={imgBoxRef} className={`img-box ${clickable?'':'click-unable'} ${isLoaded?`${cover?'cover':''}`:`cover`}`}> {/*relative*/}
                    { isLoaded && imgData.width > 0 && imgData.height > 0 &&
                        <div className="img-zoom" onClick={()=>{if(clickable) closeImgModal()}}> {/*absolute*/}
                            <div
                                ref={divZoomRef}
                                className='img-focus img-attention'
                                onClick={(e)=>{if(clickable) clickEvent(e)}}
                                onTransitionEnd={transitionEndEvent}
                                style={ratio > 0 ?{aspectRatio:ratio}:undefined}
                                data-aspectratio={ratio > 0 ? ratio : undefined}
                                data-aspectratioactive={
                                    ratio > 0 && imgData.width > 0 && imgData.height > 0 ?
                                    imgData.width/imgData.height
                                    : undefined
                                }
                            >
                                { process.env.NODE_ENV === 'production' &&
                                    <ExportedImage
                                        data-src={src_with_basePath}
                                        src={src_with_basePath}
                                        alt={alt?alt:filename}
                                        width={imgData.width}
                                        height={imgData.height}
                                        sizes="100vw"
                                        unoptimized={isOriginalImage}
                                    />
                                }
                                { process.env.NODE_ENV !== 'production' &&
                                    <NextImage
                                        data-src={src_with_basePath}
                                        src={src_with_basePath}
                                        alt={alt?alt:filename}
                                        width={imgData.width}
                                        height={imgData.height}
                                        sizes="100vw"
                                        quality={100}
                                        unoptimized={isOriginalImage}
                                    />
                                }
                                { !unoptimized && !isOriginalImage && !loadOriginalImgFail &&
                                    <div className="loading-mark">
                                        <div className="p-4 w-full h-full">
                                            <div className="rolling animate-spin"/>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    <div ref={skeletonRef} className={skeleton_div_className}>
                        { process.env.NODE_ENV === 'production' &&
                            <ExportedImage
                                ref={imgRef}
                                className={`img-location ${isLoaded?'visible':'invisible'}`}
                                style={{
                                    aspectRatio: ratio > 0 ? ratio : 'auto',
                                    objectFit: cover ? 'cover' : 'contain',
                                }}
                                onLoad={onLoadEvent}
                                data-src={src_with_basePath}
                                src={src_with_basePath}
                                alt={alt?alt:filename}
                                width={imgData.width}
                                height={imgData.height}
                                sizes="100vw"
                                unoptimized={isOriginalImage}
                                onError={()=>{setLoadFail(true)}}
                            />
                        }
                        { process.env.NODE_ENV !== 'production' &&
                            <NextImage
                                ref={imgRef}
                                className={`img-location ${isLoaded?'visible':'invisible'}`}
                                style={{
                                    aspectRatio: ratio > 0 ? ratio : 'auto',
                                    objectFit: cover ? 'cover' : 'contain',
                                }}
                                onLoad={onLoadEvent}
                                data-src={src_with_basePath}
                                src={src_with_basePath}
                                alt={alt?alt:filename}
                                width={imgData.width}
                                height={imgData.height}
                                sizes="100vw"
                                quality={100}
                                unoptimized={isOriginalImage}
                                onError={()=>{setLoadFail(true)}}
                            />
                        }
                    </div>
                </div>
            }
            {/* { isOriginalImage !== undefined &&
                <>
                { isOriginalImage && <div>original</div> }
                { !isOriginalImage && <div>optimized img</div> }
                <div>size = {width} {height}</div>
                </>
            } */}
        </div>
    </div>
    )
}