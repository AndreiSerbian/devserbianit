import { motion } from "framer-motion";
import ecommerce from "@/assets/services/01-ecommerce.svg?raw";
import business from "@/assets/services/02-business-sites.svg?raw";
import crm from "@/assets/services/03-crm.svg?raw";
import bots from "@/assets/services/04-bots.svg?raw";
import marketing from "@/assets/services/05-marketing.svg?raw";
import visual from "@/assets/services/06-visual-content.svg?raw";

interface ServicesProps {
  title: string;
  intro?: string;
  items: readonly { readonly title: string; readonly desc: string }[];
}

const art = [ecommerce, business, crm, bots, marketing, visual];

export const Services = ({ title, intro, items }: ServicesProps) => (
  <section className="py-16 md:py-24 border-b border-border">
    <div className="container px-4 sm:px-6">
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
        <span className="text-primary mr-3">01</span>
        {title}
      </h2>
      {intro && (
        <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground">{intro}</p>
      )}

      <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-border border border-border">
        {items.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="bg-card flex flex-col px-3.5 pt-4 pb-5 md:px-[22px] md:pt-6 md:pb-7 hover:bg-surface-raised transition-colors duration-150"
          >
            <div
              className="w-full aspect-[160/112] mb-3.5 md:mb-[22px] [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: art[idx % art.length] }}
            />
            <h3 className="font-display font-medium uppercase tracking-wide text-sm md:text-[17px] leading-tight mb-2.5 text-foreground [text-wrap:balance]">
              {item.title}
            </h3>
            <p className="text-[13px] md:text-sm leading-[1.55] text-foreground/75 [text-wrap:pretty]">{item.desc}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
