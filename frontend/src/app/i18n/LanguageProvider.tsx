import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LANGUAGE_META,
  LANGUAGE_STORAGE_KEY,
  formatDate,
  formatDateTime,
  formatTime,
  translateStaticText,
  type Language,
} from "./dictionary";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (value: string) => string;
  formatDate: (
    value: string | number | Date,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatDateTime: (
    value: string | number | Date,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatTime: (
    value: string | number | Date,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isLanguage = (value: string | null): value is Language =>
  value === "vi" || value === "en";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "vi";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguage(stored) ? stored : "vi";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const next = current === "vi" ? "en" : "vi";
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANGUAGE_META[language].htmlLang;
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: (text) => translateStaticText(text, language),
      formatDate: (value, options) => formatDate(value, language, options),
      formatDateTime: (value, options) =>
        formatDateTime(value, language, options),
      formatTime: (value, options) => formatTime(value, language, options),
    }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const useT = () => useLanguage().t;
