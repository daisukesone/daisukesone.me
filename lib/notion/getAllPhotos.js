import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { idToUuid, getTextContent, getDateValue } from 'notion-utils'
import getAllPageIds from './getAllPageIds'

export async function getAllPhotos () {
  const id = BLOG.galleryPageId
  if (!id) return []

  const authToken = BLOG.notionAccessToken || null
  const api = new NotionAPI({ authToken })
  const response = await api.getPage(id)

  const uuid = idToUuid(id)
  const collection = Object.values(response.collection)[0]?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[uuid].value
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.log(`galleryPageId "${uuid}" is not a database`)
    return []
  }

  const pageIds = getAllPageIds(collectionQuery)
  const photos = []

  for (const pageId of pageIds) {
    const blockValue = block[pageId]?.value
    if (!blockValue) continue

    // Get cover image
    let cover = blockValue?.format?.page_cover
    if (!cover) continue // skip entries without a cover image

    if (cover.startsWith('/')) {
      cover = `https://www.notion.so${cover}`
    }

    const rawProperties = Object.entries(blockValue?.properties || [])
    const properties = { id: pageId, cover }

    if (schema) {
      for (const [key, val] of rawProperties) {
        const schemaEntry = schema[key]
        if (!schemaEntry) continue
        switch (schemaEntry.type) {
          case 'title':
            properties.title = getTextContent(val)
            break
          case 'date': {
            const dateValue = getDateValue(val)
            delete dateValue.type
            properties.date = dateValue
            break
          }
          case 'select':
          case 'multi_select': {
            const selects = getTextContent(val)
            if (selects?.[0]?.length) {
              properties.tags = selects.split(',')
            }
            break
          }
          default:
            break
        }
      }
    }

    properties.createdTime = new Date(blockValue?.created_time).toString()
    photos.push(properties)
  }

  // Sort by date, newest first
  photos.sort((a, b) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime)
    const dateB = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  return photos
}
