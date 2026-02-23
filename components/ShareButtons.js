import { useState } from 'react'

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Hatena',
      href: `https://b.hatena.ne.jp/entry/${url}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.47 0C22.42 0 24 1.58 24 3.53v16.94c0 1.95-1.58 3.53-3.53 3.53H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zM8.8 17.28c-.17-.36-.43-.64-.77-.84-.34-.2-.7-.32-1.08-.37-.38-.05-.77-.08-1.16-.08H3.53v-9.6h2.6c.42 0 .82.04 1.2.13.38.09.7.24.98.46.28.22.5.5.65.85.15.35.23.77.23 1.26 0 .5-.12.92-.35 1.25-.23.33-.57.58-1.01.75v.03c.56.12.98.4 1.27.82.29.42.43.93.43 1.53 0 .5-.1.94-.3 1.3-.2.37-.46.66-.8.87-.34.21-.72.36-1.15.45-.43.09-.86.14-1.3.14H3.53v1.53h2.26c.39 0 .78-.03 1.16-.08.38-.05.74-.17 1.08-.37.34-.2.6-.48.77-.84.17-.36.26-.8.26-1.32 0-.52-.09-.96-.26-1.32zm-.26-5.04c0-.38-.07-.7-.2-.95-.13-.25-.32-.45-.55-.6-.23-.15-.5-.25-.8-.31-.3-.06-.62-.08-.95-.08H4.88v3.97h1.16c.33 0 .65-.03.95-.08.3-.06.57-.16.8-.31.23-.15.42-.35.55-.6.13-.25.2-.57.2-.95v-.09zm10.68 6.78v-1.53h-1.53V6.39h1.53V4.86h-4.59v1.53h1.53V17.49h-1.53v1.53h4.59zm-6.63-1.53V6.39h1.53V4.86h-4.59v1.53H11V17.49H9.47v1.53h4.59V17.49H12.59z" />
        </svg>
      ),
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-3 mt-6 mb-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${link.name}`}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        title="Copy link"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        {copied ? (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default ShareButtons
