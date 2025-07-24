import { ReactNode } from 'react';
import type { Metadata } from 'next';
import AppProviders from '@/providers/AppProviders';

export const metadata: Metadata = {
  title: 'Mindweave',
  description: 'Your own creativity space',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
