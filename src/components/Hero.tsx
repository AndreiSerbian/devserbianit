import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  onCtaClick?: () => void;
}

export const Hero = ({ title, subtitle, cta, onCtaClick }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 dark:from-[hsl(var(--gradient-hero-start))] dark:to-[hsl(var(--gradient-hero-end))]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgMTB2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10 dark:opacity-20"></div>
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 animate-fade-in-up py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground drop-shadow-sm px-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto px-4">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto group shadow-lg hover:shadow-xl transition-shadow"
              onClick={onCtaClick}
            >
              {cta}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Telegram
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
