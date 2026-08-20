import { LEGAL_FACTS, type LegalBundle } from "./types";

const F = LEGAL_FACTS;

export const legalEn: LegalBundle = {
  privacy: {
    title: "Privacy Policy",
    seoTitle: "Privacy Policy | Andrei Serbian IT Solutions",
    seoDescription:
      "How personal data is processed on the Andrei Serbian IT Solutions website: purposes, legal bases, recipients, retention periods and your rights.",
    updatedLabel: "Last updated",
    updated: F.updated,
    versionLabel: "Policy version",
    version: F.policyVersion,
    intro: [
      "The Romanian version of this document is the legally authoritative one. The Russian and English versions are provided for convenience.",
      `This website (${F.site}) presents IT services. Personal data is processed in a minimal scope and only for the purposes listed below.`,
    ],
    sections: [
      {
        heading: "1. Controller",
        paragraphs: [
          `Controller: ${F.controller}, natural person, Republic of Moldova.`,
          `Contact for any data protection request: ${F.email}, Telegram ${F.telegram}.`,
          "The service provider status (form of activity and the related identification details) is described separately in the Terms of Use. [OWNER CONFIRMATION REQUIRED]",
        ],
      },
      {
        heading: "2. What data is processed and why",
        table: {
          columns: ["Purpose", "Data", "Legal basis", "Retention"],
          rows: [
            [
              "Handling enquiries submitted through the contact form",
              "Name, preferred contact method and its value (Telegram, email or phone), request description, optional budget and timeline, interface language, path of the page the form was submitted from",
              "Pre-contractual steps at the data subject's request",
              "24 months from the last interaction [OWNER CONFIRMATION REQUIRED]",
            ],
            [
              "Pseudonymous website usage analytics",
              "Event name, page path (without query parameters), language, opened case identifier, session identifier (session_id), consent identifier (consent_id) and the identifier of the specific consent decision",
              "Consent",
              "12 months [OWNER CONFIRMATION REQUIRED]",
            ],
            [
              "Persistently storing the theme and language choice",
              "The selected theme and language values stored in your browser",
              "Consent",
              "Until consent is withdrawn or browser data is cleared",
            ],
            [
              "Abuse prevention and request rate limiting",
              "A keyed HMAC derived from the requester's IP address plus the limit scope. The raw IP address is not stored",
              "Legitimate interest",
              "Records older than 24 hours are purged automatically, hourly (effective maximum ~25 hours)",
            ],
            [
              "Consent evidence (accountability)",
              "Consent identifier, policy version, allowed or refused categories, decision timestamp. No IP address, no name or email, no browser data",
              "Legal obligation / accountability",
              "For as long as needed to demonstrate the decisions made [LEGAL REVIEW REQUIRED]",
            ],
          ],
        },
        paragraphs: [
          "Analytics is pseudonymous, not anonymous: events carry a session identifier and the consent identifier.",
        ],
      },
      {
        heading: "3. Balancing assessment for legitimate interest (rate limiting)",
        bullets: [
          "Interest pursued: keeping the website available and protecting the contact form from automated and abusive submissions.",
          "Necessity: without a per-requester limit the form can be used to flood the notification channels; no equally effective measure exists with no identification at all.",
          "Minimisation: the IP address is stored neither in the database nor in logs — only a keyed HMAC is stored, from which the address cannot be reconstructed.",
          "Impact: minimal; the data is not used for profiling, marketing or automated decisions and is deleted within ~25 hours.",
        ],
      },
      {
        heading: "4. Recipients and service providers",
        paragraphs: ["The following recipients / service providers are used to operate the site:"],
        bullets: [
          "Lovable — website hosting and static asset delivery.",
          "Supabase — database and server functions receiving form enquiries, analytics events and consent records.",
          "Cloudflare — edge network through which requests to the server functions pass.",
          "Telegram Messenger — delivery of the new-enquiry notification to the controller.",
          "Google (Gmail) — recipient / service provider for email notification delivery.",
        ],
      },
      {
        heading: "5. Fonts and external resources",
        paragraphs: [
          "The fonts (Oswald, Golos Text) are hosted on the site's own domain. Loading a page sends no request from your browser to Google servers, so your IP address is not transferred to Google in this context.",
          "The site uses no ad networks, tracking pixels, embedded maps or social media widgets.",
        ],
      },
      {
        heading: "6. Cross-border transfers",
        paragraphs: [
          "Some recipients listed in section 4 may process data outside the Republic of Moldova, including in the European Union and the United States. The applicable transfer mechanism for each recipient and the related documentation are under review. [LEGAL REVIEW REQUIRED]",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "In the cases and under the conditions provided by law, you may request access to your data, its rectification, erasure or restriction of processing, object to processing based on legitimate interest, and withdraw consent at any time without affecting the lawfulness of processing carried out before withdrawal.",
          `Send requests to ${F.email}. Additional information may be requested only to the extent needed to identify the data your request concerns.`,
          "You also have the right to lodge a complaint with the National Center for Personal Data Protection of the Republic of Moldova.",
        ],
      },
      {
        heading: "8. Applicable legal framework",
        paragraphs: [
          "Processing is carried out under Law No. 133/2011 on the protection of personal data, applicable until Law No. 195/2024 on the protection of personal data enters into force on 23.08.2026. This document is designed to satisfy both frameworks during the transition.",
        ],
      },
      {
        heading: "9. Security and incidents",
        paragraphs: [
          "Direct visitor access to database tables is blocked: data can only be written through validated server functions. Keys and secrets are not exposed in browser-executed code.",
          "In the event of a security incident affecting personal data, the controller follows an internal response and notification procedure in line with the applicable legal requirements.",
        ],
      },
      {
        heading: "10. Changes",
        paragraphs: [
          "The consent-related policy version is shown above. On material changes (new purposes, new data categories or new consent-related recipients) the version is incremented and consent is requested again.",
        ],
      },
    ],
  },

  cookies: {
    title: "Cookie and Similar Technologies Policy",
    seoTitle: "Cookie and Similar Technologies Policy | Andrei Serbian IT Solutions",
    seoDescription:
      "Full inventory of browser storage used on the Andrei Serbian IT Solutions website: localStorage, sessionStorage, purposes, duration and how to withdraw consent.",
    updatedLabel: "Last updated",
    updated: F.updated,
    versionLabel: "Policy version",
    version: F.policyVersion,
    intro: [
      "This website's application code sets no cookies of its own in your browser. It does use similar local storage technologies: localStorage and sessionStorage.",
      "Non-essential storage is activated only after your explicit consent.",
    ],
    sections: [
      {
        heading: "1. Local storage inventory",
        table: {
          columns: ["Name", "Type", "Purpose", "Category", "Duration"],
          rows: [
            [
              "consent_state_v1",
              "localStorage",
              "Stores your consent decision so the banner is not shown again and a withdrawal applies immediately",
              "Essential",
              "Persistent, until browser data is cleared",
            ],
            [
              "theme",
              "localStorage",
              "Remembers the selected theme (dark or light) between visits",
              "Preferences (consent)",
              "Persistent, until consent is withdrawn",
            ],
            [
              "lang",
              "localStorage",
              "Remembers the selected language between visits",
              "Preferences (consent)",
              "Persistent, until consent is withdrawn",
            ],
            [
              "anon_session_id",
              "sessionStorage",
              "Pseudonymous session identifier attached to analytics events",
              "Analytics (consent)",
              "Cleared when the tab closes; created only after consent",
            ],
          ],
        },
      },
      {
        heading: "2. Theme and language always work",
        paragraphs: [
          "You can change the theme and language regardless of your consent decision. Consent is required only to store that choice persistently: if the \"Preferences\" category is off, your choice applies to the current session only and is not written to your browser.",
        ],
      },
      {
        heading: "3. Analytics",
        paragraphs: [
          "Analytics records pseudonymous usage events (opening a case study, clicking a contact button, submitting the form). Without consent no session identifier is created and no event is sent.",
          "When consent is withdrawn, tracking stops immediately and the session identifier is removed from your browser.",
        ],
      },
      {
        heading: "4. How to withdraw consent",
        paragraphs: [
          "Use the \"Cookie settings\" link at the bottom of any page. Refusing is as easy as accepting: the buttons have equal prominence, and no wording or contrast nudges you toward a particular choice.",
          "You can additionally delete stored data in your browser settings.",
        ],
      },
      {
        heading: "5. Evidence of decisions",
        paragraphs: [
          "Every decision (grant or withdrawal) is recorded on the server as a separate, immutable entry: identifier, policy version, allowed categories and decision timestamp. No IP address, name, email or browser data is stored.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Use",
    seoTitle: "Terms of Use | Andrei Serbian IT Solutions",
    seoDescription:
      "Terms of use for the Andrei Serbian IT Solutions website: status of published information, purpose of the contact form, intellectual property and limitation of liability.",
    updatedLabel: "Last updated",
    updated: F.updated,
    versionLabel: "Document version",
    version: F.policyVersion,
    intro: [
      "These terms govern the use of this presentation website and its contact form. The site is not an online shop and processes no payments.",
    ],
    sections: [
      {
        heading: "1. Service provider identification",
        paragraphs: [
          `The website is operated by ${F.controller}, Republic of Moldova.`,
          `Contact: ${F.email}, Telegram ${F.telegram}.`,
          "The form of activity and the related registration / tax identification details are to be completed. [OWNER CONFIRMATION REQUIRED]",
          "Identification details are disclosed in line with the information requirements applicable to information society services, including Law No. 284/2004 on electronic commerce. [LEGAL REVIEW REQUIRED]",
        ],
      },
      {
        heading: "2. Status of published information",
        paragraphs: [
          "Service descriptions, project examples and calculator estimates are informational and do not constitute a binding public offer. Final price, scope and timeline are agreed individually and in writing.",
          "Calculator results are indicative and may differ from the final proposal.",
        ],
      },
      {
        heading: "3. Contact form",
        paragraphs: [
          "Submitting the form is a request for contact and does not in itself create a contract. Please do not include sensitive data, passwords, access keys or third-party confidential information in the form.",
          "The form is protected by request rate limiting and automated abuse checks.",
        ],
      },
      {
        heading: "4. Intellectual property",
        paragraphs: [
          "Texts, graphics, the logo and the site structure belong to the operator, except third-party elements used under their own licences.",
          "The Oswald and Golos Text fonts are used under the SIL Open Font License 1.1; the licence notices are kept alongside the font files.",
        ],
      },
      {
        heading: "5. Limitation of liability",
        paragraphs: [
          "The website is provided \"as is\". The operator does not guarantee uninterrupted availability and is not liable for decisions taken solely on the basis of published information. This clause does not limit rights that cannot be limited by law.",
        ],
      },
      {
        heading: "6. Governing law",
        paragraphs: [
          "Use of the website is governed by the laws of the Republic of Moldova. [LEGAL REVIEW REQUIRED]",
        ],
      },
      {
        heading: "7. Personal data",
        paragraphs: [
          "Personal data processing is described in the Privacy Policy and in the Cookie and Similar Technologies Policy.",
        ],
      },
    ],
  },
};
