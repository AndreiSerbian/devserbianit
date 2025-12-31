import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";
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

const caseIds: Record<string, string> = {
  "smt-premium-box": "smt-premium-box",
  "foodsaur": "foodsaur",
  "vmeste-silnee": "vmeste-silnee",
  "unit-econ": "unit-econ-strategist",
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
  lang?: string;
}

export const CaseStudies = ({ title, items, lang = "ru" }: CaseStudiesProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/20">
      <div className="container px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map((item, idx) => {
            const imageKey = item.image || "";
            const caseId = caseIds[imageKey];
            
            return (
              <Card key={idx} className="card-hover border-border/50 overflow-hidden group">
                {item.image && caseImages[item.image] && (
                  <Link to={`/cases/${caseId}`} className="block relative w-full h-48 overflow-hidden">
                    <img 
                      src={caseImages[item.image]} 
                      alt={item.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="text-sm font-medium flex items-center gap-1">
                        {lang === "ru" ? "Подробнее" : "Learn more"}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                )}
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center justify-between">
                    <Link to={`/cases/${caseId}`} className="hover:text-primary transition-colors">
                      {item.name}
                    </Link>
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
                    {item.features.slice(0, 3).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-border/50">
                    <p className="text-xs md:text-sm font-medium text-primary">{item.result}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/cases/${caseId}`}>
                        {lang === "ru" ? "Подробнее" : "Details"}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    {item.link && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
