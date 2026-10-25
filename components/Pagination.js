import Link from 'next/link'
import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'

const Pagination = ({ page, showNext }) => {
  const locale = useLocale()
  const currentPage = +page
  let additionalClassName = 'justify-between'
  if (currentPage === 1 && showNext) additionalClassName = 'justify-end'
  if (currentPage !== 1 && !showNext) additionalClassName = 'justify-start'
  return (
    <div className={`flex mt-8 ${additionalClassName}`}>
      {currentPage !== 1 && (
        <Link
          href={
            currentPage - 1 === 1
              ? `${BLOG.path || '/'}`
              : `/page/${currentPage - 1}`
          }
        >
          <a>
            <button rel="prev" className="pill-button">
              ← {locale.PAGINATION.PREV}
            </button>
          </a>
        </Link>
      )}
      {showNext && (
        <Link href={`/page/${currentPage + 1}`}>
          <a>
            <button rel="next" className="pill-button">
              {locale.PAGINATION.NEXT} →
            </button>
          </a>
        </Link>
      )}
    </div>
  )
}

export default Pagination
