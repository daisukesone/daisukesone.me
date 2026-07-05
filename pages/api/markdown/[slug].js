import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { blocksToMarkdown } from '@/lib/notion/exportContent'

/**
 * GET /api/markdown/<slug>
 *
 * Returns the post as plain Markdown — handy for pasting into platforms
 * that have no import API, such as note.com.
 * Add ?download=1 to receive it as a file download.
 */
export default async function handler (req, res) {
  const { slug, download } = req.query
  try {
    const posts = await getAllPosts({ includePages: true })
    const post = posts.find(t => t.slug === slug)
    if (!post) {
      res.status(404).send('Not found')
      return
    }
    const blockMap = await getPostBlocks(post.id)
    const markdown = blocksToMarkdown(blockMap, post.id, post)
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=59'
    )
    if (download) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(slug)}.md"`
      )
    }
    res.status(200).send(markdown)
  } catch (error) {
    console.error(`Markdown export failed for "${slug}":`, error)
    res.status(500).send('Failed to export post')
  }
}
