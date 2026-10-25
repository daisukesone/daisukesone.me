import { useEffect } from 'react'
import { useRouter } from 'next/router'

const CodeCopyButton = () => {
  const { asPath } = useRouter()
  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return
    const buttons = new Set()
    const timeouts = new Set()
    const attach = () => {
      article.querySelectorAll('pre code[class*="language-"]').forEach(code => {
        const block = code.closest('pre')
        if (block.querySelector('.copy-btn')) return
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'copy-btn'
        button.textContent = 'Copy'
        button.setAttribute('aria-label', 'コードをコピー')
        button.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(code.textContent)
            button.textContent = 'Copied!'
          } catch {
            button.textContent = 'コピーできませんでした'
          }
          const timeout = setTimeout(() => {
            button.textContent = 'Copy'
            timeouts.delete(timeout)
          }, 2000)
          timeouts.add(timeout)
        })
        buttons.add(button)
        block.appendChild(button)
      })
    }
    attach()
    const observer = new MutationObserver(attach)
    observer.observe(article, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      timeouts.forEach(clearTimeout)
      buttons.forEach(button => button.remove())
    }
  }, [asPath])
  return null
}

export default CodeCopyButton
