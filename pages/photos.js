import Image from 'next/image'
import Container from '@/components/Container'
import { getPhotos } from '@/lib/photos/getPhotos'
import formatDate from '@/lib/formatDate'
import BLOG from '@/blog.config'

export async function getStaticProps () {
  const photos = await getPhotos()
  return {
    props: { photos },
    revalidate: 300
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
          写真は準備中です。
        </p>
      )}
      <div className="photo-grid fade-up fade-up-3">
        {photos.map(photo => (
          <a className="photo-card" href={photo.src} key={photo.id} target="_blank" rel="noopener noreferrer" aria-label={`${photo.title}を大きく見る（新しいタブ）`}>
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="(min-width: 1024px) 240px, (min-width: 640px) 360px, 100vw"
            />
            <div className="photo-overlay">
              <p className="photo-title">{photo.title}</p>
              <p className="photo-meta">
                {formatDate(photo.date, BLOG.lang)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </Container>
  )
}

export default Photos
