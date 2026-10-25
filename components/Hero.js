import Link from 'next/link'
import BLOG from '@/blog.config'

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
)

const MailIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const RssIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
)

const Hero = () => {
  return (
    <section className="mb-10 md:mb-16 pt-2 md:pt-6">
      <p className="hero-eyebrow mb-4 fade-up fade-up-1">
        Hello, world — I&apos;m
      </p>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-5 fade-up fade-up-2">
        <span className="gradient-text">{BLOG.author}</span>
      </h1>
      <div className="hero-line mb-6 fade-up fade-up-3"></div>
      {BLOG.description && (
        <p className="text-base md:text-lg leading-relaxed text-gray-500 dark:text-gray-400 max-w-xl mb-7 fade-up fade-up-3">
          {BLOG.description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 fade-up fade-up-4">
        {BLOG.socialLink && (
          <a
            href={BLOG.socialLink}
            target="_blank"
            rel="noreferrer"
            className="social-chip"
          >
            <TwitterIcon />
            Twitter
          </a>
        )}
        {BLOG.email && (
          <a href={`mailto:${BLOG.email}`} className="social-chip">
            <MailIcon />
            Email
          </a>
        )}
        <Link href="/feed">
          <a className="social-chip">
            <RssIcon />
            RSS
          </a>
        </Link>
      </div>
    </section>
  )
}

export default Hero
