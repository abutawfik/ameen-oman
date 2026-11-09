# Al-Ameen Portal — Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Versioning follows `MAJOR.MINOR.PATCH` (see `version.json`).

---

## [1.10.0] — 2026-11-09 · Integration Workshop Prep

### Added
- **Integration API Map** (`docs/AlAmeen-Integration-API-Map.md`) — 518-line reference covering all 8 integration points between SITA I:Sight, airlines (APIS/PNR), Interpol, sanctions lists, and the portal's 16 outbound intelligence streams. Includes ASCII architecture diagram, full payload schemas, endpoint definitions, common enums, 10 open questions, and a 2h45m workshop agenda.
- **Sample fixtures** (`docs/samples/`) — Three consistent, interlinked test files built around the WY456/TH-001 demo scenario:
  - `apis-sample-WY456.json` — 10-passenger APIS message (AMM→MCT); seat 22A flagged `WATCHLIST_HIT`, plus `DOC_NEAR_EXPIRY`, `NO_SHOW`, and `GO_SHOW` edge cases
  - `pnr-sample-WY456.json` — 2 PNR records; HXKP91 (Ahmed Khaleel, one-way, cash, AMM→MCT→BKK, T-26h) with 5 `_riskFlags`; MLTZ44 (normal return, corporate card, Sindbad Gold)
  - `watchlist-sample-interpol.csv` — 10 Interpol Red Notice / DIF entries covering TERRORISM, DRUG_TRAFFICKING, FINANCIAL_CRIME, HUMAN_TRAFFICKING, WMD_PROLIFERATION, RUSSIA_SANCTIONS; RN-2024-12345 (Ahmad Khalil) is the TH-001 target anchor
- **Stub API backend** (`server/`) — Express server (port 3001, ES modules, no build step) implementing all ~30 endpoints from the API map. Seeded with TH-001..TH-004 hit data, all APIS/PNR fixtures, and Interpol CSV. Mutable in-memory state: escalating a hit cascades to its case lane; acknowledging an alert updates its status. Endpoints: auth, services, flights (APIS/PNR ingest), checkpoints + alerts + stats, watchlist + targets + sync, hits + actions, risk queue + entity assessment, cases + status + resolve, TPI (co-traveler, trafficking, document-anomaly, route-signatures), search, 16-stream ingest, health. CORS open for `localhost:3004` and `alameen.tech`.
- Root `npm run server:dev` / `server:start` scripts for one-command startup

### Changed
- `vite.config.ts` — `strictPort: true` so a busy port 3004 fails fast instead of silently moving to 3001 (which now belongs to the stub)
- `version.json` bumped 1.9.0 → 1.10.0

---

## [1.9.0] — 2026-10-15 · Branding, Workflows, Test Suite & CI

### Added
- **GitHub Actions CI** (`.github/workflows/ci.yml`) — Node 22, full type-check, test suite on every push; bot auto-bumps BUILD in `version.json` after each successful run
- **Test suite** (`tests/`) — initial `.mjs` test files exercising core workflow utilities; `npm test` wired via Node's built-in `--test` runner (no Jest/Vitest dependency)
- **Branding overhaul** — updated color tokens, typography scale, and logo treatment across `src/brand/`; unified `riskColors.ts` canonical system eliminating 11 color inconsistencies across 87 files
- **Workflow layer** — pure in-memory/`localStorage` functions in `src/workflows/` backing Target Match (`selectTargetHit`), sidebar pins (`alm_pins`), and notification state

### Fixed
- Mobile sidebar: auto-collapse to icon rail on viewports < 768px
- National Security: wired missing `onClick` handlers on action cards
- eCommerce Intelligence: restored missing `useNavigate` import

### Changed
- `refactor(headers)` — `PageHeader` component wired across all dashboard pages
- Demo walkthrough updated: port 3002→3004, sidebar setup section, mobile Q&A, revision history row

---

## [1.8.0] — 2026-10-10 · Sidebar Pin/Unpin, Nav Completion & UX Polish

### Added
- **Sidebar pin/unpin** — drag-to-pin UI with `📌` reveal button; pinned items persist via `localStorage` key `alm_pins`; default pins: Command Center, Target Match, Case Management, Watchlist & Targets, Search
- **Nav completion** — 12 previously missing dashboard routes wired into sidebar nav (eCommerce, Education, Employment, Healthcare, Marine, Municipality, Postal, Tourism, Transport, Utility, Hospitality, Calendar Events)
- **Target Match UX** — auto-selects first pending hit on load; PNR enrichment panel inline on hit detail

### Fixed
- PageHeader wired across remaining 20 pages lacking it
- Ghost sign-out button replacing red destructive variant in sidebar
- Sidebar reorganized into 6 operational sections with clear labels (Core Operations, Intelligence Streams, Identity & Risk, Administration, Analytics, Configuration)

### Changed
- Operator Console home: 5 design critique priorities — SLA breach link, ACK/ESCALATE hierarchy, alert count badges
- Supervisor home: 3-segment SLA bars, escalation-first column order, `SourceChip` tooltips and DEGRADED states
- `version.json` bumped 1.7.0 → 1.8.0

---

## [1.7.0] — 2026-10-09 · Travel Pattern Intelligence

### Added
- **Travel Pattern Intelligence module** (`/dashboard/travel-pattern-intelligence`) — 5 behavioral analysis engines:
  - **Co-Traveler Engine** — detects repeat travel companions across unrelated bookings
  - **Trafficking Indicators** — 8-factor scoring model (new passport, one-way ticket, transit-booked-in-transit, phone-to-facilitator link, etc.)
  - **Document Anomaly** — biometric similarity cross-check; airside document-swap detection
  - **Route Signatures** — recurring geographic patterns with hub/spoke clustering
  - **Foreign Fighter Profiler** — journey-pattern matching against known radicalization routes
- TPI → Case Management integration: "Create Case" modal pre-populated from TPI finding (subject, risk level, source, notes)
- TPI → Person-360 cross-link: subject names in TPI results navigate to full dossier
- TPI alert feed wired into Border Dashboard → Alert Feed tab
- Beat 8 of demo walkthrough updated with TPI section

### Changed
- Risk level colors standardized site-wide using `riskColors.ts` (11 components updated)
- Minimum text size enforced at 11px across all pages (a11y)
- `version.json` bumped 1.6.0 → 1.7.0

---

## [1.6.0] — 2026-08-18 · Phase 5: Remaining Spec Items

### Added
- **Target Match workflow** (`/dashboard/target-match`) — Ch 9.5.5: stats row (Pending / Confirmed / False Positives / Escalated), candidate queue with confidence bars and risk badges, Target Record vs Incoming Traveler side-by-side comparison, 4 weighted match factors with progress bars, action bar (Defer 24h / False Positive / Escalate / Confirm Match)
- **Services Dashboard** (`/dashboard/services-dashboard`) — Ch 6.2: live stats (47 active services, 8 234 pax, 23 high-risk, 11 open hits), search + risk-level + status filter bar, 10-row sticky table, 400 px slide-in detail panel with 5-pax manifest sample
- **Border Dashboard** (`/dashboard/border-dashboard`) — Ch 6.4: 3 tabs (Operations View / Alert Feed / Processing Stats), 2×4 checkpoint card grid with per-checkpoint recent crossings, live alert feed with Acknowledge buttons, inline SVG 8-hour processing bar chart
- **Identity Split flow** — Ch 8 / TiDM: SplitWizard 3-step modal on merged records in `/dashboard/identity-compare` (Step 1: per-attribute A/B toggle; Step 2: side-by-side review; Step 3: confirm → SPLIT status). `SPLIT` added to `EntityMatchCandidate` status union and `entity-resolution` counts
- **Targets Attachment upload** — Ch 9.5.7: Attachments tab in `watchlist/ImportExport` with drag-and-drop zone (PDF / JPG / PNG / DOCX, 25 MB max), populated attachment table (ATT-001 → ATT-003), Import Validation Rules card with 4 toggles and fuzzy-match threshold slider (70–100%, default 85%)
- **Risk Config Version History** — Ch 9.9: Version History tab in `risk-assessment/ScoreConfig`; `ConfigVersion` type, 3 seeded versions (Khalid / Nour / Ahmed), "Save as New Version" form with label + note, gold left border on latest, Revert button on older versions

### Changed
- `version.json` bumped 1.5.0 → 1.6.0
- `docs/AlAmeen-Gap-Analysis.md` updated to v3.0: 6 ⚠️ Partial items promoted to ✅ Built; spec-deliverable coverage now **28/31** (3 remaining are ForgeRock / external-system dependencies)

---

## [1.5.0] — 2026-08-18 · Phase 4: Identity Compare/Merge, Viz Library, Auth Flows, User Management

### Added
- **Identity Compare & Merge** (`/dashboard/identity-compare`) — Ch 8: candidate queue, 5-factor similarity panel, attribute-level comparison table, 3-step merge wizard (review → resolve conflicts → confirm), MERGE → MERGED lifecycle
- **Viz Library & Dashboard Builder** (`/dashboard/viz-library`) — Ch 13: 12-widget gallery (inline SVG — no external chart lib), drag-and-drop Dashboard Builder canvas, 3 pre-built Saved Dashboard layouts (Operational Overview, Risk Intelligence, Border Control)
- **Auth flows** — Forgot Password (`/forgot-password`), Reset Password (`/reset-password`), Set Password (`/set-password`) with token validation
- **User Profile** (`/dashboard/user-profile`) — Ch 3: personal info edit, language/timezone preferences, MFA status chip, login history table
- **Manage Users** (`/dashboard/manage-users`) — Ch 5: stats strip, role + status filter bar, full user table, slide-in detail panel, Add User modal, inline role/status edit

### Changed
- `version.json` bumped to 1.5.0
- `docs/PRODUCT-ROADMAP.md` updated; Phase 4 items marked ✅ COMPLETE
- `docs/AlAmeen-Gap-Analysis.md` created at v2.0: post Phases 1–4 status for all 32 spec areas

---

## [1.4.0] — 2026-08-18 · Phase 3: Manage Profiles, Risk Rules, ML Models

### Added
- **Manage Profiles** (`/dashboard/manage-profiles`) — Ch 9.3: Draft/Active/Expired lifecycle, condition builder, activity log, tags, Edit modal, live Profile Test preview
- **Risk Rules** (`/dashboard/risk-rules`) — Ch 9.7: 7 scoring rules (WATCHLIST_MATCH / PROFILE_MATCH / DOCUMENT_VALIDATION / EXTERNAL_SOURCE), weight bars, trigger history, activate/deactivate
- **Risk Decision Rules** — Ch 9.8: 5 decision rules (ALERT / SECONDARY_SCREENING / EMAIL_NOTIFICATION / WORKFLOW_TRIGGER / DENY_BOARDING) as second tab on `/dashboard/risk-rules`
- **ML Models** (`/dashboard/ml-models`) — Ch 10: 5 models, metric strips (ACC / PREC / REC / AUC), confusion matrix, feature list, training data export, Retire action
- Risk Source Quality stats — Ch 9.6: per-source hit rate, false positive rate, match count trend, source comparison table embedded in `/dashboard/risk-assessment`

---

## [1.3.0] — 2026-08-18 · Phase 2: Persons of Interest + Risk Tracker

### Added
- **Persons of Interest** (`/dashboard/persons-of-interest`) — Ch 11: single or batch CSV submit, Pending→In Progress→Completed/Rejected lifecycle, status count chips, filter/search
- **Risk Tracker live map** (`/dashboard/risk-tracker`) — Ch 12: geospatial canvas (inline SVG), aircraft colour-coded by risk level, airport cluster bubbles, flight list panel, click-to-manifest, passenger route arcs

---

## [1.2.0] — 2026-08-17 · Deiyafa / Rasad / Subject Timeline / Predictive Risk

### Added
- Deiyafa intelligence module integration
- Rasad surveillance feed
- Subject Timeline view (itinerary, events, crossings on a vertical timeline)
- Predictive Risk Engine with score bands and explanations

---

## [1.1.0] — 2026-08-17 · Phase 1: Search Module

### Added
- **Ad Hoc Search** (`/dashboard/search`) — Ch 7.1: General search across 4 domains (Person / Document / Vehicle / Entity), phonetic/wildcard/regex match types, Table + Card view, column manager, pagination, CSV export
- **Query Builder** — Ch 7.1: multi-condition builder, AND/OR logic, condition groups, save/load named queries (personal/shared scope)
- **Hit Search** — Ch 7.2: filter chips (status / watchlist / risk level / date / nationality), hit cards, inline status lifecycle, CSV export
- **Service Search** — Ch 7.3: search by flight number, route, date, airline; service cards with pax/hit counts; manifest drill-down with per-traveler risk scores and boarding status
- **Traveller Details 360** — Ch 7.4.7: itinerary timeline, contact icons, baggage info, related-identities panel

---

## [1.0.0] — Pre-2026-08-17 · Initial Platform

### Added
- Core dashboard shell (DashboardLayout, Sidebar, TitleBar)
- Login / auth header
- Operator Console, Executive Dashboard, Command Center
- Person 360° / Digital Dossier
- Link Analysis / Relationship Explorer
- Event Management (PNR / APIS / DCS / Hotel / Border — 12 domains)
- Case Management (full lifecycle)
- Audit Log
- API Portal
- Multilingual UI — English + Arabic, full RTL layout
- `version.json` SemVer source of truth, `<VersionBadge />` in footer
