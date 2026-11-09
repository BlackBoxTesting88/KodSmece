import './shop.css';
import './customizer.css';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <div className="shop-page">{children}</div>;
}
