import { FileListItem, DividingLine } from "@/app/archive/[[...slug]]/components/filelistitem";
import { MyNextImage } from "@/components/image/mynextImage";
import dayjs from "dayjs";

export const RecentPostAndArt = ({ className, posts, images }:
{
  className: string,
  posts: {
    date: string, title: string, url: string
  }[],
  images: {
    data: {
      width: number,
      height: number,
    },
    filename: string
  }[],
}
) => {
  return (
    <div className={className}>
      <h1 className='font-anton animate-climb100-animation'>
        Recent
      </h1>
      { posts.map((post, i)=>{
        return (
          <div className="w-full" key={`recent-post ${i}`}>
            { (i == 0 || dayjs(posts[Math.max(i-1, 0)].date).format('YYYY') !== dayjs(posts[Math.max(i, 0)].date).format('YYYY')) &&
              <DividingLine key={`line ${i}`} text={dayjs(posts[Math.max(i, 0)].date).format('YYYY')} delay={(i+1)*100}/>
            }
            <FileListItem file={post} key={`recent-post ${i}`} delay={(i+1)*100} year={false}/>
          </div>
        )
      })}
      <div className="mini-gallery">
        { images.map((image, i)=>{
          const filename = image.filename.split('/').slice(-1)[0]
          return (
            <div
              className="gallery-image"
              key={`recent-image ${i}`}
            >
              <MyNextImage
                filename={filename}
                alt={filename}
                src={image.filename}
                ratio={1/1}
                cover={true}
                imgWidth={image.data.width}
                imgHeight={image.data.height}
                unoptimized={false}
                delay={(i+1)*100}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}