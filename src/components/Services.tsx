import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SVC_ART, SVC_STYLE } from "./servicesArt";

interface ServicesProps {
  title: string;
  intro?: string;
  items: readonly { readonly title: string; readonly desc: string }[];
}

const ANIM_CSS = `
@keyframes svFade{from{opacity:0}}@keyframes svUp{from{opacity:0;transform:translateY(6px)}}
@keyframes svPop{from{opacity:0;transform:scale(.6)}}@keyframes svGrow{from{transform:scaleX(0)}}
@keyframes svDraw{from{stroke-dashoffset:1}}@keyframes svMove{from{transform:translate(var(--dx),var(--dy))}}
.svc-anim .a-pop{transform-origin:center}.svc-anim .a-grow{transform-origin:left center}.svc-anim .a-draw{stroke-dasharray:1}
.svc-anim.play :is(.a-fade,.a-up,.a-pop,.a-grow,.a-draw,.a-move){animation-duration:.55s;animation-timing-function:cubic-bezier(.2,.7,.2,1);animation-delay:var(--d,0s);animation-fill-mode:backwards;transform-box:fill-box}
.svc-anim.play .a-fade{animation-name:svFade}.svc-anim.play .a-up{animation-name:svUp}.svc-anim.play .a-pop{animation-name:svPop}
.svc-anim.play .a-grow{animation-name:svGrow}.svc-anim.play .a-draw{animation-name:svDraw}.svc-anim.play .a-move{animation-name:svMove;animation-duration:.9s}
@media (prefers-reduced-motion:reduce){.svc-anim *{animation:none!important}}
`;

const Art = ({ html }: { html: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPlay(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      key={key}
      onMouseEnter={() => play && setKey((k) => k + 1)}
      className={`svc-anim ${play ? "play" : ""} w-full aspect-[160/112] mb-3.5 md:mb-[22px] [&>svg]:block [&>svg]:w-full [&>svg]:h-full`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const Services = ({ title, intro, items }: ServicesProps) => (
  <section className="py-16 md:py-24 border-b border-border">
    <div className="container px-4 sm:px-6">
      <style>{SVC_STYLE + ANIM_CSS}</style>
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
            <Art html={SVC_ART[idx % SVC_ART.length]} />
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
