'use client';

import { assetPath } from '../asset-path';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { MenuItem } from './menu';
import { maxQuantity, money } from './cart';
import { emptySelection, normalizeSelection, optionGroups, removableIngredients, unitPrice, withoutIngredient, type MealOption, type MealSelection, type OptionGroup } from './modifiers';

type Props = {
  item: MenuItem;
  initialSelection?: MealSelection;
  initialQuantity?: number;
  editing?: boolean;
  onClose: () => void;
  onSave: (selection: MealSelection, quantity: number) => void;
};

export default function MealCustomizer({ item, initialSelection, initialQuantity = 1, editing = false, onClose, onSave }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selection, setSelection] = useState<MealSelection>(() => normalizeSelection(item, initialSelection || emptySelection()));
  const [quantity, setQuantity] = useState(initialQuantity);
  const groups = optionGroups(item);
  const removable = removableIngredients(item);
  const perPortion = unitPrice(item, selection);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => { dialog.close(); };
  }, []);

  function choose(group: OptionGroup, option: MealOption) {
    setSelection(previous => {
      const groupIds = group.options.map(choice => choice.id);
      const isSelected = previous.optionIds.includes(option.id);
      if (!group.single && !isSelected && previous.optionIds.filter(id => groupIds.includes(id)).length >= group.max) return previous;
      const optionIds = group.single
        ? [...previous.optionIds.filter(id => !groupIds.includes(id)), ...(option.id === 'drink-none' ? [] : [option.id])]
        : isSelected ? previous.optionIds.filter(id => id !== option.id) : [...previous.optionIds, option.id];
      return { ...previous, optionIds, omitted: optionIds.includes(option.id) && option.ingredient ? previous.omitted.filter(ingredient => ingredient !== option.ingredient) : previous.omitted };
    });
  }

  function omit(ingredient: string) {
    setSelection(previous => {
      if (previous.omitted.includes(ingredient)) return { ...previous, omitted: previous.omitted.filter(value => value !== ingredient) };
      const conflicting = groups.flatMap(group => group.options).filter(option => option.ingredient === ingredient).map(option => option.id);
      return { ...previous, omitted: [...previous.omitted, ingredient], optionIds: previous.optionIds.filter(id => !conflicting.includes(id)) };
    });
  }

  function backdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }

  return <dialog className="meal-dialog" ref={dialogRef} aria-labelledby="meal-title" aria-describedby="meal-description" onClick={backdropClick} onCancel={event => { event.preventDefault(); onClose(); }}>
    <button className="meal-close" type="button" aria-label="Zatvori izbor dodataka" autoFocus onClick={onClose}>×</button>
    <div className="meal-main">
      <div className="meal-intro">
        <img className="meal-hero-photo" src={assetPath(`/assets/${item.photo}`)} alt={item.name} width="585" height="780" />
        <div className="meal-intro-copy">
          <span className="meal-kicker">KOD ŠMECE / {item.category === 'giros' ? 'THE KING OF GYROS' : 'BURGERI'}</span>
          <h2 id="meal-title">{item.name}</h2>
          <p id="meal-description">{item.description}</p>
          <p className="meal-base-price">{money(item.price)} <small>osnovna cena</small></p>
          <p className="meal-base-ingredients"><span>OSNOVNI SASTAV</span>{item.ingredients.join(' · ')}</p>
        </div>
      </div>
      <div className="meal-options">
        <header className="meal-options-heading"><span>TVOJ UKUS. TVOJ IZBOR.</span><h3>Složi po svom<span>.</span></h3><p>Prilozi, začini i nešto za osveženje.</p></header>
        {groups.map((group, index) => {
          const picked = group.options.filter(option => selection.optionIds.includes(option.id)).length;
          return <fieldset className={`meal-group meal-group-${group.id}`} key={group.id}>
            <legend><span className="meal-step">0{index + 1}</span>{group.title}</legend>
            <div className="meal-group-hint"><p>{group.hint}</p>{!group.single && <span aria-live="polite">{picked}/{group.max}</span>}</div>
            <div className="meal-choices">
              {group.options.map(option => {
                const checked = selection.optionIds.includes(option.id) || (option.id === 'drink-none' && picked === 0);
                const disabled = !group.single && !checked && picked >= group.max;
                return <label className={`meal-choice${checked ? ' is-picked' : ''}${disabled ? ' is-unavailable' : ''}`} key={option.id}>
                  <input type={group.single ? 'radio' : 'checkbox'} name={`meal-${group.id}`} checked={checked} disabled={disabled} onChange={() => choose(group, option)} />
                  <span className="meal-choice-name">{option.name}</span>
                  {option.price > 0 && <span className="meal-choice-price">+{money(option.price)}</span>}
                </label>;
              })}
            </div>
          </fieldset>;
        })}
        {removable.length > 0 && <fieldset className="meal-group meal-omissions">
          <legend>Bez nečega?</legend>
          <div className="meal-group-hint"><p>Izostavi sastojak iz osnovnog sastava. Cena ostaje ista.</p></div>
          <div className="meal-omission-choices">{removable.map(ingredient => <label key={ingredient} className={selection.omitted.includes(ingredient) ? 'is-picked' : ''}>
            <input type="checkbox" checked={selection.omitted.includes(ingredient)} onChange={() => omit(ingredient)} /><span>{withoutIngredient(ingredient)}</span>
          </label>)}</div>
        </fieldset>}
        <label className="meal-note">Još neka želja?<span>Napomena za ovo jelo · opciono</span><textarea rows={3} maxLength={200} value={selection.note} onChange={event => setSelection(previous => ({ ...previous, note: event.target.value }))} placeholder="Npr. sos odvojeno…" /></label>
      </div>
    </div>
    <footer className="meal-footer">
      <div className="meal-quantity" aria-label="Broj porcija">
        <button type="button" aria-label="Manje porcija" disabled={quantity <= 1} onClick={() => setQuantity(value => Math.max(1, value - 1))}>−</button>
        <output aria-live="polite">{quantity}</output>
        <button type="button" aria-label="Više porcija" disabled={quantity >= maxQuantity} onClick={() => setQuantity(value => Math.min(maxQuantity, value + 1))}>+</button>
      </div>
      <div className="meal-unit-price"><span>Po porciji</span><output aria-live="polite">{money(perPortion)}</output><small>Dodaci i piće su po porciji.</small></div>
      <button className="meal-save" type="button" onClick={() => onSave(normalizeSelection(item, selection), quantity)}><span>{editing ? 'Sačuvaj izmene' : 'Dodaj u korpu'}</span><strong>{money(perPortion * quantity)}</strong><span className="meal-save-arrow" aria-hidden="true">↗</span></button>
    </footer>
  </dialog>;
}
