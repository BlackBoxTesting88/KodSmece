'use client';

import Link from 'next/link';
import { assetPath } from '../asset-path';
import { gyrosMotion } from './gyros-motion';

import { useEffect, useId, useRef } from 'react';

const layers = [
  { key: 'fries', label: 'Hrskavi pomfrit' },
  { key: 'meat', label: 'Giros premium meso' },
  { key: 'tomato', label: 'Paradajz i luk' },
  { key: 'greens', label: 'Sveža organska salata' },
  { key: 'sauce', label: 'Tzaziki i Giros sos' },
  { key: 'pita', label: 'Topla grčka tortilja' },
];

export default function GyrosScene() {
  const storyRef = useRef<HTMLElement>(null);
  const titlePathId = useId();

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const toggle = story.querySelector<HTMLButtonElement>('.gyros-toggle');
    const stage = story.querySelector<HTMLElement>('.gyros-stage');
    if (!toggle || !stage) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let expanded = false;
    function update() {
      if (!story || !stage || !toggle) return;
      frame = 0;
      const travel = story.offsetHeight - stage.offsetHeight;
      const distance = -story.getBoundingClientRect().top;
      const pose = gyrosMotion(motion.matches ? Number(expanded) : distance / Math.max(1, travel * .82));
      story.style.setProperty('--progress', pose.progress.toFixed(4));
      story.style.setProperty('--spread', pose.spread.toFixed(4));
      story.style.setProperty('--face-width', pose.faceWidth.toFixed(4));
      story.dataset.gyrosFace = pose.face;
      toggle.setAttribute('aria-pressed', String(pose.progress >= .8));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function toggleLayers() {
      if (!story || !stage || !toggle) return;
      expanded = toggle.getAttribute('aria-pressed') !== 'true';
      if (motion.matches) { update(); return; }
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

  return <section className="gyros-story" ref={storyRef} aria-labelledby="hero-title">
    <div className="gyros-stage">
      <div className="gyros-watermark" aria-hidden="true"><img src={assetPath("/assets/brand-gyros.jpg")}  alt="" width="3339" height="1294" /></div>
      <div className="gyros-heading">
        <p className="gyros-kicker">KOD ŠMECE / VALJEVO</p>
        <h1 id="hero-title" aria-label="Kod Šmece - The King of Gyros">
          <svg className="gyros-name-arc" viewBox="0 0 1000 280" aria-hidden="true">
            <defs><path id={titlePathId} d="M 65 245 Q 500 5 935 245" /></defs>
            <text textLength="820" lengthAdjust="spacingAndGlyphs"><textPath href={`#${titlePathId}`} startOffset="50%" textAnchor="middle">THE KING OF GYROS</textPath></text>
          </svg>
        </h1>
      </div>
      <span className="gyros-seal gyros-seal-left" aria-hidden="true">PRAVI<br />GRČKI!</span>
      <span className="gyros-seal gyros-seal-right" aria-hidden="true">SLOJ PO<br />SLOJ.</span>
      <div className="gyros-diagram" role="img" aria-label="Šmecin giros koji se pri skrolovanju razdvaja na hrskavi pomfrit, giros premium meso, paradajz i luk, svežu organsku salatu, tzaziki i giros sos i toplu grčku tortilju">
        <div className="gyros-closed"><img className="gyros-whole" src={assetPath("/assets/gyros-hero.png")}  alt="" width="1086" height="1448" fetchPriority="high" /></div>
        <div className="gyros-pieces">{layers.map((layer, index) => <div className={`gyros-layer gyros-${layer.key}`} key={layer.key}>
            <span className={`gyros-sprite sprite-${layer.key}`} />
            <span className="gyros-layer-note"><i aria-hidden="true" /> <span><small>0{index+1}</small>{layer.label}</span></span>
          </div>)}</div>
      </div>
      <p className="gyros-side-note">SVE ŠTO VOLIŠ.<br /><span>U JEDNOJ TORTILJI.</span></p>
      <div className="gyros-controls">
        <span className="gyros-index">01 <i aria-hidden="true"><b /></i> 06</span>
        <button type="button" className="gyros-toggle" aria-pressed="false">Istraži slojeve <span aria-hidden="true">↓</span></button>
        <Link className="gyros-order" href="/naruci/#giros">Naruči giros <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </section>;
}
