'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0d1117',
            color: '#faf7f2',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#c8941e', secondary: '#faf7f2' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#faf7f2' },
          },
        }}
      />
    </SessionProvider>
  );
}
