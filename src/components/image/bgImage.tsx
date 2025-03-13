'use client'

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useMediaQuery } from 'usehooks-ts'

export const BgImage = ({basePath}:{basePath:string}) => {
    const path = usePathname()
    const [ tag, setTag ] = useState('')
    const [ mounted, setMounted ] = useState(false)
    const [ imgSize, setImgSize ] = useState({width: 0, height:0})
    const [ loaded, setLoaded ] = useState(true)
    const [ imgSource, setImgSource ] = useState('')

    const on_tablet = useMediaQuery('(max-width: 1100px)')
    const on_mobile = useMediaQuery('(max-width: 768px)')
    const on_super_mini = useMediaQuery('(max-width: 400px)')

    const bg_size = on_super_mini ? 0.3 : (on_mobile ? 0.35 : (on_tablet ? 0.4 : 0.6))

    useEffect(()=>{
        setMounted(true)
    }, [])

    useEffect(()=>{
        const category = path.split('/')[1] === '' ? 'home' : path.split('/')[1]
        setTag(category)
        const src = `${basePath}/assets/img/bg/${category}.webp`
        if(src !== imgSource) {
            setImgSource(`url('${src}')`)
            const img = new Image()
            img.src = src
            if(img.complete) {
                setLoaded(true)
                setImgSize({width: img.naturalWidth, height: img.naturalHeight})
            }
            else {
                setLoaded(false)
                img.onload = () => {
                    setLoaded(true)
                    setImgSize({width: img.naturalWidth, height: img.naturalHeight})
                }
                return () => {
                    img.onload = null
                }
            }
        }
    }, [path, imgSource, basePath])

    if(!mounted) return null;
    
    return (
        <div
            className="bgimg"
        >
            { loaded &&
                <>
                { tag === 'home' && 
                    <div
                        className='bgimg-segment bg-home animate-climb100-animation'
                        style={{animationDuration:'500ms'}}
                    >
                        <div className="bg-repeat-x bg-left"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                        <div className="bg-repeat-x bg-right"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                    </div>
                }
                { tag === 'archive' && 
                    <div
                        className='bgimg-segment bg-archive animate-climb100-animation'
                        style={{animationDuration:'500ms'}}
                    >
                        <div className="bg-repeat-x bg-left"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                        <div className="bg-repeat-x bg-right"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                    </div>
                }
                { tag === 'art' && 
                    <div
                        className='bgimg-segment bg-art animate-climb100-animation'
                        style={{animationDuration:'500ms'}}
                    >
                        <div className="bg-repeat bg-right"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                    </div>
                }
                { tag === 'project' && 
                    <div
                        className='bgimg-segment bg-project animate-climb100-animation'
                        style={{animationDuration:'500ms'}}
                    >
                        <div className="bg-repeat bg-right bg-dark"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                    </div>
                }
                { tag === 'about' && 
                    <div
                        className='bgimg-segment bg-about animate-climb100-animation'
                        style={{animationDuration:'500ms'}}
                    >
                        <div className="bg-repeat-x bg-left bg-dark"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                        <div className="bg-repeat-x bg-right bg-dark"
                            style={{backgroundImage: imgSource, backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,}}
                        />
                    </div>
                }
                { tag === 'post' && 
                    <div
                        className='bgimg-segment bg-post animate-climb100-animation'
                        style={{animationDuration:'500ms'}}
                    >
                        <div className="bg-no-repeat bg-left"
                            style={{
                                backgroundImage: imgSource,
                                backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,
                                backgroundPositionX: `calc(100% + ${Math.round(imgSize.width*0.5*bg_size)}px)`,
                            }}
                        />
                        <div className="bg-no-repeat bg-right"
                            style={{
                                backgroundImage: imgSource,
                                backgroundSize: `${imgSize.width*bg_size}px ${imgSize.height*bg_size}px`,
                                backgroundPositionX: `-${Math.round(imgSize.width*0.5*bg_size)}px`,
                            }}
                        />
                    </div>
                }
                </>
            }
        </div>
    )
}