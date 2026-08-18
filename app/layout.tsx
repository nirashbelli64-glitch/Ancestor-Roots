import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import '../components/ui/SoftAurora.css';
import { SessionProvider } from '@/components/providers/SessionContext';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Ancestor's Test — Roots Edition (AR)",
  description:
    'A cinematic AI heritage storytelling experience. Point your camera at family heirlooms, converse with ancestral memory, and unearth provenance-labeled blessings.',
  keywords: ['AR Heritage', 'Oral History', 'AI Storytelling', 'Groq AI', 'Family Heirlooms', 'Cultural Lineage'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${cinzel.variable} ${inter.variable}`}>
      <body className="bg-[#0A0612] text-neutral-100 min-h-screen relative overflow-x-hidden select-none font-sans antialiased">
        {/* Film grain texture */}
        <div className="film-grain" aria-hidden="true" />

        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
