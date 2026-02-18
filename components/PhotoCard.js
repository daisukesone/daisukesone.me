export default function PhotoCard ({ photo, onClick }) {
  return (
    <div
      className='relative overflow-hidden cursor-pointer group mb-4 rounded-sm'
      onClick={onClick}
    >
      <div className='relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.cover}
          alt={photo.title || ''}
          className='w-full h-auto block transition-transform duration-500 group-hover:scale-105'
          loading='lazy'
        />
      </div>
      {photo.title && (
        <div className='absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent pointer-events-none'>
          <p className='text-white text-sm p-3 font-medium leading-snug'>
            {photo.title}
          </p>
        </div>
      )}
    </div>
  )
}
