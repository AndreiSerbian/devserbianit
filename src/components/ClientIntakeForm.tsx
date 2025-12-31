import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type ProjectType = "ecommerce" | "telegram" | "crm" | "integration";

interface ClientIntakeFormProps {
  translations: any;
}

export const ClientIntakeForm = ({ translations }: ClientIntakeFormProps) => {
  const [projectType, setProjectType] = useState<ProjectType>("ecommerce");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      const { data, error } = await supabase.functions.invoke("send-telegram-notification", {
        body: {
          projectType,
          answers,
          lang: "ru",
        },
      });

      if (error) throw error;

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
    { id: "ecommerce", label: translations.form.types.ecommerce },
    { id: "telegram", label: translations.form.types.telegram },
    { id: "crm", label: translations.form.types.crm },
    { id: "integration", label: translations.form.types.integration },
  ];

  const questions = translations.form.questions[projectType];

  return (
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                  {projectTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={projectType === type.id ? "default" : "outline"}
                        onClick={() => setProjectType(type.id as ProjectType)}
                        className="w-full text-xs md:text-sm h-auto py-2.5 md:py-3"
                      >
                        {type.label}
                      </Button>
                    </motion.div>
                  ))}
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
  );
};
