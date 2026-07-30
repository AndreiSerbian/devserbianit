import { motion } from "framer-motion";

interface ProcessProps {
  title: string;
  steps: readonly { readonly title: string; readonly desc: string }[];
}

export const Process = ({ title, steps }: ProcessProps) => (
  <section id="process" className="py-16 md:py-24 border-b border-border bg-surface">
    <div className="container px-4 sm:px-6">
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-10 md:mb-14">
        <span className="text-primary mr-3">03</span>
        {title}
      </h2>

      <ol className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10">
        {steps.map((step, idx) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="relative pt-6 border-t-2 border-primary/60"
          >
            <span className="font-display text-4xl md:text-5xl font-semibold text-primary/25 leading-none block mb-4">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-base md:text-lg font-medium tracking-wide mb-3">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);