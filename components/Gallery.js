import { useState } from 'react'
import PhotoCard from './PhotoCard'
import Lightbox from './Lightbox'

export default function Gallery ({ photos }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  if (!photos || photos.length === 0) {
    return (
      <div className='text-center text-gray-400 py-24'>
        No photos yet.
      </div>
    )
  }

  return (
    <>
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      <Lightbox
        photos={photos}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={() => setSelectedIndex(i => Math.max(0, i - 1))}
        onNext={() => setSelectedIndex(i => Math.min(photos.length - 1, i + 1))}
      />
    </>
  )
}
