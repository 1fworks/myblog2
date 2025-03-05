export const FileNotFound = ({filename}:{filename: string}) => {
  return (
    <div className="file-not-found">
      <p className="px-1">&quot;{filename}&quot;을</p><p>찾지 못했습니다 XD</p>
    </div>
  )
}