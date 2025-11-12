import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type ProjectType = "ecommerce" | "telegram" | "crm" | "integration";

interface ClientIntakeFormProps {
  translations: any;
}

export const ClientIntakeForm = ({ translations }: ClientIntakeFormProps) => {
  const [projectType, setProjectType] = useState<ProjectType>("ecommerce");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация контактных данных
    if (!answers.contact) {
      toast({
        title: translations.form.error,
        description: translations.form.contactRequired,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: translations.form.success,
      description: translations.form.successMessage,
    });

    // Здесь будет интеграция с Telegram API
    console.log("Form submitted:", { projectType, answers });
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
    <section id="intake-form" className="py-12 md:py-20 bg-secondary/20">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {translations.form.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {translations.form.subtitle}
            </p>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl mb-4">
                {translations.form.selectType}
              </CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {projectTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={projectType === type.id ? "default" : "outline"}
                    onClick={() => setProjectType(type.id as ProjectType)}
                    className="w-full text-xs md:text-sm"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {questions.map((question: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`q${index}`} className="text-sm md:text-base">
                      {index + 1}. {question}
                    </Label>
                    <Textarea
                      id={`q${index}`}
                      value={answers[`q${index}`] || ""}
                      onChange={(e) => handleAnswerChange(`q${index}`, e.target.value)}
                      placeholder={translations.form.answerPlaceholder}
                      className="min-h-[80px] text-sm md:text-base"
                    />
                  </div>
                ))}

                <div className="pt-4 md:pt-6 border-t border-border">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                    {translations.form.contactTitle}
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm md:text-base">
                        {translations.form.contactLabel}
                      </Label>
                      <Textarea
                        id="contact"
                        value={answers.contact || ""}
                        onChange={(e) => handleAnswerChange("contact", e.target.value)}
                        placeholder={translations.form.contactPlaceholder}
                        required
                        className="min-h-[100px] text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full text-sm md:text-base">
                  {translations.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
