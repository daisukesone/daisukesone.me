import { NotionAPI } from 'notion-client'

// Keep the record shape expected by notion-client 4 and react-notion-x 4.
export function normalizeRecordMap (recordMap) {
  if (!recordMap) return
  for (const table of Object.values(recordMap)) {
    if (!table || typeof table !== 'object') continue
    for (const [id, record] of Object.entries(table)) {
      if (record?.value?.value) {
        table[id] = { ...record, ...record.value }
      }
    }
  }
}

export default class BlogNotionAPI extends NotionAPI {
  constructor (options = {}) {
    super({ ...options, apiBaseUrl: 'https://app.notion.com/api/v3' })
  }

  async fetch (options) {
    const response = await super.fetch(options)
    normalizeRecordMap(response.recordMap)
    normalizeRecordMap(response.recordMapWithRoles)
    return response
  }
}
