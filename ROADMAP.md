# AMEEN — OSINT-Enriched Unified Risk Assessment Engine
## Product Roadmap

**Source:** `Oman_OSINT_Risk_Engine_PoC.docx` (v0.1, 17 April 2026) — SITA | Borders MEA
**Customer:** Royal Oman Police (ROP) under iBorders
**Decision points:** ETA adjudication + API/PNR pre-arrival screening
**Approach:** Rules baseline + unsupervised ML overlay with full explainability
**Classification:** SITA Internal — Commercial in Confidence

---

## 1. Vision

A unified, explainable risk-scoring layer that fuses open-source intelligence into ROP's existing ETA and API/PNR decisioning pipelines. Closes the "not on any watchlist but still worth a look" gap by systematically ingesting geopolitical, sanctions, biosecurity, routing and entity signals, and producing one normalized 0–100 score with per-signal attribution at every decision point.

Designed source-agnostic so classified feeds (Rasad) can land into the same schema once access is granted, without re-architecting.

---

## 2. PoC Success Criteria (6-week MVP)

| # | Outcome |
|---|---|
| 1 | ≥5 OSINT sources ingested end-to-end with documented refresh cadence and live source-health view |
| 2 | Unified risk score computable on synthetic Oman-inbound records for both ETA and API/PNR paths |
| 3 | Every scored record returns an explainability payload (sub-score breakdown + top feature attributions + source confidence) |
| 4 | Rules baseline and ML overlay operate concurrently with configurable weights (tunable without code change) |
| 5 | Dashboard supports both executive (10–12 min) and technical (25–30 min) demo tracks from one UI |
| 6 | Transition-to-production document accepted by SITA and shareable with ROP |

---

## 3. Scoring Model

Unified score is **0–100**, computed as weighted fusion of six sub-scores. Each sub-score is itself fused from rule fires and ML outputs.

| Sub-score | Default weight | Primary sources | Method |
|---|---|---|---|
| Sanctions / PEP exposure | 25% | OpenSanctions | Deterministic match + fuzzy entity resolution |
| Geopolitical origin risk | 20% | GDELT, ACLED, Advisories | Rolling conflict intensity score |
| Biosecurity overlap | 10% | WHO, ECDC, ReliefWeb | Outbreak origin windowing |
| Routing anomaly | 20% | OpenSky, flight history | Unsupervised anomaly detection |
| Sponsor / entity risk | 15% | OpenCorporates, OpenSanctions | Graph risk propagation (decay 0.5) |
| Document & identity | 10% | Advisories, internal flags | Rules (PoC); ML in Phase 2 |

All weights live in YAML — tunable at runtime via the dashboard's Config panel.

---

## 4. OSINT Source Inventory

| Source | Category | Refresh | Confidence |
|---|---|---|---|
| OpenSanctions | Sanctions & PEP | Daily | High |
| GDELT 2.0 | Geopolitical events | 15 min | Medium-High |
| ACLED | Armed conflict | Weekly | Medium-High |
| WHO / ECDC | Biosecurity | Daily | High |
| OpenSky Network | Aviation movements | Near real-time | Medium |
| Travel Advisories | Govt advisories | Daily | High |
| OpenCorporates | Corporate entities | On-query | Medium |
| ReliefWeb | Humanitarian events | Daily | Medium |

Deferred to Phase 2: commercial social media aggregators (Recorded Future, Flashpoint, Babel Street), commercial satellite imagery (Planet, Maxar), Edison TD / PRADO document integrity refs.

---

## 5. Architecture — Three Layers

```
┌──────────────────────────────────────────────────────┐
│  Layer 3 — Presentation                              │
│  REST API (FastAPI) + Dashboard (React + Recharts)   │
├──────────────────────────────────────────────────────┤
│  Layer 2 — Enrichment & Scoring                      │
│  Normalize → Entity Resolution → Rules + ML → Fuse   │
├──────────────────────────────────────────────────────┤
│  Layer 1 — Collection                                │
│  Per-source connectors (Prefect flows), DLQ, archive │
└──────────────────────────────────────────────────────┘
           ▲                                  ▲
           │ OSINT (8 sources)                │ Rasad (Phase 2)
```

Schema-contracted between layers. Source-agnostic adapter pattern means Rasad integrates as a new adapter, not a new system.

---

## 6. Six-Week Delivery Plan

| Week | Focus | Key deliverables |
|---|---|---|
| 1 | Foundation | Repo scaffold, Event/Entity/Signal/Score schemas, Docker Compose (Postgres + PostGIS), synthetic-data generator (50k passengers, PNR + APIS) |
| 2 | Collection layer | 5 connectors live (OpenSanctions, GDELT, ACLED, WHO, OpenSky) with Prefect schedules, retry/backoff, DLQ |
| 3 | Enrichment + Rules | Entity resolution (rapidfuzz + metaphone), NetworkX graph, 12+ declarative rules loaded from YAML, first unified score end-to-end |
| 4 | ML overlay | Isolation Forest (routing anomaly) + personalized PageRank (entity risk), SHAP attributions, model versioning |
| 5 | Dashboard + demo | Executive + Operator + Explainability + Sources + Config views; 5 demo scenarios loaded |
| 6 | Hardening + showcase | Dry-runs, polish, customer demo, transition-to-production document |

**Team (6 weeks):** Portfolio Director 10%, Tech Lead 80%, Backend Eng 100%, Data Eng 60%, Frontend Eng 60%, Security/Compliance Advisor 10%.

---

## 7. Demo Scenarios (PoC Showcase)

| Scenario | Setup | Expected score | Dominant signals |
|---|---|---|---|
| Low-risk routine | Established sponsor, stable origin | 5–15 | Clean across all sub-scores |
| Borderline — context-driven | Origin w/ elevated conflict recently | 35–55 | Geopolitical elevated |
| High-risk sponsor exposure | Sponsor 2 hops from sanctioned party | 70–85 | Sponsor/entity risk high |
| Anomaly-driven | Routing deviates from typical O-D profile | 55–70 | ML overlay dominant; SHAP surfaces features |
| Health-overlap | Traveler from recent outbreak origin | 40–60 | Biosecurity elevated |

---

## 8. Rasad Integration Readiness (Phase 1.5)

Not in PoC scope, but architecture enforced on day one:

- **Source abstraction layer** — every feed (OSINT or Rasad) conforms to one Event/Entity/Signal schema
- **Classification-aware routing** — records carry classification metadata from ingestion through scoring
- **Separate weight profiles** per source class — allows ROP to tune open-source vs. classified contribution independently
- **Segregated audit logging** — Rasad-sourced enrichments logged with full lineage

Transition plan when access granted: (1) schema alignment, (2) retention/classification policy mapping, (3) weight calibration, (4) parallel-run validation vs. OSINT-only scoring.

---

## 9. Roadmap Beyond PoC

### Phase 2 (post-acceptance, ~Q3 2026)
- Commercial OSINT source licensing review (Recorded Future, Flashpoint, Babel Street)
- Rasad integration sprint
- Production infrastructure design (in-country residency for ROP-originated data)
- Formal security assurance + penetration testing
- Document integrity signals via Edison TD / PRADO
- Supervised ML on real labeled outcomes (once decisioning history available)

### Phase 3 (~Q4 2026 – Q1 2027)
- **Regional replication** — same platform, country-specific calibration:
  - Kenya ECS
  - Qatar ARAS
  - Jordan
  - Saudi Arabia
- Geospatial overlay (Planet / Maxar satellite imagery)
- Full human-in-loop override logging and fairness review pipeline

---

## 10. Frontend Module inside AMEEN (this repo)

A demo-grade frontend lives under **`/dashboard/osint-risk-engine`** inside this AMEEN project. It consumes mock data calibrated to match the real scoring model and is the visual artefact for the dual-track demo. The production backend (Python + FastAPI + PostgreSQL + Prefect) is a separate repo and is scaffolded using Appendix A prompts A.1–A.10 from the PoC document.

**Frontend tabs delivered:**
1. **Overview** — KPI strip (scored_24h, flagged_24h, source health, avg score) + narrative cards
2. **Operator Queue** — live queue of recent high-score records with drill-down
3. **Explainability** — sub-score bars, rule fires, ML feature contributions, source attribution
4. **Sources** — OSINT source-health matrix with last-success timestamps
5. **Config** — weight tuning UI (sub-score weights, rule toggles) — writes to the same YAML schema backend consumes

---

## 11. Risks (Summary)

| Risk | Mitigation |
|---|---|
| OSINT source rate-limits or outages | Retry, backoff, DLQ, multi-source redundancy |
| Synthetic data not representative | Calibrate against public aviation stats; review w/ SITA Borders SMEs |
| ML opacity undermines operator trust | SHAP attribution mandatory; demo emphasises explainability |
| Scope expansion during PoC | Written scope lock; change requests deferred to Phase 2 |
| Customer diverts PoC toward production use | Classification + synthetic-data discipline end to end |
| Bias in OSINT sources amplifying into scoring | Source confidence band; fairness checklist; documented limitations |

---

## 12. Commercial Framing

- PoC scoped for internal SITA funding at bid-development level. Negligible third-party licensing given free / free-tier public sources.
- Positioned as **capability extension** of existing ROP APP/APIS and prospective PNR contracts — not a standalone product.
- Reusable across Borders MEA programs with country-specific calibration only.

---

_Last updated: 17 April 2026 · Version 0.1_
