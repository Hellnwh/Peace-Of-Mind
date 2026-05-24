import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ClientProviders } from './client-providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MoodCheckInModal } from '@/components/sections/mood-check-in-modal';
import { PageTransition } from '@/components/page-transition';

export const metadata: Metadata = {
  title: 'PeaceMind Sanctuary | Tele-Health for Neurodiversity',
  description: 'A clinical and restorative sanctuary for ADHD, Anxiety, and Neuro-related wellness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </div>
          <MoodCheckInModal />
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
