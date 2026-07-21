import { Languages } from "lucide-react";
import { LANGUAGE_META } from "./dictionary";
import { useLanguage } from "./LanguageProvider";

export const LanguageSwitcher = ({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const isDark = variant === "dark";
  const nextLanguage = language === "vi" ? "en" : "vi";
  const title = `${t("Ngôn ngữ")}: ${LANGUAGE_META[nextLanguage].label}`;

  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={toggleLanguage}
      className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-colors ${
        isDark
          ? "bg-white/15 text-white hover:bg-white/25"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Languages size={16} />
      <span>{LANGUAGE_META[language].shortLabel}</span>
    </button>
  );
};
