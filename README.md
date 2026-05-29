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
| **Leverantörer** | Manage yarn suppliers — search, filter by country/fiber, fiber badges, certifications |
| **Lager** | Manage inventory — low-stock warning badges, weight/supplier filters, margin calculation |
| **Uppgifter** | Drag-and-drop Kanban board — custom columns, card priorities, category tags, linked suppliers/inventory |
