import { useEffect } from 'react'

export default function Lightbox ({ photos, selectedIndex, onClose, onPrev, onNext }) {
  if (selectedIndex === null || selectedIndex === undefined) return null

  const photo = photos[selectedIndex]

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'
      onClick={onClose}
    >
      <button
        className='absolute top-4 right-6 text-white text-4xl leading-none z-10 hover:opacity-70 transition-opacity'
        onClick={onClose}
        aria-label='Close'
      >
        &times;
      </button>

      {selectedIndex > 0 && (
        <button
          className='absolute left-4 text-white text-5xl leading-none z-10 p-2 hover:opacity-70 transition-opacity'
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label='Previous'
        >
          &#8249;
        </button>
      )}

      {selectedIndex < photos.length - 1 && (
        <button
          className='absolute right-4 text-white text-5xl leading-none z-10 p-2 hover:opacity-70 transition-opacity'
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label='Next'
        >
          &#8250;
        </button>
      )}

      <div
        className='relative flex flex-col items-center justify-center max-w-5xl w-full px-16 py-8'
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.cover}
          alt={photo.title || ''}
          className='max-w-full max-h-screen object-contain'
          style={{ maxHeight: 'calc(100vh - 8rem)' }}
        />
        {photo.title && (
          <p className='mt-3 text-white text-sm opacity-80'>{photo.title}</p>
        )}
      </div>
    </div>
  )
}
