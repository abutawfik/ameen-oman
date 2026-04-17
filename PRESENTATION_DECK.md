# Al-Ameen · Product Brief
### Twelve-slide presentation deck for customer + stakeholder meetings

**Prepared by:** SITA Borders MEA · Al-Ameen Product Team
**Audience:** ROP-adjacent gov decision-makers · Ministry of Interior · IG briefings · commercial stakeholders
**Version:** 1.0 · 17 April 2026 · Classification: SITA Internal — Commercial in Confidence

---

> **How to use this deck:** Each slide has a **`TITLE`**, **`KEY MESSAGE`** (the one line to land), **`ON-SLIDE CONTENT`** (what appears visually), and **`SPEAKER NOTES`** (what you say out loud — conversational, 30-60 seconds). Import into Keynote / Google Slides / PowerPoint; keep the ceremonial Majlis Azure palette (navy ocean + brass accent) for visual cohesion with the live product.
>
> Companion artifact: `DEMO_WALKTHROUGH.md` covers the hands-on live-product walkthrough for executive (10-min) and technical (25-min) audiences.

---

## Slide 1 · Cover

**TITLE**
Al-Ameen · الأمين
*The Nation's Trusted Guardian*

**KEY MESSAGE**
Who we are. One line. Full stop.

**ON-SLIDE CONTENT**
- Al-Ameen wordmark (ceremonial Cormorant Garamond + Cairo) on midnight ocean canvas with brass tracery
- Arabic subtitle `الحارس الأمين للوطن`
- Bottom-right: "SITA Borders MEA · Prepared for [Customer] · April 2026"
- Gold-dashed pulsing indicator pill: "National Intelligence Platform · Operated by National Police HQ"

**SPEAKER NOTES**
Open warm and measured. "Good morning. Today we're showing you Al-Ameen — a national intelligence platform that fuses sixteen real-time data streams into one explainable risk score at the border. Built on the SITA Borders MEA portfolio. Designed alongside ROP under the iBorders programme. Ready for Phase 1 pilot."

---

## Slide 2 · The gap we close

**TITLE**
The adjudication blind spot

**KEY MESSAGE**
Today's border decisions rely on closed-system signals. Al-Ameen adds the context they're missing.

**ON-SLIDE CONTENT**
Two columns, visual contrast.

**Column A — "What border systems see today"** (muted, grey tones)
- Passport biographic data
- Watchlist matches
- Historical travel records
- APIS/PNR submission compliance

**Column B — "What they don't see" (in brass, highlighted)**
- Geopolitical conflict posture at origin
- Sponsor-entity exposure to sanctioned parties
- Routing anomalies vs. historical pattern
- Document-integrity signals from multilateral feeds
- Outbreak windowing from WHO / ECDC
- Behavioral patterns across ETA + post-arrival

Bottom trust line: *"The traveler who is not on any watchlist but whose broader context warrants secondary scrutiny — that's the blind spot."*

**SPEAKER NOTES**
"Think about a traveler who isn't on any watchlist — the system says 'clear.' But their origin country just saw a conflict escalation last week. Their sponsor entity is two hops from a sanctioned party on OpenSanctions. Their booking was made twelve hours before departure, far tighter than the 95th percentile for that nationality-origin pair. Today those signals don't enter the decisioning moment. Al-Ameen makes them visible, auditable, and explainable — at both ETA adjudication and API/PNR pre-arrival screening."

---

## Slide 3 · Al-Ameen in one page

**TITLE**
What Al-Ameen is

**KEY MESSAGE**
One platform. Two decision points. Nine sub-scores. Sovereign by design.

**ON-SLIDE CONTENT**
Three-column layout.

**Column 1 — Decision points**
- ETA adjudication (pre-travel authorization)
- API/PNR pre-arrival screening (in-flight window)

**Column 2 — Scoring model**
- 9 sub-scores · Sanctions / Geopolitical / Biosecurity / Routing / Behavioral / Declaration / Entity / Presence / Document
- Rules baseline + unsupervised ML overlay
- Every score returns a full contribution breakdown

**Column 3 — Sovereignty**
- Operated by National Police HQ · Border Control System
- Classification labels travel end-to-end
- Rasad-ready adapter pattern from day one
- In-country data residency for production

Bottom footer: *23 rules · 8 OSINT sources · 9 internal streams · 4 weight profiles*

**SPEAKER NOTES**
"Al-Ameen is positioned between what your border systems already do and what you need them to become. At the two decision moments — ETA and API/PNR — we produce one unified risk score, from nine fused sub-scores, with every contributing signal cited and every rule version-tracked. The platform is sovereign: data in-country, classification routed end-to-end, audit log for every classified access. And crucially — architected so that Rasad lands as a new source adapter, not a re-architecture, when access is granted."

---

## Slide 4 · Architecture at a glance

**TITLE**
Four layers · schema-contracted · swap-ready

**KEY MESSAGE**
Source-agnostic pipeline. Every feed lands into the same Event/Entity/Signal/Score schema.

**ON-SLIDE CONTENT**
ASCII-style architecture diagram (or formal diagram re-drawn in the deck):

```
┌─────────────────────────────────────────────────┐
│  L4 · PRESENTATION                              │
│     Operator UI · REST API · Dashboard          │
├─────────────────────────────────────────────────┤
│  L3 · API SURFACE (FastAPI)                     │
│     /v1/events · /v1/score · /v1/entity         │
│     /v1/cases · /v1/alerts · /v1/explain        │
├─────────────────────────────────────────────────┤
│  L2 · ENRICHMENT + SCORING                      │
│  Normalize → Entity Resolution → Rules + ML     │
│  Overlay → Fusion → Explainability              │
├─────────────────────────────────────────────────┤
│  L1 · COLLECTION                                │
│  OSINT connectors · Internal streams ·          │
│  [Future] Rasad adapter — same schema           │
└─────────────────────────────────────────────────┘
              ▲
              │
       Postgres 15 + PostGIS · Redis · Object Store
```

Three trust-lines on the right:
- *Classification travels end-to-end*
- *Scoring is deterministic · same inputs → same score*
- *Audit log is the integrity boundary*

**SPEAKER NOTES**
"Four layers. Collection, enrichment, API, presentation. Each layer is schema-contracted — meaning the API doesn't know whether a signal came from OpenSanctions, from your own Entry/Exit system, or from a future Rasad feed. They all land as the same shape. That's the key engineering decision. It lets us add sources without re-architecting, which is how Rasad integrates later: a new adapter, a new weight profile, segregated audit — no rewrite. Underneath, it's Postgres with PostGIS for geospatial signals, Redis for caching, and object storage for raw payloads."

---

## Slide 5 · How it scores

**TITLE**
Explainable · deterministic · tunable

**KEY MESSAGE**
Every flag cites its sources. Every decision is auditable. Weights are tunable by operators — no deploy needed.

**ON-SLIDE CONTENT**
Left half: **Unified Score Formula**
```
  unified_score = Σ (sub_score_k × weight_k)

  where Σ weights_k = 100
```

Right half: **9 Sub-scores with default weights**

| Sub-score | Default | Method |
|---|---|---|
| Sanctions / PEP | 15% | Fuzzy match + graph traversal |
| Geopolitical origin | 12% | GDELT + ACLED rolling window |
| Biosecurity overlap | 5% | WHO/ECDC outbreak windowing |
| Routing anomaly | 12% | Isolation Forest unsupervised |
| **Behavioral** | **15%** | **Overstay/denial history** |
| **Declaration** | **12%** | **Sponsor/address mismatch** |
| Sponsor / Entity | 10% | Personalized PageRank (decay 0.5) |
| **Presence coherence** | **10%** | **Cross-stream timeline gaps** |
| Document & identity | 9% | Rules + format validation |

Bottom row: *4 named weight profiles · 23 rules · SHAP attributions per record · As-of time-travel replay*

**SPEAKER NOTES**
"The score is a weighted sum — deterministic, auditable, and reproducible. Same inputs plus same model version produces the same score within point-zero-one. The nine sub-scores cover everything from sanctions match to behavioral history to cross-stream timeline gaps. The three new categories — behavioral, declaration, presence coherence — are what the Tech Spec calls 'Model Three': patterns that only emerge when you fuse across data streams. For every single score, we produce a full contribution breakdown: which rule fired, which OpenSanctions list matched, which ML feature contributed — every one explained, every one exportable. Weights are tunable in real-time via named profiles: there's a default balanced profile, a sanctions-heavy ETA profile, a behavioral-focus PNR profile, and a Rasad-weighted profile. No re-deploy to adjust."

---

## Slide 6 · Intelligence sources

**TITLE**
Eight OSINT feeds · nine internal streams · one schema

**KEY MESSAGE**
Public sources now. Classified sources when Rasad lands. Same UI, same audit trail.

**ON-SLIDE CONTENT**
Two rows.

**Row 1 — OSINT (8 sources, all today)** — each as a small card with classification stripe:
OpenSanctions · GDELT 2.0 · ACLED · WHO DON · ECDC · OpenSky · Travel Advisories · OpenCorporates

**Row 2 — Internal streams (9, operating)** — same card pattern with darker classification:
Entry/Exit · APIS · eVisa · Historical Border · Hotels · Mobile Operators · Car Rentals · Municipality · MOL Employment

Below: **Phase 2 — Classified Rasad integration**
- Read-only preview panel in product today
- 29-day transition plan: Schema alignment · Classification policy · Weight calibration · Parallel-run validation

Status footer: *"Phase 1 operates on public + internal sources only. Rasad integration contingent on formal access agreement with data owners."*

**SPEAKER NOTES**
"Phase 1 ships with eight OSINT sources and nine internal streams. OpenSanctions handles the sanctions and PEP layer — updated daily. GDELT and ACLED give us geopolitical and armed-conflict intensity, fifteen-minute to weekly cadences. WHO and ECDC cover biosecurity. OpenSky for routing anomalies. On the internal side — Entry/Exit, APIS, eVisa history, hotels, mobile operators, car rentals, municipality leases, Ministry of Labour records. All of it runs through one adapter pattern and lands in the same Event/Entity/Signal schema. Rasad's integration is designed today — there's a full preview panel showing exactly how it'll drop in. Twenty-nine working days from access granted to parallel-run validation. No re-architecture, no data migration — the adapter slots in behind the existing interface."

---

## Slide 7 · Operator workflow

**TITLE**
From alert to disposition · the feedback loop that trains tomorrow's model

**KEY MESSAGE**
Every closed case is a labelled training example. The system learns from every adjudication.

**ON-SLIDE CONTENT**
Horizontal flow diagram, 7 stages:

```
Alert fires  →  Operator Queue  →  Explainability  →  Person 360°
                                                        ↓
                                                   Case opened
                                                        ↓
                                        Investigating → Pending Review
                                                        ↓
                                              Disposition assigned
                                   (Confirmed Threat / False Positive /
                                    Insufficient Evidence / Transferred)
                                                        ↓
                                            Labelled outcome recorded
                                                        ↓
                                        Feeds next model retraining cycle
```

Under each stage: one-line description + the named surface (`/dashboard/...`).

Right-side quote box: *"Noise discipline is the product. Every CRITICAL alert that doesn't earn human attention erodes the system's credibility."*

**SPEAKER NOTES**
"Here's the operator loop. An alert fires — colour-coded by severity with an SLA countdown for CRITICAL. Operator sees it on their queue, opens the Explainability tab, sees exactly why the record scored high and which rules fired. If warranted, they pull up Person 360° — full dossier view: identity, movements timeline, relationship graph, activity feed, risk trend, case history. They open a case. It progresses through states — Open, Investigating, Pending Review. At closure, they assign a disposition: confirmed threat, false positive, insufficient evidence, or transferred. And that disposition isn't just a log entry. It becomes labelled training data that feeds the next ML retraining cycle. The unsupervised models we ship Phase 1 will become supervised by Phase 2 — because your operators will have generated the ground truth."

---

## Slide 8 · Model governance

**TITLE**
Drift · calibration · fairness · rollback

**KEY MESSAGE**
Every model decision is version-tracked. Every drift is surfaced. Every fairness anomaly is flagged. One-click rollback.

**ON-SLIDE CONTENT**
Five-panel screenshot (or simplified graphical representation) of the live Model Governance tab:

1. **Version stack** · `mvp-0.3.1` · previous `mvp-0.3.0` · 14 days in production · rollback button
2. **Drift chart** · 30-day score distribution with ±1σ band · today's z-score color-coded · status: OK / WATCH / BREACH
3. **Calibration curve** · expected vs observed risk · y=x reference line · nightly re-calibration status
4. **Per-nationality fairness** · top-10 nationalities by flag rate · σ deviation from global mean · red flag markers above 2σ
5. **Model registry timeline** · 6-month horizontal timeline of model versions: active / shadow / retired

Right-side trust line: *"Shadow-model v0.3.2-rc1 currently running for evaluation · promotion pending parallel-run results"*

**SPEAKER NOTES**
"This is the trust panel. Five things every model governance review in government asks — we show all five on one page. Drift: are today's scores statistically consistent with the 30-day baseline? Calibration: does an 80 actually mean 80% likelihood? Fairness: is one nationality getting flagged at a rate way above its baseline — and if so, is that a real risk pattern or is it bias? Rollback: if we just promoted a model and it starts drifting — one click reverts. Registry timeline: every model version deployed in the last six months, with shadow-mode markers showing what we're evaluating. Model v0.3.2-rc1 is running in shadow right now — we can compare its scores against v0.3.1's, side by side, before we promote."

---

## Slide 9 · Classification + Rasad readiness

**TITLE**
Sovereignty built-in · classified integration pre-wired

**KEY MESSAGE**
Classification labels route automatically. Rasad integration is a 29-day sprint, not a rewrite.

**ON-SLIDE CONTENT**
Left half: **Classification model**
Visual representation of the four-level classification hierarchy:
- `PUBLIC` (info-blue pill)
- `INTERNAL` (olive pill)
- `RESTRICTED` (brass pill)
- `CLASSIFIED` (Oman-red pill)

Below: "Every Event, Entity, Signal, Score carries its classification max. Operators see redacted values when their clearance is below the field's level. Every classified-data access writes to the Audit Log."

Right half: **Rasad readiness checklist (live in the product today)**
- ✅ Source abstraction layer — identical adapter contract
- ✅ Classification-aware routing — CLASSIFIED label flows end-to-end
- ✅ Separate weight profile — 'Classified · Rasad-weighted' (in Config tab)
- ✅ Segregated audit logging — all Rasad access flagged `classified_accessed`
- ⏸ Access provisioned — pending formal agreement with ROP + data owners

**SPEAKER NOTES**
"Classification is built in from the schema level — not bolted on. Every record — Event, Entity, Signal, Score — carries the maximum classification of its inputs. When an operator with INTERNAL clearance views a record that includes a CLASSIFIED signal, they see redacted placeholders. We have a live demo of that in the Clearance pill — cycle the clearance level and you watch fields blur out with a clearance-required tooltip. Rasad readiness: there's a dedicated tab in the product today. It shows the exact TypeScript adapter shape, the four-step transition plan with realistic day estimates, and a shadow-mode preview of how scores would shift if Rasad were integrated. When access is granted, the integration is a focused sprint — not a rewrite. That's the whole point of the schema-contracted architecture."

---

## Slide 10 · What's built · what's next

**TITLE**
Phase 1 complete · four delivery waves shipped

**KEY MESSAGE**
Twenty features across four waves. The Tech Spec v1.0 demo is materially complete.

**ON-SLIDE CONTENT**
Four-column timeline.

**Wave 1 — Core scoring**
- 23 rules (9-sub-score coverage)
- Model Governance dashboard
- Audit Log viewer
- Feature Vector inspector
- Weight-Profile manager

**Wave 2 — Operator workflow**
- Person 360° six-tab dossier
- Case Management lifecycle + disposition
- Entity Resolution review queue
- Notifications routing engine
- Scoring as-of replay

**Wave 3 — Polish**
- Rules YAML editor + hot-reload
- Rasad Phase 2 teaser tab
- Reports builder
- Demo narration overlay
- Classified-data redaction

**Wave 4 — Finish**
- Deep-link narration
- YAML diff view
- Clearance cycle audit
- Custom report templates
- Rasad shadow scatter

**Next (Phase 2):**
- FastAPI production backend
- Rasad integration (access-dependent)
- Regional replication (Kenya ECS · Qatar ARAS · Jordan · KSA)
- Supervised ML on labelled case dispositions

**SPEAKER NOTES**
"Twenty features across four waves. Wave one established the core — rules, scoring, governance, audit. Wave two built the operator workflow — Person 360°, Case Management with the disposition feedback loop, Entity Resolution for the 0.70–0.85 match band. Wave three polished — YAML rules editor with hot-reload, Rasad preview tab, Reports builder, demo narration. Wave four finished — deep-link demo mode, YAML diff, live clearance audit trail, scatter-plot Rasad shadow-mode. Everything you're seeing today is runnable — bilingual English and Arabic, runtime palette toggle, WCAG AA accessible, with a full walkthrough script for unattended demos. Phase 2 is the production backend and the Rasad sprint when access is granted. Regional replication — Kenya, Qatar, Jordan, KSA — uses the same platform with country-specific calibration."

---

## Slide 11 · Commercial framing

**TITLE**
Capability extension · not a standalone product

**KEY MESSAGE**
Al-Ameen extends your existing APP/APIS and PNR investments. Regionally reusable. PoC-funded.

**ON-SLIDE CONTENT**
Three-column layout.

**Column 1 — Commercial posture**
- Positioned as capability extension of existing ROP APP/APIS and prospective PNR contracts
- PoC funded at SITA bid-development level
- Phase 2 production ramp on Border Control System infrastructure

**Column 2 — Regional reuse**
Same platform · country-specific calibration only:
- Kenya ECS
- Qatar ARAS
- Jordan · borders modernization
- Saudi Arabia · haramain + general borders

**Column 3 — TCO economics**
- Zero third-party licensing in Phase 1 (OSINT = free-tier public)
- Phase 2 licensing review: Recorded Future · Flashpoint · Babel Street (deferred by design)
- Data residency: in-country hosting for all ROP-origin data

Bottom trust line: *"The unit economics scale with adjudication volume — not with the number of data sources. Adding Rasad does not increase licensing cost."*

**SPEAKER NOTES**
"Let's be direct about the commercial positioning. Al-Ameen is not a separate product we're selling into your organization — it's a capability extension of your existing SITA investments. APP, APIS, the prospective PNR feed. The PoC is funded at bid-development level — no new procurement ask. Production ramp sits on your Border Control System infrastructure. Licensing: in Phase 1 we deliberately use free-tier public OSINT — no per-seat, no per-source fees. Phase 2, if you want to add commercial intelligence aggregators like Recorded Future or Flashpoint, that's a separate licensing conversation, deferred by design. Critically — the unit economics scale with your adjudication volume, not with the number of sources. Adding Rasad does not add licensing cost. Regional replication — this same platform runs in Kenya, Qatar, Jordan, Saudi Arabia — with country-specific calibration of weights and sources only. That's where the investment compounds."

---

## Slide 12 · Next steps

**TITLE**
From demo to decision

**KEY MESSAGE**
Three concrete actions to move forward this week.

**ON-SLIDE CONTENT**

**1 · Product review meeting (internal SITA)**
- Demo walkthrough with Tech Lead + Portfolio Director
- Model governance deep-dive with SITA Borders SMEs
- Q&A on Rasad integration pathway

**2 · Customer demo (ROP, by invitation)**
- Executive track: 10-minute scripted walkthrough
- Technical track: 25-minute tech spec deep-dive
- Dual audience supported on one dashboard

**3 · Phase 2 commitment gate**
- Formal Rasad access discussion
- Production infrastructure sizing
- 6-week Phase 2 delivery plan signed

**Contact**
Alaa Fada · Portfolio Director · Borders Management MEA · SITA
alaa.fada@sita.aero

**Access**
- Live demo: https://ameen-oman.vercel.app
- Walkthrough script: `DEMO_WALKTHROUGH.md` (in repo)
- Tech Spec v1.0: `Oman_Risk_Engine_Technical_Spec_v1.0.docx`

**Thank you · شكراً لكم**
*الحارس الأمين للوطن*

**SPEAKER NOTES**
"Three concrete next steps. First — internal SITA product review: we do a full demo walkthrough with Tech Lead and Portfolio Director, go deep on model governance with our Borders SMEs, close any gaps on the Rasad integration pathway. Second — customer demo for ROP, by invitation, executive or technical track depending on the audience. The product supports both from the same dashboard. Third — the Phase 2 commitment gate: formal Rasad access discussion, production infrastructure sizing, signed six-week delivery plan. All of this is ready to move on. Live demo URL, walkthrough script in the repo, full Tech Spec attached. We're ready to move on your word. Thank you. شكراً لكم."

---

## Appendix · Presenter cheat sheet

**Keyboard shortcuts on live product:**

| Key | Action |
|---|---|
| **E** | Toggle Presenter Mode (enlarges type, hides debug panels) |
| **N** | Toggle walkthrough narration overlay |
| **Esc** | Close narration or active modal |
| **→ / Space** | Next narration step |
| **←** | Previous narration step |
| **Cmd/Ctrl + Shift + P** | Cycle palette (v1.0 ↔ v1.1) |
| **Cmd/Ctrl + Shift + N** | Dump narration script JSON (dev) |

**URL deep-links:**
- `?narrate=osint-sequence-gap` — launches narration mid-demo at the Sequence Coherence 72h gap
- `?narrate=true` — starts narration at step 0 on the current page

**Clearance pill in title bar:**
Cycles PUBLIC → INTERNAL → RESTRICTED → CLASSIFIED. Watch classified fields redact inline with tooltip.

**Palette switcher (bottom-right):**
Toggle between Majlis Azure v1.0 (deep navy) and v1.1 (brighter royal blue) in real-time. Useful if brand review is part of the meeting.

**If demo goes sideways:**
- Internet dies → fall back to local `localhost:3021`
- Narration glitches → press Esc, continue manually per this deck
- Palette toggle looks broken → hard-refresh (Cmd+Shift+R)
- "This is all mock data, what's real?" → "Frontend is demo-ready today. Backend is Phase 2 — we're showing the surface contract, not the production integration."

---

_v1.0 · 17 April 2026 · Al-Ameen product team · Prepared for SITA Borders MEA_
