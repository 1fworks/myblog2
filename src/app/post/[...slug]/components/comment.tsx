'use client'
import { siteSetting } from '@/app/site.setting';
import Giscus from '@giscus/react'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react';

export const Comment = ({customTheme}:{customTheme:string}) => {
  const [ mounted, setMounted ] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted) return null;
  return (
    <div className='giscus-box'>
      { process.env.NODE_ENV === 'production' &&
        <Giscus
          repo={`${siteSetting.proj.github}/${siteSetting.proj.repo}`}
          repoId={`${siteSetting.proj.repoId}`}
          category="Announcements"
          categoryId={`${siteSetting.proj.categoryId}`}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme==="light"?customTheme:"noborder_gray"} //noborder_light
          lang="ko"
        />
      }
    </div>
  )
}