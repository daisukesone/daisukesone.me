import Container from '@/components/Container'
import Gallery from '@/components/Gallery'
import { getAllPhotos } from '@/lib/notion'
import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'

export default function GalleryPage ({ photos }) {
  const locale = useLocale()
  return (
    <Container
      title={`${locale.NAV.GALLERY} - ${BLOG.title}`}
      fullWidth
    >
      <div className='max-w-5xl mx-auto px-4 py-4'>
        <h1 className='text-2xl font-bold mb-8 text-black dark:text-white'>
          {locale.NAV.GALLERY}
        </h1>
        <Gallery photos={photos} />
      </div>
    </Container>
  )
}

export async function getStaticProps () {
  const photos = await getAllPhotos()
  return {
    props: { photos },
    revalidate: 1
  }
}
