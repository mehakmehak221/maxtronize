import type { Metadata } from 'next';
import { DM_Sans, Sora } from 'next/font/google';
import './globals.css';
import './tk-tokenomics.css';
import './tk-web3-fx.css';
import './te-layout.css';
import './te-modern.css';
import './te-animations.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MAXTRON Tokenomics — Supply, Allocation, Vesting & Utility',
  description:
    'Complete MAXTRON tokenomics: 1B fixed supply, allocation breakdown, vesting schedules, utility mechanics, governance, economic model and transparency.',
  keywords: ['MAXTRON', 'Shield Token', 'RWA', 'tokenomics', 'real estate', 'blockchain'],
  openGraph: {
    title: 'MAXTRON — The Shield Token',
    description:
      'The utility and compliance token powering the next generation of real-world asset tokenization.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: 'var(--font-dm-sans, system-ui), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
