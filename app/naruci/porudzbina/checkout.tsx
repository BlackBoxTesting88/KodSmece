'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useCart } from '../cart';
import CartReceipt from '../cart-receipt';
import ShopFooter from '../shop-footer';
import BrandLogo from '../../components/brand-logo';

export default function Checkout() {
  const { ready, count, total } = useCart();
  const [delivery, setDelivery] = useState(false);
  const [confirmation, setConfirmation] = useState<{ total: number; delivery: boolean } | null>(null);
  const confirmed = confirmation?.total === total && confirmation?.delivery === delivery && count > 0;

  function reviewOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (count) setConfirmation({ total, delivery });
  }

  return (
    <div className="checkout-page">
      <header className="top shop-top">
        <Link className="logo" href="/" aria-label="Kod Šmece, početna"><BrandLogo /></Link>
        <Link className="checkout-back" href="/naruci/">← Nazad na meni</Link>
      </header>
      <main className="checkout-main">
        <header className="checkout-heading">
          <span className="poster-sticker">PREGLED / KOD ŠMECE</span>
          <h1>Tvoja <em>porudžbina.</em></h1>
        </header>
        <div className="checkout-layout">
          <section className="checkout-details" aria-labelledby="details-title">
            <h2 id="details-title">Kako preuzimaš?</h2>
            {!ready ? <p role="status">Učitavanje korpe…</p> : count === 0 ? (
              <p>Dodaj nešto iz menija da nastaviš. <Link href="/naruci/">Nazad na meni ↗</Link></p>
            ) : (
              <form className="order-form" autoComplete="off" onSubmit={reviewOrder} onInput={() => setConfirmation(null)}>
                <fieldset>
                  <legend>Način preuzimanja</legend>
                  <div className="fulfillment-choices">
                    <label><input type="radio" name="fulfillment" value="pickup" checked={!delivery} onChange={() => setDelivery(false)} /> Lično preuzimanje</label>
                    <label><input type="radio" name="fulfillment" value="delivery" checked={delivery} onChange={() => setDelivery(true)} /> Dostava</label>
                  </div>
                </fieldset>
                {!delivery && <p data-pickup>Karađorđeva 145, Valjevo</p>}
                <div className="checkout-fields">
                  <label>Ime i prezime<input name="name" required maxLength={100} /></label>
                  <label>Telefon<input name="phone" type="tel" required maxLength={30} /></label>
                  <label className="delivery-address" hidden={!delivery}>Adresa za dostavu u Valjevu<input name="address" maxLength={180} required={delivery} disabled={!delivery} /></label>
                  <label className="order-note">Napomena <small>(opciono)</small><textarea name="note" rows={3} maxLength={300} /></label>
                </div>
                <div className="card-payment-note">
                  <span className="payment-symbol" aria-hidden="true">▰</span>
                  <div><strong>Kartično plaćanje</strong><p>Posle pregleda porudžbine sledi plaćanje preko platnog servisa.</p></div>
                </div>
                <button className="shop-primary" type="submit">Nastavi na plaćanje <span aria-hidden="true">↗</span></button>
                {confirmed && <p className="checkout-confirmation" role="status">Pregled porudžbine je spreman · {delivery ? 'dostava' : 'lično preuzimanje'}.</p>}
              </form>
            )}
          </section>
          <CartReceipt delivery={delivery} />
        </div>
      </main>
      <ShopFooter />
    </div>
  );
}
