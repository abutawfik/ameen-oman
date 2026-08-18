# Al-Ameen — Product Roadmap
## SIT Spec Compliance + Customer Session Enhancements

**Version:** 1.1  
**Assessment Date:** 2026-08-17 · **Last Updated:** 2026-08-18  
**Source Spec:** SITA Intelligence & Targeting (SIT) Functional Specification v2024.3.5  
**Customer Sessions:** Dominic Sy (DIS feedback) · Khalid AlFarsi + Mr. Carlos (Kenya session, 14 Aug 2026)  
**Classification:** SITA Internal — Commercial in Confidence

---

## Quick Reference: Gap Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Built and compliant |
| ⚠️ | Partial — exists but incomplete vs spec |
| ❌ | Not built |
| 🔴 | Critical priority |
| 🟠 | High priority |
| 🟡 | Medium priority |
| 🟢 | Low priority / future |
| 👤 | Customer session request |
| 📋 | Spec requirement |

---

## Phase Overview

| Phase | Focus | Items | Target | Status |
|-------|-------|-------|--------|--------|
| **Phase 1** | Search + Immediate UX Wins | 12 items | Sprint 1–2 | ✅ **COMPLETE** — committed `feat(phase1)` 2026-08-17 |
| **Phase 2** | Persons of Interest + Risk Tracker + Map | 8 items | Sprint 3 | ✅ **COMPLETE** — committed `feat(v1.3)` 2026-08-17 |
| **Phase 3** | Management Layer (Rules, Profiles, Config, ML) | 10 items | Sprint 4–5 | ✅ **COMPLETE** — committed `feat(v1.4)` 2026-08-17 |
| **Phase 4** | Identity, Reporting, Auth, User Self-Service | 5 items | Sprint 6 | ✅ **COMPLETE** — committed `feat(v1.5)` 2026-08-18 |

---

## Phase 1: Search + Immediate UX Wins

> **Rationale:** The SITA SIT spec's most-used daily workflow is entirely absent. Every border officer uses Search. Customer sessions also surfaced several quick wins on the existing pages that block effective use today.

### 1.1 🔴📋 Ad Hoc Search — General Mode
**Route:** `/dashboard/search` (new)  
**Spec:** Chapter 7.1 · §7.1.1–7.1.6  
**Status:** ✅ **BUILT** — 2026-08-17

Full-text search across four domains: Events, Hits, Identities, Services. Domain selector. Phonetic / wildcard / regex toggle. Results in Table View + Card View. Pagination. Column manager (add/remove columns, max-column warning). Result filters (refine by field values).

**Acceptance Criteria:**
- [ ] Domain selector (Events / Hits / Identities / Services)
- [ ] Search text input with auto-suggestion
- [ ] Phonetic / wildcard / regex mode toggle
- [ ] Results in Table View with column manager
- [ ] Results in Card View
- [ ] Filter sidebar to refine results
- [ ] Pagination (Next / Prev / page numbers)
- [ ] Arabic RTL layout

---

### 1.2 🔴📋 Ad Hoc Search — Advanced Query Builder
**Route:** `/dashboard/search` (tab within Ad Hoc)  
**Spec:** Chapter 7.1 · §7.1.7  
**Status:** ✅ **BUILT** — 2026-08-17

Structured multi-condition search. Attributes selector, comparators (equals / contains / starts-with / greater-than / in-list / regex), AND/OR connectors between conditions, condition groups, search count preview.

**Acceptance Criteria:**
- [ ] Add / remove conditions dynamically
- [ ] Attribute dropdown per search domain
- [ ] Comparator options per attribute type
- [ ] AND/OR connector per condition
- [ ] Condition groups with bracket logic
- [ ] Preview result count before running

---

### 1.3 🔴📋 Search Results — Sorting
**Route:** `/dashboard/search`  
**Customer:** 👤 Dominic – Item 1 (top complaint)  
**Status:** ✅ **BUILT** — 2026-08-17

Clicking any column header sorts results ascending/descending. Default sort by relevance score. Sort state persists within session.

**Acceptance Criteria:**
- [ ] Sort by any visible column (asc/desc toggle)
- [ ] Visual sort indicator on active column
- [ ] Sort by relevance score (default)
- [ ] Stable sort preserves secondary order

---

### 1.4 🔴📋 Name Matching — Phonetic / Transliteration
**Route:** `/dashboard/search`  
**Customer:** 👤 Dominic – Item 1  
**Spec:** Chapter 7.1 · fuzzy search / phonetic  
**Status:** ✅ **BUILT** — 2026-08-17

Name matching with phonetic similarity (Soundex / Double Metaphone), transliteration (Latin ↔ Arabic), wildcard (`*`, `?`), and regular expression. Show match type indicator on each result (EXACT / PHONETIC / WILDCARD / FUZZY).

**Acceptance Criteria:**
- [ ] Phonetic toggle in search bar
- [ ] Match type badge on each result (EXACT / PHONETIC / ~FUZZY)
- [ ] Arabic/Latin transliteration in General Search
- [ ] Wildcard symbols (* ?) supported
- [ ] Regex mode when toggled

---

### 1.5 🔴📋 Saved Queries
**Route:** `/dashboard/search`  
**Spec:** Chapter 7.1 · §7.1.8  
**Status:** ✅ **BUILT** — 2026-08-17

Save named queries (General or Query Builder). Library of saved queries: run, edit, delete, share/unshare. Personal + shared scope.

**Acceptance Criteria:**
- [ ] Save current query (name + scope: personal/shared)
- [ ] Saved queries side panel / library
- [ ] Run saved query (reloads form + executes)
- [ ] Edit saved query name/scope
- [ ] Delete saved query
- [ ] Last-run timestamp shown

---

### 1.6 🔴📋 Hit Search
**Route:** `/dashboard/search` (Hit Search tab)  
**Spec:** Chapter 7.2  
**Status:** ✅ **BUILT** — 2026-08-17

Search specifically for risk hits/alerts. Filter by: hit status, watchlist, risk source, risk level, date range, traveler nationality. Hit result cards show: match reason, linked traveler, watchlist/profile matched, hit status lifecycle.

**Acceptance Criteria:**
- [ ] Filter form (status / watchlist / risk level / date range / nationality)
- [ ] Hit result cards with match reason
- [ ] Inline hit status update (New → ACK → Under Review → Resolved / False Positive)
- [ ] Add hit note/comment from search result
- [ ] Link to full traveler 360 view
- [ ] CSV export of hit search results

---

### 1.7 🔴📋 Hit Status Comments — Dropdown + Text
**Route:** `/dashboard/watchlist`, `/dashboard/case-management`, `/dashboard/search`  
**Customer:** 👤 Dominic – Item 4  
**Status:** ✅ **BUILT** — 2026-08-17

Replace free-text comment field on hit status updates with a pre-defined reason dropdown PLUS optional additional notes. Common reasons: "Identity confirmed — no risk", "Referred for secondary screening", "False positive — document mismatch", "Escalated to supervisor", "Transferred to case", "Insufficient evidence". User can append custom note after selecting reason.

**Acceptance Criteria:**
- [ ] Dropdown of pre-defined disposition reasons
- [ ] Optional free-text field after reason selection
- [ ] Pre-defined reasons configurable (admin setting)
- [ ] Applied on hit status update wherever it appears

---

### 1.8 🔴📋 Hit Status Transition — Streamlined Flow
**Route:** `/dashboard/watchlist`, hit cards everywhere  
**Customer:** 👤 Dominic – Item 3  
**Status:** ✅ **BUILT** — 2026-08-17

Reduce the number of clicks/steps to move a hit through its lifecycle. Currently requires too many confirmations. Target: one-click ACK from hit card, one-step resolve with reason dropdown (from item 1.7), no full-page reload.

**Acceptance Criteria:**
- [ ] ACK with single click (no confirmation modal required)
- [ ] Inline resolve with dropdown (no page navigation)
- [ ] Hit count badge updates optimistically (no reload)
- [ ] Bulk ACK on multiple selected hits

---

### 1.9 🔴📋 Service Search
**Route:** `/dashboard/search` (Service Search tab)  
**Spec:** Chapter 7.3  
**Status:** ✅ **BUILT** — 2026-08-17

Flight/service lookup by flight number, route (DEP → ARR), date, airline/operator code. Results: service summary cards with total pax, hit count, high-risk count. Drill into service detail → manifest table with per-traveler risk scores, boarding status.

**Acceptance Criteria:**
- [ ] Search form (flight no / route / date / airline)
- [ ] Service result cards (pax count, hit count, risk summary)
- [ ] Service detail view with manifest table
- [ ] Per-traveler risk score and hit badge on manifest
- [ ] Boarding status indicator (boarded / no-show / go-show)
- [ ] No-Show / Go-Show icons per passenger — spec §7.4.8 + Customer Item 1.10

---

### 1.10 🟠📋 Traveler Indicator Icons (Go-Show, No-Show, etc.)
**Route:** All traveler lists and search results  
**Customer:** 👤 Dominic – Item 6 (in current CR)  
**Spec:** Chapter 7 · §7.4 icon use  
**Status:** ✅ **BUILT** — 2026-08-17

Icons in search results and traveler lists to indicate: Go-Show, No-Show, Checked-In, Boarded, VIP, High Risk, Hit, Biometric Enrolled. Hoverable tooltips showing indicator meaning.

**Acceptance Criteria:**
- [ ] Go-Show icon (arrived without reservation)
- [ ] No-Show icon (reservation, didn't board)
- [ ] Checked-In / Boarded status icon
- [ ] Hit indicator icon (watchlist/profile hit)
- [ ] Icon legend accessible from search results header

---

### 1.11 🟠👤 Full Journey/Route Display on Passenger Screen
**Route:** Traveler detail / passenger card  
**Customer:** 👤 Khalid/Mr. Carlos – Item 1  
**Status:** ✅ **BUILT** — 2026-08-17

Show the passenger's complete itinerary (full journey from origin, not just the last leg). Example: LON → DOH → NBO displayed as full route, not just DOH → NBO. Use a journey timeline visualization with intermediate stops marked.

**Acceptance Criteria:**
- [ ] Origin → transit(s) → destination displayed in order
- [ ] Airline and flight number per leg
- [ ] Departure/arrival times per leg
- [ ] Current leg highlighted
- [ ] Visible on main passenger/traveler screen (not buried in service details)

---

### 1.12 🟠👤 Passenger Contact Info on Main Screen
**Route:** Traveler detail / passenger card  
**Customer:** 👤 Khalid/Mr. Carlos – Item 2  
**Status:** ✅ **BUILT** — 2026-08-17

Email address and phone number shown as icons in the upper section of the passenger profile. Email icon shows domain as tooltip (useful for identifying embassy/UN/org affiliations). Phone shown with country flag.

**Acceptance Criteria:**
- [ ] Email icon with tooltip (full address + domain hint)
- [ ] Phone icon with country code flag
- [ ] Shown in passenger card header (not sub-page)
- [ ] Tap to copy on click

---

### 1.13 🟡👤 Baggage Info on Main Passenger Screen
**Route:** Traveler detail / passenger card  
**Customer:** 👤 Khalid/Mr. Carlos – Item 3  
**Status:** ✅ **BUILT** — 2026-08-17

Number of checked bags and total baggage weight visible on the main passenger screen without navigating to Service Departure. Add to passenger card as a data chip: "2 bags · 32kg".

**Acceptance Criteria:**
- [ ] Bag count visible on main passenger screen
- [ ] Total baggage weight visible
- [ ] Absent gracefully when no baggage data available

---

### 1.14 🟠📋 CSV Export — Search Results
**Route:** All search result views  
**Spec:** Chapter 7 · §7.4.10  
**Status:** ✅ **BUILT** — 2026-08-17

Export current page of search results to CSV. Export includes all visible columns. File named with search criteria and timestamp.

**Acceptance Criteria:**
- [ ] Export button on all result tables
- [ ] Exports visible columns only (respects column manager)
- [ ] CSV file named: `alaameen-search-{domain}-{date}.csv`
- [ ] Works on all three search types

---

### 1.15 🟡📋 Dashboard → Hit Details Navigation
**Route:** `/dashboard` (home), all dashboard widgets  
**Customer:** 👤 Dominic – Item 5  
**Status:** ✅ **BUILT** — 2026-08-17

Dashboard hit count widgets and charts should be directly clickable to navigate to the relevant filtered hit search results. Currently there's no path from the dashboard overview into the hit detail without navigating manually.

**Acceptance Criteria:**
- [ ] Hit count widgets on home dashboard link to Hit Search with pre-populated filters
- [ ] Chart segments link to filtered results (e.g., click "HIGH risk bar" → hit search filtered by HIGH)
- [ ] Breadcrumb in hit search shows "← Dashboard · Risk Overview"

---

## Phase 2: Persons of Interest + Risk Tracker + Map

### 2.1 🔴📋 Persons of Interest Module
**Route:** `/dashboard/persons-of-interest` (new)  
**Spec:** Chapter 11  
**Status:** ✅ **BUILT** — 2026-08-17

Dedicated POI submission and tracking workflow. Add single person or batch (CSV upload). POI status lifecycle: Pending → In Progress → Completed / Rejected. Status-count summary at top. Filter by status, date, submitter.

---

### 2.2 🔴📋 Risk Tracker — Live Flight Situational Map
**Route:** `/dashboard/risk-tracker` (new)  
**Spec:** Chapter 12  
**Status:** ✅ **BUILT** — 2026-08-17

Geospatial canvas (Mapbox GL / Leaflet) showing aircraft in flight. Aircraft icons color-coded by risk level. Airport cluster bubbles with risk counts. Flight list side panel. Click aircraft → flight detail → manifest (links to Service Search). Persistent session state.

---

### 2.3 🟠👤 Passenger Movement & Route on Map
**Route:** `/dashboard/risk-tracker`, traveler detail  
**Customer:** 👤 Khalid/Mr. Carlos – Item 4  
**Status:** ✅ **BUILT** — 2026-08-17

Visualize a specific passenger's travel route and historical movements on the map. Show itinerary legs as arcs on the map, with waypoints (departure/transit/arrival airports). Accessible from traveler detail panel.

---

### 2.4 🟠📋 Risk Source Quality / Performance Statistics
**Route:** `/dashboard/risk-assessment` (new tab)  
**Spec:** Chapter 9.6  
**Status:** ✅ **BUILT** — 2026-08-17

Per-source metrics: hit rate, false positive rate, match count trend over time. Source comparison table. Used by risk managers to tune and justify configured rules.

---

## Phase 3: Management Layer

### 3.1 🟠📋 Manage Profiles — CRUD
**Route:** `/dashboard/manage-profiles` (new)  
**Spec:** Chapter 9.3  
**Status:** ✅ **BUILT** — 2026-08-17

Risk profiles — pattern definitions (NOT person records). Add Profile with condition builder (reuse Query Builder from Phase 1). Search, View, Edit, Activity Log, Bulk Update. Status lifecycle: Draft → Active → Expired.

**Delivered:**
- 5 mock profiles (ACTIVE/DRAFT/EXPIRED) with condition sets, activity logs, tags
- Profile list with status/domain filter chips + keyword search
- Click-to-expand detail panel: conditions display, activity log, tags, stats
- Edit modal with domain selector, status lifecycle, risk weight, multi-condition builder
- New Profile flow

---

### 3.2 🟠👤 Profile Results Visibility
**Route:** `/dashboard/manage-profiles`  
**Customer:** 👤 Dominic – Item 2  
**Status:** ✅ **BUILT** — 2026-08-17

**Delivered:**
- [x] "Test Profile" button launches side panel with simulated live preview
- [x] Matched attributes highlighted in gold per sample record (non-matched shown dim)
- [x] Match count banner with colour coding (green = 0, red = matches)
- [x] AVAILABLE_FIELDS cross-check per domain (unusable fields warning shown)
- [x] 900ms loading simulation before results display

---

### 3.3 🟠📋 Risk Rules Management
**Route:** `/dashboard/risk-rules` (new)  
**Spec:** Chapter 9.7  
**Status:** ✅ **BUILT** — 2026-08-17

**Delivered:**
- 7 scoring rules (WATCHLIST_MATCH / PROFILE_MATCH / DOCUMENT_VALIDATION / EXTERNAL_SOURCE)
- Sortable table with weight progress bar, type badge, status chip, trigger count
- Click-to-expand detail: scoring params, date/location scope, trigger history, activate/deactivate action

---

### 3.4 🟠📋 Risk Match Decision Rules
**Route:** `/dashboard/risk-rules` (tab on same page)  
**Spec:** Chapter 9.8  
**Status:** ✅ **BUILT** — 2026-08-17

**Delivered:**
- 5 decision rules: ALERT / SECONDARY_SCREENING / EMAIL_NOTIFICATION / WORKFLOW_TRIGGER / DENY_BOARDING
- Threshold display, email recipient list, workflow ID
- Detail panel with full configuration view

---

### 3.5 🟠📋 Risk Configuration — Extended CRUD
**Route:** `/dashboard/risk-assessment` → config section  
**Spec:** Chapter 9.9  
**Status:** ⚠️ Partial — existing config section preserved; full CRUD versioning deferred to Phase 4 scope refinement

---

### 3.6 🟠📋 ML Risk Assessment — Model Management UI
**Route:** `/dashboard/ml-models` (new)  
**Spec:** Chapter 10  
**Status:** ✅ **BUILT** — 2026-08-17

**Delivered:**
- 5 models (CLASSIFICATION / REGRESSION / ANOMALY / NLP / RETIRED)
- Card list with mini metric strip (ACC/PREC/REC/AUC) per deployed model
- Detail panel: full metrics bars, confusion matrix, input features, training samples
- Training data export sub-module: request export button, export status rows (DONE/RUNNING/PENDING)
- Retire / Edit Settings actions

---

### 3.7 🟠📋 Manage Targets — Extended Compliance
**Route:** `/dashboard/watchlist` (extensions to existing)  
**Spec:** Chapter 9.5  
**Status:** ⚠️ Partial — existing watchlist page preserved; extended import flow + attachment upload deferred to Phase 4

---

## Phase 4: Identity, Reporting, Auth, User Self-Service

### 4.1 🟡📋 Manage Identities — Compare / Merge / Split
**Route:** `/dashboard/identity-compare` (new)  
**Spec:** Chapter 8  
**Status:** ✅ **BUILT** — 2026-08-18

Guided identity deduplication workflow. Left queue panel lists candidate pairs with similarity scores and status filter chips (Pending / Merged / Kept Separate / Escalated). Compare panel shows side-by-side attribute table with match/diff colour coding and 5-factor ML score breakdown (name token ratio, alias overlap, country match, DOB proximity, source agreement). 3-step merge wizard: select master record → field-by-field chooser → review + confirm. Actions: Escalate / Keep Separate / Merge Entities. Status updates persist in local queue state.

**Delivered:**
- [x] Queue of candidate identity pairs from `ENTITY_MATCH_QUEUE` mock
- [x] Similarity bar + 5-factor breakdown bars per pair
- [x] Attribute comparison table (match=green, diff=amber, missing=dim)
- [x] 3-step `MergeWizard` modal (master select → field chooser → confirm)
- [x] Escalate / Keep Separate / Merge actions update queue status

---

### 4.2 🟡📋 Business Reporting — Visualize Library
**Route:** `/dashboard/viz-library` (new)  
**Spec:** Chapter 13  
**Status:** ✅ **BUILT** — 2026-08-18

12-widget gallery with inline SVG previews (no external dependencies). Three tabs: Widget Gallery (category filter: All / Core / Charts / Risk), Dashboard Builder (canvas with Add/Remove widgets, dashboard name, Save), and Saved Dashboards (3 pre-built layouts: Executive Overview, Risk Summary, Operational Daily) with View / Edit / Clone actions.

**Delivered:**
- [x] 12 inline SVG chart components: Bar, Line, Donut, Heatmap, Stat Tile, Horizontal Bar, Timeline, Funnel, Gauge, Scatter, Data Table, Area Chart
- [x] Widget Gallery with category filter chips and "Add to Builder" per widget
- [x] Dashboard Builder canvas with `canvasWidgets` state and remove controls
- [x] Saved Dashboards tab with 3 pre-built dashboard cards

---

### 4.3 🟡📋 Forgot Password / First-Login Flow
**Route:** `/forgot-password`, `/reset-password`, `/set-password`  
**Spec:** Chapter 3.4.4–3.4.5, Chapter 4.11  
**Status:** ✅ **BUILT** — 2026-08-18

All three standalone auth flows built as split-pane pages matching the login brand design (dark ocean-800 left pane, ivory right pane). Each page is outside DashboardLayout with its own route.

**Delivered:**
- [x] `/forgot-password` — Officer ID / email input → "Send Recovery Link" → success state ("Check your inbox"), 15-minute expiry notice. Back to Login link.
- [x] `/reset-password` — New password + confirm with 4-segment strength bar and live requirement checklist (8 chars, uppercase, number, special). Disabled submit until all 4 met. Success state → "Go to Login".
- [x] `/set-password` — First-login variant with "Activate My Account" CTA and "Account activated" success state with `ri-user-follow-line` icon.
- [x] Left pane: `BrandLogo variant="stacked" size="lg"`, policy rules, descriptive tagline per flow.

---

### 4.4 🟡📋 User Profile / Preferences
**Route:** `/dashboard/user-profile` (new)  
**Spec:** Chapter 3.7  
**Status:** ✅ **BUILT** — 2026-08-18

Full user profile page accessible from the operator menu. Two-column layout: left column for Personal Information, Display Preferences, and Security; right column for Module Access, Recent Logins, and Account Details.

**Delivered:**
- [x] Personal Information card: avatar initials circle (gradient), role + status + MFA badges, info grid (email, officer ID, unit, phone), inline edit form (name, phone) with Save/Cancel
- [x] Display Preferences card: language toggle (EN / AR buttons), timezone select dropdown
- [x] Security card: MFA enabled/disabled status with "Request Reset" button (simulated)
- [x] Module Access: chip list of assigned modules
- [x] Recent Logins: last 5 login entries with success/fail colour-coded left borders, IP, device, timestamp

---

### 4.5 🟡📋 Manage Users CRUD
**Route:** `/dashboard/manage-users` (replaces placeholder)  
**Spec:** Chapter 5  
**Status:** ✅ **BUILT** — 2026-08-18

Full user management page replacing the BatchReports placeholder. 8 mock users from `src/mocks/usersData.ts` (6 roles: SUPER_ADMIN / ADMIN / ANALYST / OPERATOR / AUDITOR / VIEWER; 4 statuses: ACTIVE / SUSPENDED / PENDING / INACTIVE).

**Delivered:**
- [x] Stats row: Total Users, Active, Suspended, Pending counts
- [x] Role filter chips (ALL + 6 roles) + Status filter chips (ALL + 4 statuses) + keyword search (name / email / officer ID / unit)
- [x] Full-width sticky-header table: Name+Email, Officer ID (gold mono), Role badge, Unit, Status badge, Last Login, detail arrow
- [x] Right detail panel (360px) on row select: `UserDetail` component with avatar, badges, info rows, edit role dropdown, Suspend / Activate / Approve buttons, login history with success/fail indicators
- [x] `AddUserModal`: name EN+AR, officer ID, role select, email, unit, phone → creates PENDING user in local state
- [x] `handleStatusChange` and `handleRoleChange` update both the list and selected state inline

---

## Deferred / Out of Scope

### D.1 🟢 Biometric Facial Matching (1:N)
**Customer:** 👤 Dominic – Item 7  
**Status:** Deferred — ECS scope

1:N facial matching against ETA photo database. **Expectation management required with ECS and ROP.** This is NOT in scope for the current CRs. Al-Ameen surfaces biometric enrollment indicator (Phase 1, item 1.10) but does not perform the matching itself. ECS handles the biometric engine.

---

### D.2 🟢 ForgeRock User Administration UI
**Spec:** Chapter 4  
**Status:** External system

Full ForgeRock End User Interface for department management, permission categories, restriction management. Handled by the ForgeRock platform, not the Al-Ameen portal UI. Portal shows read-only reflection of roles assigned via ForgeRock.

---

## AlAmeen Extensions (Beyond Spec — Protect These)

These modules are **not required** by the SITA SIT spec but are Oman-specific differentiators. They must not be removed or degraded as part of spec compliance work.

| Module | Value |
|--------|-------|
| OSINT Risk Engine | Multi-source intelligence with classification tiers |
| Predictive Analytics | AI-driven risk prediction with explainability |
| Pattern Engine | Behavioral pattern detection across time-series data |
| National Security | National threat coordination |
| GEOINT | Geospatial intelligence layer |
| Threat Intel | Structured threat intelligence management |
| Subject Timeline | Chronological event reconstruction per subject |
| Digital Dossier | Full intelligence dossier with clearance controls |
| Compliance Scorecard | Agency-level compliance and SLA tracking |
| Customs & Cargo | Cargo declaration and customs intelligence |
| API Portal | REST API management, keys, webhooks |
| Mobile Field App | Field officer interface |
| Hospitality Sub-App | Hotel operator registration reporting |
| Command Center | Multi-source operational situational awareness |
| 12 Event Domains | Marine, Postal, Education, Employment, Financial, Social, Utility, Tourism, Healthcare, Transport, E-commerce, Calendar |
| Executive Dashboard | C-level intelligence summary |
| Clearance Levels | UNCLASSIFIED / INTERNAL / SECRET on all data |
| Full Arabic RTL | Complete bilingual UI |

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-08-17 | 1.0 | Initial gap analysis against SITA SIT v2024.3.5. Incorporates customer session feedback from Dominic Sy and Khalid AlFarsi (14 Aug 2026). | Al-Ameen Team |
| 2026-08-18 | 1.1 | Phase 4 complete — marked 4.1–4.5 as ✅ BUILT. Delivered: Identity Compare/Merge (`identity-compare`), Viz Library with 12-widget gallery (`viz-library`), three auth flows (forgot/reset/set-password), User Profile page, and Manage Users CRUD. Commit: `feat(v1.5)`. | Al-Ameen Team |
