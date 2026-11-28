import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionMarker } from "./SectionMarker";
import { designCopy } from "@/data/designCopy";
import type { Lang } from "@/data/translations";
import smtPremiumBox from "@/assets/cases/smt-premium-box.png";
import vmesteSilnee from "@/assets/cases/vmeste-silnee.png";
import unitEcon from "@/assets/cases/unit-econ.png";

const caseImages: Record<string, string> = { "smt-premium-box": smtPremiumBox, "vmeste-silnee": vmesteSilnee, "unit-econ": unitEcon };
const caseIds: Record<string, string> = { "smt-premium-box": "smt-premium-box", "vmeste-silnee": "vmeste-silnee", "unit-econ": "unit-econ-strategist" };
interface CaseStudy {
  readonly name: string;
  readonly desc: string;
  readonly features: readonly string[];
  readonly result: string;
  readonly link?: string;
  readonly image?: string;
}
interface CaseStudiesProps { title: string; items: readonly CaseStudy[]; lang?: Lang; }

export const CaseStudies = ({ title, items, lang = "ru" }: CaseStudiesProps) => {
  const copy = designCopy[lang];
  return (
    <section className="section-standard border-b border-border bg-background">
      <div className="container px-4 sm:px-6">
        <SectionMarker>{copy.cases}</SectionMarker>
        <h2 className="font-display text-3xl md:text-4xl font-semibold heading-system mb-10 md:mb-14">{title}</h2>
        <div className="border-t border-border">
          {items.map((item) => {
            const imageKey = item.image ?? "";
            const id = caseIds[imageKey];
            return (
              <article key={item.name} className="grid md:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-12 py-8 md:py-10 border-b border-border">
                <div className="min-w-0">
                  <div className="border border-border bg-surface">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2">
                      <span className="w-2 h-2 border border-primary" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    {caseImages[imageKey] && <div className="aspect-[16/10] p-3 sm:p-5"><img src={caseImages[imageKey]} alt={item.name} width={1200} height={630} loading="lazy" decoding="async" className="w-full h-full object-contain object-center" /></div>}
                  </div>
                </div>
                <div className="min-w-0 flex flex-col items-start">
                  <h3 className="font-display text-2xl md:text-3xl font-medium">{item.name}</h3>
                  <dl className="mt-5 w-full divide-y divide-border">
                    <div className="py-3 grid sm:grid-cols-[90px_1fr] gap-2 sm:gap-5">
                      <dt className="text-xs text-muted-foreground">{copy.project}</dt>
                      <dd className="text-sm leading-relaxed">{item.desc}</dd>
                    </div>
                    <div className="py-3 grid sm:grid-cols-[90px_1fr] gap-2 sm:gap-5">
                      <dt className="text-xs text-muted-foreground">{copy.solution}</dt>
                      <dd><ul className="space-y-2">{item.features.map((feature) => <li key={feature} className="flex items-start gap-3 text-sm"><span aria-hidden="true" className="w-3 h-px bg-primary mt-2.5 shrink-0" />{feature}</li>)}</ul></dd>
                    </div>
                    <div className="py-3 grid sm:grid-cols-[90px_1fr] gap-2 sm:gap-5">
                      <dt className="text-xs text-muted-foreground">{copy.result}</dt>
                      <dd className="text-sm font-medium leading-relaxed text-primary">{item.result}</dd>
                    </div>
                  </dl>
                  {id && <Button variant="outline" asChild className="mt-5"><Link to={`/${lang}/cases/${id}`}>{copy.details}<ArrowRight className="h-4 w-4" /></Link></Button>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
