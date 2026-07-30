import { motion } from "framer-motion";
import { ShoppingCart, Globe, Workflow, Send } from "lucide-react";

interface ServicesProps {
  title: string;
  items: readonly { readonly title: string; readonly desc: string }[];
}

const icons = [ShoppingCart, Globe, Workflow, Send];

export const Services = ({ title, items }: ServicesProps) => (
  <section className="py-16 md:py-24 border-b border-border">
    <div className="container px-4 sm:px-6">
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-10 md:mb-14">
        <span className="text-primary mr-3">01</span>
        {title}
      </h2>

      <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
        {items.map((item, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              className="bg-card p-6 md:p-8 group hover:bg-surface-raised transition-colors"
            >
              <Icon className="h-6 w-6 text-primary mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-lg md:text-xl font-medium tracking-wide mb-3">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);