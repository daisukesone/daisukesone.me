import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { createHash } from 'crypto'

const BlogPost = ({ post, blockMap, emailHash, relatedPosts }) => {
  if (!post) return null
  return (
    <Layout
      blockMap={blockMap}
      frontMatter={post}
      emailHash={emailHash}
      fullWidth={post.fullWidth}
      relatedPosts={relatedPosts}
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

  return {
    props: { post, blockMap, emailHash, relatedPosts },
    revalidate: 1
  }
}

export default BlogPost
