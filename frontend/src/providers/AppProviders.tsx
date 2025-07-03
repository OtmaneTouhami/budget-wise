import React from 'react';
import { TanstackProvider } from './TanstackProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <TanstackProvider>{children}</TanstackProvider>;
};
