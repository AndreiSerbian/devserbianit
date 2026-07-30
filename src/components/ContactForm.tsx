import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import type { translations, Lang } from "@/data/translations";
import { CheckCircle2, Send } from "lucide-react";

type Method = "telegram" | "email" | "whatsapp" | "other";

interface ContactFormProps {
  t: (typeof translations)[Lang]["form"];
  lang: Lang;
}

export const ContactForm = ({ t, lang }: ContactFormProps) => {
  const { toast } = useToast();
  const [method, setMethod] = useState<Method>("telegram");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [request, setRequest] = useState("");
  const [budget, setBudget] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [started, setStarted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const markStart = () => {
    if (!started) {
      setStarted(true);
      trackEvent("form_start", { locale: lang });
    }
  };

  const validContact = () => {
    const v = contact.trim();
    if (method === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (method === "telegram") return v.length >= 3;
    if (method === "whatsapp") return /[\d]{6,}/.test(v.replace(/\D/g, ""));
    return v.length >= 3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !request.trim()) {
      toast({ title: t.error, description: t.required, variant: "destructive" });
      return;
    }
    if (!validContact()) {
      toast({ title: t.error, description: t.invalidContact, variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          name: name.trim(),
          preferred_contact_method: method,
          contact_value: contact.trim(),
          request: request.trim(),
          budget_and_timeline: budget.trim() || null,
          locale: lang,
          page_url: window.location.href,
          company, // honeypot — must stay empty
        },
      });
      if (error || (data && (data as { error?: string }).error)) throw error ?? new Error("failed");

      setSent(true);
      trackEvent("form_submit_success", { locale: lang });
      toast({ title: t.success, description: t.successMessage });
      setName("");
      setContact("");
      setRequest("");
      setBudget("");
    } catch {
      trackEvent("form_submit_error", { locale: lang });
      toast({ title: t.error, description: t.sendError, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact-form" className="py-16 md:py-24 border-b border-border">
      <div className="container px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="text-primary mr-3">04</span>
              {t.title}
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              {t.subtitle}
            </p>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-primary/40 bg-surface p-8 flex flex-col items-start gap-4"
            >
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <h3 className="font-display text-xl tracking-wide">{t.success}</h3>
              <p className="text-sm text-muted-foreground">{t.successMessage}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} onFocus={markStart} className="space-y-6" noValidate>
              {/* honeypot */}
              <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-name">{t.name} *</Label>
                <Input
                  id="lead-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  maxLength={80}
                  required
                  className="rounded-none"
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium mb-2">{t.preferredContactMethod} *</legend>
                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as Method)}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {(Object.keys(t.methods) as Method[]).map((m) => (
                    <label
                      key={m}
                      htmlFor={`method-${m}`}
                      className={`flex items-center gap-2 border px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                        method === m ? "border-primary bg-primary/10" : "border-border hover:bg-surface"
                      }`}
                    >
                      <RadioGroupItem value={m} id={`method-${m}`} />
                      <span className="truncate">{t.methods[m]}</span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="lead-contact">{t.contactValue} *</Label>
                <Input
                  id="lead-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={t.contactPlaceholders[method]}
                  inputMode={method === "whatsapp" ? "tel" : "text"}
                  maxLength={120}
                  required
                  className="rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-request">{t.request} *</Label>
                <Textarea
                  id="lead-request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder={t.requestPlaceholder}
                  rows={5}
                  maxLength={2000}
                  required
                  className="rounded-none resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-budget">
                  {t.budgetAndTimeline}{" "}
                  <span className="text-muted-foreground font-normal">({t.optional})</span>
                </Label>
                <Textarea
                  id="lead-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={t.budgetPlaceholder}
                  rows={2}
                  maxLength={500}
                  className="rounded-none resize-y"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full sm:w-auto rounded-none font-display uppercase tracking-[0.08em]"
              >
                {sending ? t.sending : t.submit}
                {!sending && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};