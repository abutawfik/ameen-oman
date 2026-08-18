# Al-Ameen — Functional Requirements Gap Analysis
## SIT Spec Compliance Status

**Version:** 3.0  
**Spec Source:** SITA Intelligence & Targeting (SIT) Functional Specification v2024.3.5  
**Original Assessment:** 2026-08-17  
**Last Updated:** 2026-08-18 — reflects Phases 1–5 delivery  
**Classification:** SITA Internal — Commercial in Confidence

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Built and compliant |
| ⚠️ | Partial — exists but gaps remain |
| ❌ | Not built |

---

## Full Gap Analysis — Current Status

| Spec / Area | Original Al-Ameen coverage | Pre-build status | **Current status (post Phase 1–4)** |
|---|---|---|---|
| **Ch 3–5 · User Portal & Login** | `/login` + auth header | ⚠️ Partial | ⚠️ **Partial** — Login ✅; Forgot/Reset/Set-Password ✅ (Phase 4.3); `/register` self-service not built; ForgeRock SSO is backend scope |
| **Ch 3 · User Profile / Preferences** | Operator menu (partial) | ⚠️ Partial | ✅ **Built** — `/dashboard/user-profile`: info edit, language/timezone preferences, MFA status, login history (Phase 4.4) |
| **Ch 4 · ForgeRock User Admin** | `/dashboard/system-admin` (partial) | ⚠️ Partial | ⚠️ **Partial** — Portal-side Manage Users ✅ (Phase 4.5); full ForgeRock department/permission admin is external system scope |
| **Ch 5 · Manage Users / Roles / Departments** | Route existed, rendered BatchReports placeholder | ❌ Missing | ✅ **Built** — `/dashboard/manage-users`: stats, role/status filters, full user table, detail panel, Add User modal, inline role/status edit (Phase 4.5) |
| **Ch 6 · Dashboards (Main / Services / Risk / Border)** | Operator Console, Executive Dashboard, Command Center | ⚠️ Partial | ✅ **Built** — Main operator console ✅; Services Dashboard ✅ (`/dashboard/services-dashboard` — stats, filter bar, 10-row table, detail panel, Phase 5); Border Dashboard ✅ (`/dashboard/border-dashboard` — 3 tabs, checkpoint grid, alert feed, SVG bar chart, Phase 5) |
| **Ch 7.1 · Ad Hoc Search — General + Query Builder** | None | ❌ Missing | ✅ **Built** — General search (4 domains, phonetic/wildcard/regex, Table+Card view, pagination, column manager) + Query Builder (multi-condition, AND/OR, condition groups) at `/dashboard/search` (Phase 1.1–1.2) |
| **Ch 7.1.8 · Saved Queries** | None | ❌ Missing | ✅ **Built** — Save named queries (personal/shared scope), library panel, run/edit/delete, last-run timestamp (Phase 1.5) |
| **Ch 7.2 · Hit Search** | None | ❌ Missing | ✅ **Built** — Hit Search tab with filters (status / watchlist / risk level / date / nationality), hit cards, inline status lifecycle, CSV export (Phase 1.6) |
| **Ch 7.3 · Service Search** | None | ❌ Missing | ✅ **Built** — Flight/service search by number, route, date, airline; service cards with pax/hit counts; manifest drill-down with per-traveler risk scores and boarding status (Phase 1.9) |
| **Ch 7.4 · Search Results (Table + Card + Export CSV)** | None | ❌ Missing | ✅ **Built** — Table view with column manager, Card view, CSV export (`alaameen-search-{domain}-{date}.csv`), sorting, phonetic match-type badges (Phases 1.1–1.4, 1.14) |
| **Ch 7.4.7 · Traveller Details (360 view)** | Person 360°, Digital Dossier | ✅ Built | ✅ **Built** — Full itinerary timeline, contact icons, baggage info also added (Phases 1.11–1.13) |
| **Ch 8 · Manage Identities (Compare / Merge / Split)** | Identity Fusion, Entity Resolution | ⚠️ Partial | ✅ **Built** — Compare and Merge ✅ (Phase 4.1); Split flow ✅ (Phase 5 — SplitWizard modal: Step 1 per-attribute A/B toggle, Step 2 side-by-side review, Step 3 confirm; SPLIT status added to type system) |
| **Ch 9.3 · Managing Profiles** | None (not same as Person 360) | ❌ Missing | ✅ **Built** — `/dashboard/manage-profiles`: Draft/Active/Expired lifecycle, condition builder, activity log, tags, Edit modal, live Profile Test preview (Phase 3.1–3.2) |
| **Ch 9.4–9.5 · Targets & Watch Lists** | Watchlist & Targets page | ⚠️ Partial | ✅ **Built** — Core watchlist page ✅; attachment upload ✅ (Phase 5 — drag-and-drop zone, PDF/JPG/PNG/DOCX up to 25MB, attachment table, validation rules card with fuzzy-match threshold slider) |
| **Ch 9.5.5 · Target Match** | Risk Assessment (partial) | ⚠️ Partial | ✅ **Built** — `/dashboard/target-match` (Phase 5): stats row (Pending/Confirmed/False Positives/Escalated), candidate queue with confidence bars, Target vs Traveler side-by-side compare, 4 match factors, action bar (Defer 24h / False Positive / Escalate / Confirm Match) |
| **Ch 9.5.7 · Import Targets (bulk)** | Watchlist Import/Export tab | ⚠️ Partial | ✅ **Built** — Import/Export tab ✅; Attachments tab ✅ (Phase 5 — drag-and-drop, 3 mock entries, import validation rules, fuzzy-match slider 70–100%) |
| **Ch 9.6 · Risk Source Quality / Performance Stats** | None | ❌ Missing | ✅ **Built** — Per-source hit rate, false positive rate, match count trend, source comparison table at `/dashboard/risk-assessment` (Phase 2.4) |
| **Ch 9.7 · Risk Rules Management** | Pattern Engine (related, not same) | ❌ Missing | ✅ **Built** — `/dashboard/risk-rules`: 7 scoring rules (WATCHLIST_MATCH / PROFILE_MATCH / DOCUMENT_VALIDATION / EXTERNAL_SOURCE), weight bars, trigger history, activate/deactivate (Phase 3.3) |
| **Ch 9.8 · Risk Match Decision Rules** | None | ❌ Missing | ✅ **Built** — 5 decision rules (ALERT / SECONDARY_SCREENING / EMAIL_NOTIFICATION / WORKFLOW_TRIGGER / DENY_BOARDING) as a tab on `/dashboard/risk-rules` (Phase 3.4) |
| **Ch 9.9 · Risk Configuration** | Risk Assessment config tab (partial) | ⚠️ Partial | ✅ **Built** — Config section ✅; Version History tab ✅ (Phase 5 — ConfigVersion type, 3 seeded versions, "Save as New Version" form with label+note, newest-first list, Revert button, gold border on latest) |
| **Ch 10 · ML Risk Assessment UI** | Predictive Analytics (different concept) | ❌ Missing | ✅ **Built** — `/dashboard/ml-models`: 5 models, metric strips (ACC/PREC/REC/AUC), confusion matrix, feature list, training data export, Retire action (Phase 3.6) |
| **Ch 11 · Persons of Interest** | None | ❌ Missing | ✅ **Built** — `/dashboard/persons-of-interest`: single or batch (CSV) submit, Pending→In Progress→Completed/Rejected lifecycle, status counts, filters (Phase 2.1) |
| **Ch 12 · Risk Tracker (live flight map)** | None | ❌ Missing | ✅ **Built** — `/dashboard/risk-tracker`: geospatial canvas, aircraft colour-coded by risk, airport cluster bubbles, flight list panel, click-to-manifest, passenger route arcs (Phases 2.2–2.3) |
| **Ch 13 · Reports (Visualize + Dashboard Library)** | Reports page (basic) | ⚠️ Partial | ✅ **Built** — `/dashboard/viz-library`: 12-widget gallery (inline SVG), Dashboard Builder canvas, Saved Dashboards with 3 pre-built layouts (Phase 4.2) |
| **Ch 14 · Relationship Explorer** | Link Analysis | ✅ Built | ✅ **Built** — unchanged |
| **Event Management (PNR/APIS/DCS/Hotel/Border)** | Border Intelligence, Hotel Events + 12 domains | ✅ Built | ✅ **Built** — unchanged |
| **Case Management / Alert Distribution** | Case Management (full lifecycle) | ✅ Built | ✅ **Built** — unchanged |
| **Traveler Identity Management (TiDM)** | Identity Fusion, Entity Resolution | ⚠️ Partial | ✅ **Built** — Compare + Merge ✅ (Phase 4.1); Split flow ✅ (Phase 5 — SplitWizard 3-step modal, SPLIT status in type union + entity-resolution counts) |
| **Audit Trail** | Audit Log | ✅ Built | ✅ **Built** — unchanged |
| **RBAC / User Roles / Departments** | System Admin (partial) | ⚠️ Partial | ⚠️ **Partial** — Portal-side Manage Users ✅ (Phase 4.5); department-level permission management requires ForgeRock (external) |
| **Multilingual / RTL (Arabic)** | Full i18n, RTL layout | ✅ Built | ✅ **Built** — unchanged; all new pages follow EN/AR pattern |
| **API / Integration Layer** | API Portal | ✅ Extended | ✅ **Extended** — unchanged |

---

## Summary

| Status | Count | Items |
|--------|-------|-------|
| ✅ Built / Extended | **28** | Login auth flows, User Profile, Manage Users, Ad Hoc Search (General + Query Builder), Saved Queries, Hit Search, Service Search, Search Results (table/card/CSV), Traveller Details, Manage Profiles, Risk Source Performance, Risk Rules, Decision Rules, ML Models, Persons of Interest, Risk Tracker + Map, Viz Library + Dashboard Builder, Relationship Explorer, Event Management, Case Management, Audit Trail, Multilingual/RTL, API Portal, **Target Match** (Phase 5), **Services Dashboard** (Phase 5), **Border Dashboard** (Phase 5), **Identity/TiDM Split flow** (Phase 5), **Targets Attachments + Import Validation** (Phase 5), **Risk Config Versioning** (Phase 5) |
| ⚠️ Partial — known gaps remain | **3** | User Portal (no self-service register), ForgeRock Admin (external system scope), RBAC department-level management (ForgeRock dependency) |
| ❌ Not built | **0** | All originally missing items have been addressed in Phases 1–5 |

---

## Remaining Gaps — Phase 6 Candidates

All spec-deliverable portal items are now ✅ Built. The three remaining gaps are either external-system dependencies or low-priority self-service features:

| Gap | Spec Ref | Effort | Priority | Blocker |
|-----|----------|--------|----------|---------|
| Self-service user registration | Ch 3 | Small | 🟢 Low | Not in SIT scope for operators |
| RBAC department-level management | Ch 4 | Large | 🟡 Medium | Requires ForgeRock API integration |
| ForgeRock SSO authentication | Ch 3 | N/A | 🟡 Medium | Backend / infrastructure scope |

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-17 | 1.0 | Initial gap analysis against SITA SIT v2024.3.5 |
| 2026-08-18 | 2.0 | Updated post Phase 1–4 delivery. 13 items moved from ❌ Missing to ✅ Built; 3 items moved from ⚠️ Partial to ✅ Built. Zero ❌ Missing items remain. |
| 2026-08-18 | 3.0 | Updated post Phase 5 delivery. 6 ⚠️ Partial items moved to ✅ Built: Target Match, Services Dashboard, Border Dashboard, Identity Split, Targets Attachments, Risk Config Versioning. Spec-deliverable coverage now 28/31 (3 remaining are ForgeRock/external dependencies). |
