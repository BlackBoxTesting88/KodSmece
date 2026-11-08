'use client';

import Link from 'next/link';
import { useState } from 'react';
import { maxQuantity, money, useCart } from './cart';
import { canCustomize, withoutIngredient } from './modifiers';
import MealCustomizer from './meal-customizer';

export default function CartReceipt({ showContinue = false, delivery = false }: { showContinue?: boolean; delivery?: boolean }) {
  const { lines, count, ready, total, change, update } = useCart();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const editingLine = lines.find(line => line.key === editingKey);
  return <>
    <aside className="shop-receipt" aria-labelledby="cart-title">
      <span className="shop-receipt-label">KOD ŠMECE / VALJEVO 145</span>
      <h2 id="cart-title">Tvoja korpa.</h2>
      {!ready ? <p className="shop-empty" role="status">Učitavanje korpe…</p> : !count ? <p className="shop-empty">Korpa je prazna.</p> : <ul className="receipt-lines">
        {lines.map(line => <li key={line.key}>
          <div className="receipt-line-info"><strong>{line.item.name}</strong><span>{money(line.total)}</span></div>
          <p className="receipt-unit-price">{line.quantity} × {money(line.unitPrice)} po porciji</p>
          {(line.options.length > 0 || line.selection.omitted.length > 0) && <ul className="receipt-options">
            {line.options.map(option => <li key={option.id}><span>{option.name}</span>{option.price > 0 && <span>+{money(option.price)}</span>}</li>)}
            {line.selection.omitted.map(ingredient => <li key={ingredient}>{withoutIngredient(ingredient)}</li>)}
          </ul>}
          {line.selection.note && <p className="receipt-note">Napomena: {line.selection.note}</p>}
          <div className="receipt-line-actions"><div className="quantity-controls">
            <button type="button" onClick={() => change(line.key, -1)} aria-label={`Smanji količinu: ${line.item.name}`}>−</button>
            <span>{line.quantity}</span>
            <button type="button" onClick={() => change(line.key, 1)} disabled={line.quantity >= maxQuantity} aria-label={`Povećaj količinu: ${line.item.name}`}>+</button>
          </div>{canCustomize(line.item) && <button type="button" className="receipt-edit" onClick={() => setEditingKey(line.key)} aria-label={`Izmeni dodatke: ${line.item.name}`}>Izmeni</button>}</div>
        </li>)}
      </ul>}
      <p className="shop-total"><span>Međuzbir</span><strong data-cart-total>{money(total)}</strong></p>
      {showContinue && count > 0 && <Link className="shop-primary" href="/naruci/porudzbina/">Pregled porudžbine <span aria-hidden="true">↗</span></Link>}
      {delivery && count > 0 && <small className="delivery-note">Međuzbir ne obuhvata dostavu.</small>}
    </aside>
    {editingLine && <MealCustomizer key={editingLine.key} item={editingLine.item} initialSelection={editingLine.selection} initialQuantity={editingLine.quantity} editing onClose={() => setEditingKey(null)} onSave={(selection, quantity) => { update(editingLine.key, selection, quantity); setEditingKey(null); }} />}
  </>;
}
