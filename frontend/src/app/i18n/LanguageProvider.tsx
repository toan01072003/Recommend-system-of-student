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

const textNodeOriginals = new WeakMap<Text, string>();
const translatedAttributeNames = ["placeholder", "title", "aria-label", "alt"];

const shouldSkipNode = (node: Node) => {
  const element =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;

  if (!element) return true;
  return Boolean(
    element.closest(
      "script,style,textarea,input,code,pre,[contenteditable='true'],[data-i18n-ignore]",
    ),
  );
};

const translateElementAttributes = (element: Element, language: Language) => {
  translatedAttributeNames.forEach((name) => {
    const dataName = `data-i18n-original-${name}`;
    const saved = element.getAttribute(dataName);

    if (language === "vi") {
      if (saved !== null) {
        if (element.getAttribute(name) !== saved) {
          element.setAttribute(name, saved);
        }
        element.removeAttribute(dataName);
      }
      return;
    }

    const current = element.getAttribute(name);
    const expectedFromSaved =
      saved === null ? null : translateStaticText(saved, language);
    const source =
      saved !== null && current === expectedFromSaved ? saved : current;
    if (!source) return;
    const translated = translateStaticText(source, language);
    if (translated === source) return;

    if (saved === null || source !== saved) element.setAttribute(dataName, source);
    if (current !== translated) element.setAttribute(name, translated);
  });
};

const translateTextNode = (node: Text, language: Language) => {
  if (shouldSkipNode(node)) return;

  const saved = textNodeOriginals.get(node);
  if (language === "vi") {
    if (saved !== undefined) {
      if (node.nodeValue !== saved) node.nodeValue = saved;
      textNodeOriginals.delete(node);
    }
    return;
  }

  const current = node.nodeValue ?? "";
  const expectedFromSaved =
    saved === undefined ? undefined : translateStaticText(saved, language);
  const source =
    saved !== undefined && current === expectedFromSaved ? saved : current;
  const translated = translateStaticText(source, language);
  if (translated === source) return;

  if (saved === undefined || source !== saved) textNodeOriginals.set(node, source);
  if (current !== translated) node.nodeValue = translated;
};

const translateDom = (root: ParentNode, language: Language) => {
  if (root instanceof Element) translateElementAttributes(root, language);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
  );

  let current = walker.currentNode;
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      translateTextNode(current as Text, language);
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(current as Element, language);
    }
    current = walker.nextNode();
  }
};

const DomTranslator = ({ language }: { language: Language }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const run = () => translateDom(document.body, language);
    run();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target as Text, language);
          continue;
        }

        if (
          mutation.type === "attributes" &&
          mutation.target instanceof Element
        ) {
          translateElementAttributes(mutation.target, language);
          continue;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node as Text, language);
          } else if (node instanceof Element) {
            translateDom(node, language);
          }
        });
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: translatedAttributeNames,
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
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

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <DomTranslator language={language} />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const useT = () => useLanguage().t;
