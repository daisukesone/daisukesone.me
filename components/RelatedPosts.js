import Link from 'next/link'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'

const RelatedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null
  return (
    <div className="mt-8 mb-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Related Posts</h3>
      <div className="space-y-3">
        {posts.map(post => (
          <Link key={post.id} href={`${BLOG.path}/${post.slug}`}>
            <a className="block group">
              <p className="text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition">
                {post.title}
              </p>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}
              </time>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedPosts
