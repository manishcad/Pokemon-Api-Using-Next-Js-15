import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Pokemon API Explorer - Discover and Explore Pokemon Data",
    template: "%s | Pokemon API Explorer"
  },
  description: "Interactive Pokemon API explorer built with Next.js 15. Search, browse, and explore Pokemon data with detailed information, stats, abilities, and sprites.",
  keywords: ["Pokemon", "API", "Next.js", "React", "Pokemon data", "Pokemon search", "Pokemon explorer", "PokeAPI"],
  authors: [{ name: "Pokemon API Explorer" }],
  creator: "Pokemon API Explorer",
  publisher: "Pokemon API Explorer",
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
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pokemon-api-explorer.vercel.app/',
    title: 'Pokemon API Explorer - Discover and Explore Pokemon Data',
    description: 'Interactive Pokemon API explorer built with Next.js 15. Search, browse, and explore Pokemon data with detailed information, stats, abilities, and sprites.',
    siteName: 'Pokemon API Explorer',
    images: [
      {
        url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        width: 1200,
        height: 630,
        alt: 'Pokemon API Explorer - Pikachu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon API Explorer - Discover and Explore Pokemon Data',
    description: 'Interactive Pokemon API explorer built with Next.js 15. Search, browse, and explore Pokemon data with detailed information, stats, abilities, and sprites.',
    images: ['https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'],
    creator: '@pokemon_api_explorer',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://pokemon-api-explorer.vercel.app/',
  },
  category: 'technology',
  classification: 'Pokemon API Explorer',
  other: {
    'theme-color': '#3B82F6',
    'color-scheme': 'light',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Pokemon API Explorer',
    'application-name': 'Pokemon API Explorer',
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
