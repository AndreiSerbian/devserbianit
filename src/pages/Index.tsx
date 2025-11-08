import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Menu, Sun, Moon, MessageCircle, ArrowRight,
  ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch,
  CheckCircle2, Mail, Phone
} from "lucide-react";

const Index = () => {
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState("dark");

  const translations = {
    ru: {
      hero: {
        title: "Комплексный подход к IT-решениям для бизнеса",
        subtitle: "Не просто «пишем код». Смотрим на продукт и процессы глазами бизнеса.",
        cta: "Рассчитать бюджет"
      },
      services: {
        title: "Что мы делаем",
        items: [
          { title: "E-commerce решения", desc: "Каталоги, корзина, оплата, скидки — ориентир на конверсию." },
          { title: "CRM / внутренние панели", desc: "Процессы, роли и доступы под вашу операционку." },
          { title: "Админ-панели", desc: "Удобный контроль контента, заказов и команд." },
          { title: "Telegram-боты", desc: "Оповещения, заявки и внешние интеграции." },
          { title: "Интеграции с Supabase", desc: "Хранилище, роли, функции, email." },
          { title: "Аудит и архитектура", desc: "Разбор решения и дорожная карта." }
        ]
      },
      cases: {
        title: "Кейсы",
        items: [
          {
            name: "FoodSaur",
            desc: "Маркетплейс для локальных производителей с админ-панелью и ролями.",
            features: ["Каталоги и расписания", "Админ-панель с RLS", "Telegram уведомления"],
            result: "Меньше ручных ошибок, быстрее обработка"
          },
          {
            name: "SMT Premium Box",
            desc: "Оптовый e-commerce для подарочных коробок с вариациями.",
            features: ["Карточки с вариациями", "Предзаказ", "Email-подтверждение"],
            result: "Сокращение времени обработки B2B"
          },
          {
            name: "Вместе сильнее",
            desc: "Сайт инклюзивного пространства для мам и детей в Молдове.",
            features: ["Календарь событий", "Формы волонтёров", "База ресурсов"],
            result: "Удобная точка входа для семей"
          }
        ]
      },
      contact: {
        title: "Готовы обсудить?",
        location: "Молдова, ЕС, Россия • Remote"
      }
    },
    en: {
      hero: {
        title: "Comprehensive IT Solutions for Business",
        subtitle: "Beyond coding: business lens from hypothesis to results.",
        cta: "Calculate Budget"
      },
      services: {
        title: "What we do",
        items: [
          { title: "E-commerce solutions", desc: "Catalogs, cart, payments, discounts — focused on conversion." },
          { title: "CRM / internal panels", desc: "Processes, roles, access aligned with operations." },
          { title: "Admin panels", desc: "Clear control over content, orders, teams." },
          { title: "Telegram bots", desc: "Notifications, requests, integrations." },
          { title: "Supabase integrations", desc: "Storage, roles, functions, email." },
          { title: "Audit & architecture", desc: "Assessment and roadmap." }
        ]
      },
      cases: {
        title: "Case Studies",
        items: [
          {
            name: "FoodSaur",
            desc: "Marketplace for local producers with admin panel and roles.",
            features: ["Catalogs & schedules", "Admin with RLS", "Telegram notifications"],
            result: "Fewer errors, faster processing"
          },
          {
            name: "SMT Premium Box",
            desc: "Wholesale e-commerce for gift boxes with variants.",
            features: ["Variant cards", "Pre-order", "Email confirmation"],
            result: "Reduced B2B processing time"
          },
          {
            name: "Together Stronger",
            desc: "Website for inclusive space initiative in Moldova.",
            features: ["Events calendar", "Volunteer forms", "Resources base"],
            result: "Clear entry point for families"
          }
        ]
      },
      contact: {
        title: "Ready to talk?",
        location: "Moldova, EU, Russia • Remote"
      }
    }
  };

  const t = translations[lang as keyof typeof translations];
  const icons = [ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch];

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold">Serbian IT Development</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">RU</SelectItem>
                <SelectItem value="en">EN</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 dark:from-[hsl(var(--gradient-hero-start))] dark:to-[hsl(var(--gradient-hero-end))]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgMTB2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10 dark:opacity-20"></div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-sm">{t.hero.title}</h1>
              <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto">{t.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="group shadow-lg hover:shadow-xl transition-shadow">
                  {t.hero.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="secondary" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                  <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Telegram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-secondary/20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.services.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.services.items.map((item, idx) => {
                const Icon = icons[idx];
                return (
                  <Card key={idx} className="card-hover border-border/50">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{item.desc}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cases */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.cases.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.cases.items.map((item, idx) => (
                <Card key={idx} className="card-hover">
                  <CardHeader>
                    <CardTitle className="text-2xl">{item.name}</CardTitle>
                    <CardDescription className="text-base pt-2">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-sm font-medium text-primary">{item.result}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 bg-secondary/20">
          <div className="container max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.contact.title}</h2>
            <p className="text-muted-foreground mb-8 text-lg">{t.contact.location}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Telegram
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:contact@serbian-it.dev">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 bg-secondary/20">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Serbian IT Development. Professional IT solutions for business.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
