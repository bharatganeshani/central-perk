import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Central Perk | Academic & Skill Security Verification System',
  description: 'AI-powered profile and credential verification system. Detects resume AI fabrication, validates cryptographic signatures, and maps portfolio plagiarism.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.08),rgba(255,255,255,0))]" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
