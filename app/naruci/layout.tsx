import { CartProvider } from './cart';
import './shop.css';
import './customizer.css';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider><div className="shop-page">{children}</div></CartProvider>;
}
