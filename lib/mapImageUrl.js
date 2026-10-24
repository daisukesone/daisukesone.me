import { defaultMapImageUrl } from 'react-notion-x'

export default function mapImageUrl (url, block) {
  const source = block?.properties?.source?.[0]?.[0]

  // The renderer passes a temporary signed URL for uploaded images. Let
  // Notion's image endpoint resolve the stable attachment reference instead.
  if (block?.type === 'image' && source?.startsWith('attachment:')) {
    return defaultMapImageUrl(source, block)
  }

  return defaultMapImageUrl(url, block)
}
