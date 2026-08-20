import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const baloo = "'Baloo 2', cursive";

/** Plays an episode over the page, so watching never navigates away.
 *
 *  Deliberately not autoplaying on page load: this is a children's site and a
 *  video that starts talking by itself is exactly what a parent does not want.
 *  It plays only after the button is pressed.
 */
export function VideoModal({
  open,
  onClose,
  src,
  title,
  footnote,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  title: string;
  footnote?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Stop the page behind from scrolling under the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      // Closing must actually stop the sound, not just hide the player.
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[900px]"
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="text-white text-lg sm:text-xl font-black" style={{ fontFamily: baloo }}>
            {title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close the video"
            className="text-white/70 hover:text-white p-2 -m-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
          <video
            ref={videoRef}
            src={src}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            className="w-full max-h-[70vh] bg-black"
          >
            Your browser can't play this video.{' '}
            <a href={src} className="underline">
              Open it directly
            </a>
            .
          </video>
        </div>

        {footnote && (
          <p className="text-white/70 text-sm font-semibold text-center mt-3">{footnote}</p>
        )}
      </div>
    </div>
  );
}
