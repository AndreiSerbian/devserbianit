import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, Menu, X, Send, Mail, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brand, type Lang } from "@/data/translations";
import { useLanguage } from "@/context/LanguageContext";
import { Seo } from "@/components/Seo";
import { BrandLockup } from "@/components/brand";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { ContactForm } from "@/components/ContactForm";
import { CaseStudies } from "@/components/CaseStudies";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ScrollToTop } from "@/components/ScrollToTop";
import { trackEvent } from "@/lib/analytics";

const Index = () => {
  const { lang, setLang, t } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250);
  };

  const navItems = [
    { id: "services", label: t.nav.services },
    { id: "cases", label: t.nav.cases },
    { id: "process", label: t.nav.process },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={t.seo.title}
        description={t.seo.description}
        lang={lang}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Andrei Serbian — IT Solutions",
          description: t.seo.description,
          areaServed: ["MD", "EU"],
          email: brand.email,
          sameAs: [brand.telegram],
        }}
      />
      <ProgressIndicator />
      <ScrollToTop />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
          isScrolled ? "border-border bg-background/95 backdrop-blur" : "border-border/60 bg-background"
        }`}
      >
        <div className="container flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <Link to={`/${lang}`} className="min-w-0" aria-label="Andrei Serbian — IT Solutions">
            <BrandLockup compact name={brand.name} descriptor={brand.descriptor} />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden sm:inline-flex rounded-none font-display uppercase tracking-[0.08em]"
              onClick={() => {
                trackEvent("cta_nav_click", { locale: lang });
                scrollToSection("contact-form");
              }}
            >
              {t.nav.cta}
            </Button>

            <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
              <SelectTrigger className="w-[68px] h-9 text-xs rounded-none" aria-label="Language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">RU</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ro">RO</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme((p) => (p === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={t.nav.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background overflow-hidden"
            >
              <nav className="container px-4 py-4 flex flex-col" aria-label="Mobile">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-sm uppercase tracking-[0.14em] py-3 border-b border-border/60 text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  className="mt-4 rounded-none font-display uppercase tracking-[0.08em]"
                  onClick={() => scrollToSection("contact-form")}
                >
                  {t.nav.cta}
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="flex-1">
        <Hero
          title={t.hero.title}
          subtitle={t.hero.subtitle}
          cta={t.hero.cta}
          ctaSecondary={t.hero.ctaSecondary}
          specializations={t.hero.specializations}
          diagramLabels={t.hero.diagram}
          onCtaClick={() => {
            trackEvent("cta_hero_click", { locale: lang });
            scrollToSection("contact-form");
          }}
          onSecondaryClick={() => scrollToSection("cases")}
        />

        <div id="services">
          <Services title={t.services.title} items={t.services.items} />
        </div>

        <div id="cases">
          <CaseStudies title={t.cases.title} items={t.cases.items} lang={lang} />
        </div>

        <Process title={t.process.title} steps={t.process.steps} />

        <ContactForm t={t.form} lang={lang} />

        <section id="contact" className="py-16 md:py-24">
          <div className="container px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="text-primary mr-3">05</span>
              {t.contact.title}
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl">{t.contact.subtitle}</p>

            <div className="mt-8 grid sm:grid-cols-2 gap-px bg-border border border-border max-w-3xl">
              <a
                href={brand.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("telegram_click", { locale: lang })}
                className="bg-card p-6 flex items-center justify-between gap-4 hover:bg-surface-raised transition-colors group"
              >
                <span className="flex items-center gap-4 min-w-0">
                  <Send className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t.contact.telegramLabel}
                    </span>
                    <span className="block font-medium truncate">{brand.telegramHandle}</span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href={`mailto:${brand.email}`}
                onClick={() => trackEvent("email_click", { locale: lang })}
                className="bg-card p-6 flex items-center justify-between gap-4 hover:bg-surface-raised transition-colors group"
              >
                <span className="flex items-center gap-4 min-w-0">
                  <Mail className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t.contact.emailLabel}
                    </span>
                    <span className="block font-medium truncate">{brand.email}</span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t.contact.location}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <BrandLockup name={brand.name} descriptor={brand.descriptor} />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;