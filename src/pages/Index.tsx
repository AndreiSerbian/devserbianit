import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  Menu, Sun, Moon, MessageCircle, ArrowRight,
  ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch,
  CheckCircle2, Mail, Phone, Calculator, Download, Share2
} from "lucide-react";

const Index = () => {
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState("dark");
  const { toast } = useToast();

  // Calculator state
  const [projectType, setProjectType] = useState("ecommerce");
  const [projectSize, setProjectSize] = useState("medium");
  const [urgency, setUrgency] = useState(false);
  const [options, setOptions] = useState({
    auth: false,
    payments: false,
    analytics: false,
    multilingual: false,
    supabase: false,
    telegram: false,
  });

  const translations = {
    ru: {
      hero: {
        title: "Комплексный подход к IT-решениям для бизнеса",
        subtitle: "Не просто «пишем код». Смотрим на продукт и процессы глазами бизнеса.",
        cta: "Рассчитать бюджет"
      },
      calculator: {
        title: "Калькулятор стоимости",
        projectType: "Тип проекта",
        projectSize: "Размер проекта",
        types: {
          ecommerce: "E-commerce решение",
          crm: "CRM/ERP система",
          admin: "Админ-панель",
          telegram: "Telegram-бот",
          integration: "Кастомная интеграция"
        },
        sizes: {
          small: "Малый",
          medium: "Средний",
          large: "Большой"
        },
        options: "Дополнительные опции",
        optionsList: {
          auth: "Авторизация и роли (+16ч)",
          payments: "Платежи (+24ч)",
          analytics: "Аналитика (+10ч)",
          multilingual: "Мультиязычность (+18ч)",
          supabase: "Интеграция Supabase (+20ч)",
          telegram: "Telegram интеграция (+12ч)"
        },
        urgency: "Срочная разработка (+20%)",
        estimate: "Смета проекта",
        hours: "ч",
        rate: "Ставка: €50/ч",
        total: "Итого",
        exportPdf: "Экспорт в PDF",
        sharetelegram: "Отправить в Telegram"
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
      calculator: {
        title: "Cost Calculator",
        projectType: "Project Type",
        projectSize: "Project Size",
        types: {
          ecommerce: "E-commerce Solution",
          crm: "CRM/ERP System",
          admin: "Admin Panel",
          telegram: "Telegram Bot",
          integration: "Custom Integration"
        },
        sizes: {
          small: "Small",
          medium: "Medium",
          large: "Large"
        },
        options: "Additional Options",
        optionsList: {
          auth: "Auth & Roles (+16h)",
          payments: "Payments (+24h)",
          analytics: "Analytics (+10h)",
          multilingual: "Multilingual (+18h)",
          supabase: "Supabase Integration (+20h)",
          telegram: "Telegram Integration (+12h)"
        },
        urgency: "Urgent Development (+20%)",
        estimate: "Project Estimate",
        hours: "h",
        rate: "Rate: €50/h",
        total: "Total",
        exportPdf: "Export PDF",
        sharetelegram: "Share to Telegram"
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

  // Calculator logic
  const projectHours = {
    ecommerce: { small: 60, medium: 120, large: 220 },
    crm: { small: 70, medium: 140, large: 260 },
    admin: { small: 50, medium: 100, large: 180 },
    telegram: { small: 30, medium: 60, large: 100 },
    integration: { small: 40, medium: 90, large: 160 },
  };

  const optionHours = {
    auth: 16,
    payments: 24,
    analytics: 10,
    multilingual: 18,
    supabase: 20,
    telegram: 12,
  };

  const hourlyRate = 50;

  const calculateEstimate = () => {
    const baseHours = projectHours[projectType as keyof typeof projectHours][projectSize as keyof typeof projectHours.ecommerce];
    const additionalHours = Object.entries(options).reduce((sum, [key, value]) => {
      return value ? sum + optionHours[key as keyof typeof optionHours] : sum;
    }, 0);
    const totalHours = baseHours + additionalHours;
    const subtotal = totalHours * hourlyRate;
    const urgencyMultiplier = urgency ? 1.2 : 1;
    const total = subtotal * urgencyMultiplier;
    
    return { baseHours, additionalHours, totalHours, subtotal, total };
  };

  const estimate = calculateEstimate();

  const handleExportPDF = async () => {
    const element = document.getElementById('calculator-estimate');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: theme === 'dark' ? '#1a1d29' : '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`estimate-${projectType}-${projectSize}.pdf`);
      
      toast({
        title: lang === "ru" ? "PDF создан" : "PDF Created",
        description: lang === "ru" ? "Смета успешно экспортирована" : "Estimate exported successfully",
      });
    } catch (error) {
      toast({
        title: lang === "ru" ? "Ошибка" : "Error",
        description: lang === "ru" ? "Не удалось создать PDF" : "Failed to create PDF",
        variant: "destructive",
      });
    }
  };

  const handleShareTelegram = () => {
    const message = `
🧮 ${t.calculator.estimate}

📋 ${t.calculator.projectType}: ${t.calculator.types[projectType as keyof typeof t.calculator.types]}
📏 ${t.calculator.projectSize}: ${t.calculator.sizes[projectSize as keyof typeof t.calculator.sizes]}

⏱ ${t.calculator.hours}: ${estimate.totalHours}${t.calculator.hours}
💰 ${t.calculator.total}: €${estimate.total.toFixed(2)}

${urgency ? '🚀 ' + t.calculator.urgency : ''}

Serbian IT Development
    `.trim();

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://serbian-it.dev')}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    setOptions(prev => ({ ...prev, [option]: checked }));
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

        {/* Calculator */}
        <section className="py-20 bg-secondary/20">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <Calculator className="h-8 w-8 text-primary" />
              {t.calculator.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.calculator.projectType}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>{t.calculator.projectType}</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t.calculator.types).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>{t.calculator.projectSize}</Label>
                    <Select value={projectSize} onValueChange={setProjectSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t.calculator.sizes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold">{t.calculator.options}</Label>
                    <div className="space-y-3">
                      {Object.entries(t.calculator.optionsList).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox 
                            id={key} 
                            checked={options[key as keyof typeof options]}
                            onCheckedChange={(checked) => handleOptionChange(key, checked as boolean)}
                          />
                          <Label htmlFor={key} className="text-sm font-normal cursor-pointer">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Checkbox 
                      id="urgency" 
                      checked={urgency}
                      onCheckedChange={(checked) => setUrgency(checked as boolean)}
                    />
                    <Label htmlFor="urgency" className="text-sm font-medium cursor-pointer">{t.calculator.urgency}</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Estimate */}
              <Card id="calculator-estimate" className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">{t.calculator.estimate}</CardTitle>
                  <CardDescription>{t.calculator.rate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.calculator.types[projectType as keyof typeof t.calculator.types]} ({t.calculator.sizes[projectSize as keyof typeof t.calculator.sizes]})</span>
                      <span className="font-medium">{estimate.baseHours}{t.calculator.hours}</span>
                    </div>
                    
                    {estimate.additionalHours > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.calculator.options}</span>
                        <span className="font-medium">+{estimate.additionalHours}{t.calculator.hours}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">{t.calculator.hours}</span>
                      <span className="font-bold text-lg">{estimate.totalHours}{t.calculator.hours}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">€{estimate.subtotal.toFixed(2)}</span>
                    </div>
                    
                    {urgency && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400">
                        <span>{t.calculator.urgency}</span>
                        <span className="font-medium">+€{(estimate.total - estimate.subtotal).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-primary/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">{t.calculator.total}</span>
                      <span className="text-3xl font-bold text-primary">€{estimate.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleExportPDF} variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      {t.calculator.exportPdf}
                    </Button>
                    <Button onClick={handleShareTelegram} className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      {t.calculator.sharetelegram}
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
