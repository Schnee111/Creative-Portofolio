import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Mono, Geist } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

// 1. Font untuk Display (Judul Besar)
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
});

// 2. Font untuk Body (Geist)
const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist',
});

// 3. Font untuk Logs/Monospace (IBM Plex Mono)
const ibmPlexMono = IBM_Plex_Mono({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm',
});

export const metadata: Metadata = {
  title: 'DAFFA | Portfolio',
  description: 'Immersive Creative Developer Experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased selection:bg-blue-500/30">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}