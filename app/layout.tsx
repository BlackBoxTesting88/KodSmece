import type { Metadata, Viewport } from 'next';
import './globals.css';
import './brand.css';

export const metadata: Metadata = {
  title: { default: 'Kod Šmece — Valjevo', template: '%s | Kod Šmece' },
  description: 'Giros, burgeri, palačinke i još mnogo toga. Kod Šmece, Karađorđeva 145, Valjevo.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#070707' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,800;0,900;1,900&family=Oleo+Script:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body id="vrh">{children}</body>
    </html>
  );
}
