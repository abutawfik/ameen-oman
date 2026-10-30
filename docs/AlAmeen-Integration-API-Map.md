# Al-Ameen Portal — Integration API Mapping
**Workshop Prep · v1.0 · 2026-10-30**

Audience: ROP IT team, SITA engineers, integration workshop participants.

This document maps every data exchange the Al-Ameen portal requires against the
real systems that will supply or consume it. It is the pre-workshop baseline;
open questions are tracked in Section 7.

---

## 1 · Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                            │
│                                                                 │
│  SITA I:Sight    Interpol FIND    NL Sanctions   Airlines       │
│  (border events) (watchlist feed) (sanctions feed) (APIS/PNR)  │
└────────┬──────────────┬────────────────┬───────────────┬────────┘
         │ REST / SFTP  │ SFTP/API       │ SFTP/API      │ IATA EDIFACT
         ▼              ▼                ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AL-AMEEN BACKEND API                         │
│        (to be built / confirmed with ROP IT)                    │
│                                                                 │
│  /api/v1/flights       — ingest APIS / PNR                     │
│  /api/v1/watchlist     — watchlist CRUD + sync                  │
│  /api/v1/hits          — target match queue                     │
│  /api/v1/search        — identity / event search                │
│  /api/v1/cases         — case management                        │
│  /api/v1/checkpoints   — border dashboard live data             │
│  /api/v1/services      — services dashboard (flights manifest)  │
│  /api/v1/risk          — risk scores + OSINT queue              │
└────────────────────────────────┬────────────────────────────────┘
                                 │ JSON / REST (HTTPS + Bearer)
                                 ▼
                ┌────────────────────────────┐
                │   AL-AMEEN PORTAL (React)  │
                │   alameen.tech             │
                │   — currently 100% mock    │
                │   — this doc maps what     │
                │     replaces each mock     │
                └────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────┐
  │                  OUTBOUND DATA PUSH (16 streams)             │
  │  Hotels · Car Rental · Telecom · Municipalities · Payments   │
  │  Health · Utilities · Transport · Education · Employment     │
  │  E-Commerce · Social · Customs · Marine · Postal · Borders   │
  │                                                              │
  │  Each pushes to:  POST /api/v1/events/{stream}              │
  └──────────────────────────────────────────────────────────────┘
```

---

## 2 · Integration Points Summary

| # | Direction | Source → Target | Protocol | Priority | Status |
|---|-----------|-----------------|----------|----------|--------|
| A | Inbound | Airlines → Al-Ameen (APIS) | IATA Type-B / REST | 🔴 Critical | ❌ Not wired |
| B | Inbound | Airlines → Al-Ameen (PNR) | IATA EDIFACT / REST | 🔴 Critical | ❌ Not wired |
| C | Inbound | SITA I:Sight → Al-Ameen (border events) | REST webhook | 🔴 Critical | ❌ Not wired |
| D | Inbound | Interpol FIND → Al-Ameen (watchlist sync) | SFTP / REST | 🔴 Critical | ❌ Not wired |
| E | Inbound | NL Sanctions / UN → Al-Ameen | SFTP / REST | 🟡 High | ❌ Not wired |
| F | Outbound | Al-Ameen → 16 entity streams | REST push | 🟡 High | Mock only |
| G | Internal | Portal → Al-Ameen backend | HTTPS REST | 🔴 Critical | Mock only |
| H | Outbound | Al-Ameen → Case Management export | REST / PDF | 🟢 Medium | Mock only |

---

## 3 · APIS / PNR Inbound (Integrations A + B)

### 3.1 APIS — Advance Passenger Information

APIS data arrives per flight, typically 30–60 minutes before departure (for
outbound) or at the time of departure (inbound). Each record is one passenger
biographical record tied to a flight segment.

**Expected trigger:** SITA I:Sight pushes a webhook to Al-Ameen when a new APIS
message is received for a flight bound for an Oman port.

**Proposed endpoint (Al-Ameen backend receives):**
```
POST /api/v1/flights/{flightId}/apis
Authorization: Bearer {service-token}
Content-Type: application/json
```

**Proposed payload schema (per passenger):**
```jsonc
{
  "flightNo": "WY456",
  "scheduledDep": "2026-11-01T10:30:00Z",
  "scheduledArr": "2026-11-01T14:35:00Z",
  "originIata":   "AMM",
  "destIata":     "MCT",
  "passengers": [
    {
      "seq":         1,
      "surname":     "KHALIL",
      "givenNames":  "AHMED",
      "gender":      "M",
      "dob":         "1981-03-15",
      "nationality": "SYR",
      "docType":     "P",
      "docNumber":   "SY7721039",
      "docCountry":  "SYR",
      "docExpiry":   "2028-06-30",
      "boardingStatus": "CHECKED_IN",  // CHECKED_IN | BOARDED | NO_SHOW | GO_SHOW
      "seatNo":      "22A",
      "bagCount":    2,
      "bagWeightKg": 23.0
    }
  ]
}
```

**Portal consumer:** `src/mocks/searchData.ts` (`SearchResult` rows with
`domain: 'services'`). Replace mock with `GET /api/v1/services/{flightId}`.

---

### 3.2 PNR — Passenger Name Record

PNR contains booking-level data: itinerary, contact, payment method, special
service requests (SSRs), and frequent flyer.  Received via Global Distribution
System or direct airline feed.

**Proposed endpoint (Al-Ameen backend receives):**
```
POST /api/v1/flights/{flightId}/pnr
Authorization: Bearer {service-token}
Content-Type: application/json
```

**Key PNR fields the portal uses:**
```jsonc
{
  "pnrLocator": "XYZABC",
  "flightNo":   "WY456",
  "passengers": [
    {
      "seq":        1,
      "name":       "AHMED/KHALIL",
      "contact": {
        "email": "a.khalil@example.com",
        "phone": "+962799000000"
      },
      "journey": [
        { "from": "AMM", "to": "MCT", "flightNo": "WY456",
          "dep": "2026-11-01T10:30:00Z", "arr": "2026-11-01T14:35:00Z" },
        { "from": "MCT", "to": "BKK", "flightNo": "WY210",
          "dep": "2026-11-01T17:00:00Z", "arr": "2026-11-02T04:30:00Z" }
      ],
      "bookingRef":   "XY123456",
      "ticketedDate": "2026-10-15T08:12:00Z",
      "fareClass":    "Y",
      "ssrs":         ["VGML", "WCHR"]
    }
  ]
}
```

**Portal consumer:** `SearchResult.journey[]` (multi-leg itinerary panel in
Traveller Details 360) and the Travel Pattern Intelligence co-traveler engine
(`src/mocks/travelPatternData.ts`).

---

## 4 · SITA I:Sight Border Events (Integration C)

The portal's Border Dashboard (`/dashboard/border-dashboard`) currently renders
mock checkpoint data from `src/mocks/dashboardData.ts`. In production this will
be a live feed from SITA I:Sight.

**Proposed webhook (I:Sight pushes to Al-Ameen):**
```
POST /api/v1/checkpoints/events
Authorization: Bearer {isight-service-token}
Content-Type: application/json
```

**Event payload:**
```jsonc
{
  "eventId":      "EVT-20261101-0042",
  "eventType":    "HIT_FIRED",  // HIT_FIRED | BOARDING_COMPLETE | LANE_STATUS_CHANGE | ALERT_ACKNOWLEDGED
  "checkpointId": "MCT-T1-L3",
  "checkpointName": "Muscat T1 — Lane 3",
  "occurredAt":   "2026-11-01T14:38:52Z",
  "passengerId":  "PAX-SY7721039",
  "flightNo":     "WY456",
  "riskLevel":    "CRITICAL",
  "details": {
    "watchlistHit": "INTERPOL Red",
    "confidence":   0.91
  }
}
```

**Lane / checkpoint status feed (polled every 30 s):**
```
GET /api/v1/checkpoints
Authorization: Bearer {portal-token}
```

Response consumed by `<BorderDashboard />` to render the 8-checkpoint grid
with green / amber / red status indicators.

---

## 5 · Watchlist Sync (Integrations D + E)

### 5.1 Interpol FIND

Interpol publishes Red Notices and Diffusions via the FIND (Facial and Image
Notices Database) system. Sync runs every 6 hours (per the demo script).

**Proposed sync mechanism:**
- SFTP pull from Interpol gateway (XML feed) → Al-Ameen ingest job
- OR Interpol REST API if available under ROP bilateral agreement

**Proposed ingest endpoint (triggered by sync job):**
```
POST /api/v1/watchlist/sync
Authorization: Bearer {internal-service-token}
Content-Type: application/json

{
  "sourceId":    "INTERPOL_RED",
  "syncAt":      "2026-11-01T06:00:00Z",
  "records": [
    {
      "externalId":   "RN-2024-12345",
      "surname":      "IBRAHIM",
      "givenNames":   "OMAR SAEED",
      "dob":          "1978-09-04",
      "nationality":  "LBY",
      "docNumber":    "LY443901",
      "docType":      "P",
      "riskCategory": "TERRORISM",
      "designationRef": "INTERPOL-RN-2024/12345",
      "sourceAuthority": "INTERPOL General Secretariat",
      "effectiveDate":   "2024-03-15",
      "active": true
    }
  ]
}
```

**Portal consumer:** `src/mocks/watchlistData.ts` — `WatchlistTarget[]` rows
where `watchlistIds` includes `wl-006` (Interpol Red Notices).

---

### 5.2 Netherlands Sanctions / UN Sanctions

Sanctions lists (EU Reg 269/2014, UN 1267 Committee) are published as XML
or CSV by the relevant authorities and pulled daily (06:00).

**Same ingest endpoint** as above with `sourceId: "NL_SANCTIONS"` or
`"UN_1267"`. The `riskCategory` field maps to:

| Source | riskCategory values |
|--------|---------------------|
| NL Sanctions | `ISIL_FACILITATOR`, `RUSSIA_SANCTIONS`, `DPRK_PROLIFERATION`, `IRAN_SANCTIONS` |
| Interpol Red | `TERRORISM`, `DRUG_TRAFFICKING`, `FINANCIAL_CRIME`, `HUMAN_TRAFFICKING` |
| UN 1267 | `AL_QAEDA`, `ISIL`, `TALIBAN` |

---

## 6 · Portal Internal API (Integration G)

These are the calls the React SPA (`src/`) will make instead of reading mock
files. Each row shows the mock file replaced and the proposed endpoint.

### 6.1 Search

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/searchData.ts` | `/api/v1/search` | GET | Unified search across events / hits / identities / services |

```
GET /api/v1/search?domain=events&q=Ahmed+Khalil&mode=phonetic&page=1&pageSize=25
Authorization: Bearer {officer-token}
```

Response: `{ results: SearchResult[], total: number, page: number }`

---

### 6.2 Services Dashboard

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/dashboardData.ts` (services section) | `/api/v1/services` | GET | Flight-level service list with pax/hit counts |
| — | `/api/v1/services/{id}` | GET | Single flight detail + manifest |

```
GET /api/v1/services?date=2026-11-01&status=active&riskLevel=high&page=1
Authorization: Bearer {officer-token}
```

---

### 6.3 Border Dashboard

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/dashboardData.ts` (border section) | `/api/v1/checkpoints` | GET | Live checkpoint status grid |
| — | `/api/v1/checkpoints/alerts` | GET | Alert feed (last 60 min) |
| — | `/api/v1/checkpoints/alerts/{id}/acknowledge` | POST | Acknowledge an alert |
| — | `/api/v1/checkpoints/stats` | GET | Processing stats (8-hour throughput chart) |

---

### 6.4 Watchlist

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/watchlistData.ts` | `/api/v1/watchlist` | GET | All watchlists + summary stats |
| — | `/api/v1/watchlist/{id}/targets` | GET | Targets in a watchlist (paginated) |
| — | `/api/v1/watchlist/{id}/targets` | POST | Add new target (draft → review → active) |
| — | `/api/v1/watchlist/import` | POST | Bulk CSV/XML import |
| — | `/api/v1/watchlist/export` | GET | Export with format=csv\|xml |

---

### 6.5 Target Match

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/targetMatchData.ts` | `/api/v1/hits` | GET | Match queue (paginated, filterable by status) |
| — | `/api/v1/hits/{id}` | GET | Single hit detail (target + traveler side-by-side) |
| — | `/api/v1/hits/{id}/action` | POST | Officer action (false positive / escalate / confirm / defer) |

```
POST /api/v1/hits/TH-001/action
Authorization: Bearer {officer-token}
Content-Type: application/json

{
  "action":     "ESCALATE",         // FALSE_POSITIVE | ESCALATE | CONFIRM | DEFER
  "reason":     "High name similarity + matching DOB",
  "deferUntil": null                // ISO timestamp if action=DEFER
}
```

---

### 6.6 OSINT Risk Engine

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/osintData.ts` | `/api/v1/risk/queue` | GET | Risk queue (high-risk pax awaiting analyst review) |
| — | `/api/v1/risk/{entityId}` | GET | Full risk record: score, factors, rule trace, source coverage |

---

### 6.7 Case Management

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/caseManagementData.ts` | `/api/v1/cases` | GET | All cases (Kanban lanes: open / investigating / pending / closed) |
| — | `/api/v1/cases/{id}/status` | PUT | Move case to new lane |
| — | `/api/v1/cases/{id}/resolve` | POST | Close with disposition + notes |

---

### 6.8 Travel Pattern Intelligence

| Mock file | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| `src/mocks/travelPatternData.ts` | `/api/v1/tpi/co-traveler` | GET | Co-traveler network results |
| — | `/api/v1/tpi/trafficking` | GET | Trafficking indicator queue |
| — | `/api/v1/tpi/document-anomaly` | GET | Document anomaly detections |
| — | `/api/v1/tpi/route-signatures` | GET | Route cluster signatures |

---

### 6.9 Authentication

All portal API calls use **Bearer token** authentication. Tokens are issued by
the IdP (ForgeRock in production; stub JWT in sandbox).

```
POST /auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=ameen-portal
&username=OFC-2024-0042
&password=***
```

Response: `{ access_token, expires_in, token_type: "Bearer", roles: ["SUPERVISOR"] }`

---

## 7 · Outbound Stream API (Integration F)

Third-party entities (hotels, telecom, etc.) push intelligence events to
Al-Ameen. This surface is documented in the portal's API Portal module
(`/dashboard/api-portal`). Current mock endpoints defined in
`src/mocks/ameenData.ts`:

| Stream | Endpoint | Notes |
|--------|----------|-------|
| Hotel | `POST /v1/events/hotel` | Check-in, check-out, room change |
| Car Rental | `POST /v1/events/car-rental` | Booking, pickup, return, extension |
| Mobile / Telecom | `POST /v1/events/mobile` | SIM sale, activation, deactivation |
| Municipality | `POST /v1/events/municipality` | Lease registration, renewal, termination |
| Payment | `POST /v1/events/payment` | Currency exchange, wire, large-cash flag |
| Borders | `POST /v1/events/borders` | Entry, exit, visa event |
| Health | `POST /v1/events/health` | Admission, prescription, discharge |
| Utility | `POST /v1/events/utility` | Electricity / water / internet activation |
| Transport | `POST /v1/events/transport` | Bus / taxi usage |
| Education | `POST /v1/events/education` | Enrollment, visa extension |
| Employment | `POST /v1/events/employment` | Work permit, employer change |
| E-Commerce | `POST /v1/events/ecommerce` | Online transaction, bulk purchase |
| Social | `POST /v1/events/social` | Phone-account linkage, keyword flag |
| Customs | `POST /v1/events/customs` | Cargo manifest, restricted goods |
| Marine | `POST /v1/events/marine` | Docking, boat rental, vessel movement |
| Postal | `POST /v1/events/postal` | PO Box, parcel, international mail |

**Common status endpoints:**
```
GET /v1/entity/status          — integration health (entity ID, last sync, error rate)
GET /v1/entity/events/history  — submitted event history (paginated)
```

---

## 8 · Data Model — Common Enums

These enums span multiple endpoints and must be agreed with SITA/backend before
go-live:

```typescript
// Risk levels (consistent across watchlist, hit, search)
type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

// Hit / match statuses
type HitStatus = 'PENDING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'ESCALATED' | 'DEFERRED';

// Boarding statuses (APIS)
type BoardingStatus = 'CHECKED_IN' | 'BOARDED' | 'NO_SHOW' | 'GO_SHOW' | 'PENDING';

// Case dispositions
type CaseDisposition =
  | 'CONFIRMED_THREAT'
  | 'FALSE_POSITIVE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'TRANSFERRED';

// Watchlist types (must match portal typeConfig)
type WatchlistType =
  | 'national_security' | 'overstay' | 'financial'
  | 'employment' | 'interpol' | 'sanctions' | 'custom';

// Document types
type DocType = 'P' | 'V' | 'ID' | 'RP' | 'OTHER';
// P=Passport, V=Visa, ID=National ID, RP=Residence Permit
```

---

## 9 · Sandbox / Test Environment

| Item | Value |
|------|-------|
| Portal sandbox | `https://alameen.tech` (current Vercel deployment, mock data) |
| Backend sandbox | TBD — ROP IT to provision |
| Auth sandbox | Stub JWT (no ForgeRock required for workshop) |
| Test APIS feed | Sample file available: `docs/samples/apis-sample-WY456.json` (to be created) |
| Test PNR feed | Sample file available: `docs/samples/pnr-sample-WY456.json` (to be created) |
| Test watchlist CSV | Sample file available: `docs/samples/watchlist-sample-interpol.csv` (to be created) |

---

## 10 · Open Questions

| # | Question | Owner | Priority |
|---|----------|-------|----------|
| OQ-01 | What is the SITA I:Sight webhook format? Does it follow IATA standard or a proprietary schema? | SITA | 🔴 |
| OQ-02 | Will APIS/PNR arrive via SITA SureChek or direct airline push? | SITA / ROP IT | 🔴 |
| OQ-03 | What is the Interpol FIND access mechanism for ROP — REST API or SFTP? What is the update cycle? | SITA / ROP IT | 🔴 |
| OQ-04 | Is ForgeRock available for the sandbox/workshop, or do we stub JWT auth? | ROP IT | 🟡 |
| OQ-05 | What is the agreed pagination strategy — cursor or offset? | ROP IT | 🟡 |
| OQ-06 | Will the backend be new-build or an extension of existing SITA systems? | SITA / ROP IT | 🔴 |
| OQ-07 | Are real-time checkpoint events websocket or polling (30 s)? What SLA for event delivery? | SITA | 🟡 |
| OQ-08 | Which of the 16 intelligence streams are in scope for Phase 1 of the live integration? | ROP IT | 🟡 |
| OQ-09 | What is the data retention policy for APIS/PNR records in the backend? | ROP IT / Legal | 🟢 |
| OQ-10 | Are risk scores computed by the backend or the portal? Currently computed client-side (mock). | SITA / ROP IT | 🔴 |

---

## 11 · Workshop Agenda (Proposed)

| Time | Topic | Owner | Output |
|------|-------|-------|--------|
| 0:00–0:15 | Intro: portal live demo, scope of integration | Al-Ameen team | Shared context |
| 0:15–0:45 | Section 3: APIS/PNR — payload walkthrough, agree schema | SITA + ROP IT | Agreed payload v0.1 |
| 0:45–1:15 | Section 4: I:Sight events — webhook format, checkpoint feed | SITA | Agreed event format |
| 1:15–1:45 | Section 5: Watchlist sync — Interpol FIND + sanctions | SITA + ROP IT | Sync schedule + format |
| 1:45–2:15 | Section 6: Portal internal API — backend owner, auth model | ROP IT | Backend owner assigned |
| 2:15–2:30 | Open Questions (Section 10) — triage and assign | All | OQ log updated |
| 2:30–2:45 | Integration timeline: milestones, owners, next meeting | All | Action list |

---

## 12 · Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-10-30 | 1.0 | Initial draft — all integrations identified, payload schemas proposed, open questions logged |
