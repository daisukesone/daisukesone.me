import { useEffect } from 'react'

const CodeCopyButton = () => {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]')
    codeBlocks.forEach(block => {
      if (block.querySelector('.copy-btn')) return
      const button = document.createElement('button')
      button.className = 'copy-btn'
      button.textContent = 'Copy'
      button.addEventListener('click', () => {
        const code = block.querySelector('code')
        if (code) {
          navigator.clipboard.writeText(code.textContent).then(() => {
            button.textContent = 'Copied!'
            setTimeout(() => { button.textContent = 'Copy' }, 2000)
          })
        }
      })
      block.style.position = 'relative'
      block.appendChild(button)
    })
  }, [])
  return null
}

export default CodeCopyButton
