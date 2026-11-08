import type { MenuItem } from './menu';

// Početna ponuda i cene u RSD. Konačne dodatke/pića potvrditi sa restoranom.
// Svi dodaci i izabrano piće obračunavaju se po jednoj porciji jela.
export type MealOption = { id: string; name: string; price: number; ingredient?: string };
export type OptionGroup = {
  id: string;
  title: string;
  hint: string;
  max: number;
  single?: boolean;
  options: MealOption[];
};
export type MealSelection = { optionIds: string[]; omitted: string[]; note: string };
export const emptySelection = (): MealSelection => ({ optionIds: [], omitted: [], note: '' });

const toppings: OptionGroup = {
  id: 'toppings', title: 'Prilozi i sosovi', hint: 'Izaberi do 4 priloga uz osnovni sastav.', max: 4,
  options: [
    { id: 'pavlaka', name: 'Pavlaka', price: 0 },
    { id: 'tartar', name: 'Tartar', price: 0 },
    { id: 'urnebes', name: 'Urnebes', price: 0 },
    { id: 'luk', name: 'Crveni luk', price: 0, ingredient: 'Crveni luk' },
    { id: 'kupus', name: 'Kupus salata', price: 0 },
    { id: 'pavlaka-susam', name: 'Pavlaka sa susamom', price: 0 },
    { id: 'krastavcici', name: 'Kiseli krastavčići', price: 0, ingredient: 'Kiseli krastavčići' },
    { id: 'paradajz', name: 'Paradajz', price: 0, ingredient: 'Paradajz' },
  ],
};
const spices: OptionGroup = {
  id: 'spices', title: 'Začini po želji', hint: 'Blago, začinjeno ili malo ljuće — ti biraš.', max: 3,
  options: [
    { id: 'tucana', name: 'Tucana paprika', price: 0 },
    { id: 'vegeta', name: 'Vegeta', price: 0 },
    { id: 'biber', name: 'Biber', price: 0 },
  ],
};
const drinks: OptionGroup = {
  id: 'drinks', title: 'Nešto za osveženje?', hint: 'Jedno piće po porciji. Možeš i bez pića.', max: 1, single: true,
  options: [
    { id: 'drink-none', name: 'Bez pića', price: 0 },
    { id: 'coca-cola', name: 'Coca-Cola · 0,33 l', price: 180 },
    { id: 'cola-zero', name: 'Coca-Cola Zero · 0,33 l', price: 180 },
    { id: 'fanta', name: 'Fanta · 0,33 l', price: 180 },
    { id: 'sprite', name: 'Sprite · 0,33 l', price: 180 },
    { id: 'voda', name: 'Voda · 0,5 l', price: 120 },
  ],
};

export function canCustomize(item: MenuItem) { return item.category === 'giros' || item.category === 'burgeri'; }

export function optionGroups(item: MenuItem): OptionGroup[] {
  if (!canCustomize(item)) return [];
  return [toppings, spices, {
    id: 'extras', title: 'Dodaj još malo uživanja', hint: 'Dodatna porcija, za još bogatiji ukus.', max: 3,
    options: [
      { id: 'kajmak', name: 'Kajmak', price: 150 },
      { id: 'sprza', name: 'Sprža', price: 150 },
      { id: item.category === 'giros' ? 'extra-gyros' : 'extra-cheddar', name: item.category === 'giros' ? 'Dodatno giros meso' : 'Dodatni čedar', price: item.category === 'giros' ? 200 : 100 },
    ],
  }, drinks];
}

export function removableIngredients(item: MenuItem) {
  if (!canCustomize(item)) return [];
  return item.ingredients.filter(ingredient => /salata|paradajz|luk|sos|sir|krastav|pomfrit|kukuruz/i.test(ingredient));
}

export function withoutIngredient(ingredient: string) {
  const labels: Record<string, string> = {
    'Crveni luk': 'Bez crvenog luka', 'Paradajz': 'Bez paradajza', 'Zelena salata': 'Bez zelene salate',
    'Burger sos': 'Bez burger sosa', 'Sos': 'Bez sosa', 'Sir': 'Bez sira', 'Pomfrit': 'Bez pomfrita',
    'Kiseli krastavčići': 'Bez kiselih krastavčića', 'Kukuruz': 'Bez kukuruza', 'Beli sos': 'Bez belog sosa',
  };
  return labels[ingredient] || `Bez: ${ingredient.toLowerCase()}`;
}

export function normalizeSelection(item: MenuItem, input: unknown): MealSelection {
  if (!canCustomize(item) || !input || typeof input !== 'object') return emptySelection();
  const raw = input as Partial<MealSelection>;
  const requested = new Set(Array.isArray(raw.optionIds) ? raw.optionIds.filter(id => typeof id === 'string') : []);
  const selected = optionGroups(item).flatMap(group => group.options.filter(option => option.id !== 'drink-none' && requested.has(option.id)).slice(0, group.max));
  const addedIngredients = new Set(selected.map(option => option.ingredient));
  const omitted = Array.isArray(raw.omitted) ? raw.omitted : [];
  return {
    optionIds: selected.map(option => option.id).sort(),
    omitted: removableIngredients(item).filter(ingredient => omitted.includes(ingredient) && !addedIngredients.has(ingredient)).sort(),
    note: typeof raw.note === 'string' ? raw.note.replace(/\r\n/g, '\n').trim().slice(0, 200) : '',
  };
}

export function selectedOptions(item: MenuItem, selection: MealSelection) {
  return optionGroups(item).flatMap(group => group.options.filter(option => selection.optionIds.includes(option.id) && option.id !== 'drink-none'));
}

export function unitPrice(item: MenuItem, selection: MealSelection) {
  return item.price + selectedOptions(item, normalizeSelection(item, selection)).reduce((sum, option) => sum + option.price, 0);
}
