import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { getReadingTime } from '@/lib/readingTime'
import { createHash } from 'crypto'

const BlogPost = ({ post, blockMap, emailHash, readingTime }) => {
  if (!post) return null
  return (
    <Layout
      blockMap={blockMap}
      frontMatter={post}
      emailHash={emailHash}
      fullWidth={post.fullWidth}
      readingTime={readingTime}
    />
  )
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: posts.map(row => `${BLOG.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)
  const blockMap = await getPostBlocks(post.id)
  const readingTime = getReadingTime(blockMap)
  const emailHash = createHash('md5')
    .update(BLOG.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  return {
    props: { post, blockMap, emailHash, readingTime },
    revalidate: 1
  }
}

export default BlogPost
