'use client';
import Link from 'next/link';
import { useCart } from '../naruci/cart';
import styles from './world-actions.module.css';

export default function WorldActions() {
  const { count } = useCart();
  return <div className={styles.actions}>
    <Link className={styles.switch} href="/palacinke/">Slatki svet <span aria-hidden="true">↗</span></Link>
    <Link className="order" href={count ? '/naruci/porudzbina/' : '/naruci/'}>{count ? `Korpa (${count})` : 'Naruči'} <span aria-hidden="true">↗</span></Link>
  </div>;
}
