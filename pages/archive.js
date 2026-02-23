import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false })
  const archiveByYear = {}
  posts.forEach(post => {
    const date = new Date(post?.date?.start_date || post.createdTime)
    const year = date.getFullYear()
    if (!archiveByYear[year]) archiveByYear[year] = []
    archiveByYear[year].push(post)
  })
  return { props: { archiveByYear }, revalidate: 1 }
}

const Archive = ({ archiveByYear }) => {
  const years = Object.keys(archiveByYear).sort((a, b) => b - a)
  return (
    <Container title={`Archive - ${BLOG.title}`}>
      <h1 className="font-bold text-3xl text-black dark:text-white mb-8">Archive</h1>
      {years.map(year => (
        <div key={year} className="mb-8">
          <h2 className="font-bold text-2xl text-black dark:text-white mb-4">{year}</h2>
          {archiveByYear[year].map(post => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      ))}
    </Container>
  )
}

export default Archive
