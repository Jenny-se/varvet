# Varvet CRM — Teknisk dokumentation

## Innehåll
1. [Översikt](#översikt)
2. [Teknikstack](#teknikstack)
3. [Mappstruktur](#mappstruktur)
4. [Sidor och navigering](#sidor-och-navigering)
5. [Komponenter](#komponenter)
6. [Datamodell](#datamodell)
7. [Autentisering](#autentisering)
8. [Filhantering](#filhantering)
9. [Miljövariabler](#miljövariabler)
10. [Driftsättning](#driftsättning)

---

## Översikt

Varvet CRM är ett internt verktyg för Varvet — ett garnbutik och kreativt studio i Gustavsberg. Systemet hanterar leverantörer, lager, uppgifter och moodboards. Appen är webbaserad och kräver inloggning.

---

## Teknikstack

| Del | Teknologi |
|---|---|
| Ramverk | Next.js 14 (App Router) |
| Databas & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Stilar | Tailwind CSS (anpassad höstpalett) |
| Drag-and-drop | @hello-pangea/dnd |
| Datumformatering | date-fns (sv locale) |
| Ikoner | lucide-react |
| Språk | TypeScript |
| Driftsättning | Vercel (auto-deploy vid push till main) |
| Versionshantering | Git / GitHub (Jenny-se/varvet) |

---

## Mappstruktur

```
varvet-crm/
├── app/                        # Next.js App Router — sidor
│   ├── layout.tsx              # Roturlayout (AppShell wrappas här)
│   ├── page.tsx                # Redirect → /dashboard
│   ├── globals.css             # Globala stilar och Tailwind-direktiv
│   ├── error.tsx               # Felboundary för routes
│   ├── global-error.tsx        # Global felboundary
│   ├── not-found.tsx           # 404-sida
│   ├── dashboard/page.tsx      # Översiktssida
│   ├── suppliers/page.tsx      # Leverantörssida
│   ├── inventory/page.tsx      # Lagersida
│   ├── kanban/page.tsx         # Kanban-tavla
│   ├── moodboards/
│   │   ├── page.tsx            # Moodboard-lista
│   │   └── [id]/page.tsx       # Enskild moodboard
│   ├── documents/page.tsx      # Dokumentbibliotek
│   └── login/page.tsx          # Inloggningssida
│
├── components/                 # Återanvändbara komponenter
│   ├── auth/
│   │   └── AuthProvider.tsx    # Sessionshantering och routing
│   ├── layout/
│   │   ├── AppShell.tsx        # Villkorlig layout (sidebar / login)
│   │   └── Sidebar.tsx         # Navigering med logout
│   ├── ui/
│   │   ├── Modal.tsx           # Återanvändbar modal
│   │   ├── Badge.tsx           # Märken (prioritet, kategori, vikt)
│   │   ├── EmptyState.tsx      # Tom-state komponent
│   │   └── ConfirmDialog.tsx   # Bekräftelsedialog
│   ├── dashboard/
│   │   ├── StatsCard.tsx       # Klickbar statistikruta
│   │   └── ActivityFeed.tsx    # Aktivitetsflöde
│   ├── suppliers/
│   │   ├── SupplierCard.tsx    # Leverantörskort (klickbart)
│   │   ├── SupplierForm.tsx    # Skapa/redigera leverantör
│   │   └── SupplierDetailModal.tsx  # Detaljvy + logg + filer
│   ├── inventory/
│   │   ├── InventoryCard.tsx   # Lagerprodukt med låglagervarning
│   │   └── InventoryForm.tsx   # Skapa/redigera lagerpost
│   └── kanban/
│       ├── KanbanCard.tsx      # Draggbart kort
│       ├── KanbanColumn.tsx    # Kolumn med droppzon
│       └── CardForm.tsx        # Skapa/redigera kort
│
├── lib/                        # Hjälpfunktioner och konfiguration
│   ├── supabase.ts             # Supabase-klient
│   ├── types.ts                # TypeScript-typer för alla entiteter
│   ├── activity.ts             # logActivity() — skriver till activity_feed
│   └── sanitize.ts             # sanitizeFileName() — rensar filnamn
│
├── supabase/
│   └── migrations/
│       ├── 001_initial.sql     # Grundschema (alla basTabeller)
│       ├── 002_moodboards.sql  # Moodboards + länk till kanban
│       └── 003_documents.sql   # Dokumenttabell
│
├── public/
│   └── varvet_logo.JPG         # Varvet-logotyp
│
├── .github/
│   └── workflows/
│       └── build.yml           # CI: npm run build vid push till main
│
├── .env.local                  # Miljövariabler (ej i git)
├── next.config.js              # Next.js-konfiguration (bilddomäner)
├── tailwind.config.ts          # Anpassad färgpalett
└── tsconfig.json               # TypeScript-konfiguration
```

---

## Sidor och navigering

| URL | Sida | Beskrivning |
|---|---|---|
| `/` | Redirect | Skickar direkt till `/dashboard` |
| `/login` | Inloggning | E-post + lösenord via Supabase Auth |
| `/dashboard` | Översikt | Statistik, lågt lager, förfallodatum, aktivitet |
| `/suppliers` | Leverantörer | Lista, sök, filtrera, detaljvy, logg, filer |
| `/inventory` | Lager | Lista med låglagervarning, filtrera |
| `/kanban` | Uppgifter | Drag-and-drop kanban, filtrerbar via URL |
| `/moodboards` | Moodboards | Lista med omslagsbilder |
| `/moodboards/[id]` | Moodboard | Bilder, färgrutor, anteckningar, ordna om |
| `/documents` | Dokument | Ladda upp, söka och ladda ner filer |

### URL-baserat filter (Kanban)
Prioritetsfilter: `/kanban?priority=high` | `medium` | `low`

---

## Komponenter

### AuthProvider
Hanterar inloggningsstatus. Hämtar sessionen en gång vid start, lyssnar på förändringar via `onAuthStateChange`. Redirectar automatiskt:
- Ej inloggad → `/login`
- Inloggad på `/login` → `/dashboard`

### AppShell
Villkorlig layout baserad på aktuell URL:
- På `/login` → renderar bara sidinnehållet
- Övriga sidor → renderar `<Sidebar>` + `<main>`

### Sidebar
Navigation med logotyp, fem menyval och inloggad användare med utloggningsknapp. Responsiv med mobil drawer.

### StatsCard
Klickbar statistikruta på dashboard. Stöder `href`-prop för navigering.

### SupplierDetailModal
Tre-flik-modal för leverantörer:
- **Information** — läsläge med all leverantörsdata
- **Logg** — kontaktlogg med typ, meddelande och datum
- **Filer** — uppladdning och hantering av bifogade filer

### KanbanColumn + KanbanCard
Drag-and-drop via `@hello-pangea/dnd`. Kort kan filtreras via `priorityFilter` från URL-parametrar. Kolumner kan läggas till, byta namn och raderas.

---

## Datamodell

### `suppliers`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| company_name | text | Företagsnamn |
| contact_person | text | Kontaktperson |
| email | text | E-postadress |
| phone | text | Telefonnummer |
| website | text | Webbplats |
| country_of_origin | text | Ursprungsland |
| address | text | Adress |
| notes | text | Anteckningar |
| fiber_specialties | text[] | Fiberspecialiteter (merino, alpaca…) |
| certifications | text[] | Certifieringar (GOTS, mulesing-free…) |
| minimum_order_quantity | integer | Minimiorderkvantitet |
| lead_time_days | integer | Ledtid i dagar |
| status | text | `active` \| `inactive` |

### `supplier_logs`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| supplier_id | uuid FK → suppliers | Kopplad leverantör |
| type | text | `note` \| `call` \| `email` \| `meeting` \| `order` |
| message | text | Loggtext |
| log_date | date | Valfritt datum för händelsen |
| created_at | timestamptz | Skapad automatiskt |

### `supplier_files`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| supplier_id | uuid FK → suppliers | Kopplad leverantör |
| name | text | Originalfilnamn |
| file_path | text | Sökväg i Supabase Storage |
| file_url | text | Publik URL |
| file_size | bigint | Filstorlek i bytes |
| file_type | text | MIME-typ (t.ex. application/pdf) |

### `inventory`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| product_name | text | Produktnamn |
| colorway | text | Färgväg |
| dye_lot | text | Färgparti |
| yarn_weight | text | `lace` \| `fingering` \| `DK` \| `worsted` \| `bulky` |
| fiber_content | text | Fiberinnehåll (t.ex. "100% merino") |
| meterage_per_skein | integer | Meter per härva |
| needle_size_recommendation | text | Rekommenderad nålstorlek |
| quantity_in_stock | integer | Antal i lager |
| cost_price | numeric | Inköpspris |
| retail_price | numeric | Försäljningspris |
| supplier_id | uuid FK → suppliers | Kopplad leverantör |
| low_stock_threshold | integer | Gräns för låglagervarning |
| category | text | `yarn` \| `needles` \| `accessories` |
| tags | text[] | Fria taggar |

### `kanban_columns`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| title | text | Kolumntitel |
| position | integer | Ordning (0-baserad) |

Standard-kolumner: Idéer (0), Att göra (1), Pågående (2), Klart (3)

### `kanban_cards`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| column_id | uuid FK → kanban_columns | Kolumn |
| title | text | Korttitel |
| description | text | Beskrivning |
| due_date | date | Förfallodatum |
| priority | text | `low` \| `medium` \| `high` |
| category_tag | text | `Workshop` \| `Order` \| `Marketing` \| `Admin` \| `Event` |
| assignee | text | `Jenny` \| `Cissi` \| `Båda` |
| supplier_id | uuid FK → suppliers | Valfri koppling |
| inventory_id | uuid FK → inventory | Valfri koppling |
| moodboard_id | uuid FK → moodboards | Valfri koppling |
| position | integer | Ordning inom kolumn |

### `moodboards`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| title | text | Titel |
| description | text | Beskrivning |
| tags | text[] | Taggar |

### `moodboard_items`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| moodboard_id | uuid FK → moodboards | Kopplad moodboard |
| type | text | `image` \| `color` \| `note` |
| position | integer | Ordning |
| image_url | text | URL till bild i Storage |
| color_hex | text | Färgkod (t.ex. `#C89C00`) |
| label | text | Namn på färg |
| note_text | text | Anteckningstext |

### `documents`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| name | text | Filnamn |
| description | text | Beskrivning |
| file_url | text | Publik URL |
| file_path | text | Sökväg i Supabase Storage |
| file_size | bigint | Filstorlek i bytes |
| file_type | text | MIME-typ |
| tags | text[] | Taggar |

### `activity_feed`
| Kolumn | Typ | Beskrivning |
|---|---|---|
| id | uuid PK | Unikt ID |
| action | text | Beskrivning av händelse |
| entity_type | text | `supplier` \| `inventory` \| `kanban_card` \| `moodboard` |
| entity_id | uuid | ID på berörd post |
| entity_name | text | Namn på berörd post |

---

## Autentisering

Supabase Auth med e-post och lösenord. Användarkonton skapas manuellt via Supabase Dashboard → Authentication → Users.

**Flöde:**
1. Ej inloggad användare → redirect till `/login`
2. Lyckad inloggning → `onAuthStateChange` triggas → redirect till `/dashboard`
3. Utloggning → `supabase.auth.signOut()` → redirect till `/login`

RLS (Row Level Security) är aktiverat på alla tabeller. Policys tillåter full åtkomst för `authenticated`-rollen och läsåtkomst för `anon`.

---

## Filhantering

Tre Supabase Storage-buckets används:

| Bucket | Används för | Sökvägsformat |
|---|---|---|
| `moodboard-images` | Bilder i moodboards | `{moodboard_id}/{timestamp}_{filnamn}` |
| `supplier-files` | Bifogade filer på leverantörer | `{supplier_id}/{timestamp}_{filnamn}` |
| `documents` | Dokumentbiblioteket | `{timestamp}_{filnamn}` |

Alla buckets är publika. Filnamn saneras automatiskt före uppladdning — mellanslag ersätts med `_` och tecken utanför ASCII (å, ä, ö m.fl.) ersätts med `_`.

---

## Miljövariabler

Lagras i `.env.local` (ej i Git):

```
NEXT_PUBLIC_SUPABASE_URL=https://<projekt-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-nyckel>
```

På Vercel sätts dessa under **Settings → Environment Variables**.

---

## Driftsättning

- **Repository:** github.com/Jenny-se/varvet
- **Hosting:** Vercel — auto-deploy vid push till `main`
- **CI:** GitHub Actions kör `npm run build` vid varje push

**För att deploya:** push till `main` → Vercel bygger och deployer automatiskt (~1 minut).
