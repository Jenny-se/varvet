# Varvet CRM

CRM system for Varvet — yarn shop and creative studio in Gustavsberg, Sweden.

## Tech stack

- **Next.js 14** (App Router)
- **Supabase** (Postgres + Auth + RLS)
- **Tailwind CSS** (custom warm, Scandinavian palette)
- **@hello-pangea/dnd** (drag-and-drop Kanban)
- **date-fns** (date formatting, Swedish locale)
- **TypeScript**

## Repository

https://github.com/Jenny-se/varvet

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run the migration file: `supabase/migrations/001_initial.sql`
3. Copy your project URL and anon key from **Settings → API**

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

## GitHub Actions

Add your Supabase credentials as repository secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The workflow at `.github/workflows/build.yml` runs `npm run build` on every push to `main`.

## Features

| Section | Description |
|---|---|
| **Översikt** | Dashboard with stats, low-stock alerts, upcoming due dates, activity feed |
| **Leverantörer** | Manage yarn suppliers — search, filter by country/fiber, fiber badges, certifications, contact log, file attachments |
| **Lager** | Manage inventory — low-stock warning badges, weight/supplier filters, margin calculation |
| **Uppgifter** | Drag-and-drop Kanban board — custom columns, card priorities, category tags, linked suppliers/inventory |
| **Moodboards** | Visual inspiration boards — drag-and-drop image, colour, and note items |

## Storage

Files (supplier attachments) and moodboard images are stored in **private** Supabase Storage buckets:

- `documents` — general document library (PDFs, images, spreadsheets etc.)
- `supplier-files` — files attached to individual supplier records
- `moodboard-images` — images uploaded to moodboards

Access is granted via **signed URLs** (1-hour expiry), generated on demand in `lib/storage.ts`. Buckets must be set to **Private** in the Supabase dashboard (Storage → bucket settings) for this to be effective — public buckets expose files regardless of signed URL usage.

### Supabase Storage setup

1. In the Supabase dashboard, go to **Storage** and create three buckets: `documents`, `supplier-files`, and `moodboard-images`
2. Set both buckets to **Private**
3. Add a storage policy allowing authenticated users to upload and download from each bucket
