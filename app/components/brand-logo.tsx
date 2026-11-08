import { assetPath } from '../asset-path';

export default function BrandLogo({ sweet = false }: { sweet?: boolean }) {
  return <img className={`brand-logo${sweet ? ' brand-logo-sweet' : ''}`}
    src={assetPath(sweet ? '/assets/brand-crepes.jpg' : '/assets/brand-gyros.jpg')}
    alt={sweet ? 'Kod Šmece - crêpes & coffee' : 'Kod Šmece - The King of Gyros'}
    width={sweet ? 2958 : 3339} height={sweet ? 957 : 1294} />;
}
