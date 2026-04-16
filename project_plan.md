# AMEEN — Activity Monitoring for Events & Entities Nationally

## 1. Project Description
AMEEN (أمين) is a centralized data collection and intelligence platform operated by the Royal Oman Police (ROP) under the iBorders initiative in the Sultanate of Oman. It receives real-time event data from 13 external entity categories via B2B API or the AMEEN Portal. Data feeds into the Visitor Intelligence System (VIS) for background risk assessment. Risk results are strictly internal and never shared with external entities.

**AMEEN Hospitality** (أمين للضيافة) is a separate standalone desktop hotel management app given free to small hotels without their own PMS. It syncs data to AMEEN in the background but has its own login and is a completely separate product.

- **Target Users:** External entities (hotels, car rentals, telecom operators, municipalities, etc.) for data submission; ROP internal staff for monitoring
- **Core Value:** Centralized national intelligence data collection with bilingual (EN/AR RTL) enterprise UI

## 2. Page Structure (Single-Page Sections)
- `/` — Home (Hero + Animated Counters + Overview)
- `#core-services` — Core Services (4 core data streams)
- `#extended-services` — Extended Services (9 extended data streams)
- `#data-streams` — Data Streams (All 13 streams detail + Architecture diagram)
- `#api-integration` — API & Integration (B2B API docs, portal access)
- `#about` — About & Contact (ROP/iBorders info, contact form)

## 3. Core Features
- [x] Bilingual EN/AR with full RTL support
- [x] Dark futuristic intelligence design system
- [x] Animated counters (events, alerts, sources)
- [x] 13 data stream cards (4 Core + 9 Extended) with expandable event types
- [x] Architecture flow diagram
- [x] API & Integration documentation section
- [x] AMEEN Hospitality standalone product showcase
- [x] Contact form
- [x] Language toggle (EN/AR)
- [x] Responsive navigation with smooth scroll

## 4. Data Model Design
No database required — this is a marketing/information website. Mock data used for counters and event types.

## 5. Backend / Third-party Integration Plan
- Supabase: Not needed for this phase
- Shopify: Not needed
- Stripe: Not needed
- Contact Form: Using get_form_url for contact submissions

## 6. Development Phase Plan

### Phase 1: Foundation + Home Section ✅
- Goal: Setup design system, i18n, navigation, hero section with counters
- Deliverable: Working bilingual homepage with animated hero

### Phase 2: Services & Data Streams ✅
- Goal: All 13 service cards + architecture diagram
- Deliverable: Complete services and data streams sections

### Phase 3: API, About & Contact ✅
- Goal: API integration docs, about section, contact form, footer
- Deliverable: Complete single-page website

### Phase 4: AMEEN Hospitality Standalone App ✅
- Goal: Separate standalone desktop hotel management system
- Routes: /hospitality/login, /hospitality/setup, /hospitality/app
- Deliverable: Login screen, 4-step setup wizard, full app shell with dashboard, bookings, rooms, guests, AMEEN sync log
