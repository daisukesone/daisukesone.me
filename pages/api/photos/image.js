import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { get } from '@vercel/blob'
import { isGalleryPath } from '@/lib/photos/catalog'

export const config = { api: { responseLimit: false } }

// Only images explicitly uploaded to photos/ are exposed by the gallery.
export default async function handler (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).end()
  }
  const pathname = req.query.path
  if (!isGalleryPath(pathname)) return res.status(404).end()
  try {
    const result = await get(pathname, { access: 'private' })
    if (!result || result.statusCode !== 200 || !result.stream) return res.status(404).end()
    const contentType = result.blob.contentType
    if (!/^image\/(jpeg|png|webp|avif|gif)$/i.test(contentType || '')) {
      await result.stream.cancel()
      return res.status(404).end()
    }
    res.setHeader('Content-Type', contentType)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300')
    if (req.method === 'HEAD') {
      await result.stream.cancel()
      return res.status(200).end()
    }
    await pipeline(Readable.fromWeb(result.stream), res)
  } catch (error) {
    console.error('Photo could not be loaded:', error.name)
    if (!res.headersSent) res.status(503).end()
    else res.destroy()
  }
}
