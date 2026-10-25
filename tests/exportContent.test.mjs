import assert from 'node:assert/strict'
import test from 'node:test'
import { blocksToHtml, blocksToMarkdown } from '../lib/notion/exportContent.js'

const record = (id, type, properties, content) => ({ value: { id, type, properties, content } })

test('export preserves nested text and stable uploaded images', () => {
  const blockMap = { block: {
    root: record('root', 'page', {}, ['text', 'image']),
    text: record('text', 'text', { title: [['Parent']] }, ['child']),
    child: record('child', 'text', { title: [['Nested']] }),
    image: record('image', 'image', { source: [['attachment:file:photo.jpg']] })
  } }
  const html = blocksToHtml(blockMap, 'root')
  assert.ok(html.includes('<p>Parent</p>\n<p>Nested</p>'))
  assert.ok(html.includes('/image/attachment%3Afile%3Aphoto.jpg?table=block&amp;id=image'))
  assert.ok(blocksToMarkdown(blockMap, 'root').includes('/image/attachment%3Afile%3Aphoto.jpg'))
})

test('HTML export escapes image alt text and rejects executable links', () => {
  const blockMap = { block: {
    root: record('root', 'page', {}, ['link', 'image']),
    link: record('link', 'text', { title: [['click', [['a', 'javascript:alert(1)']]]] }),
    image: record('image', 'image', {
      source: [['attachment:file:photo.jpg']],
      caption: [['caption "', [['a', 'https://example.com']]]]
    })
  } }
  const html = blocksToHtml(blockMap, 'root')
  assert.ok(!html.includes('javascript:'))
  assert.ok(html.includes('alt="caption &quot;"'))
  assert.ok(html.includes('<figcaption><a href="https://example.com">'))
})
