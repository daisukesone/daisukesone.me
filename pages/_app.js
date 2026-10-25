import 'prismjs/themes/prism.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.min.css'
import '@/styles/globals.css'
import '@/styles/notion.css'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { LocaleProvider } from '@/lib/locale'
import Scripts from '@/components/Scripts'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })

function MyApp ({ Component, pageProps }) {
  const router = useRouter()
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    const handleStart = () => setFadeIn(false)
    const handleComplete = () => setFadeIn(true)

    setFadeIn(true)
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
    }
  }, [router])

  return (
    <>
      <Scripts />
      <LocaleProvider>
        <>
          {BLOG.isProd && BLOG?.analytics?.provider === 'ga' && <Gtag />}
          <div className={`page-transition ${fadeIn ? 'page-visible' : 'page-hidden'}`}>
            <Component {...pageProps} />
          </div>
        </>
      </LocaleProvider>
    </>
  )
}

export default MyApp
