import { getAllPosts } from './getAllPosts'
import { getPostBlocks } from './getPostBlocks'
import mapImageUrl from './mapImageUrl'

/**
 * Extract every image block from a post's block map, in document order.
 */
export function extractImages (blockMap, rootId) {
  const images = []
  const root = blockMap?.block?.[rootId]?.value
  if (!root) return images
  const walk = ids => {
    if (!ids) return
    for (const id of ids) {
      const value = blockMap.block?.[id]?.value
      if (!value) continue
      if (value.type === 'image') {
        const src =
          value.properties?.source?.[0]?.[0] || value.format?.display_source
        const mapped = mapImageUrl(src, value.id)
        if (mapped) {
          images.push({
            id: value.id,
            src: mapped,
            caption: value.properties?.caption?.[0]?.[0] || '',
            width: value.format?.block_width || null,
            aspectRatio: value.format?.block_aspect_ratio || null
          })
        }
      }
      walk(value.content)
    }
  }
  walk(root.content)
  return images
}

/**
 * All published posts with type 'Photo', each with a cover image and
 * image count for the gallery grid.
 */
export async function getPhotoPosts () {
  const posts = await getAllPosts({ includePages: true })
  const photoPosts = (posts || []).filter(p => p?.type?.[0] === 'Photo')
  const gallery = []
  for (const post of photoPosts) {
    try {
      const blockMap = await getPostBlocks(post.id)
      const images = extractImages(blockMap, post.id)
      const pageCover = blockMap?.block?.[post.id]?.value?.format?.page_cover
      const cover =
        images[0]?.src || (pageCover ? mapImageUrl(pageCover, post.id) : null)
      if (!cover) continue
      gallery.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary || '',
        date: post?.date?.start_date || post.createdTime,
        createdTime: post.createdTime,
        cover,
        aspectRatio: images[0]?.aspectRatio || null,
        imageCount: images.length
      })
    } catch (error) {
      console.error(`Failed to load photo post "${post.slug}":`, error)
    }
  }
  return gallery
}
