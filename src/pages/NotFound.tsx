import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/context/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { lang, t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Seo
        title={t.seo.notFoundTitle}
        description={t.seo.notFoundDescription}
        lang={lang}
        index={false}
      />
      <div className="text-center">
        <h1 className="font-display mb-4 text-4xl font-semibold uppercase tracking-tight">404</h1>
        <p className="mb-6 text-base text-muted-foreground">{t.seo.notFoundDescription}</p>
        <Button asChild className="rounded-none font-display uppercase tracking-[0.08em]">
          <Link to={`/${lang}`}>{t.nav.contact}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
