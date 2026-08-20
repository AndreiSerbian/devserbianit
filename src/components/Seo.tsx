import { Helmet } from "react-helmet-async";
import { alternatesFor, localizedUrl, type LocalePaths } from "@/lib/seoRoutes";
import type { Lang } from "@/data/translations";

type JsonLd = Record<string, unknown>;

interface SeoProps {
  title: string;
  description: string;
  lang: Lang;
  /** A string for shared paths, or a per-locale map for localized slugs. */
  path?: string | LocalePaths;
  /** when false, adds noindex (e.g. utility pages, 404) */
  index?: boolean;
  jsonLd?: JsonLd | JsonLd[];
}

export const Seo = ({ title, description, lang, path = "", index = true, jsonLd }: SeoProps) => {
  const canonical = localizedUrl(lang, typeof path === "string" ? path : path[lang]);
  const alternates = alternatesFor(path);
  const graph = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {index ? (
        <link rel="canonical" href={canonical} />
      ) : (
        <meta name="robots" content="noindex, follow" />
      )}

      {index &&
        alternates.map((a) => (
          <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
        ))}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={lang} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {graph.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}
        </script>
      )}
    </Helmet>
  );
};
