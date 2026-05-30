"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang } from "../lib/translations";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("harpia-lang");
    if (saved === "es") setLangState("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("harpia-lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
