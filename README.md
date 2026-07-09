# Varvet CRM

CRM system for Varvet — yarn shop and creative studio in Gustavsberg, Sweden.

## Tech stack

- **Next.js 14** (App Router)
- **Supabase** (Postgres + Auth + RLS + Storage)
- **Tailwind CSS** (custom warm, Scandinavian palette)
- **@hello-pangea/dnd** (drag-and-drop Kanban)
- **Recharts** (monthly expense chart)
- **date-fns** (date formatting, Swedish locale)
- **cheerio** (HTML parsing for stock scraper)
- **TypeScript**

## Repository

https://github.com/Jenny-se/varvet

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run all Supabase migrations

In the Supabase SQL Editor, run each migration in order:

| File | Description |
|---|---|
| `supabase/migrations/001_initial.sql` | Core tables: suppliers, inventory, kanban, activity feed |
| `supabase/migrations/002_moodboards.sql` | Moodboards and moodboard items |
| `supabase/migrations/003_documents.sql` | Document library |
| `supabase/migrations/004_activity_user.sql` | Add user_email to activity feed |
| `supabase/migrations/005_expenses.sql` | Expense tracker |
| `supabase/migrations/006_stock_tracking.sql` | Competitor stock snapshots |

### 3. Configure environment

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

| Section | Description |
|---|---|
| **Översikt** | Dashboard with stats, low-stock alerts, upcoming due dates, activity feed with user |
| **Leverantörer** | Manage yarn suppliers — search, filter by country/fiber, fiber badges, certifications, contact log, file attachments |
| **Lager** | Manage inventory — low-stock warning badges, weight/supplier filters, margin calculation |
| **Uppgifter** | Drag-and-drop Kanban board — custom columns, card priorities, category tags, linked suppliers/inventory |
| **Moodboards** | Visual inspiration boards — drag-and-drop image, colour, and note items |
| **Dokument** | General document library — upload PDFs, images, spreadsheets with tags and descriptions |
| **Utgifter** | Expense tracker — log amounts, categories (Hyra/Garn/Accessoarer/Representation/custom), supplier link, paid status, monthly bar chart |

## Storage

Files and images are stored in **private** Supabase Storage buckets using signed URLs (1-hour expiry). All file access goes through `lib/storage.ts`.

### Buckets

| Bucket | Used by |
|---|---|
| `supplier-files` | File attachments in the supplier detail modal |
| `documents` | General document library (/documents) |
| `moodboard-images` | Images uploaded to moodboards |

### Setup

1. In Supabase → **Storage**, create the three buckets above and set each to **Private**
2. Add SELECT policies so authenticated users can download:

```sql
create policy "Authenticated users can download supplier files"
  on storage.objects for select to authenticated using (bucket_id = 'supplier-files');

create policy "Authenticated users can download documents"
  on storage.objects for select to authenticated using (bucket_id = 'documents');

create policy "Authenticated users can view moodboard images"
  on storage.objects for select to authenticated using (bucket_id = 'moodboard-images');
```

## GitHub Actions

Two automated workflows run on this repo:

### Build (`build.yml`)
Runs `npm run build` on every push to `main`.

Required secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Stock scraper (`scrape-stock.yml`)
Runs every day at 06:00 UTC (08:00 Swedish summer time). Scrapes stock levels for three Rauma yarn products from garnr.se and saves daily snapshots to the `stock_snapshots` table.

Tracked products:
- Rauma Finull — https://garnr.se/p/rauma-finull/
- Rauma Fivel — https://garnr.se/p/rauma-fivel/
- Rauma Lamull — https://garnr.se/p/rauma-lamull/

Required secret:
- `SUPABASE_SERVICE_ROLE_KEY` — found in Supabase → Settings → API → service_role key

Can also be triggered manually from the GitHub Actions tab.
