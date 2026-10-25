import { list } from '@vercel/blob'
import { loadGallery } from './catalog'

export async function getPhotos () {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) return []
  return loadGallery(list)
}
