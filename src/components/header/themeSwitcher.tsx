"use client"

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
  const [ mounted, setMounted ] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.body.style.transitionProperty = 'all';
    document.body.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.style.transitionDuration = '150ms';
    setMounted(true);
  }, []);

  return (
    <div className='mode' onClick={()=>{
      if(mounted){
        if(theme !== 'dark') setTheme('dark');
        else setTheme('light');
      }
    }}>
      {
        // Image by Dazzle UI, licensed under CC Attribution License
        // https://www.svgrepo.com/collection/dazzle-line-icons
      }
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>
    </div>
  )
}

export default ThemeSwitch