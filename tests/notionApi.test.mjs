import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeRecordMap } from '../lib/notion/api.js'
import getAllPageIds from '../lib/notion/getAllPageIds.js'

test('current Notion records are unwrapped without changing legacy records', () => {
  const block = { id: 'photo', type: 'image' }
  const legacy = { value: { id: 'legacy', type: 'page' }, role: 'reader' }
  const recordMap = { block: { photo: { value: { value: block, role: 'reader' } }, legacy } }
  normalizeRecordMap(recordMap)
  assert.deepEqual(recordMap.block.photo, { value: block, role: 'reader' })
  assert.equal(recordMap.block.legacy, legacy)
  normalizeRecordMap(recordMap)
  assert.equal(recordMap.block.photo.value, block)
  normalizeRecordMap(undefined)
})

test('page IDs include current collection reducers and legacy view results', () => {
  const viewId = 'c7d801df-a3ce-4c61-a065-03b8c7f9eb05'
  const query = { collection: {
    [viewId]: { collection_group_results: { blockIds: ['first', 'second'] } },
    legacy: { blockIds: ['second', 'third'] }
  } }
  assert.deepEqual(getAllPageIds(query), ['first', 'second', 'third'])
  assert.deepEqual(getAllPageIds(query, viewId), ['first', 'second'])
  assert.deepEqual(getAllPageIds({}), [])
})
