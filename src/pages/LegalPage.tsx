import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { BrandLockup } from "@/components/brand";
import { LegalFooterLinks } from "@/components/consent/LegalFooterLinks";
import { useLanguage } from "@/context/LanguageContext";
import { brand } from "@/data/translations";
import { legalContent } from "@/data/legal";
import { legalPathsByLocale, type LegalDoc } from "@/lib/legalRoutes";
import { siteConfig, type Locale } from "@/lib/siteConfig";
import { localizedUrl } from "@/lib/seoRoutes";
import { useTheme } from "@/hooks/useTheme";

const LegalPage = ({ doc }: { doc: LegalDoc }) => {
  const { lang, t } = useLanguage();
  const locale = lang as Locale;
  const { theme, toggleTheme } = useTheme();
  const content = legalContent[locale][doc];
  const paths = legalPathsByLocale(doc);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={content.seoTitle}
        description={content.seoDescription}
        lang={lang}
        path={paths}
        jsonLd={[
          {
            "@type": "WebPage",
            "@id": `${localizedUrl(locale, paths[locale])}#webpage`,
            url: localizedUrl(locale, paths[locale]),
            name: content.title,
            inLanguage: locale,
            dateModified: content.updated,
            isPartOf: { "@id": siteConfig.websiteId },
            publisher: { "@id": siteConfig.personId },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: brand.name,
                item: localizedUrl(locale),
              },
              { "@type": "ListItem", position: 2, name: content.title },
            ],
          },
        ]}
      />

      <header className="border-b border-border">
        <div className="container px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to={`/${lang}`} className="min-w-0">
            <BrandLockup compact name={brand.name} descriptor={brand.descriptor} />
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild className="rounded-none">
              <Link to={`/${lang}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.nav.contact}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <article className="container px-4 sm:px-6 py-12 max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-[0.04em]">
            {content.title}
          </h1>

          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {content.updatedLabel}: {content.updated} · {content.versionLabel}: {content.version}
          </p>

          {content.intro.map((paragraph) => (
            <p key={paragraph} className="mt-5 text-sm sm:text-base text-muted-foreground">
              {paragraph}
            </p>
          ))}

          {content.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-display text-lg sm:text-xl uppercase tracking-[0.06em]">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-sm sm:text-base text-muted-foreground">
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm sm:text-base text-muted-foreground pl-4 border-l border-border"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {section.table && (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr>
                        {section.table.columns.map((column) => (
                          <th
                            key={column}
                            className="border-b border-border py-2 pr-4 align-top font-display uppercase tracking-[0.1em] text-[0.7rem]"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell) => (
                            <td
                              key={cell}
                              className="border-b border-border py-3 pr-4 align-top text-muted-foreground"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </article>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container px-4 sm:px-6 flex flex-col gap-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
          </p>
          <LegalFooterLinks />
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;
