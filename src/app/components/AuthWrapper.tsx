import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';

export function AuthWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
