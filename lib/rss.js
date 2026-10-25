import { Feed } from 'feed'
import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { blocksToHtml } from '@/lib/notion/exportContent'

export async function generateRss (posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: BLOG.title,
    description: BLOG.description,
    id: `${BLOG.link}/${BLOG.path}`,
    link: `${BLOG.link}/${BLOG.path}`,
    language: BLOG.lang,
    favicon: `${BLOG.link}/favicon.png`,
    copyright: `All rights reserved ${year}, ${BLOG.author}`,
    author: {
      name: BLOG.author,
      email: BLOG.email,
      link: BLOG.link
    }
  })
  for (const post of posts) {
    // Full post content in the feed so platforms like Substack can import
    // articles via RSS. Falls back to the summary if Notion is unreachable.
    let content
    try {
      const blockMap = await getPostBlocks(post.id)
      content = blocksToHtml(blockMap, post.id)
    } catch (error) {
      console.error(`RSS: failed to render content for "${post.slug}":`, error)
    }
    feed.addItem({
      title: post.title,
      id: `${BLOG.link}/${post.slug}`,
      link: `${BLOG.link}/${post.slug}`,
      description: post.summary,
      content: content || post.summary,
      date: new Date(post?.date?.start_date || post.createdTime)
    })
  }
  return feed.rss2()
}
