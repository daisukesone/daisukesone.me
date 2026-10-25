import Image from 'next/image'
import Container from '@/components/Container'
import TagItem from '@/components/TagItem'
import ReadingProgress from '@/components/ReadingProgress'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { NotionRenderer } from 'react-notion-x'
import mapImageUrl from '@/lib/mapImageUrl'
import CodeCopyButton from '@/components/CodeCopyButton'
import TableOfContents from '@/components/TableOfContents'
import RelatedPosts from '@/components/RelatedPosts'
import ShareButtons from '@/components/ShareButtons'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import { useLocale } from '@/lib/locale'
import { useRouter } from 'next/router'
import Comments from '@/components/Comments'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(m => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(m => m.Collection)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then(m => m.Equation)
)

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const Layout = ({
  children,
  blockMap,
  frontMatter,
  emailHash,
  fullWidth = false,
  prevPost,
  nextPost,
  readingTime,
  relatedPosts
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
            {readingTime > 0 && <span className="mr-3">約{readingTime}分</span>}
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
          <TableOfContents blockMap={blockMap} />
          {blockMap && (
            <div className="-mt-4">
              <NotionRenderer
                recordMap={blockMap}
                components={{
                  Equation,
                  Code,
                  Collection
                }}
                mapPageUrl={mapPageUrl}
                mapImageUrl={mapImageUrl}
              />
            </div>
          )}
        </div>
        <CodeCopyButton />
        <ShareButtons title={frontMatter.title} url={`${BLOG.link.replace(/\/$/, '')}/${frontMatter.slug}`} />
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
      {(prevPost || nextPost) && (
        <div className="flex justify-between mt-6 text-gray-500 dark:text-gray-400">
          <div className="text-left max-w-[45%]">
            {prevPost && (
              <Link href={`${BLOG.path}/${prevPost.slug}`}>
                <a className="hover:text-black dark:hover:text-gray-100 transition-colors">
                  <span className="text-sm">← Previous</span>
                  <p className="font-medium mt-1 truncate">{prevPost.title}</p>
                </a>
              </Link>
            )}
          </div>
          <div className="text-right max-w-[45%]">
            {nextPost && (
              <Link href={`${BLOG.path}/${nextPost.slug}`}>
                <a className="hover:text-black dark:hover:text-gray-100 transition-colors">
                  <span className="text-sm">Next →</span>
                  <p className="font-medium mt-1 truncate">{nextPost.title}</p>
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
      <RelatedPosts posts={relatedPosts} />
      <Comments frontMatter={frontMatter} />
    </Container>
  )
}

export default Layout
