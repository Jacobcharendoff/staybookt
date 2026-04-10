# Staybookt (Growth OS) — Claude Code Project Memory

## What This Is
Staybookt is a CRM and business operating system for Canadian service businesses (plumbers, HVAC, electricians, roofers, landscapers, cleaners). Live at staybookt.com. Built by Jacob Charendoff.

## Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript strict mode
- **React**: v19
- **Styling**: Tailwind CSS v4 — mobile-first responsive (base mobile → sm:640px → md:768px → lg:1024px)
- **State**: Zustand with persist middleware
- **Database**: Supabase (PostgreSQL) via Drizzle ORM
- **Auth**: Supabase Auth with middleware-based route protection
- **Payments**: Stripe (CAD-native)
- **Email**: Resend
- **SMS/Voice**: Twilio
- **Charts**: Recharts
- **Icons**: lucide-react
- **Drag & Drop**: @hello-pangea/dnd
- **Validation**: Zod
- **Deployment**: Vercel auto-deploy from GitHub main branch
- **Repo**: github.com/Jacobcharendoff/staybookt

## Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Marketing landing page (~1500 lines)
│   ├── layout.tsx                  # Root layout
│   ├── middleware.ts               # Supabase auth + route protection
│   ├── (app)/                      # Authenticated app pages (with Sidebar)
│   │   ├── layout.tsx              # App layout with Sidebar
│   │   ├── dashboard/page.tsx      # KPI cards, charts, activity feed
│   │   ├── pipeline/page.tsx       # Kanban board with drag-and-drop
│   │   ├── contacts/page.tsx       # Contact management + import
│   │   ├── estimates/page.tsx      # Estimate creation and tracking
│   │   ├── invoices/page.tsx       # Invoice management
│   │   ├── schedule/page.tsx       # Calendar/scheduling
│   │   ├── reports/page.tsx        # Revenue and performance reports
│   │   ├── automations/page.tsx    # Automation playbooks
│   │   ├── advisor/page.tsx        # AI growth advisor
│   │   ├── leads/page.tsx          # Lead scoring and management
│   │   ├── activity/page.tsx       # Activity feed
│   │   ├── messages/page.tsx       # SMS/email messaging
│   │   ├── notifications/page.tsx  # Notification center
│   │   ├── settings/page.tsx       # Company settings
│   │   ├── setup/page.tsx          # Onboarding wizard
│   │   └── templates/page.tsx      # Email/SMS templates
│   ├── (auth)/                     # Auth pages (login, reset-password)
│   ├── (marketing)/                # Public marketing pages (pricing, verticals, comparisons)
│   ├── portal/                     # Client-facing portal (estimates, invoices, payments)
│   └── api/                        # API routes (contacts, deals, estimates, invoices, etc.)
├── components/                     # Shared React components
├── lib/                            # Utilities and service integrations
│   ├── canadian-tax.ts             # Provincial tax calculation (GST/HST/PST/QST)
│   ├── lead-scoring.ts             # Lead qualification scoring
│   ├── stripe.ts                   # Stripe integration
│   ├── twilio.ts                   # SMS/voice integration
│   ├── resend.ts                   # Email service
│   ├── supabase.ts                 # Client-side Supabase
│   ├── supabase-server.ts          # Server-side Supabase
│   ├── rbac.ts                     # Role-based access control
│   ├── portal-tokens.ts            # Client portal token management
│   ├── webhooks.ts                 # Outbound webhook system
│   └── data-service.ts             # Data access layer
├── store/index.ts                  # Zustand store (contacts, deals, settings, etc.)
├── i18n/translations.ts            # EN/FR bilingual translations
├── server/db/
│   ├── schema.ts                   # Drizzle ORM schema (PostgreSQL)
│   └── index.ts                    # DB connection
├── hooks/                          # Custom React hooks
└── types/index.ts                  # Shared TypeScript interfaces
```

## Pipeline Stages (in order)
new_lead → contacted → estimate_scheduled → estimate_sent → booked → in_progress → completed → invoiced

## Lead Sources (Three Rings Model)
Ring 1 (Harvest): existing_customer, reactivation, cross_sell
Ring 2 (Amplify): referral, review, neighborhood
Ring 3 (Acquire): google_lsa, seo, gbp

## Bilingual (EN/FR)
All user-facing strings go through `src/i18n/translations.ts`. Components use `const { t } = useLanguage()` from `src/components/LanguageProvider.tsx`. Every new string needs both EN and FR entries. Quebec users default to FR.

## Coding Conventions
- `'use client'` directive on any component with hooks, event handlers, or browser APIs
- TypeScript strict: no `any`, define interfaces for all data structures
- Tailwind mobile-first: always start with mobile styles, scale up with sm:/md:/lg:
  - Padding: `p-4 sm:p-6 lg:p-8` (NOT `p-8` alone)
  - Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
  - Fonts: `text-xl sm:text-2xl md:text-3xl`
  - Touch targets: minimum 44px for interactive elements
- Zustand for global state, React state for local UI
- Import order: React/Next → third-party → @/ local components → @/ local utils
- File naming: PascalCase components, camelCase utilities
- Dark mode: use isDark pattern from ThemeProvider, slate-900/slate-800 for dark surfaces

## Design System
- Primary: #0071E3 (blue-600)
- Success/CTA: #27AE60 (emerald)
- Background: slate-50 (light), slate-950 (dark)
- Cards: white with shadow-sm, rounded-xl
- Status: emerald (positive), amber (warning), rose (negative)

## Canadian-Specific Features
- Tax engine in `src/lib/canadian-tax.ts` — auto-calculates GST/HST/PST/QST by province
- All invoices CRA-compliant (registration number, proper tax breakdown)
- Stripe processes in CAD
- Provincial license tracking support
- Company province stored in Zustand settings (`companyProvince`)

## Key Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build (must pass before pushing)
npm run lint         # ESLint
git push origin main # Triggers Vercel auto-deploy
```

## Current State
The app is a fully functional prototype with mock data persisted in Zustand (localStorage). Backend API routes exist for contacts, deals, estimates, invoices, activities, auth, payments, email, SMS, calendar, tax, team, settings, webhooks, and portal. Supabase and Drizzle schema are defined but the app falls back to demo mode gracefully when Supabase isn't configured.

## What NOT to Do
- Never use fixed desktop-only padding (p-8, px-6) without mobile breakpoints
- Never skip bilingual — every user-facing string needs EN + FR in translations.ts
- Never push without running `npm run build` first
- Never use `any` types
- Never hardcode tax rates — always use the canadian-tax utility
