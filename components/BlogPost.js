import Link from 'next/link'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'

const BlogPost = ({ post, index = 0 }) => {
  const delay = Math.min(index + 3, 8)
  return (
    <Link href={`${BLOG.path}/${post.slug}`}>
      <a className={`post-card group mb-4 md:mb-5 fade-up fade-up-${delay}`}>
        <article key={post.id}>
          <header className="flex items-center justify-between mb-2">
            <time className="post-date">
              {formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}
            </time>
            <span className="post-arrow">
              Read
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </header>
          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-gray-100 transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-rose-500">
            {post.title}
          </h2>
          {post.summary && (
            <p className="post-summary leading-7 text-sm md:text-base text-gray-500 dark:text-gray-400">
              {post.summary}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap mt-3 -mb-1">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-pill mr-2 mb-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </a>
    </Link>
  )
}

export default BlogPost
