/**
 * Map a raw Notion image source to a stable, publicly servable URL.
 * Notion attachment URLs (S3 signed URLs) expire, so everything is routed
 * through Notion's image proxy, which works for public pages and never expires.
 */
export default function mapImageUrl (url, blockId) {
  if (!url) return null
  if (url.startsWith('data:')) return url
  // built-in covers & images like '/images/page-cover/...'
  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`
  }
  if (url.startsWith('https://www.notion.so/image/')) return url
  return `https://www.notion.so/image/${encodeURIComponent(
    url
  )}?table=block&id=${blockId}&cache=v2`
}
