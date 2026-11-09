import type { Metadata } from 'next';
import Home from '../home';

export const metadata: Metadata = { title: 'The King of Gyros' };
export default function GirosPage() { return <Home />; }
