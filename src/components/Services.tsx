import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch, LucideIcon } from "lucide-react";

interface Service {
  title: string;
  desc: string;
}

interface ServicesProps {
  title: string;
  items: Service[];
}

const icons: LucideIcon[] = [ShoppingCart, Boxes, LayoutDashboard, MessageSquare, Database, FileSearch];

export const Services = ({ title, items }: ServicesProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/20">
      <div className="container px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <Card key={idx} className="card-hover border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
