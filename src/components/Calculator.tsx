import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { Calculator as CalculatorIcon, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
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
};

const optionHours = {
  auth: 16,
  payments: 24,
  analytics: 12,
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
    const urgencyMultiplier = urgency ? 1.3 : 1;
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
      
      // Use PT Sans from raw GitHub - verified TTF with full Cyrillic support
      const fontUrl = 'https://raw.githubusercontent.com/nicokempe/google-fonts-subset/main/PTSans-Regular.ttf';
      
      try {
        const fontResponse = await fetch(fontUrl);
        if (!fontResponse.ok) {
          throw new Error('Font fetch failed');
        }
        const fontBuffer = await fontResponse.arrayBuffer();
        const fontBytes = new Uint8Array(fontBuffer);
        let fontBase64 = '';
        for (let i = 0; i < fontBytes.length; i++) {
          fontBase64 += String.fromCharCode(fontBytes[i]);
        }
        fontBase64 = btoa(fontBase64);
        
        pdf.addFileToVFS('PTSans-Regular.ttf', fontBase64);
        pdf.addFont('PTSans-Regular.ttf', 'PTSans', 'normal');
        pdf.setFont('PTSans');
      } catch (fontError) {
        // Fallback: try Roboto from Google Fonts CDN
        const fallbackUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf';
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackBuffer = await fallbackResponse.arrayBuffer();
        const fallbackBytes = new Uint8Array(fallbackBuffer);
        let fallbackBase64 = '';
        for (let i = 0; i < fallbackBytes.length; i++) {
          fallbackBase64 += String.fromCharCode(fallbackBytes[i]);
        }
        fallbackBase64 = btoa(fallbackBase64);
        
        pdf.addFileToVFS('Roboto-Regular.ttf', fallbackBase64);
        pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        pdf.setFont('Roboto');
      }
      
      const pageWidth = 210;
      const margin = 20;
      let yPos = margin;
      
      pdf.setFontSize(24);
      pdf.setTextColor(66, 66, 66);
      pdf.text('Serbian IT Development', margin, yPos);
      yPos += 15;
      
      pdf.setFontSize(18);
      pdf.setTextColor(100, 100, 100);
      pdf.text(t.estimate, margin, yPos);
      yPos += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`${t.projectType}: ${t.types[projectType as keyof typeof t.types]}`, margin, yPos);
      yPos += 10;
      
      pdf.text(`${t.projectSize}: ${t.sizes[projectSize as keyof typeof t.sizes]}`, margin, yPos);
      yPos += 10;
      
      if (urgency) {
        pdf.setTextColor(220, 38, 38);
        pdf.text(`${t.urgency}: ${lang === "ru" ? "Да (+30%)" : lang === "ro" ? "Da (+30%)" : "Yes (+30%)"}`, margin, yPos);
        yPos += 10;
      }
      
      yPos += 5;
      
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
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      
      const baseHoursLabel = lang === "ru" ? "Базовые часы" : lang === "ro" ? "Ore de bază" : "Base hours";
      pdf.text(`${baseHoursLabel}: ${estimate.baseHours} ${t.hours}`, margin, yPos);
      yPos += 8;
      
      if (estimate.additionalHours > 0) {
        const addHoursLabel = lang === "ru" ? "Доп. часы" : lang === "ro" ? "Ore suplimentare" : "Additional hours";
        pdf.text(`${addHoursLabel}: ${estimate.additionalHours} ${t.hours}`, margin, yPos);
        yPos += 8;
      }
      
      pdf.setTextColor(50, 50, 50);
      const totalHoursLabel = lang === "ru" ? "Всего часов" : lang === "ro" ? "Total ore" : "Total hours";
      pdf.text(`${totalHoursLabel}: ${estimate.totalHours} ${t.hours}`, margin, yPos);
      yPos += 8;
      
      pdf.setTextColor(80, 80, 80);
      pdf.text(`${t.rate}: €${hourlyRate}/${lang === "ru" ? "час" : lang === "ro" ? "oră" : "hour"}`, margin, yPos);
      yPos += 12;
      
      if (urgency) {
        const subtotalLabel = lang === "ru" ? "Промежуточная сумма" : lang === "ro" ? "Subtotal" : "Subtotal";
        pdf.text(`${subtotalLabel}: €${estimate.subtotal.toFixed(2)}`, margin, yPos);
        yPos += 8;
        
        pdf.setTextColor(220, 38, 38);
        const urgencyLabel = lang === "ru" ? "Срочность" : lang === "ro" ? "Urgență" : "Urgency";
        pdf.text(`${urgencyLabel} (+30%): €${(estimate.total - estimate.subtotal).toFixed(2)}`, margin, yPos);
        yPos += 10;
      }
      
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.text(`${t.total}: €${estimate.total.toFixed(2)}`, margin, yPos);
      
      yPos = 280;
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Serbian IT Development', margin, yPos);
      pdf.text('contact@serbian-it.dev', pageWidth - margin - 50, yPos);
      
      pdf.save(`estimate-${projectType}-${projectSize}.pdf`);
      
      toast({
        title: lang === "ru" ? "PDF создан" : lang === "ro" ? "PDF creat" : "PDF Created",
        description: lang === "ru" ? "Смета успешно экспортирована" : lang === "ro" ? "Estimarea a fost exportată" : "Estimate exported successfully",
      });
    } catch (error) {
      toast({
        title: lang === "ru" ? "Ошибка" : lang === "ro" ? "Eroare" : "Error",
        description: lang === "ru" ? "Не удалось создать PDF" : lang === "ro" ? "Nu s-a putut crea PDF" : "Failed to create PDF",
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
    <section id="calculator" className="py-16 md:py-24 bg-background">
      <div className="container max-w-5xl px-4 sm:px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 flex items-center justify-center gap-2 md:gap-3"
        >
          <CalculatorIcon className="h-5 w-5 md:h-7 md:w-7 lg:h-8 lg:w-8 text-primary" />
          {t.title}
        </motion.h1>
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg lg:text-xl">{t.projectType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-xs sm:text-sm md:text-base">{t.projectType}</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.types).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-xs sm:text-sm md:text-base">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label className="text-xs sm:text-sm md:text-base">{t.projectSize}</Label>
                  <Select value={projectSize} onValueChange={setProjectSize}>
                    <SelectTrigger className="text-xs sm:text-sm md:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.sizes).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-xs sm:text-sm md:text-base">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:space-y-3 pt-2">
                  <Label className="text-xs sm:text-sm md:text-base font-semibold">{t.options}</Label>
                  <div className="space-y-2 md:space-y-3">
                    {Object.entries(t.optionsList).map(([key, label]) => (
                      <motion.div 
                        key={key} 
                        className="flex items-center space-x-2"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Checkbox 
                          id={key} 
                          checked={options[key as keyof typeof options]}
                          onCheckedChange={(checked) => handleOptionChange(key, checked as boolean)}
                        />
                        <Label htmlFor={key} className="text-xs md:text-sm cursor-pointer leading-tight">
                          {label}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div 
                  className="flex items-center space-x-2 pt-2"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Checkbox id="urgency" checked={urgency} onCheckedChange={(checked) => setUrgency(checked as boolean)} />
                  <Label htmlFor="urgency" className="text-xs md:text-sm cursor-pointer">{t.urgency}</Label>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estimate */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card id="calculator-estimate" className="h-full bg-primary/5 backdrop-blur-sm border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg lg:text-xl">{t.estimate}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-2 text-xs sm:text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.projectType}:</span>
                    <span className="font-medium">
                      <AnimatedNumber value={estimate.baseHours} suffix={t.hours} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.options}:</span>
                    <span className="font-medium">
                      <AnimatedNumber value={estimate.additionalHours} prefix="+" suffix={t.hours} />
                    </span>
                  </div>
                  <div className="border-t border-border/50 pt-2 flex justify-between text-sm md:text-base lg:text-lg font-semibold">
                    <span>{t.hours}:</span>
                    <span>
                      <AnimatedNumber value={estimate.totalHours} suffix={t.hours} />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                    <span>{t.rate}</span>
                    <span>
                      <AnimatedNumber value={estimate.subtotal} decimals={2} prefix="€" />
                    </span>
                  </div>
                  {urgency && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between text-xs md:text-sm text-amber-600 dark:text-amber-400"
                    >
                      <span>{t.urgency}</span>
                      <span>+30%</span>
                    </motion.div>
                  )}
                  <div className="border-t-2 border-primary/30 pt-3 flex justify-between items-center">
                    <span className="text-sm md:text-lg lg:text-xl font-bold">{t.total}:</span>
                    <AnimatedNumber 
                      value={estimate.total} 
                      decimals={2} 
                      prefix="€" 
                      className="text-lg md:text-xl lg:text-2xl font-bold text-primary"
                      highlightOnChange
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleExportPDF} variant="outline" className="w-full text-xs md:text-sm">
                      <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      {t.exportPdf}
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleShareTelegram} variant="secondary" className="w-full text-xs md:text-sm">
                      <Share2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      {t.sharetelegram}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
