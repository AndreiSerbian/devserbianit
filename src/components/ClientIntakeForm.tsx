import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiEffect, SuccessCheckmark } from "./ConfettiEffect";
import { ShoppingBag, Send, LayoutGrid, Check } from "lucide-react";

type ProjectType = "ecommerce" | "telegram" | "crm";

interface ClientIntakeFormProps {
  translations: any;
  lang?: string;
}

export const ClientIntakeForm = ({ translations, lang = "ru" }: ClientIntakeFormProps) => {
  const [projectType, setProjectType] = useState<ProjectType>("ecommerce");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answers.contact) {
      toast({
        title: translations.form.error,
        description: translations.form.contactRequired,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const questionsList: string[] = translations.form.questions[projectType] || [];

    try {
      const { data, error } = await supabase.functions.invoke("send-telegram-notification", {
        body: {
          projectType,
          projectTypeLabel: translations.form.types[projectType],
          answers,
          questions: questionsList,
          contactLabel: translations.form.contactLabel,
          lang,
        },
      });

      if (error) throw error;

      // Trigger success animations
      setShowConfetti(true);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      toast({
        title: translations.form.success,
        description: translations.form.successMessage,
      });

      setAnswers({});
    } catch (error) {
      console.error("Error sending form:", error);
      toast({
        title: translations.form.error,
        description: translations.form.sendError || "Ошибка при отправке формы",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const projectTypes = [
    { id: "ecommerce", label: translations.form.types.ecommerce, Icon: ShoppingBag },
    { id: "telegram", label: translations.form.types.telegram, Icon: Send },
    { id: "crm", label: translations.form.types.crm, Icon: LayoutGrid },
  ];

  const questions = translations.form.questions[projectType];

  return (
    <>
      <ConfettiEffect isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <SuccessCheckmark isVisible={showSuccess} />
      
      <section id="intake-form" className="py-16 md:py-24 bg-secondary/20">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              {translations.form.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {translations.form.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg lg:text-xl mb-4">
                  {translations.form.selectType}
                </CardTitle>
                <div className="flex flex-col gap-3">
                  {projectTypes.map((type) => {
                    const isActive = projectType === type.id;
                    const Icon = type.Icon;
                    return (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => setProjectType(type.id as ProjectType)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        aria-pressed={isActive}
                        className={`relative flex items-center gap-4 w-full rounded-2xl border px-4 py-4 md:px-5 md:py-5 text-left transition-all duration-300 ${
                          isActive
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                            : "border-border bg-card/40 hover:border-primary/50 hover:bg-card/70"
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
                        </span>
                        <span className="flex-1 text-sm md:text-base font-semibold">
                          {type.label}
                        </span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-transparent"
                          }`}
                        >
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={projectType}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 md:space-y-6"
                    >
                      {questions.map((question: string, index: number) => (
                        <motion.div 
                          key={index} 
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Label htmlFor={`q${index}`} className="text-xs sm:text-sm md:text-base leading-relaxed">
                            {index + 1}. {question}
                          </Label>
                          <Textarea
                            id={`q${index}`}
                            value={answers[`q${index}`] || ""}
                            onChange={(e) => handleAnswerChange(`q${index}`, e.target.value)}
                            placeholder={translations.form.answerPlaceholder}
                            className="min-h-[70px] md:min-h-[80px] text-xs sm:text-sm md:text-base resize-none"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  <div className="pt-4 md:pt-6 border-t border-border">
                    <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-3 md:mb-4">
                      {translations.form.contactTitle}
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact" className="text-xs sm:text-sm md:text-base">
                          {translations.form.contactLabel}
                        </Label>
                        <Textarea
                          id="contact"
                          value={answers.contact || ""}
                          onChange={(e) => handleAnswerChange("contact", e.target.value)}
                          placeholder={translations.form.contactPlaceholder}
                          required
                          className="min-h-[90px] md:min-h-[100px] text-xs sm:text-sm md:text-base resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full text-sm md:text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (translations.form.sending || "Отправка...") : translations.form.submit}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </div>
      </section>
    </>
  );
};
