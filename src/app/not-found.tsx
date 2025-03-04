import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='notification'>
      <div>
        <div>
          <h1>404</h1><h1>404</h1><h1>404</h1><h1>404</h1>
        </div>
        <h2>Not Found</h2>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  )
}