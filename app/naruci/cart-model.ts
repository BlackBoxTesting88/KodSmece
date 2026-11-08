import { menu, type MenuItem } from './menu';
import { emptySelection, normalizeSelection, selectedOptions, unitPrice, type MealSelection } from './modifiers';

export const cartKey = 'kod-smece-cart-v2';
export const legacyCartKey = 'kod-smece-cart-v1';
export const maxQuantity = 20;
export type CartLine = { key: string; productId: string; quantity: number; selection: MealSelection };
export type PricedLine = CartLine & { item: MenuItem; unitPrice: number; total: number; options: ReturnType<typeof selectedOptions> };

export function lineKey(productId: string, selection: MealSelection) {
  return JSON.stringify([productId, selection.optionIds, selection.omitted, selection.note]);
}

export function makeLine(productId: string, rawSelection: unknown = emptySelection(), quantity = 1): CartLine | null {
  const item = menu.find(product => product.id === productId);
  if (!item || !Number.isInteger(quantity) || quantity <= 0) return null;
  const selection = normalizeSelection(item, rawSelection);
  return { key: lineKey(item.id, selection), productId: item.id, quantity: Math.min(quantity, maxQuantity), selection };
}

export function addLine(cart: CartLine[], incoming: CartLine): CartLine[] {
  const existing = cart.find(line => line.key === incoming.key);
  if (!existing) return [...cart, incoming];
  return cart.map(line => line.key === incoming.key ? { ...line, quantity: Math.min(maxQuantity, line.quantity + incoming.quantity) } : line);
}

export function changeLine(cart: CartLine[], key: string, step: number) {
  if (!Number.isInteger(step)) return cart;
  return cart.flatMap(line => {
    if (line.key !== key) return [line];
    const quantity = Math.min(maxQuantity, Math.max(0, line.quantity + step));
    return quantity ? [{ ...line, quantity }] : [];
  });
}

export function replaceLine(cart: CartLine[], key: string, selection: MealSelection, quantity: number) {
  const index = cart.findIndex(line => line.key === key);
  if (index < 0) return cart;
  const replacement = makeLine(cart[index].productId, selection, quantity);
  if (!replacement) return cart;
  if (replacement.key === key) return cart.map(line => line.key === key ? replacement : line);
  const remaining = cart.filter(line => line.key !== key);
  if (remaining.some(line => line.key === replacement.key)) return addLine(remaining, replacement);
  remaining.splice(index, 0, replacement);
  return remaining;
}

export function restoreCart(saved: unknown): CartLine[] {
  if (!saved || typeof saved !== 'object' || (saved as { version?: number }).version !== 2 || !Array.isArray((saved as { lines?: unknown }).lines)) return [];
  return ((saved as { lines: unknown[] }).lines).slice(0, 200).reduce<CartLine[]>((cart, raw) => {
    if (!raw || typeof raw !== 'object') return cart;
    const line = raw as Partial<CartLine>;
    const checked = makeLine(typeof line.productId === 'string' ? line.productId : '', line.selection, line.quantity ?? 0);
    return checked ? addLine(cart, checked) : cart;
  }, []);
}

export function migrateCart(saved: unknown): CartLine[] {
  if (!saved || typeof saved !== 'object') return [];
  return menu.flatMap(item => {
    const quantity = (saved as Record<string, unknown>)[item.id];
    const line = makeLine(item.id, emptySelection(), typeof quantity === 'number' ? quantity : 0);
    return line ? [line] : [];
  });
}

export function priceCart(cart: CartLine[]): PricedLine[] {
  return cart.flatMap(line => {
    const item = menu.find(product => product.id === line.productId);
    if (!item) return [];
    const price = unitPrice(item, line.selection);
    return [{ ...line, item, unitPrice: price, total: price * line.quantity, options: selectedOptions(item, line.selection) }];
  });
}
