import BLOG from '@/blog.config'

const Footer = ({ fullWidth }) => {
  const d = new Date()
  const y = d.getFullYear()
  const from = +BLOG.since
  return (
    <div
      className={`mt-10 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all ${
        !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
      }`}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      <div className="my-5 text-sm leading-6">
        <div className="flex align-baseline justify-between flex-wrap">
          <p className="font-medium">
            © {BLOG.author} {from === y || !from ? y : `${from} - ${y}`}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 self-center">
            Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Next.js
            </a>{' '}
            &amp;{' '}
            <a
              href="https://notion.so"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Notion
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
