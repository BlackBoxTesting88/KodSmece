'use client';

import { assetPath } from './asset-path';

import Link from 'next/link';
import { useRef, useState, type PointerEvent } from 'react';
import GyrosScene from './components/gyros-scene';
import BrandLogo from './components/brand-logo';
import HoursStatus from './components/hours-status';
import SocialIcons from './components/social-icons';
import StickerPeel from './components/sticker-peel';

export default function Home() {
  const [activeChapter, setActiveChapter] = useState('giros');
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function hoverChapter(event: PointerEvent<HTMLElement>, chapter: string) {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)').matches;
    if (event.pointerType !== 'mouse' || !finePointer || document.activeElement?.closest('.chapter-copy')) return;
    setActiveChapter(chapter);
  }

  function openGallery() {
    setGalleryLoaded(true);
    dialogRef.current?.showModal();
  }

  return (
    <>
  <a className="skip" href="#meni">Preskoči na meni</a>
  <header className="top">
    <a className="logo" href="#vrh" aria-label="Kod Šmece, početna"><BrandLogo /></a>
    <nav aria-label="Glavna navigacija"><a href="#meni">Naš meni</a><a href="#lokacija">Lokacija</a></nav>
    <Link className="order" href="/naruci/">Naruči <span aria-hidden="true">↗</span></Link>
  </header>
  <main>
    <GyrosScene />
    <section className="street-poster" aria-labelledby="street-poster-title">
      <p className="eyebrow">KARAĐORĐEVA 145 / VALJEVO</p>
      <h2 id="street-poster-title">Svrati <em>gladan.</em></h2>
      <div className="poster-photos">
        <figure><img src={assetPath("/assets/24.webp")}  alt="Giros u Šmecinom papiru" loading="lazy" /></figure>
        <figure><img src={assetPath("/assets/28.webp")}  alt="Burger sa topljenim sirom" loading="lazy" /></figure>
        <figure><img src={assetPath("/assets/10.webp")}  alt="Palačinke na plavom tanjiru" loading="lazy" /></figure>
      </div>
      <Link href="/naruci/" className="poster-link">Naruči ↗</Link>
    </section>
    <section className="kitchen" id="meni" aria-labelledby="menu-title">
      <div className="kitchen-head">
        <span className="eyebrow">KOD ŠMECE / THE KING OF GYROS</span>
        <h2 id="menu-title">Kruna ima<br /><em>svoj ukus.</em></h2>
        <p>Tri favorita.<br /><strong>Samo jedan Šmeca.</strong></p>
      </div>
      <div className="food-chapters">
        <article className={`chapter chapter-giros${activeChapter === 'giros' ? ' is-active' : ''}`} onPointerEnter={event => hoverChapter(event, 'giros')}>
          <img className="chapter-photo" src={assetPath("/assets/29.webp")}  alt="Giros u Šmecinom papiru" loading="lazy" />
          <h3><button className="chapter-trigger" type="button" aria-expanded={activeChapter === 'giros'} aria-controls="chapter-giros" id="trigger-giros" onClick={() => setActiveChapter('giros')}>
            <span className="chapter-meta"><span>01</span><span className="chapter-mark" aria-hidden="true"></span></span>
            <span className="chapter-title">Giros</span>
          </button></h3>
          <div className="chapter-copy" id="chapter-giros" hidden={activeChapter !== 'giros'}>
            <p>Grčki klasik, kod Šmece.</p>
            <Link href="/naruci/#giros">Naruči <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
        <article className={`chapter chapter-burger${activeChapter === 'burger' ? ' is-active' : ''}`} onPointerEnter={event => hoverChapter(event, 'burger')}>
          <img className="chapter-photo" src={assetPath("/assets/28.webp")}  alt="Burger sa topljenim sirom na Šmecinom papiru" loading="lazy" />
          <h3><button className="chapter-trigger" type="button" aria-expanded={activeChapter === 'burger'} aria-controls="chapter-burger" id="trigger-burger" onClick={() => setActiveChapter('burger')}>
            <span className="chapter-meta"><span>02</span><span className="chapter-mark" aria-hidden="true"></span></span>
            <span className="chapter-title">Burgeri</span>
          </button></h3>
          <div className="chapter-copy" id="chapter-burger" hidden={activeChapter !== 'burger'}>
            <p>Između dve zemičke.</p>
            <Link href="/naruci/#burgeri">Naruči <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
        <article className={`chapter chapter-slatko${activeChapter === 'slatko' ? ' is-active' : ''}`} onPointerEnter={event => hoverChapter(event, 'slatko')}>
          <img className="chapter-photo" src={assetPath("/assets/07.webp")}  alt="Palačinka servirana za stolom" loading="lazy" />
          <h3><button className="chapter-trigger" type="button" aria-expanded={activeChapter === 'slatko'} aria-controls="chapter-slatko" id="trigger-slatko" onClick={() => setActiveChapter('slatko')}>
            <span className="chapter-meta"><span>03</span><span className="chapter-mark" aria-hidden="true"></span></span>
            <span className="chapter-title">Palačinke</span>
          </button></h3>
          <div className="chapter-copy" id="chapter-slatko" hidden={activeChapter !== 'slatko'}>
            <p>Ostavi mesta za slatko.</p>
            <Link href="/naruci/#palacinke">Naruči palačinke <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
      </div>
    </section>
    <section className="flavor-poster" aria-labelledby="flavor-title">
      <div className="flavor-inner">
        <p className="poster-sticker">IZ ŠMECINE KUHINJE</p>
        <h2 id="flavor-title"><span>Svaki sloj</span><span>ima svoj</span><span>ukus.</span></h2>
        <div className="flavor-ingredient flavor-greens" aria-hidden="true"><span className="gyros-sprite sprite-greens"></span></div>
        <div className="flavor-ingredient flavor-bun" aria-hidden="true"><span className="gyros-sprite sprite-fries"></span></div>
        <div className="flavor-ingredient flavor-cheese" aria-hidden="true"><span className="gyros-sprite sprite-tomato"></span></div>
        <div className="flavor-ingredient flavor-patty" aria-hidden="true"><span className="gyros-sprite sprite-meat"></span></div>
        <span className="flavor-index" aria-hidden="true">01—04 / SLOJ PO SLOJ</span>
      </div>
    </section>
    <section className="sweet-feature" id="palacinke" aria-labelledby="sweet-title">
      <div className="sweet-copy">
        <BrandLogo sweet />
        <p className="poster-sticker">SLATKA STRANA ŠMECE</p>
        <h2 id="sweet-title">Šmecine<br /><em>palačinke.</em></h2>
        <Link className="sweet-link" href="/naruci/#palacinke">Pogledaj slatku ponudu <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="sweet-photos">
        <figure className="sweet-photo-main"><img src={assetPath("/assets/10.webp")}  alt="Palačinka sa čokoladnim prelivom i keksom na plavom tanjiru" width="585" height="780" loading="lazy" /></figure>
        <figure className="sweet-photo-detail"><img src={assetPath("/assets/02.webp")}  alt="Rolovane palačinke sa čokoladnim prelivom" width="585" height="780" loading="lazy" /></figure>
      </div>
    </section>
    <section className="bite-scene" id="galerija" aria-labelledby="bite-title">
      <div className="bite-copy">
        <p className="poster-sticker">ZA PONETI</p>
        <h2 id="bite-title">Zagrizi<br />kod Šmece.</h2>
        <p>Za sto u Karađorđevoj ili za poneti. Izaberi šta ti se jede.</p>
        <div className="bite-actions">
          <Link className="bite-order" href="/naruci/">Naruči dostavu <span aria-hidden="true">↗</span></Link>
          <button className="album-all" type="button" onClick={openGallery}>Galerija jela <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <figure className="bite-photo">
        <img src={assetPath("/assets/24.webp")}  alt="Šmecin giros u papiru, sa mesom, pomfritom i povrćem" loading="lazy" />
        <figcaption>VALJEVO / KARAĐORĐEVA 145</figcaption>
      </figure>
      <StickerPeel />
      <dialog ref={dialogRef} className="album-dialog" aria-labelledby="full-album-title">
        <header><h2 id="full-album-title">Galerija jela</h2><button className="album-close" type="button" autoFocus onClick={() => dialogRef.current?.close()}>Zatvori ×</button></header>
        <div className="album-grid">{galleryLoaded && Array.from({ length: 35 }, (_, index) => (
          <img key={index} src={assetPath(`/assets/${String(index + 1).padStart(2, '0')}.webp`)} alt={`Jelo iz galerije ${index + 1}`} loading="lazy" />
        ))}</div>
      </dialog>
    </section>
  </main>
  <footer className="site-footer" id="lokacija">
    <div className="footer-inner">
      <div className="footer-brand">
        <a className="logo" href="#vrh" aria-label="Kod Šmece, na početak"><BrandLogo /></a>
        <a className="footer-link" href="#vrh">Na početak ↑</a>
        <SocialIcons />
      </div>
      <div className="footer-location">
        <p className="eyebrow">SVRATI</p>
        <address><a className="footer-link" href="https://www.google.com/maps/search/?api=1&amp;query=Kara%C4%91or%C4%91eva+145+Valjevo">Karađorđeva 145, Valjevo ↗</a></address>
        <HoursStatus />
      </div>
      <div className="footer-orders">
        <a className="footer-link" href="tel:+381649334933">064 9334 933</a>
        <Link className="footer-delivery" href="/naruci/">Naruči dostavu <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </footer>
    </>
  );
}
