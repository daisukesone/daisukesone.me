import assert from 'node:assert/strict'
import test from 'node:test'
import { isGalleryPath, loadGallery, toGalleryPhotos } from '../lib/photos/catalog.js'

test('gallery only exposes supported images inside photos/', () => {
  for (const path of ['photos/旅行/夕焼け.JPG', 'photos/a.webp']) assert.equal(isGalleryPath(path), true)
  for (const path of ['private/a.jpg', 'photos/../private/a.jpg', 'photos/%2e%2e/private/a.jpg', 'photos/a?x.jpg', 'photos/a#x.jpg', 'photos//a.jpg', 'photos/a.svg', 'photos/a.HEIC', 'photos/a.jpg.html', 'photos/a\\b.jpg', ['photos/a.jpg'], undefined]) {
    assert.equal(isGalleryPath(path), false, String(path))
  }
})

test('photo list includes all pages, filters non-images and sorts newest first', async () => {
  const cursors = []
  const photos = await loadGallery(async options => {
    assert.equal(options.prefix, 'photos/')
    cursors.push(options.cursor)
    return options.cursor
      ? { blobs: [{ pathname: 'photos/日本語の写真.png', uploadedAt: '2026-10-02' }], hasMore: false }
      : { blobs: [{ pathname: 'photos/old_photo.jpg', uploadedAt: '2026-10-01' }, { pathname: 'photos/secret.txt', uploadedAt: '2026-10-03' }], hasMore: true, cursor: 'next' }
  })
  assert.deepEqual(cursors, [undefined, 'next'])
  assert.deepEqual(photos.map(photo => photo.title), ['日本語の写真', 'old photo'])
  assert.equal(new URL(photos[0].src, 'https://example.com').searchParams.get('path'), 'photos/日本語の写真.png')
  assert.deepEqual(toGalleryPhotos([]), [])
})

test('storage failure is not turned into a successful empty gallery', async () => {
  await assert.rejects(loadGallery(async () => { throw new Error('storage unavailable') }), /storage unavailable/)
})

test('imported photos keep their original dates and mix correctly with new uploads', () => {
  const photos = toGalleryPhotos([
    { pathname: 'photos/tumblr/old-01.jpg', uploadedAt: '2026-10-26' },
    { pathname: 'photos/new-photo.jpg', uploadedAt: '2026-10-25' },
    { pathname: 'photos/tumblr/newer-01.jpg', uploadedAt: '2026-10-26' }
  ], {
    'photos/tumblr/old-01.jpg': { date: '2017-11-30T15:00:00Z', title: '' },
    'photos/tumblr/newer-01.jpg': { date: '2025-08-30T08:22:54Z', title: '' }
  })
  assert.deepEqual(photos.map(p => p.id), ['photos/new-photo.jpg', 'photos/tumblr/newer-01.jpg', 'photos/tumblr/old-01.jpg'])
  assert.equal(photos[2].date, '2017-11-30T15:00:00.000Z')
  assert.equal(photos[2].title, 'Tumblrからの写真')
  assert.equal(photos[0].title, 'new photo')
})
