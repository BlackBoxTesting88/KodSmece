'use client';

import { assetPath } from '../asset-path';

import { useEffect, useId, useRef, useState } from 'react';

const artwork = assetPath('/assets/smeca-burger-sticker.png');

export default function StickerPeel() {
  const stickerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const sticker = stickerRef.current;
    if (!sticker) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function update() {
      if (!sticker) return;
      frame = 0;
      if (motion.matches) {
        setProgress(1);
        return;
      }
      const bounds = sticker.getBoundingClientRect();
      const travel = Math.min(bounds.height, innerHeight * .5) + innerHeight * .08;
      setProgress(Math.max(0, Math.min(1, (innerHeight * .98 - bounds.top) / travel)));
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    update();
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  const crease = 1800 * (1 - progress);
  const frontClip = `${crease},0 2500,0 2500,2500 0,2500 0,${crease}`;
  const backClip = `0,0 ${crease},0 0,${crease}`;

  return (
    <div className="bite-mascot peel-sticker" ref={stickerRef} aria-hidden="true">
      <svg viewBox="0 0 800 1000" focusable="false">
        <defs>
          <clipPath id={id + '-front'}><polygon points={frontClip} /></clipPath>
          <clipPath id={id + '-back'}><polygon points={backClip} /></clipPath>
          <mask id={id + '-silhouette'} x="0" y="0" width="800" height="1000" maskUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
            <image href={artwork} width="800" height="1000" />
          </mask>
          <linearGradient id={id + '-paper'} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b9b3a9" />
            <stop offset=".6" stopColor="#e6e0d6" />
            <stop offset="1" stopColor="#faf4ea" />
          </linearGradient>
          <filter id={id + '-shadow'} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="-5" dy="7" stdDeviation="10" floodColor="#372719" floodOpacity=".28" />
          </filter>
        </defs>
        <g className="peel-sticker-face" clipPath={`url(#${id}-front)`}>
          <image href={artwork} width="800" height="1000" />
        </g>
        {progress < .997 && (
          <g filter={`url(#${id}-shadow)`}>
            <g transform={`matrix(0 -1 -1 0 ${crease} ${crease})`}>
              <g clipPath={`url(#${id}-back)`}>
                <rect width="800" height="1000" fill={`url(#${id}-paper)`} mask={`url(#${id}-silhouette)`} />
              </g>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
