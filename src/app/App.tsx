import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsentBanner } from './components/shared/CookieConsentBanner';
import { CookiePreferencesDialog } from './components/shared/CookiePreferencesDialog';

export default function App() {
  return (
    <AuthProvider>
      <CookieConsentProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
        <CookieConsentBanner />
        <CookiePreferencesDialog />
      </CookieConsentProvider>
    </AuthProvider>
  );
}
