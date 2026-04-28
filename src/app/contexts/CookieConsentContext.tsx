import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CookiePreferences {
  necessary: boolean;     // Always true, cannot be disabled
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface ConsentRecord {
  timestamp: string;
  action: 'accepted_all' | 'rejected_optional' | 'custom' | 'withdrawn';
  preferences: CookiePreferences;
  userAgent: string;
  ip: string;
}

interface CookieConsentContextType {
  hasConsented: boolean;
  preferences: CookiePreferences;
  consentHistory: ConsentRecord[];
  showBanner: boolean;
  showPreferences: boolean;
  setShowBanner: (v: boolean) => void;
  setShowPreferences: (v: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  saveCustom: (prefs: Partial<CookiePreferences>) => void;
  withdrawConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setHasConsented(true);
        setPreferences(data.preferences || defaultPreferences);
        setConsentHistory(data.history || []);
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const recordConsent = (action: ConsentRecord['action'], prefs: CookiePreferences) => {
    const record: ConsentRecord = {
      timestamp: new Date().toISOString(),
      action,
      preferences: prefs,
      userAgent: navigator.userAgent,
      ip: '192.168.x.x', // mock
    };
    const newHistory = [...consentHistory, record];
    setConsentHistory(newHistory);
    setPreferences(prefs);
    setHasConsented(action !== 'withdrawn');
    localStorage.setItem('cookie_consent', JSON.stringify({ preferences: prefs, history: newHistory }));
  };

  const acceptAll = () => {
    const prefs: CookiePreferences = { necessary: true, analytics: true, functional: true, marketing: true };
    recordConsent('accepted_all', prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const rejectOptional = () => {
    const prefs: CookiePreferences = { necessary: true, analytics: false, functional: false, marketing: false };
    recordConsent('rejected_optional', prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const saveCustom = (custom: Partial<CookiePreferences>) => {
    const prefs: CookiePreferences = { ...defaultPreferences, ...custom, necessary: true };
    recordConsent('custom', prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const withdrawConsent = () => {
    recordConsent('withdrawn', defaultPreferences);
    setShowBanner(true);
  };

  return (
    <CookieConsentContext.Provider value={{
      hasConsented, preferences, consentHistory,
      showBanner, showPreferences,
      setShowBanner, setShowPreferences,
      acceptAll, rejectOptional, saveCustom, withdrawConsent,
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be within CookieConsentProvider');
  return ctx;
}
