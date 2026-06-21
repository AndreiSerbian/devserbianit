import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, Mail, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/data/translations";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { ClientIntakeForm } from "@/components/ClientIntakeForm";
import { Calculator } from "@/components/Calculator";
import { CaseStudies } from "@/components/CaseStudies";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Magnetic } from "@/components/Magnetic";

const Index = () => {
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, default to dark
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang as keyof typeof translations];

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <ProgressIndicator />
      <FloatingParticles />
      <ScrollToTop />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled 
            ? "border-border/60 bg-background/95 backdrop-blur-lg shadow-sm" 
            : "border-transparent bg-background/80 backdrop-blur"
        }`}
      >
        <div className="container flex h-14 md:h-16 items-center justify-between px-4 sm:px-6">
          <motion.div 
            className="flex items-center gap-4 md:gap-8"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm sm:text-base md:text-lg font-bold truncate max-w-[180px] sm:max-w-none">
              Serbian IT Development
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Magnetic strength={0.2}>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {lang === "ru" ? "Услуги" : lang === "ro" ? "Servicii" : "Services"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button 
                onClick={() => scrollToSection('cases')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {lang === "ru" ? "Кейсы" : lang === "ro" ? "Cazuri" : "Cases"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button 
                onClick={scrollToCalculator}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {lang === "ru" ? "Калькулятор" : lang === "ro" ? "Calculator" : "Calculator"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            </Magnetic>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="w-[65px] sm:w-[80px] md:w-[100px] text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">RU</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ro">RO</SelectItem>
              </SelectContent>
            </Select>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-8 w-8 md:h-10 md:w-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg"
            >
              <nav className="container px-4 py-4 flex flex-col gap-3">
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-left text-sm py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {lang === "ru" ? "Услуги" : lang === "ro" ? "Servicii" : "Services"}
                </button>
                <button 
                  onClick={() => scrollToSection('cases')}
                  className="text-left text-sm py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {lang === "ru" ? "Кейсы" : lang === "ro" ? "Cazuri" : "Cases"}
                </button>
                <button 
                  onClick={scrollToCalculator}
                  className="text-left text-sm py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {lang === "ru" ? "Калькулятор" : lang === "ro" ? "Calculator" : "Calculator"}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">
        <Hero 
          title={t.hero.title}
          subtitle={t.hero.subtitle}
          cta={t.hero.cta}
          onCtaClick={scrollToCalculator}
        />
        
        <div id="services">
          <Services title={t.services.title} items={t.services.items} />
        </div>
        
        <ClientIntakeForm translations={t} />
        
        <Calculator translations={t.calculator} lang={lang} theme={theme} />
        
        <div id="cases">
          <CaseStudies title={t.cases.title} items={t.cases.items} lang={lang} />
        </div>
        
        {/* Contact */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="max-w-2xl mx-auto text-center border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">{t.contact.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{t.contact.location}</p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-sm">
                        <a href="mailto:serbiyan012@gmail.com">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                      <Button size="lg" asChild className="w-full sm:w-auto text-sm">
                        <a href="https://t.me/public_serb" target="_blank" rel="noopener noreferrer">
                          <Phone className="mr-2 h-4 w-4" />
                          Telegram
                        </a>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8 border-t border-border/40 bg-secondary/20">
        <div className="container px-4 sm:px-6 text-center text-xs md:text-sm text-muted-foreground">
          <p>&copy; 2024 Serbian IT Development. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
