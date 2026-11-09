import type { Metadata } from 'next';
import SweetWorld from './sweet-world';

export const metadata: Metadata = {
  title: 'Slatki svet — palačinke',
  description: 'Šmecine palačinke, čokoladni prelivi i slatki zalogaji. Izaberi svoju palačinku i dodaj je u zajedničku korpu.',
};

export default function PancakesPage() { return <SweetWorld />; }
