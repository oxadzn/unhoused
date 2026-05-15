import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lightbox({ images, currentIndex, onClose, onNav }) {
  const image = images[currentIndex];

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNav(1);
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNav(-1);
  }, [onClose, onNav, currentIndex, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="lightbox-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lightbox-content"
          onClick={e => e.stopPropagation()}
        >
          <button className="lightbox-close" onClick={onClose} aria-label="Close">×</button>

          <img
            src={image.src}
            alt={image.label}
            className="lightbox-img"
          />

          <div className="lightbox-label">{image.label}</div>

          {images.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button className="lightbox-nav prev" onClick={() => onNav(-1)} aria-label="Previous">‹</button>
              )}
              {currentIndex < images.length - 1 && (
                <button className="lightbox-nav next" onClick={() => onNav(1)} aria-label="Next">›</button>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
