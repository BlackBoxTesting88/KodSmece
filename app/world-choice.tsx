'use client';
import Link from 'next/link';
import { assetPath } from './asset-path';
import { useCart } from './naruci/cart';
import styles from './world-choice.module.css';

export default function WorldChoice() {
  const { count } = useCart();
  return <div className={styles.page}>
    <header className={styles.header}>
      <span className={styles.wordmark}>KOD ŠMECE<span aria-hidden="true">✳</span></span>
      <h1>Šta ti se danas jede?</h1>
      <Link href={count ? '/naruci/porudzbina/' : '/naruci/'}>{count ? `Korpa (${count})` : 'Ceo meni'} <span aria-hidden="true">↗</span></Link>
    </header>
    <main className={styles.worlds}>
      <Link href="/giros/" className={`${styles.panel} ${styles.savory}`} aria-label="Uđi u slani svet — giros i burgeri">
        <div className={styles.panelTop}><span>THE KING OF GYROS</span><span>VALJEVO</span></div>
        <div className={styles.copy}><h2>Slani<br /><em>karakter.</em></h2><p>Giros. Burgeri. Ozbiljan zalogaj.</p></div>
        <span className={styles.orbit} aria-hidden="true" />
        <img className={styles.gyros} src={assetPath('/assets/gyros-hero.png')} alt="Šmecin giros u prepoznatljivom papiru" width="1000" height="1500" fetchPriority="high" />
        <span className={styles.sticker} aria-hidden="true">Pravi<br />grčki!</span>
        <div className={styles.panelBottom}><span>Uđi u slani svet</span><span className={styles.arrow} aria-hidden="true">↗</span></div>
      </Link>
      <span className={styles.or} aria-hidden="true">ili</span>
      <Link href="/palacinke/" className={`${styles.panel} ${styles.sweet}`} aria-label="Uđi u slatki svet — palačinke">
        <div className={styles.panelTop}><span>CRÊPES & COFFEE</span><span>VALJEVO</span></div>
        <div className={styles.copy}><h2>Slatki<br /><em>svet.</em></h2><p>Za osmeh. Za uživanje. Za tebe.</p></div>
        <span className={styles.blue} aria-hidden="true" />
        <img className={styles.pancake} src={assetPath('/assets/pancake-plate.webp')} alt="Palačinka sa čokoladnim keksom i prelivima na plavom tanjiru" width="1200" height="1200" fetchPriority="high" />
        <span className={styles.sweetSticker} aria-hidden="true">Još jedan<br />zalogaj.</span>
        <div className={styles.panelBottom}><span>Uđi u slatki svet</span><span className={styles.arrow} aria-hidden="true">↗</span></div>
      </Link>
    </main>
  </div>;
}
