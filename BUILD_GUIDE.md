# Staybookt MVP - Build & Run Guide

## Quick Start

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

The app will load with pre-populated sample data from 15 contacts and 15 deals spread across the pipeline.

## Available Routes

- **Dashboard** (`/`) - Main hub with KPIs, funnel, lead sources, activity feed
- **Pipeline** (`/pipeline`) - Drag-and-drop Kanban board with 8 stages
- **Contacts** (`/contacts`) - Contact database with search and filtering
- **Activity** (`/activity`) - Timeline of all business activities

## Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript type definitions
├── store/
│   └── index.ts              # Zustand state management + seed data
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── KPICard.tsx           # Dashboard metric cards
│   ├── PipelineBoard.tsx     # Drag-and-drop Kanban board
│   ├── DealCard.tsx          # Individual deal cards
│   ├── ContactRow.tsx        # Contact table rows
│   ├── LeadSourceBadge.tsx   # Ring system badges
│   ├── Modal.tsx             # Modal wrapper component
│   ├── AddDealForm.tsx       # Deal creation form
│   └── AddContactForm.tsx    # Contact creation form
└── app/
    ├── layout.tsx            # Root layout with sidebar
    ├── globals.css           # Global styling
    ├── page.tsx              # Dashboard page
    ├── pipeline/page.tsx     # Pipeline page
    ├── contacts/page.tsx     # Contacts page
    └── activity/page.tsx     # Activity page
```

## Key Features

### Dashboard
- 6 KPI cards with trend indicators
- Pipeline funnel visualization
- Lead source ring distribution (Ring 1/2/3)
- Recent activity timeline
- Quick "Add Deal" button

### Pipeline Board
- 8 pipeline stages (color-coded)
- Drag-and-drop deals between stages
- Deal cards show:
  - Contact name
  - Deal title
  - Deal value
  - Lead source ring
  - Days in stage
  - Assigned person
- Real-time state persistence

### Contacts
- Full contact list in table format
- Search by name, email, or phone
- Shows contact type (Customer/Lead)
- Shows lead source with ring badge
- Shows associated deal count
- Quick email/phone action buttons

### Activity
- Timeline-style activity feed
- Icons for different activity types
- Shows contact and deal associations
- Sorted by most recent first
- Activity types: call, email, meeting, note, estimate, payment

## Data Model

### Contact
- id, name, email, phone, address
- type: 'customer' | 'lead'
- source: Lead source type
- notes, createdAt

### Deal
- id, contactId, title, value, stage
- stage: One of 8 pipeline stages
- source: Lead source type
- assignedTo: Team member name
- notes, createdAt, updatedAt

### Activity
- id, dealId, contactId, type, description, createdAt

## Lead Source Ring System

**Ring 1 (High-Quality, Zero-Cost)**
- existing_customer
- reactivation
- cross_sell

**Ring 2 (Community, Low-Cost)**
- referral
- review
- neighborhood

**Ring 3 (Paid Channels, Cost/Acquisition)**
- google_lsa
- seo
- gbp (Google Business Profile)

## Development

All state is managed client-side with zustand and persisted to localStorage. There is no backend - all data is stored locally in the browser.

### Adding Data
Use the UI buttons in each section to add new contacts and deals. Data automatically persists to localStorage.

### Building for Production
```bash
npm run build
npm start
```

## Browser Support

- Modern browsers with ES2017 support
- Chrome, Firefox, Safari, Edge (latest versions)
- localStorage required for persistence

## Sample Data

The app comes pre-loaded with:
- 15 realistic plumbing business contacts
- 15 deals with plumbing-specific job descriptions
- 5 sample activities
- All 8 pipeline stages represented
- All lead source types represented

This sample data resets on first load. After that, your data persists in localStorage.

## Design System

- **Primary Color**: Apple Blue (#0071E3)
- **Sidebar**: Dark gradient (slate-900 → slate-800)
- **Backgrounds**: Light gray (#F5F5F7)
- **Ring 1 Badge**: Emerald green
- **Ring 2 Badge**: Amber orange
- **Ring 3 Badge**: Blue
- **Typography**: System font stack
- **Border Radius**: 2xl throughout

## Tips for Investors

1. The pipeline board demonstrates industry-standard workflow
2. The lead source ring system shows sophisticated funnel management
3. The dashboard gives comprehensive business overview at a glance
4. All data persists - try the app, refresh, data is still there
5. Drag deals to move them through stages and watch real-time updates
6. The UI is responsive and clean - professional SaaS quality

## Performance

- No API calls - instant interactions
- Lightweight JavaScript bundle
- Smooth drag-and-drop animations
- localStorage ensures data persistence
- Page load time < 1 second

---

Built with Next.js 15, TypeScript, Tailwind CSS, zustand, and @hello-pangea/dnd.
