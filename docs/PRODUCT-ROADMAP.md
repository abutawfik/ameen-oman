# Al-Ameen — Product Roadmap
## SIT Spec Compliance + Customer Session Enhancements

**Version:** 1.0  
**Assessment Date:** 2026-08-17  
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

| Phase | Focus | Items | Target |
|-------|-------|-------|--------|
| **Phase 1** | Search + Immediate UX Wins | 12 items | Sprint 1–2 |
| **Phase 2** | Persons of Interest + Risk Tracker + Map | 8 items | Sprint 3 |
| **Phase 3** | Management Layer (Rules, Profiles, Config, ML) | 10 items | Sprint 4–5 |
| **Phase 4** | Identity, Reporting, Auth, User Self-Service | 8 items | Sprint 6 |

---

## Phase 1: Search + Immediate UX Wins

> **Rationale:** The SITA SIT spec's most-used daily workflow is entirely absent. Every border officer uses Search. Customer sessions also surfaced several quick wins on the existing pages that block effective use today.

### 1.1 🔴📋 Ad Hoc Search — General Mode
**Route:** `/dashboard/search` (new)  
**Spec:** Chapter 7.1 · §7.1.1–7.1.6  
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ⚠️ Partial (free text only)

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
**Status:** ⚠️ Partial

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

Number of checked bags and total baggage weight visible on the main passenger screen without navigating to Service Departure. Add to passenger card as a data chip: "2 bags · 32kg".

**Acceptance Criteria:**
- [ ] Bag count visible on main passenger screen
- [ ] Total baggage weight visible
- [ ] Absent gracefully when no baggage data available

---

### 1.14 🟠📋 CSV Export — Search Results
**Route:** All search result views  
**Spec:** Chapter 7 · §7.4.10  
**Status:** ❌ Not built

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
**Status:** ❌ Not built

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
**Status:** ❌ Not built

Dedicated POI submission and tracking workflow. Add single person or batch (CSV upload). POI status lifecycle: Pending → In Progress → Completed / Rejected. Status-count summary at top. Filter by status, date, submitter.

---

### 2.2 🔴📋 Risk Tracker — Live Flight Situational Map
**Route:** `/dashboard/risk-tracker` (new)  
**Spec:** Chapter 12  
**Status:** ❌ Not built

Geospatial canvas (Mapbox GL / Leaflet) showing aircraft in flight. Aircraft icons color-coded by risk level. Airport cluster bubbles with risk counts. Flight list side panel. Click aircraft → flight detail → manifest (links to Service Search). Persistent session state.

---

### 2.3 🟠👤 Passenger Movement & Route on Map
**Route:** `/dashboard/risk-tracker`, traveler detail  
**Customer:** 👤 Khalid/Mr. Carlos – Item 4  
**Status:** ❌ Not built

Visualize a specific passenger's travel route and historical movements on the map. Show itinerary legs as arcs on the map, with waypoints (departure/transit/arrival airports). Accessible from traveler detail panel.

---

### 2.4 🟠📋 Risk Source Quality / Performance Statistics
**Route:** `/dashboard/risk-assessment` (new tab)  
**Spec:** Chapter 9.6  
**Status:** ❌ Not built

Per-source metrics: hit rate, false positive rate, match count trend over time. Source comparison table. Used by risk managers to tune and justify configured rules.

---

## Phase 3: Management Layer

### 3.1 🟠📋 Manage Profiles — CRUD
**Route:** `/dashboard/manage-profiles` (new)  
**Spec:** Chapter 9.3  
**Status:** ❌ Not built

Risk profiles — pattern definitions (NOT person records). Add Profile with condition builder (reuse Query Builder from Phase 1). Search, View, Edit, Activity Log, Bulk Update. Status lifecycle: Draft → Active → Expired.

---

### 3.2 🟠👤 Profile Results Visibility
**Route:** `/dashboard/manage-profiles`  
**Customer:** 👤 Dominic – Item 2  
**Status:** ❌ Not built

Users need to see actual matching results per profile, not just graphs. Add a "Test Profile" function showing a live preview of how many records would match the current profile definition, with sample matching records listed. Show matched-attribute highlighting so analysts can see WHY a record matches.

**Acceptance Criteria:**
- [ ] "Test Profile" action shows matching count + sample records
- [ ] Matched attributes highlighted in sample records
- [ ] Cross-check: profile attributes vs. available Ad Hoc Search attributes (same field set)
- [ ] Warning shown when a profile uses attributes not available in search

---

### 3.3 🟠📋 Risk Rules Management
**Route:** `/dashboard/risk-rules` (new)  
**Spec:** Chapter 9.7  
**Status:** ❌ Not built

Scoring rules CRUD: type (watchlist match / profile match / document validation / external), risk weight (0–100), active date range, location scope, bulk update, activity log.

---

### 3.4 🟠📋 Risk Match Decision Rules
**Route:** `/dashboard/match-decision-rules` (new)  
**Spec:** Chapter 9.8  
**Status:** ❌ Not built

Define actions triggered on a risk match: action type, threshold, email recipients, workflow to trigger. CRUD + bulk update.

---

### 3.5 🟠📋 Risk Configuration — Extended CRUD
**Route:** `/dashboard/risk-assessment` → config section  
**Spec:** Chapter 9.9  
**Status:** ⚠️ Partial

Extend the existing config tab into full CRUD: search configurations, view history, per-watchlist score threshold overrides. Currently shows weights but doesn't save/version them.

---

### 3.6 🟠📋 ML Risk Assessment — Model Management UI
**Route:** `/dashboard/ml-models` (new)  
**Spec:** Chapter 10  
**Status:** ❌ Not built

Model list, add model (parameter form), view performance metrics (accuracy, precision, recall, AUC, confusion matrix), edit model settings, delete. Training Data Export sub-module with status tracking.

---

### 3.7 🟠📋 Manage Targets — Extended Compliance
**Route:** `/dashboard/watchlist` (extensions to existing)  
**Spec:** Chapter 9.5  
**Status:** ⚠️ Partial

Add: target attachments (file upload), extended identity fields (aliases, document history), Target Match drill-down, full Import Targets flow (CSV template download, validation report), bulk update with activity log per action.

---

## Phase 4: Identity, Reporting, Auth, User Self-Service

### 4.1 🟡📋 Manage Identities — Compare / Merge / Split
**Route:** `/dashboard/entity-resolution` (extensions)  
**Spec:** Chapter 8  
**Status:** ⚠️ Partial

Add guided identity deduplication: side-by-side Compare view, Merge wizard (select master record, choose fields to keep), Split flow (separate previously merged identities).

---

### 4.2 🟡📋 Business Reporting — Visualize Library
**Route:** `/dashboard/reports` (extensions)  
**Spec:** Chapter 13  
**Status:** ⚠️ Partial

Pre-defined report widgets + custom visualization builder. Save, search, edit, delete visualizations. Dashboard Library (compose widgets into saved dashboard layouts).

---

### 4.3 🟡📋 Forgot Password / First-Login Flow
**Route:** `/forgot-password`, `/reset-password/:token`, `/set-password`  
**Spec:** Chapter 3.4.4–3.4.5, Chapter 4.11  
**Status:** ❌ Not built

Three flows: (1) Forgot password → email token → reset form, (2) New user forced change on first login, (3) Admin-initiated forced password change. Notification screens on success.

---

### 4.4 🟡📋 User Profile / Preferences
**Route:** Operator menu (expand existing)  
**Spec:** Chapter 3.7  
**Status:** ⚠️ Partial

Edit personal info, upload profile photo, set timezone preference, view login history, view assigned roles. Currently the operator menu button exists but the screens don't.

---

### 4.5 🟡📋 Manage Users CRUD
**Route:** `/dashboard/manage-users` (currently placeholder)  
**Spec:** Chapter 5  
**Status:** ❌ Not built (placeholder routes to BatchReports)

Add user, search users, view user, edit roles/permissions, activate/deactivate. Portal-side UI (ForgeRock integration is backend scope).

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
