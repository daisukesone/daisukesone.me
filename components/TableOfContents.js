const TableOfContents = ({ blockMap }) => {
  if (!blockMap) return null
  
  const headings = Object.values(blockMap.block || {})
    .filter(b => b?.value?.type && ['header', 'sub_header', 'sub_sub_header'].includes(b.value.type))
    .map(b => ({
      id: b.value.id,
      type: b.value.type,
      text: b.value.properties?.title?.map(t => t[0]).join('') || ''
    }))
    .filter(h => h.text)
  
  if (headings.length === 0) return null
  
  const indentMap = { header: 'ml-0', sub_header: 'ml-4', sub_sub_header: 'ml-8' }
  
  return (
    <div className="mb-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Table of Contents</p>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} className={indentMap[h.type]}>
            <a
              href={`#${h.id.replace(/-/g, '')}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TableOfContents
