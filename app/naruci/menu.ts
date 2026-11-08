// Probni artikli, sastavi i cene u RSD. Zameniti potvrđenim jelovnikom i receptima pre aktivacije porudžbina.
export type Category = 'burgeri' | 'giros' | 'palacinke';

export type MenuItem = {
  id: string;
  category: Category;
  name: string;
  price: number;
  photo: string;
  description: string;
  ingredients: string[];
};

export const menu: MenuItem[] = [
  { id: 'burger-klasik', category: 'burgeri', name: 'Klasični burger', price: 690, photo: '27.webp', description: "Klasična kombinacija u tostiranoj zemički.", ingredients: ["Zemička", "Pljeskavica", "Zelena salata", "Paradajz", "Crveni luk", "Burger sos"] },
  { id: 'burger-sir', category: 'burgeri', name: 'Burger sa sirom', price: 790, photo: '08.webp', description: "Burger sa topljenim sirom i svežim povrćem.", ingredients: ["Zemička", "Pljeskavica", "Sir", "Zelena salata", "Paradajz", "Crveni luk", "Burger sos"] },
  { id: 'burger-dupli', category: 'burgeri', name: 'Dupli burger', price: 990, photo: '28.webp', description: "Dve pljeskavice sa sirom u jednoj zemički.", ingredients: ["Zemička", "Dve pljeskavice", "Sir", "Zelena salata", "Paradajz", "Crveni luk", "Burger sos"] },
  { id: 'burger-obrok', category: 'burgeri', name: 'Burger obrok', price: 890, photo: '17.webp', description: "Burger uz porciju pomfrita.", ingredients: ["Zemička", "Pljeskavica", "Sir", "Zelena salata", "Paradajz", "Burger sos", "Pomfrit"] },
  { id: 'burger-specijal', category: 'burgeri', name: 'Burger specijal', price: 1090, photo: '31.webp', description: "Bogato punjen burger sa sirom i prelivom.", ingredients: ["Zemička sa susamom", "Pljeskavica", "Sir", "Zelena salata", "Crveni luk", "Burger sos"] },
  { id: 'burger-hrskavi', category: 'burgeri', name: 'Hrskavi burger', price: 850, photo: '32.webp', description: "Hrskavo punjenje sa povrćem u zemički.", ingredients: ["Zemička", "Pohovano punjenje", "Zelena salata", "Paradajz", "Crveni luk", "Kiseli krastavčići", "Sos"] },

  { id: 'giros-pita', category: 'giros', name: 'Giros u piti', price: 590, photo: '29.webp', description: "Giros sa pomfritom i povrćem u piti.", ingredients: ["Pita", "Giros meso", "Pomfrit", "Paradajz", "Crveni luk", "Sos"] },
  { id: 'giros-veliki', category: 'giros', name: 'Veliki giros', price: 740, photo: '24.webp', description: "Veća porcija girosa sa prilozima.", ingredients: ["Pita", "Giros meso", "Pomfrit", "Paradajz", "Zelena salata", "Crveni luk", "Sos"] },
  { id: 'giros-tanjir', category: 'giros', name: 'Giros na tanjiru', price: 890, photo: '20.webp', description: "Giros poslužen uz pomfrit i povrće.", ingredients: ["Giros meso", "Pomfrit", "Paradajz", "Zelena salata", "Crveni luk", "Kukuruz", "Sos"] },
  { id: 'giros-lepinja', category: 'giros', name: 'Giros u lepinji', price: 650, photo: '18.webp', description: "Giros u toploj lepinji sa povrćem.", ingredients: ["Lepinja", "Giros meso", "Paradajz", "Crveni luk", "Zelena salata", "Sos"] },
  { id: 'giros-poneti', category: 'giros', name: 'Giros za poneti', price: 620, photo: '25.webp', description: "Giros u piti, upakovan za poneti.", ingredients: ["Pita", "Giros meso", "Pomfrit", "Paradajz", "Crveni luk", "Sos"] },
  { id: 'giros-specijal', category: 'giros', name: 'Giros specijal', price: 790, photo: '35.webp', description: "Giros sa prilozima i dodatnim prelivom.", ingredients: ["Pita", "Giros meso", "Pomfrit", "Paradajz", "Zelena salata", "Crveni luk", "Sos"] },

  { id: 'palacinka-cokolada', category: 'palacinke', name: 'Čokoladna palačinka', price: 460, photo: '07.webp', description: "Slatka palačinka sa čokoladnim prelivom.", ingredients: ["Palačinka", "Čokoladni krem", "Mleveni keks", "Voćni preliv"] },
  { id: 'palacinka-keks', category: 'palacinke', name: 'Palačinka sa keksom', price: 520, photo: '10.webp', description: "Čokoladni i beli preliv sa mrvicama keksa.", ingredients: ["Palačinka", "Čokoladni krem", "Beli krem", "Mleveni keks", "Čokoladni keks"] },
  { id: 'palacinka-rolovana', category: 'palacinke', name: 'Rolovana palačinka', price: 590, photo: '02.webp', description: "Rolovana palačinka sa kremom i keksom.", ingredients: ["Palačinka", "Čokoladni krem", "Beli krem", "Mleveni keks", "Čokoladni preliv"] },
  { id: 'palacinka-poneti', category: 'palacinke', name: 'Palačinka za poneti', price: 490, photo: '03.webp', description: "Rolovana slatka palačinka u kutiji.", ingredients: ["Palačinka", "Čokoladni krem", "Beli krem", "Mleveni keks", "Čokoladna dekoracija"] },
  { id: 'palacinka-dva-preliva', category: 'palacinke', name: 'Palačinka sa dva preliva', price: 550, photo: '16.webp', description: "Dva kremasta preliva i mrvljeni keks.", ingredients: ["Palačinka", "Čokoladni krem", "Beli krem", "Mleveni keks"] },
  { id: 'palacinka-klasik', category: 'palacinke', name: 'Klasična palačinka', price: 390, photo: '30.webp', description: "Jednostavna slatka palačinka sa kremom.", ingredients: ["Palačinka", "Čokoladni krem", "Mleveni keks"] },
  { id: 'palacinka-povrce', category: 'palacinke', name: 'Palačinka sa povrćem', price: 620, photo: '06.webp', description: "Slana palačinka sa povrćem i prelivom.", ingredients: ["Palačinka", "Zelena salata", "Kukuruz", "Paprika", "Beli sos"] },
  { id: 'palacinka-slana', category: 'palacinke', name: 'Slana palačinka', price: 590, photo: '11.webp', description: "Slana palačinka sa kremastim punjenjem.", ingredients: ["Palačinka", "Sir", "Pavlaka", "Začini", "Preliv"] },
  { id: 'palacinke-porcija', category: 'palacinke', name: 'Rolovane palačinke — porcija', price: 690, photo: '13.webp', description: "Porcija rolanih palačinki za deljenje.", ingredients: ["Palačinke", "Krem punjenje"] },
];
