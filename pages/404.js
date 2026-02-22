import Container from '@/components/Container'
import Link from 'next/link'

const NotFound = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page Not Found</p>
        <Link href="/">
          <a className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
            Back to Home
          </a>
        </Link>
      </div>
    </Container>
  )
}

export default NotFound
