import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Index = () => {
  const [rate, setRate] = useState(30);
  const [projectType, setProjectType] = useState("E-commerce");
  const [size, setSize] = useState("Medium");
  const [options, setOptions] = useState<string[]>([]);
  const [urgency, setUrgency] = useState(0);

  // Calculator logic
  const baseHours: Record<string, Record<string, number>> = {
    "E-commerce": { Small: 60, Medium: 120, Large: 220 },
    "CRM/ERP": { Small: 70, Medium: 140, Large: 260 },
    "Admin panel": { Small: 50, Medium: 100, Large: 180 },
    "Telegram bot": { Small: 30, Medium: 60, Large: 100 },
    "Custom integration": { Small: 40, Medium: 90, Large: 160 }
  };

  const optionHours: Record<string, number> = {
    "Auth/roles": 16,
    "Payments": 24,
    "Analytics": 10,
    "Multilingual": 18,
    "Supabase": 20,
    "Telegram": 12
  };

  const calculateTotal = () => {
    const base = baseHours[projectType]?.[size] || 100;
    const extra = options.reduce((sum, opt) => sum + (optionHours[opt] || 0), 0);
    let totalHours = base + extra;
    let total = totalHours * rate;
    if (urgency === 1) total *= 1.2;
    return { hours: totalHours, total: Math.round(total) };
  };

  const result = calculateTotal();

  const toggleOption = (opt: string) => {
    setOptions(prev => 
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  const downloadPDF = async () => {
    const element = document.getElementById("calculator-card");
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`estimate-${projectType}-${size}.pdf`);
      toast.success("PDF скачан успешно!");
    } catch (error) {
      toast.error("Ошибка при создании PDF");
    }
  };

  const shareTelegram = () => {
    const text = `📊 Смета проекта\n\nТип: ${projectType}\nРазмер: ${size}\nОпции: ${options.join(", ") || "Нет"}\n\nСтавка: €${rate}/час\nЧасы: ${result.hours}\nИтого: €${result.total}`;
    window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero с улучшенным контрастом */}
      <section className="relative py-20 px-8 bg-gradient-to-br from-primary/20 via-background to-secondary/20 border-b border-border">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgMTB2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 dark:opacity-20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Serbian IT Development
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Комплексный подход к IT-решениям для бизнеса
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Не просто «пишем код». Смотрим на продукт и процессы глазами бизнеса.
          </p>
          <button 
            onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-lg font-medium transition-all hover:scale-105"
          >
            Рассчитать бюджет →
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-8">

        <main className="space-y-16">
          {/* Интерактивный калькулятор */}
          <section id="calculator">
            <h2 className="text-3xl font-bold mb-8 text-center">Калькулятор бюджета</h2>
            <div id="calculator-card" className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ставка, €/час</label>
                  <input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    min={1} 
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Тип проекта</label>
                  <select 
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option>E-commerce</option>
                    <option>CRM/ERP</option>
                    <option>Admin panel</option>
                    <option>Telegram bot</option>
                    <option>Custom integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Размер и сложность</label>
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Дополнительные опции</label>
                  <div className="space-y-2">
                    {Object.keys(optionHours).map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-secondary/20 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={options.includes(opt)}
                          onChange={() => toggleOption(opt)}
                          className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{opt} (+{optionHours[opt]}ч)</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Срочность</label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary"
                  >
                    <option value={0}>Обычная</option>
                    <option value={1}>Срочно (+20%)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-1">Часы работы</div>
                      <div className="text-3xl font-bold text-primary">{result.hours}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-1">Итого</div>
                      <div className="text-3xl font-bold text-primary">€{result.total}</div>
                    </div>
                  </div>
                  
                  {urgency === 1 && (
                    <p className="text-sm text-center text-muted-foreground mt-3">
                      * Включена наценка за срочность +20%
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={downloadPDF}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all font-medium"
                  >
                    📄 Скачать PDF
                  </button>
                  <button 
                    onClick={shareTelegram}
                    className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-all font-medium"
                  >
                    📤 Telegram
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-8">Контакты</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <a 
                href="https://t.me/your_username"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-lg font-medium"
              >
                Написать в Telegram
              </a>
              <a 
                href="mailto:contact@serbian-it.dev"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 text-lg font-medium"
              >
                Email
              </a>
            </div>
            <p className="mt-8 text-muted-foreground">
              Молдова, ЕС, Россия • Remote work
            </p>
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2025 Serbian IT Development. Professional IT solutions for business.
        </footer>
      </div>
    </div>
  );
};

export default Index;
