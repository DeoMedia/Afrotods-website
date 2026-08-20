import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const baloo = "'Baloo 2', cursive";

export interface HeroVideoHandle {
  play: () => void;
}

/** Part 1, playing in the hero itself.
 *
 *  Nothing loads until someone asks for it: preload="none" keeps a 13MB file
 *  off the critical path, so the homepage still opens quickly on a phone.
 *  When the episode finishes it hands over to Google Play, which is the whole
 *  point of giving Part 1 away.
 */
export const HeroVideo = forwardRef<HeroVideoHandle, {
  src: string;
  poster?: string;
  playStoreUrl: string;
}>(function HeroVideo({ src, poster, playStoreUrl }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const start = () => {
    setFinished(false);
    setStarted(true);
    // On a phone the columns stack and the video sits below the copy, so the
    // button would otherwise start something the viewer cannot see.
    frameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // The element exists already; play() after state has flushed.
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {/* a blocked autoplay just leaves the controls */});
      }
    });
  };

  useImperativeHandle(ref, () => ({ play: start }));

  return (
    <div
      ref={frameRef}
      className="@container relative w-full max-w-[520px] rounded-3xl overflow-hidden bg-black shadow-2xl aspect-video"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="none"
        controlsList="nodownload"
        onEnded={() => setFinished(true)}
        className="w-full h-full object-cover bg-black"
      >
        Your browser can't play this video.{' '}
        <a href={src} className="underline">
          Open it directly
        </a>
        .
      </video>

      {/* Resting state: a play button over the poster, nothing downloaded yet. */}
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Play The Afrotods Festival Time, Part 1"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-transparent via-[#2D0A6B]/20 to-[#2D0A6B]/60 hover:via-[#2D0A6B]/10 hover:to-[#2D0A6B]/50 transition-colors group"
        >
          <span className="w-14 h-14 @md:w-20 @md:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 @md:w-9 @md:h-9 text-[#F97316] ml-1" fill="currentColor" />
          </span>
          <span className="text-white font-extrabold text-sm @md:text-lg drop-shadow" style={{ fontFamily: baloo }}>
            Watch Part 1 free
          </span>
        </button>
      )}

      {/* Finished: the moment they are most likely to want more. */}
      {finished && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 @md:gap-4 bg-[#2D0A6B]/95 px-4 @md:px-6 text-center">
          <p className="text-white font-black text-base @md:text-2xl leading-tight" style={{ fontFamily: baloo }}>
            Want to see what happens next?
          </p>
          <p className="hidden @md:block text-white/75 font-semibold text-sm max-w-[320px]">
            The rest of the series is in the app, along with the books, games and music.
          </p>
          <a
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 @md:gap-2.5 px-5 @md:px-7 py-2.5 @md:py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-sm @md:text-base shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: baloo }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2D0A6B" aria-hidden="true">
              <path d="M3.18 23.76a2 2 0 0 0 2.08-.18L19 14.48l-3.82-3.82-12 13.1zM22.37 9.74a1.94 1.94 0 0 0 0-3.48L19.5 4.6l-4.32 4.32 4.32 4.32 2.87-3.5zM1.55.47A1.94 1.94 0 0 0 1 1.73v20.54c0 .5.2.96.55 1.26L2 23l11.5-11.5v-.27L2 0l-.45.47z" />
            </svg>
            Download on Google Play
          </a>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs @md:text-sm font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            Watch Part 1 again
          </button>
        </div>
      )}
    </div>
  );
});
