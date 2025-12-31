import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { Calculator as CalculatorIcon, Download, Share2 } from "lucide-react";

interface CalculatorTranslations {
  title: string;
  projectType: string;
  projectSize: string;
  types: Record<string, string>;
  sizes: Record<string, string>;
  options: string;
  optionsList: Record<string, string>;
  urgency: string;
  estimate: string;
  hours: string;
  rate: string;
  total: string;
  exportPdf: string;
  sharetelegram: string;
}

interface CalculatorProps {
  translations: CalculatorTranslations;
  lang: string;
  theme: string;
}

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

const hourlyRate = 12.5;

export const Calculator = ({ translations: t, lang, theme }: CalculatorProps) => {
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
  const { toast } = useToast();

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
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Load font with Cyrillic support
      const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-cyrillic-400-normal.woff';
      const fontResponse = await fetch(fontUrl);
      const fontBuffer = await fontResponse.arrayBuffer();
      const fontBase64 = btoa(
        new Uint8Array(fontBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      pdf.addFileToVFS('Roboto-Regular.ttf', fontBase64);
      pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      pdf.setFont('Roboto');
      
      const pageWidth = 210;
      const margin = 20;
      let yPos = margin;
      
      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(66, 66, 66);
      pdf.text('Serbian IT Development', margin, yPos);
      yPos += 15;
      
      // Title
      pdf.setFontSize(18);
      pdf.setTextColor(100, 100, 100);
      pdf.text(t.estimate, margin, yPos);
      yPos += 15;
      
      // Project Type
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`${t.projectType}: ${t.types[projectType as keyof typeof t.types]}`, margin, yPos);
      yPos += 10;
      
      // Project Size
      pdf.text(`${t.projectSize}: ${t.sizes[projectSize as keyof typeof t.sizes]}`, margin, yPos);
      yPos += 10;
      
      // Urgency
      if (urgency) {
        pdf.setTextColor(220, 38, 38);
        pdf.text(`${t.urgency}: ${lang === "ru" ? "Да (+20%)" : "Yes (+20%)"}`, margin, yPos);
        yPos += 10;
      }
      
      yPos += 5;
      
      // Selected Options
      const selectedOptions = Object.entries(options).filter(([_, value]) => value);
      if (selectedOptions.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(80, 80, 80);
        pdf.text(t.options + ':', margin, yPos);
        yPos += 8;
        
        pdf.setFontSize(11);
        selectedOptions.forEach(([key]) => {
          pdf.setTextColor(50, 50, 50);
          pdf.text(`• ${t.optionsList[key as keyof typeof t.optionsList]}`, margin + 5, yPos);
          yPos += 6;
        });
        yPos += 5;
      }
      
      // Separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Calculation Details
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      
      // Base hours
      pdf.text(`${lang === "ru" ? "Базовые часы" : "Base hours"}: ${estimate.baseHours} ${t.hours}`, margin, yPos);
      yPos += 8;
      
      // Additional hours
      if (estimate.additionalHours > 0) {
        pdf.text(`${lang === "ru" ? "Доп. часы" : "Additional hours"}: ${estimate.additionalHours} ${t.hours}`, margin, yPos);
        yPos += 8;
      }
      
      // Total hours
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${lang === "ru" ? "Всего часов" : "Total hours"}: ${estimate.totalHours} ${t.hours}`, margin, yPos);
      yPos += 8;
      
      // Hourly rate
      pdf.setTextColor(80, 80, 80);
      pdf.text(`${t.rate}: €${hourlyRate}/${lang === "ru" ? "час" : "hour"}`, margin, yPos);
      yPos += 12;
      
      // Subtotal
      if (urgency) {
        pdf.text(`${lang === "ru" ? "Промежуточная сумма" : "Subtotal"}: €${estimate.subtotal.toFixed(2)}`, margin, yPos);
        yPos += 8;
        
        pdf.setTextColor(220, 38, 38);
        pdf.text(`${lang === "ru" ? "Срочность" : "Urgency"} (+20%): €${(estimate.total - estimate.subtotal).toFixed(2)}`, margin, yPos);
        yPos += 10;
      }
      
      // Total - larger and bold
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text(`${t.total}: €${estimate.total.toFixed(2)}`, margin, yPos);
      
      // Footer
      yPos = 280;
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Serbian IT Development', margin, yPos);
      pdf.text('contact@serbian-it.dev', pageWidth - margin - 50, yPos);
      
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
🧮 ${t.estimate}

📋 ${t.projectType}: ${t.types[projectType as keyof typeof t.types]}
📏 ${t.projectSize}: ${t.sizes[projectSize as keyof typeof t.sizes]}

⏱ ${t.hours}: ${estimate.totalHours}${t.hours}
💰 ${t.total}: €${estimate.total.toFixed(2)}

${urgency ? '🚀 ' + t.urgency : ''}

Serbian IT Development
    `.trim();

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://serbian-it.dev')}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    setOptions(prev => ({ ...prev, [option]: checked }));
  };

  return (
    <section id="calculator" className="py-12 md:py-20 bg-background">
      <div className="container max-w-5xl px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 flex items-center justify-center gap-3">
          <CalculatorIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          {t.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{t.projectType}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <Label className="text-sm md:text-base">{t.projectType}</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.types).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:space-y-3">
                <Label className="text-sm md:text-base">{t.projectSize}</Label>
                <Select value={projectSize} onValueChange={setProjectSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.sizes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:space-y-3 pt-2">
                <Label className="text-sm md:text-base font-semibold">{t.options}</Label>
                <div className="space-y-2 md:space-y-3">
                  {Object.entries(t.optionsList).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key} 
                        checked={options[key as keyof typeof options]}
                        onCheckedChange={(checked) => handleOptionChange(key, checked as boolean)}
                      />
                      <Label htmlFor={key} className="text-xs md:text-sm cursor-pointer leading-tight">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="urgency" checked={urgency} onCheckedChange={(checked) => setUrgency(checked as boolean)} />
                <Label htmlFor="urgency" className="text-xs md:text-sm cursor-pointer">{t.urgency}</Label>
              </div>
            </CardContent>
          </Card>

          {/* Estimate */}
          <Card id="calculator-estimate" className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{t.estimate}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.projectType}:</span>
                  <span className="font-medium">{estimate.baseHours}{t.hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.options}:</span>
                  <span className="font-medium">+{estimate.additionalHours}{t.hours}</span>
                </div>
                <div className="border-t border-border/50 pt-2 flex justify-between text-base md:text-lg font-semibold">
                  <span>{t.hours}:</span>
                  <span>{estimate.totalHours}{t.hours}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                  <span>{t.rate}</span>
                  <span>€{estimate.subtotal.toFixed(2)}</span>
                </div>
                {urgency && (
                  <div className="flex justify-between text-xs md:text-sm text-amber-600 dark:text-amber-400">
                    <span>{t.urgency}</span>
                    <span>+20%</span>
                  </div>
                )}
                <div className="border-t-2 border-primary/30 pt-3 flex justify-between items-center">
                  <span className="text-base md:text-xl font-bold">{t.total}:</span>
                  <span className="text-xl md:text-2xl font-bold text-primary">€{estimate.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4">
                <Button onClick={handleExportPDF} variant="outline" className="flex-1 text-xs md:text-sm">
                  <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {t.exportPdf}
                </Button>
                <Button onClick={handleShareTelegram} variant="secondary" className="flex-1 text-xs md:text-sm">
                  <Share2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {t.sharetelegram}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
