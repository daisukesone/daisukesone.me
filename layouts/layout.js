import Image from 'next/image'
import Container from '@/components/Container'
import TagItem from '@/components/TagItem'
import ReadingProgress from '@/components/ReadingProgress'
import { NotionRenderer, Equation, Code, Collection, CollectionRow } from 'react-notion-x'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import { useLocale } from '@/lib/locale'
import { useRouter } from 'next/router'
import Comments from '@/components/Comments'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const Layout = ({
  children,
  blockMap,
  frontMatter,
  emailHash,
  fullWidth = false
}) => {
  const locale = useLocale()
  const router = useRouter()
  return (
    <Container
      layout="blog"
      title={frontMatter.title}
      description={frontMatter.summary}
      // date={new Date(frontMatter.publishedAt).toISOString()}
      type="article"
      fullWidth={fullWidth}
    >
      <ReadingProgress />
      <article>
        <h1 className="font-extrabold tracking-tight text-3xl md:text-4xl text-gray-900 dark:text-white fade-up fade-up-1">
          {frontMatter.title}
        </h1>
        {frontMatter.type[0] !== 'Page' && (
          <nav className="flex mt-6 mb-2 items-center text-sm text-gray-500 dark:text-gray-400 fade-up fade-up-2">
            <div className="flex items-center">
              <a
                href={BLOG.socialLink || '#'}
                className="flex items-center"
                target="_blank"
                rel="noreferrer"
              >
                <span className="avatar-ring">
                  <Image
                    alt={BLOG.author}
                    width={22}
                    height={22}
                    src={`https://gravatar.com/avatar/${emailHash}`}
                    className="rounded-full"
                  />
                </span>
                <p className="ml-2 font-medium md:block">{BLOG.author}</p>
              </a>
              <span className="block mx-2 text-gray-300 dark:text-gray-600">
                /
              </span>
            </div>
            <time className="post-date mr-3 flex-shrink-0">
              {formatDate(
                frontMatter?.date?.start_date || frontMatter.createdTime,
                BLOG.lang
              )}
            </time>
            {frontMatter.tags && (
              <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags">
                {frontMatter.tags.map(tag => (
                  <TagItem key={tag} tag={tag} />
                ))}
              </div>
            )}
          </nav>
        )}
        <div className="hero-line my-6 fade-up fade-up-2"></div>
        <div className="fade-up fade-up-3">
          {children}
          {blockMap && (
            <div className="-mt-4">
              <NotionRenderer
                recordMap={blockMap}
                components={{
                  equation: Equation,
                  code: Code,
                  collection: Collection,
                  collectionRow: CollectionRow
                }}
                mapPageUrl={mapPageUrl}
              />
            </div>
          )}
        </div>
      </article>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push(BLOG.path || '/')}
          className="pill-button"
        >
          ← {locale.POST.BACK}
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pill-button"
        >
          ↑ {locale.POST.TOP}
        </button>
      </div>
      <Comments frontMatter={frontMatter} />
    </Container>
  )
}

export default Layout
