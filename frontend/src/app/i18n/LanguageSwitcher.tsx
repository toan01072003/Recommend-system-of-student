import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LANGUAGE_META, type Language } from "./dictionary";
import { useLanguage } from "./LanguageProvider";

const languageOrder: Language[] = ["vi", "en"];

export const LanguageSwitcher = ({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) => {
  const { language, setLanguage, t } = useLanguage();
  const isDark = variant === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("Ngôn ngữ")}
          title={t("Ngôn ngữ")}
          className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-colors ${
            isDark
              ? "bg-white/15 text-white hover:bg-white/25"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Languages size={16} />
          <span>{LANGUAGE_META[language].shortLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {languageOrder.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => setLanguage(item)}
            className="cursor-pointer justify-between"
          >
            <span>{LANGUAGE_META[item].label}</span>
            {language === item && <Check size={14} className="text-orange-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

