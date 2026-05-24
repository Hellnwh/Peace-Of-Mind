"use client"

import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="peacemind-theme">
      <FirebaseClientProvider>
        {children}
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
