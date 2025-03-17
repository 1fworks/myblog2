import cold_ark from 'assets/styles/prism-coldark-cold-and-dark.module.scss'

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`spotlight ${cold_ark.coldark}`}>
      {children}
    </div>
  )
}