import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Lightbulb, 
  Wrench,
  CheckCircle2,
  Sun,
  Moon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCaseStudyById, caseStudiesData } from "@/data/caseStudiesData";

const CaseStudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lang, setLang] = useState("ru");
  const [theme, setTheme] = useState("dark");
  
  const caseStudy = id ? getCaseStudyById(id) : undefined;

  useEffect(() => {
    // Check for stored preferences
    const storedTheme = document.documentElement.classList.contains("light") ? "light" : "dark";
    setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
  };

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          {lang === "ru" ? "Кейс не найден" : "Case study not found"}
        </h1>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === "ru" ? "Вернуться на главную" : "Back to home"}
          </Link>
        </Button>
      </div>
    );
  }

  const currentIndex = caseStudiesData.findIndex(c => c.id === id);
  const prevCase = currentIndex > 0 ? caseStudiesData[currentIndex - 1] : null;
  const nextCase = currentIndex < caseStudiesData.length - 1 ? caseStudiesData[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
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
                <SelectItem value="ro">RO</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-8 w-8 md:h-10 md:w-10">
              {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img 
              src={caseStudy.image} 
              alt={caseStudy.name[lang as "ru" | "en" | "ro"]}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          
          <div className="container px-4 -mt-20 md:-mt-32 relative z-10">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-4">
                {caseStudy.category[lang as "ru" | "en"]}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {caseStudy.name[lang as "ru" | "en"]}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                {caseStudy.fullDesc[lang as "ru" | "en"]}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href={caseStudy.link} target="_blank" rel="noopener noreferrer">
                    {lang === "ru" ? "Открыть проект" : "View project"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/#calculator">
                    {lang === "ru" ? "Рассчитать похожий проект" : "Calculate similar project"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="py-12 md:py-20">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Challenge */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <Lightbulb className="h-5 w-5 text-destructive" />
                      </div>
                      <h2 className="text-xl font-semibold">
                        {lang === "ru" ? "Задача" : "Challenge"}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {caseStudy.challenge[lang as "ru" | "en"]}
                    </p>
                  </CardContent>
                </Card>

                {/* Solution */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Wrench className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">
                        {lang === "ru" ? "Решение" : "Solution"}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {caseStudy.solution[lang as "ru" | "en"]}
                    </p>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {lang === "ru" ? "Что реализовано" : "Features implemented"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {caseStudy.features[lang as "ru" | "en"].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Info */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {lang === "ru" ? "Категория" : "Category"}
                      </p>
                      <p className="font-medium">{caseStudy.category[lang as "ru" | "en"]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lang === "ru" ? "Срок разработки" : "Development time"}
                      </p>
                      <p className="font-medium">{caseStudy.duration[lang as "ru" | "en"]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {lang === "ru" ? "Результат" : "Result"}
                      </p>
                      <p className="font-medium text-primary">{caseStudy.result[lang as "ru" | "en"]}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Technologies */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">
                      {lang === "ru" ? "Технологии" : "Technologies"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">
                      {lang === "ru" ? "Нужен похожий проект?" : "Need a similar project?"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {lang === "ru" 
                        ? "Рассчитайте стоимость вашего проекта прямо сейчас" 
                        : "Calculate the cost of your project right now"}
                    </p>
                    <Button className="w-full" asChild>
                      <Link to="/#calculator">
                        {lang === "ru" ? "Рассчитать бюджет" : "Calculate budget"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 border-t border-border/40">
          <div className="container px-4">
            <div className="flex justify-between items-center">
              {prevCase ? (
                <Button variant="ghost" asChild>
                  <Link to={`/cases/${prevCase.id}`} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{prevCase.name[lang as "ru" | "en"]}</span>
                    <span className="sm:hidden">{lang === "ru" ? "Назад" : "Previous"}</span>
                  </Link>
                </Button>
              ) : <div />}
              
              <Button variant="outline" asChild>
                <Link to="/">
                  {lang === "ru" ? "Все кейсы" : "All cases"}
                </Link>
              </Button>
              
              {nextCase ? (
                <Button variant="ghost" asChild>
                  <Link to={`/cases/${nextCase.id}`} className="flex items-center gap-2">
                    <span className="hidden sm:inline">{nextCase.name[lang as "ru" | "en"]}</span>
                    <span className="sm:hidden">{lang === "ru" ? "Далее" : "Next"}</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              ) : <div />}
            </div>
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

export default CaseStudyDetail;
