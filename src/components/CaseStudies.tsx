import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface CaseStudy {
  name: string;
  desc: string;
  features: string[];
  result: string;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <Card key={idx} className="card-hover border-border/50">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{item.name}</CardTitle>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
