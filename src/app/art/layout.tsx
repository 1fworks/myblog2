export default function ArtLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='spotlight'>
      {children}
    </div>
  )
}