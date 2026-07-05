import mapImageUrl from './mapImageUrl'

/**
 * Convert a Notion block map into portable HTML / Markdown, so posts can be
 * syndicated to platforms like Substack (via full-content RSS) or pasted
 * into note.com (via Markdown).
 *
 * Covers the common block types; unknown blocks degrade gracefully.
 */

const escapeHtml = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Notion rich text: [[text, [[deco, arg?], ...]?], ...]
const richTextToHtml = title => {
  if (!title) return ''
  return title
    .map(([text, decorations]) => {
      let out = escapeHtml(text)
      if (decorations) {
        for (const deco of decorations) {
          switch (deco[0]) {
            case 'b':
              out = `<strong>${out}</strong>`
              break
            case 'i':
              out = `<em>${out}</em>`
              break
            case 's':
              out = `<del>${out}</del>`
              break
            case 'c':
              out = `<code>${out}</code>`
              break
            case 'a':
              out = `<a href="${escapeHtml(deco[1])}">${out}</a>`
              break
            default:
              break
          }
        }
      }
      return out
    })
    .join('')
}

const richTextToMarkdown = title => {
  if (!title) return ''
  return title
    .map(([text, decorations]) => {
      let out = String(text)
      if (decorations) {
        for (const deco of decorations) {
          switch (deco[0]) {
            case 'b':
              out = `**${out}**`
              break
            case 'i':
              out = `*${out}*`
              break
            case 's':
              out = `~~${out}~~`
              break
            case 'c':
              out = `\`${out}\``
              break
            case 'a':
              out = `[${out}](${deco[1]})`
              break
            default:
              break
          }
        }
      }
      return out
    })
    .join('')
}

const getBlock = (blockMap, id) => blockMap?.block?.[id]?.value

const renderChildren = (blockMap, ids) => {
  if (!ids || !ids.length) return []
  const out = []
  let listBuffer = []
  let listType = null

  const flushList = () => {
    if (!listBuffer.length) return
    out.push({ list: listType, items: listBuffer })
    listBuffer = []
    listType = null
  }

  for (const id of ids) {
    const value = getBlock(blockMap, id)
    if (!value) continue
    if (value.type === 'bulleted_list' || value.type === 'numbered_list' || value.type === 'to_do') {
      const type = value.type === 'numbered_list' ? 'ol' : 'ul'
      if (listType && listType !== type) flushList()
      listType = type
      listBuffer.push(value)
      continue
    }
    flushList()
    out.push({ block: value })
  }
  flushList()
  return out
}

/* ------------------------- HTML ------------------------- */

const blockToHtml = (blockMap, value, depth = 0) => {
  const text = richTextToHtml(value.properties?.title)
  const children = () => htmlFromIds(blockMap, value.content, depth + 1)
  switch (value.type) {
    case 'text':
      return text ? `<p>${text}</p>` : ''
    case 'header':
      return `<h2>${text}</h2>`
    case 'sub_header':
      return `<h3>${text}</h3>`
    case 'sub_sub_header':
      return `<h4>${text}</h4>`
    case 'quote':
      return `<blockquote><p>${text}</p></blockquote>`
    case 'callout': {
      const icon = value.format?.page_icon
      const prefix = icon && !String(icon).startsWith('http') ? `${icon} ` : ''
      return `<blockquote><p>${prefix}${text}</p></blockquote>`
    }
    case 'code': {
      const lang = value.properties?.language?.[0]?.[0] || ''
      return `<pre><code class="language-${escapeHtml(
        lang.toLowerCase()
      )}">${text}</code></pre>`
    }
    case 'image': {
      const src = mapImageUrl(
        value.properties?.source?.[0]?.[0] || value.format?.display_source,
        value.id
      )
      if (!src) return ''
      const caption = richTextToHtml(value.properties?.caption)
      return caption
        ? `<figure><img src="${escapeHtml(
            src
          )}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`
        : `<figure><img src="${escapeHtml(src)}" alt="" /></figure>`
    }
    case 'video':
    case 'embed':
    case 'bookmark': {
      const link =
        value.properties?.link?.[0]?.[0] ||
        value.properties?.source?.[0]?.[0] ||
        value.format?.display_source
      if (!link) return ''
      const label = text || link
      return `<p><a href="${escapeHtml(link)}">${label}</a></p>`
    }
    case 'divider':
      return '<hr />'
    case 'toggle':
      return `<details><summary>${text}</summary>${children()}</details>`
    case 'column_list':
    case 'column':
      return children()
    case 'equation':
      return text ? `<p><code>${text}</code></p>` : ''
    default:
      return text ? `<p>${text}</p>` : ''
  }
}

const listItemHtml = (blockMap, value, depth) => {
  let inner = richTextToHtml(value.properties?.title)
  if (value.type === 'to_do') {
    const checked = value.properties?.checked?.[0]?.[0] === 'Yes'
    inner = `${checked ? '☑' : '☐'} ${inner}`
  }
  const childHtml = value.content
    ? htmlFromIds(blockMap, value.content, depth + 1)
    : ''
  return `<li>${inner}${childHtml}</li>`
}

const htmlFromIds = (blockMap, ids, depth = 0) => {
  const groups = renderChildren(blockMap, ids)
  return groups
    .map(group => {
      if (group.list) {
        const items = group.items
          .map(v => listItemHtml(blockMap, v, depth))
          .join('')
        return `<${group.list}>${items}</${group.list}>`
      }
      return blockToHtml(blockMap, group.block, depth)
    })
    .filter(Boolean)
    .join('\n')
}

export function blocksToHtml (blockMap, rootId) {
  const root = getBlock(blockMap, rootId)
  if (!root) return ''
  return htmlFromIds(blockMap, root.content, 0)
}

/* ----------------------- Markdown ----------------------- */

const blockToMarkdown = (blockMap, value, depth = 0) => {
  const text = richTextToMarkdown(value.properties?.title)
  const children = () => markdownFromIds(blockMap, value.content, depth + 1)
  switch (value.type) {
    case 'text':
      return text || ''
    case 'header':
      return `## ${text}`
    case 'sub_header':
      return `### ${text}`
    case 'sub_sub_header':
      return `#### ${text}`
    case 'quote':
      return text
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n')
    case 'callout': {
      const icon = value.format?.page_icon
      const prefix = icon && !String(icon).startsWith('http') ? `${icon} ` : ''
      return `> ${prefix}${text}`
    }
    case 'code': {
      const lang = (value.properties?.language?.[0]?.[0] || '').toLowerCase()
      const raw = (value.properties?.title || []).map(t => t[0]).join('')
      return `\`\`\`${lang}\n${raw}\n\`\`\``
    }
    case 'image': {
      const src = mapImageUrl(
        value.properties?.source?.[0]?.[0] || value.format?.display_source,
        value.id
      )
      if (!src) return ''
      const caption = (value.properties?.caption || [])
        .map(t => t[0])
        .join('')
      return `![${caption}](${src})`
    }
    case 'video':
    case 'embed':
    case 'bookmark': {
      const link =
        value.properties?.link?.[0]?.[0] ||
        value.properties?.source?.[0]?.[0] ||
        value.format?.display_source
      if (!link) return ''
      return `[${text || link}](${link})`
    }
    case 'divider':
      return '---'
    case 'toggle': {
      const body = children()
      return `**${text}**${body ? `\n\n${body}` : ''}`
    }
    case 'column_list':
    case 'column':
      return children()
    case 'equation':
      return text ? `$${text}$` : ''
    default:
      return text || ''
  }
}

const listItemMarkdown = (blockMap, value, index, listType, depth) => {
  const indent = '  '.repeat(depth)
  let marker = '-'
  if (listType === 'ol') marker = `${index + 1}.`
  let inner = richTextToMarkdown(value.properties?.title)
  if (value.type === 'to_do') {
    const checked = value.properties?.checked?.[0]?.[0] === 'Yes'
    marker = '-'
    inner = `[${checked ? 'x' : ' '}] ${inner}`
  }
  let out = `${indent}${marker} ${inner}`
  if (value.content) {
    const childIds = value.content
    const childGroups = renderChildren(blockMap, childIds)
    const childMd = childGroups
      .map(group => {
        if (group.list) {
          return group.items
            .map((v, i) =>
              listItemMarkdown(blockMap, v, i, group.list, depth + 1)
            )
            .join('\n')
        }
        const md = blockToMarkdown(blockMap, group.block, depth + 1)
        if (!md) return ''
        return md
          .split('\n')
          .map(line => `${'  '.repeat(depth + 1)}${line}`)
          .join('\n')
      })
      .filter(Boolean)
      .join('\n')
    if (childMd) out += `\n${childMd}`
  }
  return out
}

const markdownFromIds = (blockMap, ids, depth = 0) => {
  const groups = renderChildren(blockMap, ids)
  return groups
    .map(group => {
      if (group.list) {
        return group.items
          .map((v, i) => listItemMarkdown(blockMap, v, i, group.list, depth))
          .join('\n')
      }
      return blockToMarkdown(blockMap, group.block, depth)
    })
    .filter(Boolean)
    .join('\n\n')
}

export function blocksToMarkdown (blockMap, rootId, frontMatter) {
  const root = getBlock(blockMap, rootId)
  if (!root) return ''
  const body = markdownFromIds(blockMap, root.content, 0)
  if (!frontMatter) return body
  const header = `# ${frontMatter.title}\n`
  return `${header}\n${body}\n`
}
