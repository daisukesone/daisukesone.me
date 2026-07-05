import Link from 'next/link'

const Tags = ({ tags, currentTag }) => {
  if (!tags) return null
  return (
    <div className="tag-container">
      <ul className="flex max-w-full mt-4 overflow-x-auto">
        {Object.keys(tags).map((key) => {
          const selected = key === currentTag
          return (
            <li key={key} className="mr-2 whitespace-nowrap">
              <Link
                key={key}
                href={selected ? '/search' : `/tag/${encodeURIComponent(key)}`}
              >
                <a
                  className={`tag-pill block ${
                    selected ? 'tag-pill-active' : ''
                  }`}
                >
                  {`${key} (${tags[key]})`}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags
