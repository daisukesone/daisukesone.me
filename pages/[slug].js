import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { getReadingTime } from '@/lib/readingTime'
import { createHash } from 'crypto'

const BlogPost = ({ post, blockMap, emailHash, prevPost, nextPost, readingTime, relatedPosts }) => {
  if (!post) return null
  return (
    <Layout
      blockMap={blockMap}
      frontMatter={post}
      emailHash={emailHash}
      fullWidth={post.fullWidth}
      prevPost={prevPost}
      nextPost={nextPost}
      readingTime={readingTime}
      relatedPosts={relatedPosts}
    />
  )
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: (posts || []).map(row => `${BLOG.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)
  if (!post) return { notFound: true }
  const blockMap = await getPostBlocks(post.id)
  const readingTime = getReadingTime(blockMap)
  const currentTags = post.tags || []
  const relatedPosts = currentTags.length > 0
    ? posts
        .filter(p => p.slug !== slug && p.type && p.type[0] !== 'Page' && (p.tags || []).some(t => currentTags.includes(t)))
        .slice(0, 3)
    : []
  const emailHash = createHash('md5')
    .update(BLOG.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  const postIndex = posts.indexOf(post)
  const prevPost = postIndex > 0 ? { title: posts[postIndex - 1].title, slug: posts[postIndex - 1].slug } : null
  const nextPost = postIndex < posts.length - 1 ? { title: posts[postIndex + 1].title, slug: posts[postIndex + 1].slug } : null

  return {
    props: { post, blockMap, emailHash, prevPost, nextPost, readingTime, relatedPosts },
    revalidate: 1
  }
}

export default BlogPost
