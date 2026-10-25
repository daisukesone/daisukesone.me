const extensions = /\.(jpe?g|png|webp|avif|gif)$/i

export function isGalleryPath (pathname) {
  return typeof pathname === 'string' &&
    pathname.startsWith('photos/') &&
    !pathname.split('/').some(part => !part || part === '.' || part === '..') &&
    !/[\\%?#]/.test(pathname) && !Array.from(pathname).some(char => char.charCodeAt(0) < 32) && extensions.test(pathname)
}

export function toGalleryPhotos (blobs, metadata = {}) {
  return blobs.filter(blob => isGalleryPath(blob.pathname)).map(blob => {
    const imported = metadata[blob.pathname]
    return {
      id: blob.pathname,
      title: imported ? (imported.title || 'Tumblrからの写真') : blob.pathname.split('/').pop().replace(extensions, '').replace(/[_-]+/g, ' '),
      date: new Date(imported?.date || blob.uploadedAt).toISOString(),
      src: `/api/photos/image?path=${encodeURIComponent(blob.pathname)}`
    }
  }).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
}

export async function loadGallery (listBlobs, metadata = {}) {
  const blobs = []
  let cursor
  do {
    const page = await listBlobs({ prefix: 'photos/', limit: 1000, cursor })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
    if (page.hasMore && !cursor) throw new Error('Missing photo pagination cursor')
  } while (cursor)
  return toGalleryPhotos(blobs, metadata)
}
