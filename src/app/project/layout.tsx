export default function ProjectLayout({
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