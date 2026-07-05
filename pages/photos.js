import Link from 'next/link'
import Container from '@/components/Container'
import { getPhotoPosts } from '@/lib/notion/getPhotoPosts'
import formatDate from '@/lib/formatDate'
import BLOG from '@/blog.config'

export async function getStaticProps () {
  const photos = await getPhotoPosts()
  return {
    props: { photos },
    revalidate: 1
  }
}

const Photos = ({ photos }) => {
  return (
    <Container
      title={`Photos - ${BLOG.title}`}
      description="Photo gallery"
      fullWidth={false}
    >
      <header className="mb-8">
        <p className="hero-eyebrow mb-3 fade-up fade-up-1">Gallery</p>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 fade-up fade-up-2">
          <span className="gradient-text">Photos</span>
        </h1>
        <div className="hero-line fade-up fade-up-3"></div>
      </header>
      {!photos.length && (
        <p className="text-gray-500 dark:text-gray-400 fade-up fade-up-3">
          No photos yet — add a post with type “Photo” in Notion.
        </p>
      )}
      <div className="photo-grid fade-up fade-up-3">
        {photos.map(photo => (
          <Link href={`${BLOG.path}/${photo.slug}`} key={photo.id}>
            <a className="photo-card">
              <img
                src={photo.cover}
                alt={photo.title}
                loading="lazy"
                decoding="async"
              />
              <div className="photo-overlay">
                <p className="photo-title">{photo.title}</p>
                <p className="photo-meta">
                  {formatDate(photo.date, BLOG.lang)}
                  {photo.imageCount > 1 && ` · ${photo.imageCount} photos`}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default Photos
