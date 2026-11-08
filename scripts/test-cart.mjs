import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Exercise the cart's actual pure modules without adding a browser/test dependency.
const compiled = mkdtempSync(join(tmpdir(), 'smece-cart-test-'));
for (const name of ['menu', 'modifiers', 'cart-model']) {
  const source = readFileSync(new URL(`../app/naruci/${name}.ts`, import.meta.url), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  writeFileSync(join(compiled, `${name}.js`), result.outputText);
}
const require = createRequire(import.meta.url);
const { menu } = require(join(compiled, 'menu.js'));
const { emptySelection, normalizeSelection, optionGroups } = require(join(compiled, 'modifiers.js'));
const { makeLine, addLine, changeLine, replaceLine, restoreCart, migrateCart, priceCart, maxQuantity } = require(join(compiled, 'cart-model.js'));
process.on('exit', () => rmSync(compiled, { recursive: true, force: true }));
const selection = (optionIds = [], omitted = [], note = '') => ({ optionIds, omitted, note });
const total = cart => priceCart(cart).reduce((sum, line) => sum + line.total, 0);

test('paid extras and drinks are charged per portion on both giros and burgers', () => {
  const gyros = makeLine('giros-pita', selection(['kajmak', 'coca-cola']), 2);
  const burger = makeLine('burger-klasik', selection(['sprza', 'cola-zero']), 1);
  const plain = makeLine('giros-pita');
  assert.equal(priceCart([gyros])[0].unitPrice, 920);
  assert.equal(priceCart([gyros])[0].total, 1840);
  assert.equal(priceCart([burger])[0].unitPrice, 1020);
  assert.equal(total([gyros, plain, burger]), 3450);
});

test('same dish with different additions, omissions or notes stays separate', () => {
  const variants = [emptySelection(), selection(['kajmak']), selection([], ['Crveni luk']), selection([], [], 'Sos odvojeno')];
  const cart = variants.reduce((lines, value) => addLine(lines, makeLine('giros-pita', value)), []);
  assert.equal(cart.length, 4);
  assert.equal(new Set(cart.map(line => line.key)).size, 4);
  assert.equal(total(cart), 4 * 590 + 150);
});

test('identical choices merge regardless of click order, and quantity changes target just that variant', () => {
  let cart = addLine([], makeLine('giros-pita', selection(['kajmak', 'tartar']), 2));
  cart = addLine(cart, makeLine('giros-pita', selection(['tartar', 'kajmak']), 1));
  cart = addLine(cart, makeLine('giros-pita'));
  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 3);
  cart = changeLine(cart, cart[1].key, -1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);
});

test('editing updates prices, merges an identical existing variant and retains other dishes', () => {
  const customized = makeLine('giros-pita', selection(['kajmak']), 2);
  const plain = makeLine('giros-pita');
  const burger = makeLine('burger-klasik');
  const edited = replaceLine([customized, plain, burger], customized.key, emptySelection(), 2);
  assert.equal(edited.length, 2);
  assert.equal(edited.find(line => line.productId === 'giros-pita').quantity, 3);
  assert.equal(total(edited), 590 * 3 + 690);
});

test('saved baskets restore choices and recalculate current catalog prices rather than trusting stored amounts', () => {
  const line = makeLine('burger-klasik', selection(['sprza', 'cola-zero'], ['Crveni luk'], 'Sos odvojeno'), 2);
  const restored = restoreCart({ version: 2, lines: [{ ...line, key: 'fake', unitPrice: 1, total: 1 }] });
  assert.deepEqual(restored, [line]);
  assert.equal(total(restored), 2040);
  assert.equal(priceCart(restored)[0].selection.note, 'Sos odvojeno');
});

test('invalid saved options and quantities are rejected and all selection limits hold', () => {
  const item = menu.find(item => item.id === 'giros-pita');
  const raw = selection(optionGroups(item).flatMap(group => group.options.map(option => option.id)).concat(['invented', 'extra-cheddar']), ['Pita', 'Crveni luk', 'not-real'], 'x'.repeat(240));
  const normalized = normalizeSelection(item, raw);
  for (const group of optionGroups(item)) assert.ok(group.options.filter(option => normalized.optionIds.includes(option.id)).length <= group.max);
  assert.ok(!normalized.optionIds.includes('invented'));
  assert.ok(!normalized.optionIds.includes('extra-cheddar'));
  assert.ok(!normalized.omitted.includes('Crveni luk')); // Added onion takes precedence.
  assert.equal(normalized.note.length, 200);
  const lines = restoreCart({ version: 2, lines: [
    { productId: 'giros-pita', quantity: 2, selection: raw },
    { productId: 'unknown', quantity: 3 },
    { productId: 'burger-klasik', quantity: -1 },
    { productId: 'burger-klasik', quantity: 1.5 },
    { productId: 'burger-klasik', quantity: '2' },
  ] });
  assert.equal(lines.length, 1);
  assert.equal(lines[0].quantity, 2);
});

test('legacy basket migrates without losing meals, while invalid entries are dropped', () => {
  const migrated = migrateCart({ 'giros-pita': 2, 'burger-klasik': 1, 'palacinka-klasik': 3, unknown: 9, 'giros-veliki': -1 });
  assert.equal(migrated.length, 3);
  assert.equal(migrated.reduce((sum, line) => sum + line.quantity, 0), 6);
  assert.equal(total(migrated), 590 * 2 + 690 + 390 * 3);
  assert.ok(migrated.every(line => line.selection.optionIds.length === 0));
});

test('quantity cap and pancake quick-add behavior stay consistent', () => {
  const item = menu.find(item => item.id === 'palacinka-klasik');
  const line = makeLine(item.id, selection(['kajmak', 'cola-zero'], ['Sir'], 'x'), 999);
  assert.deepEqual(line.selection, emptySelection());
  assert.equal(line.quantity, maxQuantity);
  assert.equal(addLine([line], line)[0].quantity, maxQuantity);
  assert.equal(changeLine([line], line.key, 1)[0].quantity, maxQuantity);
  assert.deepEqual(changeLine([line], line.key, -maxQuantity), []);
  assert.deepEqual(restoreCart(null), []);
});
