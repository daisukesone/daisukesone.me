import BLOG from '@/blog.config'
import NotionAPI from './api'

export async function getPostBlocks (id) {
  const authToken = BLOG.notionAccessToken || null
  const api = new NotionAPI({ authToken })
  const pageBlock = await api.getPage(id)
  return pageBlock
}
