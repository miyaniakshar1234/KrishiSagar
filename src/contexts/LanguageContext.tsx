import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Initialize the language from the router locale or localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    const currentLocale = router.locale as Language;
    
    if (savedLanguage && ['en', 'hi', 'gu'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else if (currentLocale && ['en', 'hi', 'gu'].includes(currentLocale)) {
      setLanguageState(currentLocale);
    }
  }, [router.locale]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 