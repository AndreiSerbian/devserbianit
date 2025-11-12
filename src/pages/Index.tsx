import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, Mail, Phone } from "lucide-react";
import { translations } from "@/data/translations";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { ClientIntakeForm } from "@/components/ClientIntakeForm";
import { Calculator } from "@/components/Calculator";
import { CaseStudies } from "@/components/CaseStudies";

const Index = () => {
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState("dark");

  const t = translations[lang as keyof typeof translations];

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4 md:gap-8">
            <span className="text-base md:text-lg font-bold truncate">Serbian IT Development</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="w-[80px] md:w-[100px] text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">RU</SelectItem>
                <SelectItem value="en">EN</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-8 w-8 md:h-10 md:w-10">
              {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero 
          title={t.hero.title}
          subtitle={t.hero.subtitle}
          cta={t.hero.cta}
          onCtaClick={scrollToCalculator}
        />
        
        <Services title={t.services.title} items={t.services.items} />
        
        <ClientIntakeForm translations={t} />
        
        <Calculator translations={t.calculator} lang={lang} theme={theme} />
        
        <CaseStudies title={t.cases.title} items={t.cases.items} />
        
        {/* Contact */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container px-4">
            <Card className="max-w-2xl mx-auto text-center border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl">{t.contact.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <p className="text-sm md:text-base text-muted-foreground">{t.contact.location}</p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <a href="mailto:contact@serbian-it.dev">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer">
                      <Phone className="mr-2 h-4 w-4" />
                      Telegram
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8 border-t border-border/40 bg-secondary/20">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>&copy; 2024 Serbian IT Development. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
