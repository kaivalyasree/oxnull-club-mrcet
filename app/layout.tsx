import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '0XNULL — Cybersecurity Technology Platform & Research Collective',
  description:
    'Official digital platform for 0XNULL. Seven specialized research domains, hands-on virtualized adversarial laboratories, curated intelligence graphs, and member-led engineering under the Department of Cybersecurity.',
  keywords: [
    '0XNULL',
    'Cybersecurity Platform',
    'Red Team',
    'Blue Team',
    'Digital Forensics',
    'Cryptography',
    'Cloud Security',
    'Security Architecture',
    'Awareness',
    'Department of Cybersecurity'
  ],
  icons: {
    icon: '/assets/0xnull-symbol.png',
    apple: '/assets/0xnull-symbol.png'
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[#151417]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
