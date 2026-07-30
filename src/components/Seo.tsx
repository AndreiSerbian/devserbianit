import { Helmet } from "react-helmet-async";
import { SUPPORTED_LANGS, type Lang } from "@/data/translations";

interface SeoProps {
  title: string;
  description: string;
  lang: Lang;
  path?: string;
  /** when false, adds noindex (e.g. utility pages) */
  index?: boolean;
  jsonLd?: Record<string, unknown>;
}

const ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://devserbianit.lovable.app";

export const Seo = ({ title, description, lang, path = "", index = true, jsonLd }: SeoProps) => {
  const canonical = `${ORIGIN}/${lang}${path}`.replace(/\/$/, "") || ORIGIN;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {!index && <meta name="robots" content="noindex, follow" />}

      {SUPPORTED_LANGS.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${ORIGIN}/${l}${path}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${ORIGIN}/ru${path}`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={lang} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};