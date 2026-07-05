import Link from 'next/link'

const TagItem = ({ tag }) => (
  <Link href={`/tag/${encodeURIComponent(tag)}`}>
    <a>
      <p className="tag-pill mr-2">{tag}</p>
    </a>
  </Link>
)

export default TagItem
