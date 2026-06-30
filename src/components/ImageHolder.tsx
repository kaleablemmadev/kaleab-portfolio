import { useState } from 'react';

interface ImageHolderProps {
  label?: string;
  images?: string[];
}

function ImageHolder({ label = "Project Screenshot", images = [] }: ImageHolderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset index when the image list changes (e.g. project changes)
  const [prevImages, setPrevImages] = useState<string[]>(images);
  if (images !== prevImages) {
    setSelectedIndex(0);
    setPrevImages(images);
  }

  const hasImages = images && images.length > 0;
  
  // Slide controls
  const next = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!hasImages) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 200);
  };

  const prev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!hasImages) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 200);
  };

  const selectImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  const currentImage = hasImages 
    ? images[selectedIndex] 
    : 'src/assets/images/project-image-placeholder-landscape.jpg';

  return (
    <>
      <div 
        onClick={() => hasImages && setIsLightboxOpen(true)}
        className={`relative w-full aspect-[4/3] md:aspect-auto md:h-[380px] border border-stone-200/80 dark:border-stone-850 bg-stone-100 dark:bg-stone-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group ${hasImages ? 'cursor-zoom-in' : ''}`}
      >
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

        {/* Carousel Image */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img 
            src={currentImage} 
            alt={`${label} screenshot ${selectedIndex + 1}`} 
            className={`w-full h-full object-cover transition-all duration-500 ease-out 
              ${isTransitioning ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
              group-hover:scale-105
            `}
            onError={(e) => {
              // Fallback if image doesn't load
              const target = e.target as HTMLImageElement;
              target.src = 'src/assets/images/project-image-placeholder-landscape.jpg';
            }}
          />
        </div>

        {/* Glassmorphic Slide Count Tag */}
        {hasImages && images.length > 1 && (
          <div className="absolute top-4 right-4 z-20 glass px-3 py-1.5 rounded-full text-xs font-semibold font-outfit text-stone-700 dark:text-stone-300 shadow-sm transition-all group-hover:scale-105">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Left Arrow Button */}
        {hasImages && images.length > 1 && (
          <button 
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass border border-white/20 dark:border-white/10 flex items-center justify-center text-stone-800 dark:text-white opacity-0 group-hover:opacity-100 md:translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary outline-none focus-visible:opacity-100 focus-visible:translate-x-0"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow Button */}
        {hasImages && images.length > 1 && (
          <button 
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass border border-white/20 dark:border-white/10 flex items-center justify-center text-stone-800 dark:text-white opacity-0 group-hover:opacity-100 md:translate-x-[10px] group-hover:translate-x-0 transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary outline-none focus-visible:opacity-100 focus-visible:translate-x-0"
            aria-label="Next image"
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Indicator dots */}
        {hasImages && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-row gap-2 px-3 py-1.5 rounded-full bg-stone-905/20 backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => selectImage(idx, e)}
                className={`h-2 rounded-full transition-all duration-300 outline-none
                  ${selectedIndex === idx 
                    ? 'w-6 bg-primary dark:bg-primary-light' 
                    : 'w-2 bg-white/60 dark:bg-stone-500 hover:bg-white'
                  }
                `}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Zoom Icon Hint */}
        {hasImages && (
          <div className="absolute bottom-4 right-4 z-20 p-2 rounded-lg glass border border-white/20 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-4 h-4 text-stone-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        )}
      </div>

      {/* Full-screen Lightbox Modal */}
      {isLightboxOpen && hasImages && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-stone-900 border border-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-colors duration-300 z-50 cursor-pointer"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous control inside lightbox */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-6 w-14 h-14 rounded-full bg-stone-900/80 border border-stone-800 flex items-center justify-center text-stone-300 hover:bg-stone-800 hover:text-white hover:scale-105 transition-all z-40"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image slide inside lightbox */}
          <div 
            className="max-w-[90vw] max-h-[85vh] relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[selectedIndex]} 
              alt={label} 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-slide-up"
            />
            {label && (
              <p className="mt-4 text-stone-400 font-outfit text-sm tracking-wide bg-stone-900/60 px-4 py-2 rounded-full border border-stone-800">
                {label} ({selectedIndex + 1} / {images.length})
              </p>
            )}
          </div>

          {/* Next control inside lightbox */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-6 w-14 h-14 rounded-full bg-stone-900/80 border border-stone-800 flex items-center justify-center text-stone-300 hover:bg-stone-800 hover:text-white hover:scale-105 transition-all z-40"
              aria-label="Next image"
            >
              <svg className="w-8 h-8 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ImageHolder;