import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionContext';

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
    <html lang="en" className="dark">
      <body className="bg-charcoal text-neutral-100 min-h-screen relative overflow-x-hidden select-none font-sans">
        {/* Film grain texture */}
        <div className="film-grain" aria-hidden="true" />

        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
