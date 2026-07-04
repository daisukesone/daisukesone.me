import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'
import ThemeSwitcher from '@/components/ThemeSwitcher'

const NavBar = () => {
  const locale = useLocale()
  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: true },
    { id: 3, name: locale.NAV.SEARCH, to: '/search', show: true }
  ]
  return (
    <div className="flex-shrink-0 flex items-center">
      <ul className="flex flex-row items-center">
        {links.map(
          (link) =>
            link.show && (
              <li
                key={link.id}
                className="block ml-4 text-sm font-medium text-gray-600 dark:text-gray-300 nav"
              >
                <Link href={link.to}>
                  <a className="nav-link">{link.name}</a>
                </Link>
              </li>
            )
        )}
      </ul>
      <ThemeSwitcher />
    </div>
  )
}

const Header = ({ navBarTitle, fullWidth }) => {
  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(null)
  const sentinalRef = useRef([])
  const handler = ([entry]) => {
    if (navRef && navRef.current && useSticky) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add('sticky-nav-full')
      } else {
        navRef.current?.classList.remove('sticky-nav-full')
      }
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }
  useEffect(() => {
    const obvserver = new window.IntersectionObserver(handler)
    obvserver.observe(sentinalRef.current)
    // Don't touch this, I have no idea how it works XD
    // return () => {
    //   if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    // }
    /* eslint-disable-line */
  }, [sentinalRef])
  return (
    <>
      <div className="observer-element h-4 md:h-12" ref={sentinalRef}></div>
      <div
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}
        id="sticky-nav"
        ref={navRef}
      >
        <div className="flex items-center">
          <Link href="/">
            <a aria-label={BLOG.title} className="avatar-ring">
              <Image
                src="/top.png"
                width={26}
                height={26}
                alt="daisukesone"
              />
            </a>
          </Link>
          {navBarTitle
            ? (
            <p className="ml-3 font-semibold text-gray-800 dark:text-gray-100 header-name">
              {navBarTitle}
            </p>
              )
            : (
            <p className="ml-3 font-semibold text-gray-800 dark:text-gray-100 header-name">
              {BLOG.title}
            </p>
              )}
        </div>
        <NavBar />
      </div>
    </>
  )
}

export default Header
