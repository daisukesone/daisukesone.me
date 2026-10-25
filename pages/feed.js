import { getAllPosts } from '@/lib/notion'
import { generateRss } from '@/lib/rss'
export async function getServerSideProps ({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  // Cache on the CDN so the feed doesn't hit Notion on every request
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  )
  const posts = await getAllPosts({ includePages: false })
  const latestPosts = posts.slice(0, 10)
  const xmlFeed = await generateRss(latestPosts)
  res.write(xmlFeed)
  res.end()
  return {
    props: {}
  }
}
const feed = () => null
export default feed
