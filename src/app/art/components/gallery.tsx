import { MyNextImage } from '@/components/image/mynextImage'

export const Gallery = ({ listName, imageList, className="" }
:{
  listName: string,
  imageList: {
    data:{width:number, height:number},
    filename: string
  }[],
  className: string,
}) => {
  return (
    <section className={`gallery ${className}`}>
      <h1 id={listName} className='animate-climb100-animation' style={{animationDuration:`${500}ms`}}>
        <a className={`anchor`} href={`#${listName}`}>
          {listName.replace('_', ' ').toUpperCase()}
        </a>
      </h1>
      <div className="gallery-box">
        {imageList.map((imageData, i)=>{
          const filename = imageData.filename.split('/').slice(-1)[0]
          return (
            <div className="gallery-image" key={`img ${i}`}>
              <MyNextImage
                filename={filename}
                alt={filename}
                src={imageData.filename}
                ratio={1/1}
                cover={true}
                imgWidth={imageData.data.width}
                imgHeight={imageData.data.height}
                unoptimized={false}
                delay={i*50}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}