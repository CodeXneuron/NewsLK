import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'NewsLK Live - Breaking News from Sri Lanka',
  description: 'Your trusted source for live breaking news, updates, and alerts from Sri Lanka. Stay informed with real-time news coverage.',
  keywords: ['Sri Lanka news', 'breaking news', 'live news', 'news alerts', 'Lanka news'],
  authors: [{ name: 'NewsLK' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'NewsLK Live - Breaking News from Sri Lanka',
    description: 'Your trusted source for live breaking news from Sri Lanka',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsLK Live',
    description: 'Breaking news from Sri Lanka',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF9933',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
