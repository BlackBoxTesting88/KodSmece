'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { addLine, cartKey, changeLine, legacyCartKey, makeLine, migrateCart, priceCart, replaceLine, restoreCart, type CartLine, type PricedLine } from './cart-model';
import { type MealSelection } from './modifiers';

export { maxQuantity } from './cart-model';
export const money = (value: number) => new Intl.NumberFormat('sr-Latn-RS').format(value) + ' RSD';

function readCart(): CartLine[] {
  try {
    const saved = localStorage.getItem(cartKey);
    if (saved !== null) return restoreCart(JSON.parse(saved));
    return migrateCart(JSON.parse(localStorage.getItem(legacyCartKey) || '{}'));
  } catch { return []; }
}

type CartContextValue = {
  cart: CartLine[];
  lines: PricedLine[];
  ready: boolean;
  count: number;
  total: number;
  message: string;
  add: (productId: string, selection?: MealSelection, quantity?: number) => void;
  change: (key: string, step: number) => void;
  update: (key: string, selection: MealSelection, quantity: number) => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setCart(readCart());
    setReady(true);
    function syncStorage(event: StorageEvent) {
      if (event.key === cartKey || event.key === legacyCartKey || event.key === null) setCart(readCart());
    }
    function syncPage(event: PageTransitionEvent) { if (event.persisted) setCart(readCart()); }
    addEventListener('storage', syncStorage);
    addEventListener('pageshow', syncPage);
    return () => { removeEventListener('storage', syncStorage); removeEventListener('pageshow', syncPage); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(cartKey, JSON.stringify({ version: 2, lines: cart })); }
    catch { setMessage('Pregledač ne može da sačuva korpu pri sledećem otvaranju sajta.'); }
  }, [cart, ready]);

  function add(productId: string, selection?: MealSelection, quantity = 1) {
    if (!ready) return;
    const incoming = makeLine(productId, selection, quantity);
    if (!incoming) return;
    setCart(previous => addLine(previous, incoming));
    setMessage('Izabrano jelo je dodato u korpu.');
  }
  function change(key: string, step: number) {
    if (!ready) return;
    setCart(previous => changeLine(previous, key, step));
    setMessage('Količina u korpi je ažurirana.');
  }
  function update(key: string, selection: MealSelection, quantity: number) {
    if (!ready) return;
    setCart(previous => replaceLine(previous, key, selection, quantity));
    setMessage('Izbor dodataka u korpi je sačuvan.');
  }

  const lines = priceCart(cart);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.total, 0);
  return <CartContext.Provider value={{ cart, lines, ready, count, total, message, add, change, update }}>
    {children}<p style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0 }} role="status">{message}</p>
  </CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('Korpa zahteva CartProvider.');
  return context;
}
