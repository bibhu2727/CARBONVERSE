import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carbonverse: The Climate RPG',
  description: 'A venture-backed behavior change platform. Save the planet, level up your life.',
  manifest: '/manifest.json', // Placeholder for PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="aurora-bg"></div>
        {children}
      </body>
    </html>
  );
}
