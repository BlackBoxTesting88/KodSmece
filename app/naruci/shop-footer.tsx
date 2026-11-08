import Link from 'next/link';
import SocialIcons from '../components/social-icons';
import BrandLogo from '../components/brand-logo';

export default function ShopFooter() {
  return (
    <footer className="shop-footer">
      <Link href="/" aria-label="Kod Šmece, početna"><BrandLogo /></Link>
      <span>Karađorđeva 145 · Valjevo</span>
      <a href="tel:+381649334933">064 9334 933</a>
      <SocialIcons />
    </footer>
  );
}
