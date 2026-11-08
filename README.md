# Kod Šmece

Next.js sajt restorana: animirani giros, meni, izbor priloga i pića, korpa i pregled porudžbine.

## Lokalno pokretanje

```sh
npm ci
npm run dev
```

Adresa: http://127.0.0.1:3200/

Razvojni skript zaustavlja samo prethodni server ovog projekta na portu 3200, čisti njegov razvojni keš i otvara sajt. Za pokretanje bez otvaranja pregledača: `npm run dev -- --no-open`.

## Provere

```sh
npm run typecheck
npm test
npm run build
```

## GitHub Pages

Workflow `.github/workflows/pages.yml` objavljuje svaku izmenu grane `main`. U Settings → Pages izvor objave treba da bude GitHub Actions. Dostupnost Pages za privatne repozitorijume zavisi od GitHub plana vlasnika.

Lokalna izrada istog statičkog prikaza:

```sh
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/KodSmece npm run build
```

Rezultat je folder `out/`. Putanje fotografija i ilustracija prolaze kroz `app/asset-path.ts`; Next.js sam dodaje prefiks navigaciji preko `next/link`.

## Struktura

- `app/home.tsx`: početna stranica.
- `app/components/gyros-scene.tsx`: animacija i natpisi slojeva girosa.
- `app/globals.css` i `app/brand.css`: stilovi početne.
- `app/naruci/menu.ts`: jela, sastavi, fotografije i cene.
- `app/naruci/modifiers.ts`: prilozi, začini, doplatni dodaci i pića.
- `app/naruci/cart-model.ts` i `cart.tsx`: obračun i čuvanje korpe.
- `app/naruci/porudzbina/`: pregled porudžbine.
- `public/assets/`: optimizovane fotografije, logotipi i ilustracije.
- `SlikeHrana/`: dostavljene izvorne fotografije.

Trenutna verzija čuva korpu u pregledaču. Prava naplata, obrada porudžbina i paneli za lokale povezuju se sa backend sistemom; GitHub Pages prikazuje statički frontend.
