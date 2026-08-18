# Al-Ameen Portal — Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Versioning follows `MAJOR.MINOR.PATCH` (see `version.json`).

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
