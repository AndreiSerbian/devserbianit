import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calculator } from "@/components/Calculator";
import { Seo } from "@/components/Seo";
import { BrandLockup } from "@/components/brand";
import { useLanguage } from "@/context/LanguageContext";
import { brand } from "@/data/translations";
import { trackEvent } from "@/lib/analytics";
import { useTheme } from "@/hooks/useTheme";

const CalculatorPage = () => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    trackEvent("calculator_open", { locale: lang });
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={`${t.calculator.title} — ${brand.name}`}
        description={t.seo.description}
        lang={lang}
        path="/calculator"
        index={false}
      />
      <header className="border-b border-border">
        <div className="container px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to={`/${lang}`} className="min-w-0">
            <BrandLockup compact name={brand.name} descriptor={brand.descriptor} />
          </Link>
          <Button variant="ghost" size="sm" asChild className="rounded-none">
            <Link to={`/${lang}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.nav.contact}
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <Calculator translations={t.calculator} lang={lang} theme={theme} />
      </main>
    </div>
  );
};

export default CalculatorPage;