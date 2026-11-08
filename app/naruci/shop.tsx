'use client';

import { assetPath } from '../asset-path';

import Link from 'next/link';
import { useState } from 'react';
import { menu, type Category, type MenuItem } from './menu';
import { canCustomize } from './modifiers';
import MealCustomizer from './meal-customizer';
import { money, useCart } from './cart';
import CartReceipt from './cart-receipt';
import ShopFooter from './shop-footer';
import BrandLogo from '../components/brand-logo';

const categories: { id: Category; className: string; label: string; title: string }[] = [
  { id: 'giros', className: 'shop-gyros', label: '01 / THE KING OF GYROS', title: 'Giros.' },
  { id: 'burgeri', className: 'shop-burgers', label: '02 / IZMEĐU DVE ZEMIČKE', title: 'Burgeri.' },
  { id: 'palacinke', className: 'shop-sweets', label: '03 / SLATKA STRANA MENIJA', title: 'Palačinke.' },
];

export default function Shop() {
  const { ready, count, total, add } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  return (
    <>
      <a className="skip" href="#giros">Preskoči na ponudu</a>
      <header className="top shop-top">
        <Link className="logo" href="/" aria-label="Kod Šmece, početna"><BrandLogo /></Link>
        <Link className="shop-cart-link" href="/naruci/porudzbina/">Korpa <span data-cart-count>{count}</span></Link>
      </header>
      <main>
        <section className="shop-masthead" aria-labelledby="shop-title">
          <div className="shop-masthead-copy">
            <span className="poster-sticker">ŠMECIN MENI</span>
            <h1 id="shop-title">Šta ti se<br /><em>jede?</em></h1>
            <p>Giros, burgeri i palačinke u jednoj porudžbini.</p>
          </div>
          <figure className="shop-masthead-image">
            <img src={assetPath("/assets/24.webp")}  alt="Giros sa pomfritom i povrćem u Šmecinom papiru" width="585" height="780" fetchPriority="high" />
          </figure>
          <img className="shop-mascot" src={assetPath("/assets/smeca-sticker.svg")}  alt="" />
        </section>
        <nav className="shop-tabs" aria-label="Kategorije menija">
          <a href="#giros"><span>01</span> Giros</a>
          <a href="#burgeri"><span>02</span> Burgeri</a>
          <a href="#palacinke"><span>03</span> Palačinke</a>
        </nav>
        <div className="shop-layout">
          <div className="shop-catalog">
            {categories.map(category => (
              <section className={`shop-category ${category.className}`} id={category.id} aria-labelledby={category.id + '-title'} key={category.id}>
                <header><span>{category.label}</span><h2 id={category.id + '-title'}>{category.title}</h2></header>
                <div className="shop-products">
                  {menu.filter(item => item.category === category.id).map(item => (
                    <article className="product-card" key={item.id}>
                      {canCustomize(item) ? <button type="button" className="product-photo product-photo-button" disabled={!ready} onClick={() => setSelectedItem(item)} aria-label={`Pogledaj i prilagodi: ${item.name}`}><img src={assetPath(`/assets/${item.photo}`)} alt={item.name} loading="lazy" /></button> : <div className="product-photo"><img src={assetPath(`/assets/${item.photo}`)} alt={item.name} loading="lazy" /></div>}
                      <div className="product-copy">
                        <h3>{canCustomize(item) ? <button className="product-title-button" type="button" disabled={!ready} onClick={() => setSelectedItem(item)}>{item.name}</button> : item.name}</h3>
                        <p className="product-ingredients">{item.ingredients.join(' · ')}</p>
                        <span className="product-price">{money(item.price)}</span>
                        <button className="product-add" type="button" disabled={!ready} onClick={() => canCustomize(item) ? setSelectedItem(item) : add(item.id)} aria-label={`${canCustomize(item) ? 'Prilagodi i dodaj' : 'Dodaj u korpu'}: ${item.name}`}>+</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <CartReceipt showContinue />
        </div>
        {count > 0 && <Link className="mobile-basket" href="/naruci/porudzbina/"><span>Korpa · <b data-cart-count>{count}</b></span><strong data-cart-total>{money(total)}</strong></Link>}
      </main>
      <ShopFooter />
      {selectedItem && <MealCustomizer item={selectedItem} onClose={() => setSelectedItem(null)} onSave={(selection, quantity) => { add(selectedItem.id, selection, quantity); setSelectedItem(null); }} />}
    </>
  );
}
