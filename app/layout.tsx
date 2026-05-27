import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'GenerateID — Beautiful ID Cards in Seconds',
  description:
    'Create stunning, customizable ID cards for any purpose. Export for social media or print.',
  openGraph: {
    title: 'GenerateID — Beautiful ID Cards in Seconds',
    description:
      'Create stunning, customizable ID cards for any purpose. Export for social media or print.',
    images: [
      {
        url: '/asset/generateid_socialpreview.png',
        width: 1200,
        height: 630,
        alt: 'GenerateID — Beautiful ID Cards in Seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenerateID — Beautiful ID Cards in Seconds',
    description:
      'Create stunning, customizable ID cards for any purpose. Export for social media or print.',
    images: ['/asset/generateid_socialpreview.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
