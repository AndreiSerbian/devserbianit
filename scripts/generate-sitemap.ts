// Writes public/sitemap.xml from the shared SEO route map (src/lib/seoRoutes.ts).
// Run via: bun run generate:sitemap  (also wired to prebuild)

import { writeFileSync } from "fs";
import { resolve } from "path";
import { indexableUrls } from "../src/lib/seoRoutes";

const urls = indexableUrls().map((entry) =>
  [
    `  <url>`,
    `    <loc>${entry.loc}</loc>`,
    ...entry.alternates.map(
      (a) => `    <xhtml:link rel="alternate" hreflang="${a.hrefLang}" href="${a.href}"/>`,
    ),
    `    <priority>${entry.priority}</priority>`,
    `  </url>`,
  ].join("\n"),
);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...urls,
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml + "\n");
console.log(`sitemap.xml written (${urls.length} entries)`);
