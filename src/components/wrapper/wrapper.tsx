'use client'

import { Footer } from '@/components/footer/footer';
import { usePathname } from 'next/navigation';

export const Wrapper = ({children}:{children:React.ReactNode}) => {
  const path = usePathname()
  const condition = ['/', '/about']
  return (
    <div className='uwu'>
    { condition.indexOf(path) > -1 &&
      <div className='empty-div cute grow'></div>
    }
      <div className='grow-0'>
        <div className='space'></div>
        <div className='wrapper'>
          {children}
        </div>
      </div>
    { condition.indexOf(path) > -1 &&
      <div className='empty-div grow'></div>
    }
      <div className='grow-0'>
        <Footer />
      </div>
    </div>
  )
}