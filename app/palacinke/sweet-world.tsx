'use client';
import Link from 'next/link';
import { useState } from 'react';
import { assetPath } from '../asset-path';
import BrandLogo from '../components/brand-logo';
import SocialIcons from '../components/social-icons';
import HoursStatus from '../components/hours-status';
import { money, useCart } from '../naruci/cart';
import { menu } from '../naruci/menu';
import styles from './sweet-world.module.css';

const pancakes = menu.filter(item => item.category === 'palacinke').slice(0, 6);

export default function SweetWorld() {
  const { ready, count, total, cart, add } = useCart();
  const [added, setAdded] = useState('');

  function addPancake(id: string) {
    add(id);
    setAdded(id);
  }

  return <div className={styles.page}>
    <a className="skip" href="#ponuda">Preskoči na palačinke</a>
    <header className={styles.header}>
      <Link className={styles.logo} href="/" aria-label="Kod Šmece — izaberi slatki ili slani svet"><BrandLogo sweet /></Link>
      <nav aria-label="Slatki svet"><a href="#ponuda">Palačinke</a><Link href="/giros/">Slani svet ↗</Link></nav>
      <Link className={styles.cartLink} href="/naruci/porudzbina/">Korpa <span data-cart-count>{count}</span></Link>
    </header>
    <main>
      <section className={styles.hero} aria-labelledby="sweet-hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>KOD ŠMECE / CRÊPES & COFFEE</p>
          <h1 id="sweet-hero-title">Slatko.<br /><em>Baš tvoje.</em></h1>
          <p className={styles.heroText}>Malo krema. Malo keksa.<br />Mnogo razloga za još jedan zalogaj.</p>
          <a href="#ponuda" className={styles.primary}>Izaberi palačinku <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.heroVisual}>
          <span className={styles.halo} aria-hidden="true" />
          <span className={styles.heroNote} aria-hidden="true">Ovde je<br /><b>slatko.</b></span>
          <img className={styles.heroPlate} src={assetPath('/assets/pancake-plate.webp')} width="1200" height="1200" alt="Šmecina palačinka sa čokoladnim i belim prelivom, keksom i mrvicama" fetchPriority="high" />
          <span className={styles.handwritten} aria-hidden="true">ljubav na<br />prvi zalogaj ↗</span>
        </div>
        <div className={styles.heroBottom}><span>SLATKI SVET / VALJEVO</span><a href="#ponuda">Spusti se po nešto slatko <span aria-hidden="true">↓</span></a><Link href="/giros/">Ili si ipak za giros? ↗</Link></div>
      </section>
      <div className={styles.ribbon} aria-hidden="true"><span>Palačinke.</span><i>✳</i><span>Još jedan zalogaj.</span><i>✳</i><span>Palačinke.</span><i>✳</i><span>Još jedan zalogaj.</span></div>
      <section className={styles.menu} id="ponuda" aria-labelledby="pancakes-title">
        <div className={styles.menuHeading}><div><p className={styles.eyebrow}>VREME JE ZA NEŠTO SLATKO.</p><h2 id="pancakes-title">Tvoj slatki<br /><em>izbor.</em></h2></div><p>Od čokoladnog krema do hrskavog keksa.<br />Koja je danas tvoja?</p></div>
        <div className={styles.products}>
          {pancakes.map((item, index) => {
            const quantity = cart.filter(line => line.productId === item.id).reduce((sum, line) => sum + line.quantity, 0);
            return <article className={styles.product} key={item.id}>
              <div className={styles.productPhoto}>
                <span className={styles.productIndex} aria-hidden="true">0{index + 1}</span>
                <img src={assetPath(`/assets/${item.photo}`)} alt={item.name} width="585" height="780" loading="lazy" />
                {quantity > 0 && <span className={styles.quantity}>{quantity} u korpi</span>}
              </div>
              <div className={styles.productTitle}><h3>{item.name}</h3><strong>{money(item.price)}</strong></div>
              <p className={styles.ingredients}>{item.ingredients.join(' · ')}</p>
              <button type="button" disabled={!ready} onClick={() => addPancake(item.id)} className={styles.add} aria-label={`Dodaj u korpu: ${item.name}`}><span>{added === item.id && quantity > 0 ? 'Dodaj još jednu' : 'Dodaj u korpu'}</span><span aria-hidden="true">+</span></button>
            </article>;
          })}
        </div>
        <Link className={styles.textLink} href="/naruci/#palacinke">Pogledaj i ostale palačinke <span aria-hidden="true">↗</span></Link>
      </section>
      <section className={styles.bajadera} aria-labelledby="bajadera-title">
        <div className={styles.bajaderaCopy}><p className={styles.eyebrow}>IZ ŠMECINOG SLATKOG SVETA</p><h2 id="bajadera-title">Bajadera.<br /><em>Za pamćenje.</em></h2><p>Neke palačinke zaslužuju<br />posebno mesto.</p><a className={styles.lightButton} href="#ponuda">Pronađi svoj slatki izbor <span aria-hidden="true">↗</span></a><span className={styles.bajaderaStamp} aria-hidden="true">Još samo<br />jedan griz.</span></div>
        <figure className={styles.bajaderaPhoto}><img src={assetPath('/assets/bajadera-poster.webp')} alt="Šmecin poster Bajadera palačinke, sa prelivom i lešnicima" width="900" height="1600" loading="lazy" /></figure>
      </section>
      <section className={styles.together} aria-labelledby="together-title">
        <div className={styles.togetherCopy}><p className={styles.eyebrow}>SLATKO + SLANO / ISTA EKIPA</p><h2 id="together-title">Različiti ukusi.<br /><em>Jedna korpa.</em></h2><p>Ti palačinku. Neko giros.<br />Sve stiže u jednoj porudžbini.</p><Link className={styles.primary} href="/giros/">Zaviri u slani svet <span aria-hidden="true">↗</span></Link></div>
        <div className={styles.togetherPhoto}><img src={assetPath('/assets/gyros-hero.png')} alt="Giros u Šmecinom papiru" width="1000" height="1500" loading="lazy" /><span aria-hidden="true">The King<br />of Gyros.</span></div>
      </section>
    </main>
    <footer className={styles.footer}>
      <div className={styles.footerBrand}><Link href="/" aria-label="Kod Šmece — izbor sveta"><BrandLogo sweet /></Link><SocialIcons /></div>
      <div><span className={styles.footerLabel}>VIDIMO SE KOD ŠMECE</span><address><a href="https://www.google.com/maps/search/?api=1&query=Kara%C4%91or%C4%91eva+145+Valjevo">Karađorđeva 145, Valjevo ↗</a></address><HoursStatus /></div>
      <div className={styles.footerLinks}><a href="tel:+381649334933">064 9334 933</a><Link href="/giros/">Slani svet ↗</Link><Link href="/naruci/">Ceo meni ↗</Link><a href="#vrh">Na početak ↑</a></div>
    </footer>
    {count > 0 && <Link href="/naruci/porudzbina/" className={styles.basket}><span>Korpa <b>{count}</b></span><strong>{money(total)} <span aria-hidden="true">↗</span></strong></Link>}
  </div>;
}
