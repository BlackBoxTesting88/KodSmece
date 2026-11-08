import type { Metadata } from 'next';
import Checkout from './checkout';

export const metadata: Metadata = { title: 'Tvoja porudžbina' };

export default function CheckoutPage() {
  return <Checkout />;
}
