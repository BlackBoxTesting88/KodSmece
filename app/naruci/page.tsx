import type { Metadata } from 'next';
import Shop from './shop';

export const metadata: Metadata = { title: 'Naruči' };

export default function ShopPage() {
  return <Shop />;
}
