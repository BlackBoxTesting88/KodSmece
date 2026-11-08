'use client';

import { useEffect, useId, useRef } from 'react';

export default function BurgerScene() {
  const storyRef = useRef<HTMLElement>(null);
  const titlePathId = useId();

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const toggle = story.querySelector<HTMLButtonElement>('.burger-toggle');
    const stage = story.querySelector<HTMLElement>('.burger-stage');
    if (!toggle || !stage) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let expanded = false;
    function update() {
      if (!story || !stage || !toggle) return;
      frame = 0;
      const travel = story.offsetHeight - stage.offsetHeight;
      const distance = -story.getBoundingClientRect().top;
      const progress = motion.matches
        ? Number(expanded)
        : Math.min(1, Math.max(0, distance / Math.max(1, travel * .82)));
      story.style.setProperty('--progress', progress.toFixed(3));
      toggle.setAttribute('aria-pressed', String(progress >= .8));
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function toggleLayers() {
      if (!story || !stage || !toggle) return;
      expanded = toggle.getAttribute('aria-pressed') !== 'true';
      if (motion.matches) {
        update();
        return;
      }
      const start = scrollY + story.getBoundingClientRect().top;
      const travel = story.offsetHeight - stage.offsetHeight;
      scrollTo({ top: start + (expanded ? travel * .83 : 0), behavior: 'smooth' });
    }
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    toggle.addEventListener('click', toggleLayers);
    update();
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      toggle.removeEventListener('click', toggleLayers);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="burger-story" ref={storyRef} aria-labelledby="hero-title">
      <div className="burger-stage">
        <div className="burger-heading">
          <h1 id="hero-title" aria-label="Kod Šmece">
            <svg className="hero-name-arc" viewBox="0 0 1000 330" aria-hidden="true">
              <defs>
                <path id={titlePathId} d="M 75 270 Q 500 0 925 270" />
              </defs>
              <text className="hero-name-text" textLength="780" lengthAdjust="spacing">
                <textPath href={`#${titlePathId}`} startOffset="50%" textAnchor="middle">KOD ŠMECE</textPath>
              </text>
            </svg>
          </h1>
        </div>
        <span className="hero-stamp hero-stamp-left" aria-hidden="true">PREMIUM<br />UKUS</span><span className="hero-stamp hero-stamp-right" aria-hidden="true">SLOJ PO<br />SLOJ!</span>
        <div className="burger-diagram" role="img" aria-label="Burger koji se razdvaja na zemičku, sir, pljeskavicu, povrće i donju polovinu zemičke">
          <div className="burger-layer bun-top"><span className="layer-visual"></span><span className="layer-note">01 / Zemička</span></div>
          <div className="burger-layer cheese"><span className="layer-visual"></span><span className="layer-note">02 / Sir</span></div>
          <div className="burger-layer patty"><span className="layer-visual"></span><span className="layer-note">03 / Pljeskavica</span></div>
          <div className="burger-layer greens"><span className="layer-visual"></span><span className="layer-note">04 / Povrće</span></div>
          <div className="burger-layer bun-bottom"><span className="layer-visual"></span><span className="layer-note">05 / Tostirana zemička</span></div>
        </div>
        <div className="burger-controls">
          <span className="burger-index">01 <i></i> 05</span>
          <button type="button" className="burger-toggle" aria-pressed="false">Istraži slojeve <span aria-hidden="true">↓</span></button>
        </div>
      </div>
    </section>
  );
}
