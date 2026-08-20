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
      // Above the site header, which sits at z-[1000]. Anything lower and the
      // close button hides behind the nav bar.
      className="fixed inset-0 z-[2000] bg-black/90 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[1000px] my-auto">
        {/* Anchored to the video's own corner rather than a row above it, so no
            amount of surrounding layout can push it off screen or behind
            something else. */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close the video"
          className="absolute top-2 right-2 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full bg-black/75 text-white backdrop-blur-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          // Once the episode finishes, close on its own rather than leaving a
          // black frame the viewer has to dismiss.
          onEnded={onClose}
          className="w-full max-h-[68vh] rounded-2xl bg-black shadow-2xl block"
        >
          Your browser can't play this video.{' '}
          <a href={src} className="underline">
            Open it directly
          </a>
          .
        </video>

        <h2
          className="text-white text-base sm:text-xl font-black mt-4 text-center px-2"
          style={{ fontFamily: baloo }}
        >
          {title}
        </h2>
        {footnote && (
          <p className="text-white/70 text-xs sm:text-sm font-semibold text-center mt-1 px-2">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
