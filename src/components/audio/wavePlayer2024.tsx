'use client'

import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FileNotFound } from "../mdx/fileNotFound";

interface Window {
  webkitAudioContext?: typeof AudioContext;
}

export const WavePlayer2024 = ({audioUrl}:{audioUrl:string}) => {
  const [ mounted, setMounted ] = useState(false);
  const { theme } = useTheme();
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const endTimeRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<HTMLDivElement>(null)
  
  const canvasCtx = useRef<CanvasRenderingContext2D>(null)

  const audioCtx = useRef<AudioContext>(undefined);
  
  const source = useRef<MediaElementAudioSourceNode>(undefined)
  const analyser = useRef<AnalyserNode>(undefined)
  const bufferLength = useRef<number>(-1)
  const dataArray = useRef<Uint8Array<ArrayBuffer>>(undefined)
  const audioBuffer = useRef<AudioBuffer>(undefined)
  const [ init, setInit ] = useState(false)
  
  const audioData = useRef<ArrayBuffer>(undefined)

  const color = useRef<string>('#000')
  const color1 = useRef<string>('#000')
  const color2 = useRef<string>('#000')
  const color3 = useRef<string>('#000')

  const now = useRef<number>(Date.now())
  const then = useRef<number>(Date.now())
  const delta = useRef<number>(0)

  const isMouseOverCanvas = useRef<boolean>(false)
  const mouseX = useRef<number>(-100)

  const [ loadState, setLoadState ] = useState<number>(-1)
  const [ paused, setPaused ] = useState<boolean>(true)

  const animateRef = useRef<number>(null)
  
  function logspace(start:number, stop:number, n:number, max:number) {
    return start * Math.pow(stop/start, n/(max-1));
  }
  
  const endTimeUpdate = () => {
    if(audioRef.current && endTimeRef.current && endTimeRef.current.textContent == "00:00"){
      if(!isNaN(audioRef.current.duration)){
        const duration = Math.round(audioRef.current.duration);
        endTimeRef.current.textContent = String(Math.floor(duration/60)).padStart(2, '0')+":"+String(duration%60).padStart(2, '0');
      }
    }
  }
  
  const draw = useCallback(() => {
    endTimeUpdate();
    if(!audioRef.current || !startTimeRef.current || !canvasRef.current) return;
    const currentTime = Math.round(audioRef.current.currentTime);
    startTimeRef.current.textContent = String(Math.floor(currentTime/60)).padStart(2, '0')+":"+String(currentTime%60).padStart(2, '0');

    if(canvasCtx.current)
      canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if(init && analyser.current && dataArray.current){
      analyser.current.getByteFrequencyData(dataArray.current);
    }
    
    const amp = canvasRef.current.height / 2;
    if(canvasCtx.current) {
      if(isMouseOverCanvas.current)
        canvasCtx.current.fillStyle = color2.current;
      else if(audioRef.current.currentTime != 0 && audioRef.current.currentTime != audioRef.current.duration)
        canvasCtx.current.fillStyle = color1.current;
      else canvasCtx.current.fillStyle = color.current;
    }

    if(audioBuffer.current && dataArray.current && bufferLength.current && canvasCtx.current) {
      for (let i = 0; i < canvasRef.current.width; i++) {
        if(i % 6 != 0) continue;
        let min = 1.0;
        let max = -1.0;
        for(let channel=0;channel<audioBuffer.current.numberOfChannels;channel++){
          const channelData = audioBuffer.current.getChannelData(channel);
          const bufferLength = channelData.length;
          const step = Math.ceil(bufferLength / canvasRef.current.width);
          for (let j = 0; j < step; j++) {
              const datum = channelData[(i * step) + j];
              if (datum < min)
                  min = datum;
              if (datum > max)
                  max = datum;
          }
        }
        
        let val = 0;
        if(init){
          const headpos = Math.min(logspace(1, bufferLength.current, 80 + i, canvasRef.current.width + 80), bufferLength.current - 1);
          val = dataArray.current[Math.floor(headpos)] / 256;
          if(Math.floor(headpos) + 1 < canvasRef.current.width)
            val = val * (1 - Math.abs(headpos % 1)) + dataArray.current[Math.floor(headpos) + 1] / 256 * (Math.abs(headpos % 1));
        }
        min = Math.min(min, 0);
        max = Math.max(max, 0);
        if(-min < max) min = -max;
        min = -min * 0.5;
        min += val * 0.4;
        if(init){
          if(isMouseOverCanvas.current){
            if(mouseX.current > i) canvasCtx.current.fillStyle = color1.current;
            else canvasCtx.current.fillStyle = color2.current;
          }
          else if(audioRef.current.currentTime/audioRef.current.duration*canvasRef.current.width <= i){
            canvasCtx.current.fillStyle = color.current;
          }
        }
        canvasCtx.current.fillRect(i, amp * (1 - min) , 2, amp * (min * 2) + 1);
      }
      if(init){
        if(audioRef.current.currentTime !== 0 && !audioRef.current.paused){
          canvasCtx.current.fillStyle = color3.current;
          canvasCtx.current.fillRect(audioRef.current.currentTime/audioRef.current.duration*canvasRef.current.width-2, 0 , 2, canvasRef.current.height);
        }
        else if(isMouseOverCanvas.current){
          canvasCtx.current.fillStyle = color.current;
          canvasCtx.current.fillRect(mouseX.current-2, 0 , 2, canvasRef.current.height);
        }
      }
    }
  }, [init, mounted])

  const update = useCallback((init:boolean = false) => {
    if(!audioRef.current) return;
    const fps = 20;
    const interval = 1000/fps;
    now.current = Date.now();
    delta.current = now.current - then.current;
    
    if(!init && audioRef.current.paused){
      if(delta.current > interval){
        then.current = now.current + (delta.current % interval);
      }
      else return;
    }
    draw();
  }, [draw, mounted])

  const drawWave = useCallback(() => {
    if(canvasRef.current) {
      update()
      animateRef.current = requestAnimationFrame(drawWave)
      if(audioRef.current && audioRef.current.paused !== paused)
        setPaused(audioRef.current.paused)
    }
  }, [paused, update, mounted])

  const getDecodeAudioData = useCallback(async () => {
    if(!audioData.current || !audioCtx.current) return;
    await audioCtx.current.decodeAudioData(audioData.current)
    .then(audioBuff => {
        audioBuffer.current = audioBuff;
        update(true);
      }
    );
  }, [update, mounted])

  useEffect(() => {
    setMounted(true);
  }, [])

  const audiofile_request = useRef<boolean>(false)
  useEffect(() => {
    if(mounted) {
      if(audiofile_request.current) return;
      audiofile_request.current = true
      fetch(`${audioUrl}`)
      .then(res => res.blob())
      .then(async data => {
        audioData.current = await data.arrayBuffer()
        audioCtx.current = new (window.AudioContext || (window as Window).webkitAudioContext)()
        getDecodeAudioData()
        if(audioRef.current) {
          audioRef.current.src = URL.createObjectURL(data)
        }
      })
      .catch((err)=>{
        console.log(err)
        setLoadState(0)
      })
    }
  }, [mounted, audioUrl, getDecodeAudioData]);

  useEffect(()=>{
    if(mounted) {
      if(!canvasCtx.current && canvasRef.current) {
        canvasCtx.current = canvasRef.current.getContext('2d');
      }
    }
  }, [mounted])

  useEffect(()=>{
    if(mounted) {
      color.current  = theme === 'dark' ? '#afafaf' : '#aaaaaa'
      color1.current = theme === 'dark' ? '#ff5277' : '#ff5277'
      color2.current = theme === 'dark' ? '#a1a1a1' : '#dddddd'
      color3.current = theme === 'dark' ? '#f1f1f1' : '#ff9999'
      if(canvasRef.current) {
        const observer = new ResizeObserver((entries)=>{
          entries.forEach(entry=>{
            const { width, height } = entry.contentRect
            if(canvasRef.current) {
              canvasRef.current.width = width;
              canvasRef.current.height = height;
              canvasRef.current.style.maxWidth = `${Math.floor(width)}px`;
              canvasRef.current.style.maxHeight = `${Math.floor(height)}px`;
            }
          })
          update(true);
        })
        observer.observe(canvasRef.current.parentElement as HTMLDivElement)
        animateRef.current = requestAnimationFrame(drawWave)
        return () => {
          observer.disconnect()
          if(animateRef.current){
            cancelAnimationFrame(animateRef.current)
            animateRef.current = null
          }
        }
      }
    }
  }, [mounted, theme, init, update, drawWave])

  const initAudioContent = useCallback(() => {
    if(!audioRef.current || init || !audioCtx.current) return;
    source.current = audioCtx.current.createMediaElementSource(audioRef.current);
    analyser.current = audioCtx.current.createAnalyser();
    source.current.connect(analyser.current);
    analyser.current.connect(audioCtx.current.destination);
    analyser.current.fftSize = 2048;
    bufferLength.current = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength.current);
    setInit(true)
  }, [init, mounted])
  
  const activateAudioContext = () => {
    if(audioCtx.current) {
      if(audioCtx.current.state === 'suspended')
        audioCtx.current.resume().catch(err => console.error("AudioContext Activation failed:", err));
    }
  }

  const buttonEvent = () => {
    if(audioRef.current) {
      activateAudioContext()
      const audio_ary = document.querySelectorAll('audio')
      if (audioRef.current.paused) {
        for(let i=0;i<audio_ary.length;i++){
          audio_ary[i].pause();
          // audio_ary[i].currentTime = 0;
        }
        audioRef.current.play();
      } else {
        // for(let i=0;i<audio_ary.length;i++){
        //   audio_ary[i].currentTime = 0;
        // }
        audioRef.current.pause();
      }
    }
  }

  const mouseupCanvas = () => {
    if(!audioRef.current || !canvasRef.current) return;
    activateAudioContext()
    const audio_ary = document.querySelectorAll('audio')
    for(let i=0;i<audio_ary.length;i++){
      audio_ary[i].pause();
      // audio_ary[i].currentTime = 0;
    }
    if(init) {
      audioRef.current.currentTime = mouseX.current / canvasRef.current.width * audioRef.current.duration;
    }
    audioRef.current.play();
    setPaused(false)
  }

  const mouseenterCanvas = () => {
    isMouseOverCanvas.current = true
  }

  const mouseleaveCanvas = () => {
    isMouseOverCanvas.current = false
    update(true)
  }

  const mousemoveCanvas = (e:MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if(rect) {
      mouseX.current = e.clientX - rect.left
      if(audioRef.current?.paused) update(true)
    }
  }
  
  if(loadState === 0) {
    return (<FileNotFound filename={ audioUrl.split('/').slice(-1)[0] } />)
  }

  return (
    <div className="wave-player-2024">
      <audio ref={audioRef}
        onPlay={()=>{setPaused(false);}}
        onPause={()=>{setPaused(true); update(true)}}
        onLoadedData={()=>{
          endTimeUpdate()
          setLoadState(1)
          initAudioContent()
        }}
      />
      { !mounted &&
        <div className="canvas-box"></div>
      }
      { mounted &&
        <>
          <button onClick={buttonEvent} className="no-style">
            { audioRef.current &&
              <>
                { !paused &&
                  <svg viewBox="0 0 24 24" fill="none">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z"></path>
                      <path d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z"></path>
                    </g>
                  </svg>
                }
                { paused &&
                  <svg viewBox="1.2 0 25.2 24" fill="none">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"></path>
                    </g>
                  </svg>
                }
              </>
            }
            { !audioRef.current &&
              <svg />
            }
          </button>
          <div className="flex flex-row w-full justify-between items-center">
            <div ref={startTimeRef} className="time text-right">00:00</div>
            <div className="w-full canvas-box px-1">
              <div className="w-full h-full">
                <canvas ref={canvasRef}
                  className="w-full h-full"
                  onMouseUp={mouseupCanvas}
                  onMouseEnter={mouseenterCanvas}
                  onMouseLeave={mouseleaveCanvas}
                  onMouseMove={mousemoveCanvas}/>
                </div>
            </div>
            <div ref={endTimeRef} className="time time-end text-left">00:00</div>
          </div>
        </>
      }
    </div>
  )
}