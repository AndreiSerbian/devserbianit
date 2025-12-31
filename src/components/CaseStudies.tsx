import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import smtPremiumBox from "@/assets/cases/smt-premium-box.png";
import foodsaur from "@/assets/cases/foodsaur.png";
import vmesteSilnee from "@/assets/cases/vmeste-silnee.png";
import unitEcon from "@/assets/cases/unit-econ.png";

const caseImages: Record<string, string> = {
  "smt-premium-box": smtPremiumBox,
  "foodsaur": foodsaur,
  "vmeste-silnee": vmesteSilnee,
  "unit-econ": unitEcon,
};

interface CaseStudy {
  name: string;
  desc: string;
  features: string[];
  result: string;
  link?: string;
  image?: string;
}

interface CaseStudiesProps {
  title: string;
  items: CaseStudy[];
}

export const CaseStudies = ({ title, items }: CaseStudiesProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/20">
      <div className="container px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <Card key={idx} className="card-hover border-border/50 overflow-hidden">
              {item.image && caseImages[item.image] && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={caseImages[item.image]} 
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center justify-between">
                  {item.name}
                  {item.link && (
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground pt-2">{item.desc}</p>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  {item.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 md:pt-3 border-t border-border/50">
                  <p className="text-xs md:text-sm font-medium text-primary">{item.result}</p>
                </div>
                {item.link && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      Открыть проект <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
