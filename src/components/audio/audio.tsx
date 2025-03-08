export const MyAudio = ({audioUrl}: {audioUrl:string}) => {
  return (
    <div className="my-audio">
      <audio className="w-full rounded-md" controls src={`${audioUrl}`} />
    </div>
  )
}