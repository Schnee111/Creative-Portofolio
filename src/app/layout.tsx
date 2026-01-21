import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Mono, Geist } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm',
});

export const metadata: Metadata = {
  title: {
    default: 'Muhammad Daffa Maarif | Portfolio',
    template: '%s | Muhammad Daffa Maarif',
  },
  description: 'Immersive Creative Developer Experience focusing on modern web technologies.',
  openGraph: {
    title: 'Muhammad Daffa Maarif | Portfolio',
    description: 'Explore the creative work and technical expertise of Muhammad Daffa Maarif.',
    url: './',
    siteName: 'Muhammad Daffa Maarif Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Daffa Maarif | Portfolio',
    description: 'Explore the creative work and technical expertise of Muhammad Daffa Maarif.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
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