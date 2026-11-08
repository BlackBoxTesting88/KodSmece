# Kod Šmece - novi identitet i vizuali

## Sačuvani vizuali
- `public/assets/brand-gyros.jpg`: originalni crno-narandžasti logo koji je dostavio klijent, bez promene crteža ili slova.
- `public/assets/brand-crepes.jpg`: originalni roze-plavi logo za palačinke, bez promene crteža ili slova.
- `public/assets/gyros-hero.png`: transparentan prikaz girosa pripremljen iz klijentove fotografije `29.webp`.
- `public/assets/gyros-atlas.png`: transparentan atlas šest sastojaka, 2 kolone i 3 reda, za animaciju pri skrolovanju.

## Način pripreme
Korišćen je ugrađeni ImageGen alat, bez CLI/API režima. Logotipi nisu generisani. Fotografija girosa je referenca za izgled hrane; atlas je ilustrativni fotografski prikaz sastojaka.

## Promptovi za vizuale
1. Hero / background-extraction: isolate only the exact upright Greek gyros from reference photo 29.webp; remove hand, watch, table and street; preserve grilled pita, visible roasted meat, fries, tomato, red onion, lettuce, sauces, printed paper and orange sleeve; natural three-quarter perspective, transparent alpha, no added text or branding.
2. Atlas / product-mockup: high-end photorealistic transparent food sprite sheet, exactly two columns by three rows of square cells; upper left golden fries, upper right shaved roasted gyros chicken, middle left tomato and red onion, middle right lettuce, lower left tzatziki and orange house sauce, lower right empty toasted pita cone in orange cuff; consistent studio light and perspective; complete isolated groups with no borders, letters, hands, utensils or plates.
3. Final atlas edit / background-extraction: remove all background and colored mist to genuine zero-alpha transparency; preserve the six food groups, positions, sizes, details and two-by-three layout exactly; no extra objects, text or opaque shadows.

## Izgled i pristupačnost
Boje preuzete iz materijala klijenta: gotovo crna #070707 i narandžasta #FD8922, uz roze #F0A7AD i plavu #8BD3ED za palačinke. Animacija podržava tastaturu, klik i smanjeno kretanje sistema. Prethodna hero komponenta i burger atlas ostavljeni su kao izvor za povratak na stari izgled.
