import { LEGAL_FACTS, type LegalBundle } from "./types";

const F = LEGAL_FACTS;

export const legalRo: LegalBundle = {
  privacy: {
    title: "Politica de confidențialitate",
    seoTitle: "Politica de confidențialitate | Andrei Serbian IT Solutions",
    seoDescription:
      "Cum sunt prelucrate datele personale pe site-ul Andrei Serbian IT Solutions: scopuri, baze legale, destinatari, termene de păstrare și drepturile persoanei vizate.",
    updatedLabel: "Ultima actualizare",
    updated: F.updated,
    versionLabel: "Versiunea politicii",
    version: F.policyVersion,
    intro: [
      "Versiunea în limba română este versiunea de referință a acestui document. Traducerile în rusă și engleză sunt oferite pentru comoditate.",
      `Acest site (${F.site}) este un site de prezentare a serviciilor IT. Datele personale sunt prelucrate în volum minim, doar în scopurile descrise mai jos.`,
    ],
    sections: [
      {
        heading: "1. Operatorul de date",
        paragraphs: [
          `Operator: ${F.controller}, persoană fizică, Republica Moldova.`,
          `Contact pentru orice cerere privind datele personale: ${F.email}, Telegram ${F.telegram}.`,
          "Statutul de prestator de servicii (forma de activitate și datele de identificare aferente) este descris separat în Termenii de utilizare. [OWNER CONFIRMATION REQUIRED]",
        ],
      },
      {
        heading: "2. Ce date sunt prelucrate și în ce scop",
        table: {
          columns: ["Scop", "Date", "Bază legală", "Păstrare"],
          rows: [
            [
              "Prelucrarea cererilor transmise prin formularul de contact",
              "Nume, metoda de contact preferată și valoarea acesteia (Telegram, e-mail sau telefon), descrierea solicitării, bugetul și termenele indicate opțional, limba interfeței, calea paginii de pe care a fost trimis formularul",
              "Demersuri precontractuale la cererea persoanei vizate",
              "24 de luni de la ultima interacțiune [OWNER CONFIRMATION REQUIRED]",
            ],
            [
              "Analitică pseudonimă a utilizării site-ului",
              "Denumirea evenimentului, calea paginii (fără parametrii de interogare), limba, identificatorul cazului deschis, identificatorul de sesiune (session_id), identificatorul consimțământului (consent_id) și identificatorul deciziei de consimțământ",
              "Consimțământ",
              "12 luni [OWNER CONFIRMATION REQUIRED]",
            ],
            [
              "Păstrarea persistentă a preferințelor de temă și limbă",
              "Valorile alese pentru temă și limbă, stocate în browserul dvs.",
              "Consimțământ",
              "Până la retragerea consimțământului sau ștergerea datelor din browser",
            ],
            [
              "Prevenirea abuzurilor și limitarea numărului de cereri (rate limiting)",
              "Un cod HMAC cu cheie secretă, derivat din adresa IP a solicitantului, și domeniul de aplicare al limitei. Adresa IP în formă brută nu este salvată",
              "Interes legitim",
              "Înregistrările mai vechi de 24 de ore sunt șterse automat, o dată pe oră (durata efectivă maximă ~25 de ore)",
            ],
            [
              "Dovada consimțământului (responsabilizare)",
              "Identificatorul consimțământului, versiunea politicii, categoriile permise sau refuzate, momentul deciziei. Fără IP, fără date de identificare, fără date despre browser",
              "Obligație legală / responsabilizare",
              "Pe durata necesară pentru a demonstra deciziile luate [LEGAL REVIEW REQUIRED]",
            ],
          ],
        },
        paragraphs: [
          "Analitica este pseudonimă, nu anonimă: evenimentele includ un identificator de sesiune și identificatorul consimțământului.",
        ],
      },
      {
        heading: "3. Evaluarea echilibrului pentru interesul legitim (rate limiting)",
        bullets: [
          "Interesul urmărit: menținerea disponibilității site-ului și protejarea formularului de trimiteri automatizate și abuzive.",
          "Necesitate: fără o limitare per solicitant, formularul poate fi folosit pentru inundarea canalelor de notificare; nu există o măsură la fel de eficientă fără nicio identificare.",
          "Minimizare: adresa IP nu este stocată nici în baza de date, nici în jurnale; se stochează exclusiv un cod HMAC cu cheie secretă, care nu permite reconstituirea adresei.",
          "Impact: efect minim asupra persoanei; datele nu sunt folosite pentru profilare, marketing sau decizii automatizate și sunt șterse în cel mult ~25 de ore.",
        ],
      },
      {
        heading: "4. Destinatari și prestatori de servicii",
        paragraphs: [
          "Pentru funcționarea site-ului sunt folosiți următorii destinatari / prestatori de servicii:",
        ],
        bullets: [
          "Lovable — găzduirea site-ului și livrarea conținutului static.",
          "Supabase — baza de date și funcțiile server care primesc cererile din formular, evenimentele de analitică și înregistrările de consimțământ.",
          "Cloudflare — rețeaua edge prin care trec cererile către funcțiile server.",
          "Telegram Messenger — livrarea notificării despre o cerere nouă către operator.",
          "Google (Gmail) — destinatar / prestator de servicii pentru livrarea notificărilor prin e-mail.",
        ],
      },
      {
        heading: "5. Fonturi și resurse externe",
        paragraphs: [
          "Fonturile (Oswald, Golos Text) sunt găzduite pe propriul domeniu al site-ului. La încărcarea paginii browserul dvs. nu trimite cereri către serverele Google, deci adresa dvs. IP nu este transmisă către Google în acest context.",
          "Site-ul nu folosește rețele publicitare, pixeli de urmărire, hărți încorporate sau widget-uri de rețele sociale.",
        ],
      },
      {
        heading: "6. Transferuri transfrontaliere",
        paragraphs: [
          "Unii destinatari menționați la punctul 4 pot prelucra datele în afara Republicii Moldova, inclusiv în Uniunea Europeană și în Statele Unite ale Americii. Instrumentul juridic aplicabil pentru fiecare transfer și documentația aferentă sunt în curs de verificare. [LEGAL REVIEW REQUIRED]",
        ],
      },
      {
        heading: "7. Drepturile dvs.",
        paragraphs: [
          "În cazurile și condițiile prevăzute de lege, aveți dreptul de a solicita: accesul la datele dvs., rectificarea, ștergerea, restricționarea prelucrării, opoziția la prelucrarea bazată pe interes legitim, precum și retragerea consimțământului în orice moment, fără a afecta legalitatea prelucrării anterioare.",
          `Cererile se transmit la ${F.email}. Vă putem solicita informații suplimentare doar în măsura necesară pentru a identifica datele la care se referă cererea.`,
          "Aveți de asemenea dreptul de a depune o plângere la Centrul Național pentru Protecția Datelor cu Caracter Personal al Republicii Moldova.",
        ],
      },
      {
        heading: "8. Cadrul legal aplicabil",
        paragraphs: [
          "Prelucrarea se realizează în conformitate cu Legea nr. 133/2011 privind protecția datelor cu caracter personal, aplicabilă până la data intrării în vigoare a Legii nr. 195/2024 privind protecția datelor cu caracter personal, respectiv 23.08.2026. Documentul este construit pentru a respecta ambele cadre în perioada de tranziție.",
        ],
      },
      {
        heading: "9. Securitate și incidente",
        paragraphs: [
          "Accesul direct la tabelele bazei de date este blocat pentru vizitatori: datele pot fi scrise doar prin funcții server validate. Cheile și secretele nu sunt expuse în codul care rulează în browser.",
          "În cazul unui incident de securitate care afectează datele personale, operatorul aplică o procedură internă de reacție și notificare, conform cerințelor legale aplicabile.",
        ],
      },
      {
        heading: "10. Modificări",
        paragraphs: [
          "Versiunea politicii legată de consimțământ este afișată mai sus. La modificări materiale (scopuri noi, categorii noi de date sau destinatari noi legați de consimțământ) versiunea este incrementată și vi se solicită din nou consimțământul.",
        ],
      },
    ],
  },

  cookies: {
    title: "Politica privind cookie-urile și tehnologiile similare",
    seoTitle: "Politica cookie și tehnologii similare | Andrei Serbian IT Solutions",
    seoDescription:
      "Inventarul complet al datelor stocate în browser pe site-ul Andrei Serbian IT Solutions: localStorage, sessionStorage, scopuri, durată și modul de retragere a consimțământului.",
    updatedLabel: "Ultima actualizare",
    updated: F.updated,
    versionLabel: "Versiunea politicii",
    version: F.policyVersion,
    intro: [
      "Codul aplicației acestui site nu instalează cookie-uri proprii în browserul dvs. Sunt însă folosite tehnologii similare de stocare locală: localStorage și sessionStorage.",
      "Stocarea neesențială este activată numai după consimțământul dvs. explicit.",
    ],
    sections: [
      {
        heading: "1. Inventarul stocării locale",
        table: {
          columns: ["Nume", "Tip", "Scop", "Categorie", "Durată"],
          rows: [
            [
              "consent_state_v1",
              "localStorage",
              "Reține decizia dvs. privind consimțământul, pentru a nu afișa din nou bannerul și a putea aplica imediat retragerea",
              "Esențial",
              "Persistent, până la ștergerea datelor browserului",
            ],
            [
              "theme",
              "localStorage",
              "Reține tema aleasă (întunecată sau deschisă) între vizite",
              "Preferințe (consimțământ)",
              "Persistent, până la retragerea consimțământului",
            ],
            [
              "lang",
              "localStorage",
              "Reține limba aleasă între vizite",
              "Preferințe (consimțământ)",
              "Persistent, până la retragerea consimțământului",
            ],
            [
              "anon_session_id",
              "sessionStorage",
              "Identificator de sesiune pseudonim, atașat evenimentelor de analitică",
              "Analitică (consimțământ)",
              "Se șterge la închiderea tabului; se creează doar după consimțământ",
            ],
          ],
        },
      },
      {
        heading: "2. Tema și limba funcționează întotdeauna",
        paragraphs: [
          "Puteți schimba tema și limba indiferent de decizia privind consimțământul. Consimțământul este necesar doar pentru păstrarea persistentă a acestei alegeri: dacă categoria „Preferințe” este dezactivată, alegerea se aplică doar pentru sesiunea curentă și nu este salvată în browser.",
        ],
      },
      {
        heading: "3. Analitica",
        paragraphs: [
          "Analitica înregistrează evenimente pseudonime privind utilizarea site-ului (deschiderea unui caz, apăsarea unui buton de contact, trimiterea formularului). Dacă nu ați acordat consimțământul, nu se creează niciun identificator de sesiune și nu se trimite niciun eveniment.",
          "La retragerea consimțământului, urmărirea se oprește imediat, iar identificatorul de sesiune este șters din browser.",
        ],
      },
      {
        heading: "4. Cum retrageți consimțământul",
        paragraphs: [
          "Folosiți linkul „Setări cookie” din partea de jos a fiecărei pagini. Refuzul este la fel de simplu ca acordul: butoanele au aceeași vizibilitate și nu sunt folosite formulări sau contraste care să vă influențeze decizia.",
          "Suplimentar, puteți șterge datele stocate direct din setările browserului dvs.",
        ],
      },
      {
        heading: "5. Dovada deciziilor",
        paragraphs: [
          "Fiecare decizie (acordare sau retragere) este înregistrată pe server ca o intrare separată, imuabilă: identificator, versiunea politicii, categoriile permise și momentul deciziei. Nu se stochează adresa IP, numele, e-mailul sau datele despre browser.",
        ],
      },
    ],
  },

  terms: {
    title: "Termeni de utilizare",
    seoTitle: "Termeni de utilizare | Andrei Serbian IT Solutions",
    seoDescription:
      "Termenii de utilizare a site-ului Andrei Serbian IT Solutions: statutul informațiilor publicate, natura formularului de contact, proprietatea intelectuală și limitarea răspunderii.",
    updatedLabel: "Ultima actualizare",
    updated: F.updated,
    versionLabel: "Versiunea documentului",
    version: F.policyVersion,
    intro: [
      "Acești termeni reglementează utilizarea site-ului de prezentare și a formularului de contact. Site-ul nu este un magazin online și nu procesează plăți.",
    ],
    sections: [
      {
        heading: "1. Identificarea prestatorului",
        paragraphs: [
          `Site-ul este administrat de ${F.controller}, Republica Moldova.`,
          `Contact: ${F.email}, Telegram ${F.telegram}.`,
          "Forma de desfășurare a activității și datele de identificare fiscale / de înregistrare aferente urmează să fie completate. [OWNER CONFIRMATION REQUIRED]",
          "Informațiile de identificare sunt furnizate în conformitate cu cerințele de informare aplicabile serviciilor societății informaționale, inclusiv Legea nr. 284/2004 privind comerțul electronic. [LEGAL REVIEW REQUIRED]",
        ],
      },
      {
        heading: "2. Statutul informațiilor publicate",
        paragraphs: [
          "Descrierile serviciilor, exemplele de proiecte și estimările afișate de calculator au caracter informativ și nu constituie o ofertă publică obligatorie. Prețul, volumul și termenele finale se stabilesc individual, în scris.",
          "Rezultatele calculatorului sunt orientative și pot diferi de oferta finală.",
        ],
      },
      {
        heading: "3. Formularul de contact",
        paragraphs: [
          "Trimiterea formularului reprezintă o solicitare de contact și nu creează în sine un contract. Vă rugăm să nu includeți în formular date sensibile, parole, chei de acces sau informații confidențiale ale terților.",
          "Formularul este protejat prin limitarea numărului de cereri și prin verificări automate împotriva trimiterilor abuzive.",
        ],
      },
      {
        heading: "4. Proprietate intelectuală",
        paragraphs: [
          "Textele, elementele grafice, logotipul și structura site-ului aparțin operatorului, cu excepția elementelor terților folosite conform licențelor proprii.",
          "Fonturile Oswald și Golos Text sunt utilizate în baza licenței SIL Open Font License 1.1; notele de licență sunt păstrate împreună cu fișierele fonturilor.",
        ],
      },
      {
        heading: "5. Limitarea răspunderii",
        paragraphs: [
          "Site-ul este oferit „așa cum este”. Operatorul nu garantează funcționarea neîntreruptă și nu răspunde pentru deciziile luate exclusiv pe baza informațiilor publicate. Această clauză nu limitează drepturile care nu pot fi limitate potrivit legii.",
        ],
      },
      {
        heading: "6. Legea aplicabilă",
        paragraphs: [
          "Utilizarea site-ului este guvernată de legislația Republicii Moldova. [LEGAL REVIEW REQUIRED]",
        ],
      },
      {
        heading: "7. Date personale",
        paragraphs: [
          "Prelucrarea datelor personale este descrisă în Politica de confidențialitate și în Politica privind cookie-urile și tehnologiile similare.",
        ],
      },
    ],
  },
};
