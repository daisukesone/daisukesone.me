import { idToUuid } from 'notion-utils'
export default function getAllPageIds (collectionQuery, viewId) {
  const views = Object.values(collectionQuery)[0] || {}
  const getBlockIds = view => view?.blockIds || view?.collection_group_results?.blockIds || []
  let pageIds = []
  if (viewId) {
    const vId = idToUuid(viewId.replace(/-/g, ''))
    pageIds = getBlockIds(views[vId])
  } else {
    const pageSet = new Set()
    Object.values(views).forEach(view => {
      getBlockIds(view).forEach(id => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }
  return pageIds
}
