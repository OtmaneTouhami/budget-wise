import React from 'react';
import { TanstackProvider } from './TanstackProvider';
import { Toaster } from '@/components/ui/sonner';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanstackProvider>
      {children}
      <Toaster />
    </TanstackProvider>
  );
};