import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { createHash } from 'crypto'

const BlogPost = ({ post, blockMap, emailHash, prevPost, nextPost }) => {
  if (!post) return null
  return (
    <Layout
      blockMap={blockMap}
      frontMatter={post}
      emailHash={emailHash}
      fullWidth={post.fullWidth}
      prevPost={prevPost}
      nextPost={nextPost}
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
  const emailHash = createHash('md5')
    .update(BLOG.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  const postIndex = posts.indexOf(post)
  const prevPost = postIndex > 0 ? { title: posts[postIndex - 1].title, slug: posts[postIndex - 1].slug } : null
  const nextPost = postIndex < posts.length - 1 ? { title: posts[postIndex + 1].title, slug: posts[postIndex + 1].slug } : null

  return {
    props: { post, blockMap, emailHash, prevPost, nextPost },
    revalidate: 1
  }
}

export default BlogPost
