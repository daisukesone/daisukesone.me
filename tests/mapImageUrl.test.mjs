import assert from 'node:assert/strict'
import test from 'node:test'
import { defaultMapImageUrl } from 'react-notion-x'
import mapImageUrl from '../lib/mapImageUrl.js'

const block = {
  id: '2dae6617-a1e0-8098-97d5-f5e068aff9db',
  type: 'image',
  parent_table: 'block',
  properties: {
    source: [['attachment:8590769b-51f9-45e3-9c2d-9ac4e61b2c9b:R0005258.jpg']]
  }
}

test('uploaded images keep the same URL after their signed URL expires', () => {
  const expired = 'https://file.notion.so/photo.jpg?expirationTimestamp=1&signature=old'
  const renewed = 'https://file.notion.so/photo.jpg?expirationTimestamp=9999999999999&signature=new'
  const mapped = mapImageUrl(expired, block)
  const imageUrl = new URL(mapped)

  assert.equal(mapped, mapImageUrl(renewed, block))
  assert.equal(decodeURIComponent(imageUrl.pathname.slice('/image/'.length)), block.properties.source[0][0])
  assert.equal(imageUrl.searchParams.get('id'), block.id)
  assert.equal(imageUrl.searchParams.get('table'), 'block')
  assert.ok(!mapped.includes('expirationTimestamp'))
  assert.ok(!mapped.includes('signature'))
})

test('external images, legacy uploads, icons and covers keep the default mapping', () => {
  for (const source of [
    'https://images.unsplash.com/photo-example',
    'https://example.com/photo.jpg',
    'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/file/photo.jpg',
    '/images/page-cover/woodcuts_1.jpg',
    'data:image/png;base64,example'
  ]) {
    const externalBlock = { ...block, properties: { source: [[source]] } }
    assert.equal(mapImageUrl(source, externalBlock), defaultMapImageUrl(source, externalBlock))
  }
  const page = { ...block, type: 'page' }
  const cover = 'https://example.com/cover.jpg'
  assert.equal(mapImageUrl(cover, page), defaultMapImageUrl(cover, page))
  assert.equal(mapImageUrl(undefined, block), defaultMapImageUrl(block.properties.source[0][0], block))
})
