export function getReadingTime(blockMap) {
  if (!blockMap || !blockMap.block) return 0
  let wordCount = 0
  Object.values(blockMap.block).forEach(block => {
    const props = block?.value?.properties
    if (props?.title) {
      const text = props.title.map(t => t[0]).join('')
      const cjkChars = (text.match(/[\u3000-\u9fff\uf900-\ufaff]/g) || []).length
      const latinWords = text.replace(/[\u3000-\u9fff\uf900-\ufaff]/g, '').split(/\s+/).filter(Boolean).length
      wordCount += cjkChars + latinWords
    }
  })
  return Math.max(1, Math.ceil(wordCount / 400))
}
