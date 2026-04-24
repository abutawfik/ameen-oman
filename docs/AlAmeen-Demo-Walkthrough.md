# Al-Ameen — Demo Walkthrough Script
Version 1.0 · Tech Spec buildout complete · Prepared for SITA Borders MEA

---

## 0 · Before you start

### Machine setup

| Item | What to do |
| --- | --- |
| Browser | Chrome or Edge, latest. One window, one tab. Full screen (F11). |
| Display | External monitor if projecting. Native 1080p minimum; 1440p preferred. |
| Audio | Muted. This demo is visual-first — no audio cues fire. |
| Network | Vercel deployment is the primary surface. Local `npm run dev` is the fallback. |
| Dev tools | Closed. If you're recording, open only for the console-dump demo moment. |

### URLs

| Target | URL |
| --- | --- |
| Primary (live)   | `https://ameen-oman.vercel.app` (confirm the exact deploy URL with the account team before the meeting) |
| Local fallback   | `http://localhost:5173` after `npm run dev` |
| Seeded narration | Append `?narrate=<step-id>` to any route to deep-link a specific highlight |

### First five seconds

Before the audience walks in:

1. Navigate to `/`. Wait for the hero to finish its gold-glow animation.
2. Press `E` to enter **Presenter mode**. Chrome shrinks, font sizes grow.
3. If the room is warm-toned, press `Cmd/Ctrl+Shift+P` once to cycle to palette v1.1 (brass is more legible under tungsten lighting).
4. Confirm the clearance pill in the title bar reads `PUBLIC`. Leave it there — the redaction demo comes later.

### Keyboard bindings — quick cheat

| Key | Effect |
| --- | --- |
| `E` | Toggle Presenter mode |
| `N` | Start the page's narration walkthrough |
| `Cmd/Ctrl+Shift+P` | Cycle brand palette (v1.0 ↔ v1.1) |
| `Cmd/Ctrl+Shift+N` | Dump current narration script to console (for the "prove the structure" moment) |
| `Esc` | Exit any overlay |

### Demo scenarios

Five pre-loadable cases live in the Queue tab of the OSINT Risk Engine. Load order for a 10-minute demo: **high-risk sponsor → sequence anomaly → borderline**. Keep the low-risk routine case in reserve for the "false positive" question.

---

## 1 · Positioning (60 seconds, no click)

Three lines. Say them before you touch the keyboard.

> "Al-Ameen is a national intelligence and risk-scoring platform — the decisioning layer behind Royal Oman Police's ETA and API/PNR pipelines.
>
> It fuses sixteen real-time streams, scores every traveller through nine sub-scores, and hands operators explainable risk with full lineage in under 100 milliseconds.
>
> It is built by SITA Borders MEA for National Police HQ. Not a SaaS. Classification-adjacent from day one."

Pause. Let the hero page carry the next beat.

---

## 2 · Ten-minute executive demo

Eight clicks. One clearance cycle. One closing frame. Budget 60 seconds per beat.

### Beat 1 · Hero — 45s · `/`

| What | How |
| --- | --- |
| Click/press | Nothing. Just let the page render. |
| Say | "Operated by National Police HQ. This is a state-run surface, not a vendor SaaS. The Arabic slogan `الحارس الأمين للوطن` is always visible — Arabic and English are peers, never translations." |
| Expected | Audience reads the eyebrow pill and the tagline. The gold grid tracery registers as "intentional design." |
| If interrupted | "We'll open every tab in the next ten minutes. Let me frame the pipeline first." |

### Beat 2 · Data flow architecture — 45s · scroll to `#data-flow-architecture`

| What | How |
| --- | --- |
| Click/press | Scroll to the 4-stage diagram. Hover stage 3 (Score) so the provenance chip animates. |
| Say | "Ingest. Normalise. Score. Deliver. Same four stages every signal travels. Scoring is deterministic — identical inputs produce the same score within 0.01. That determinism is what makes it auditable." |
| Expected | Nods from the compliance-minded audience. |
| If interrupted | "Reproducibility is non-negotiable. We don't ship a black box to a border." |

### Beat 3 · Enter the portal — 30s · `/login` → SSO → `/dashboard`

| What | How |
| --- | --- |
| Click/press | Login link in nav. On `/login`, click the SSO button. You land on `/dashboard` as a Manager by default. |
| Say | "Gov-operator portal. Primary path is Government IdP SSO. Officer ID + OTP is the fallback. Every session is logged, every decision carries lineage." |
| Expected | Quick. Don't linger — the SSO button is a one-second beat. |
| If interrupted | "We didn't build auth. We integrated. SSO upstream handles 2FA per NHQ's IdP rules." |

### Beat 4 · Role-switch to Manager — 45s · `/dashboard`

| What | How |
| --- | --- |
| Click/press | Top-right role pill → Manager. Dashboard re-renders with the KPI strip + source health. |
| Say | "Three roles: Data Analyst, Supervisor, Manager. Same data, different lenses. Manager sees throughput, flagged rate, model version, source coverage. All of it real — derived from the mock feed, never hardcoded." |
| Expected | The live-count badges are the proof point. Let them see the numbers update. |
| If interrupted | "Role-based access control is enforced upstream via the IdP's group claims. This UI reflects what the claim allows." |

### Beat 5 · OSINT Risk Engine Overview — 60s · `/dashboard/osint-risk-engine`

| What | How |
| --- | --- |
| Click/press | Sidebar → OSINT Risk Engine. Land on Overview tab. |
| Say | "This is the workbench. Eight tabs. Overview, Queue, Explainability, Sequence Coherence, OSINT Sources, Configuration, Model Governance, Rasad. Start here — 24h throughput, flagged rate, average score, seventeen live sources, model version `v1.4.2-calibrated`." |
| Expected | Audience sees the tab bar and the KPI strip. Move on. |
| If interrupted | "Rasad is Phase 2 — the investigative workbench for organised-crime networks. I'll skip it today; it's a separate briefing." |

### Beat 6 · Queue → Explainability — 90s · Queue tab → click first row

| What | How |
| --- | --- |
| Click/press | Queue tab. Click the top row (should be the high-risk sponsor scenario). Explainability opens. |
| Say | "Every score has an explanation. Top contributions, bottom contributions, coverage strip, confidence gauge. Which sources fed this score, which rules fired, which rules were skipped — it's all here. No silent contributions." |
| Expected | The coverage strip does the work. Point to it. |
| If interrupted (the "is this biased?" question) | "Fairness testing is in the Model Governance tab — per-nationality flagged-rate bars. I'll open that in a minute. Bias is measured, not assumed." |

### Beat 7 · Sequence Coherence — 45s · Sequence Coherence tab

| What | How |
| --- | --- |
| Click/press | Tab header. Scroll to the 62h gap anomaly card. |
| Say | "Rules don't catch this one. A sixty-two-hour gap between APIS arrival and the first hotel check-in — rules see two green fields. Model 3 sees a presence anomaly. That's the ML recall story." |
| Expected | One or two people lean forward. This is the "aha." |
| If interrupted | "Same person, different signal arrangement. The anomaly is the pattern, not the value." |

### Beat 8 · Model Governance + clearance demo — 90s · Model Governance tab → clearance pill

| What | How |
| --- | --- |
| Click/press | Model Governance tab. Scroll to drift panel. Then click the clearance pill in the title bar — cycle `PUBLIC → INTERNAL → RESTRICTED → CLASSIFIED`. Watch fields redact live. |
| Say | "Drift monitor — thirty days, calibration curve, feature distribution, PSI alert. Catches silent degradation before it hurts precision. And — *click* — classification is live. Every field on every page respects the operator's clearance. Watch the passport numbers disappear." |
| Expected | The redaction is visceral. This is the closing image. |
| If interrupted (the "what's real?" question) | "The UI is live. The data is seeded — fifty synthetic personas matched against realistic patterns. Integration with the real feed is a four-week activity once the classified authority is granted." |

### Beat 9 · Closing frame — 30s · Back to `/dashboard`

| What | How |
| --- | --- |
| Click/press | Sidebar → Dashboard. |
| Say | "What you've seen today is one operator shell. Sidebar, eight-tab engine, per-role dashboards, ten analyst pages, three admin pages. Six of those have built-in narrated walkthroughs — press `N` any time. Printable walkthrough script is leave-behind. Next step is the integration workshop." |
| Expected | Pause. Questions. |
| If interrupted | Good — questions are engagement. Go to section 4 for the tight answers. |

---

## 3 · Twenty-five-minute technical demo

Deeper. Plan for 5 minutes of Q&A slack inside the budget.

### T+0 · Positioning (2 min)

Repeat section 1. Add: "SITA Borders MEA owns the platform. National Police HQ owns the decisioning. We are integrators, not intelligence producers."

### T+2 · Tech Spec architecture (3 min) · `/dashboard/osint-risk-engine` → Configuration tab

- Walk the YAML reload pattern. Show the weight profile switcher. Mention the ETA vs API/PNR profile split.
- Say: "Operational knobs live in YAML. Model weights, source thresholds, rule enablement. No redeploys. Every change is audited."
- Flag the `data-narrate-id` attributes in the DOM for anyone leaning over the shoulder — show Cmd/Ctrl+Shift+N dumping the script.

### T+5 · OSINT Risk Engine — all 8 tabs (6 min)

| Tab | Key callout |
| --- | --- |
| Overview | KPIs are aggregations, not fixtures. |
| Queue | Scenario loader top-right — load the five pre-built cases in sequence. |
| Explainability | Show SHAP-style attributions, coverage strip, confidence gauge, rule trace. |
| Sequence Coherence | The 62h gap anomaly. Mention Model 3. |
| OSINT Sources | Source health matrix. Classification awareness (CLASSIFIED sources don't render for PUBLIC operators). |
| Configuration | Weight profiles + YAML reload. |
| Model Governance | Drift, calibration, fairness bars. Open the per-nationality flagged-rate panel. |
| Rasad | One sentence. Phase 2. Skip and move on. |

### T+11 · Person 360° (3 min) · `/dashboard/person-360`

- Click a subject from the Queue (passport-linked navigation).
- Walk the dossier tabs: Identity → Movements → Relationships → Cases → Audit.
- Say: "Entity graph feeds a personalised PageRank. Sponsor, employer, address. Graph features drive one of the nine sub-scores."

### T+14 · Case Management (3 min) · `/dashboard/case-management`

- Kanban view. Drag a card from Open → Investigating.
- Close a case — trigger the disposition gate. Pick `False Positive` on purpose.
- Say: "Closing requires a disposition. Confirmed Threat, False Positive, Insufficient Evidence, Transferred. That disposition feeds the model — false-positive labels are how we tune threshold."

### T+17 · Entity Resolution queue (2 min) · `/dashboard/entity-resolution`

- Show the side-by-side pair view.
- Resolve one pair. Show the audit trail.
- Say: "Human-in-the-loop for the fuzzy matches. `rapidfuzz` and `metaphone` do the first pass. Operators confirm or reject. That labelled data is the training set for the next model version."

### T+19 · Audit Log + Reports (3 min) · `/dashboard/audit-log` → `/dashboard/reports`

- Audit Log: filter by event type. Show an immutable WORM-signed event.
- Reports: Generate the Compliance Summary. Preview the PDF. Show the scheduled tab. Open the custom template builder.

### T+22 · Questions buffer (3 min)

See section 4. Pick the two most likely questions for the audience in the room.

---

## 4 · Talking points per feature

### Scoring determinism

| Q | A |
| --- | --- |
| "How do we know the score won't drift for the same input?" | "Feature snapshot is captured with every score. Replay produces the same score within 0.01. Deterministic hash on the input — if the hash matches, the score matches. It's in the Explainability payload." |
| "What about non-deterministic model layers?" | "ML inference runs with fixed seeds and deterministic execution mode. Stochastic layers are flagged in the model card and excluded from the core score fusion." |
| "Can we replay a historic decision?" | "Yes. Feature snapshot + model version ID reproduces the exact score. That's the audit primitive." |

### Classification handling

| Q | A |
| --- | --- |
| "How does classification flow through the UI?" | "Every field has a classification tag. The operator's clearance is read once per session from the IdP claim. Fields above clearance redact live — try the pill in the title bar." |
| "What about exports?" | "Exports carry the operator's clearance at export time. A PUBLIC operator cannot export a RESTRICTED field. Enforced at the API layer, not the UI." |
| "Audit of classified access?" | "Every classified-field access is a separate audit event. Actor, target, field, timestamp, signed. WORM storage." |

### Rasad readiness

| Q | A |
| --- | --- |
| "What is Rasad?" | "Phase 2 investigative workbench. Network-level view for organised-crime and state-threat analysis. Stub is visible as the eighth tab today; the feature set is a separate briefing after this one closes." |
| "When does Rasad go live?" | "Phase 2 starts after Phase 1 is in UAT. Timeline depends on the classified authority being granted for the relevant data streams." |

### ML model governance

| Q | A |
| --- | --- |
| "Who owns the model?" | "Al-Ameen ships the model. National Police HQ owns the acceptance criteria. Model Governance tab shows the sign-off chain — who trained, who validated, who approved, who deployed." |
| "How do you catch drift?" | "Thirty-day rolling drift monitor. PSI on feature distributions. Calibration curve. Alert fires at threshold — goes to the governance channel in Notifications." |
| "Model rollback?" | "Every model version is signed and retained. Previous version is one click from the Configuration tab. Feature snapshots survive the rollback — historic decisions stay replayable." |

### False positives

| Q | A |
| --- | --- |
| "What's your false-positive rate?" | "Depends on threshold. At operator's chosen threshold — currently 0.72 — simulated FPR is around 3.8%. Tuneable. Every disposition tagged `False Positive` flows back to the training pipeline." |
| "How is that measured against real arrivals?" | "That's the integration workshop. Today — simulated. With real feed — first quarter of Phase 1." |

### Bias + fairness

| Q | A |
| --- | --- |
| "How do you know the model isn't biased?" | "Model Governance tab → fairness bars. Flagged-rate by nationality, by age band, by gender. Compared to base rate. Disparities above threshold open a governance ticket." |
| "What if the base rate itself is biased?" | "That's why we separate flagged-rate from confirmed-threat-rate. The second one is what matters. Both are in the tab. Full methodology is in the model card." |

### Data residency

| Q | A |
| --- | --- |
| "Where does the data live?" | "On-premise, National Police HQ data centre. No cloud. No third-party analytics. SITA hardware, NPH operational control." |
| "What about the model?" | "Same. Trained on-premise, inferred on-premise. Weights never leave the facility." |

### Commercial model

| Q | A |
| --- | --- |
| "How is this priced?" | "Platform licence + support. Not per-transaction, not per-user. Priced to survive budget cycles, not optimised for usage growth." |
| "Vendor lock-in?" | "Open schemas. Exports are signed, portable, and audited. Model weights are yours. The integration layer is generic — another vendor could take over within one quarter." |

---

## 5 · Demo failure modes

### Internet dies mid-demo

Say: "We're on the local fallback — let me switch." Switch browser tab to `http://localhost:5173`. If local isn't running, say: "The Vercel deploy will be back — let me continue on screenshots." Open the deploy's last-good-state screenshots folder. Don't pretend the internet is fine.

### Palette toggle fails

Say nothing about the failure. The v1.0 palette is the default and is production-safe. Move on. If pressed: "Palette switching is a presenter-only affordance. Operators don't see that toggle."

### Narration overlay glitches

Press `Esc` twice. If the overlay sticks, reload the page. Say: "Demo walkthrough is a presenter aid — the product doesn't ship with narration overlays."

### Presenter mode locks up

Press `E` to toggle off. If stuck, reload. Say: "Presenter mode is a UI-only zoom — no state. Reload is safe."

### "Is this real data?" / "Can I see a real arrival?"

Say: "This is seeded. Fifty synthetic personas, realistic patterns, zero real passenger data. Integration with the NPH feed is a four-week activity once classified authority is granted. I can show you the integration architecture in the follow-up workshop."

### Someone asks for a screenshot

Say: "The leave-behind has everything. I'll send you the deploy URL, the walkthrough script, and a PDF. Live screenshotting risks capturing session state — we avoid it on principle."

### Unfamiliar Arabic audience member probes the copy

Say: "Arabic is peer, not translation. Every string was written by a bilingual specialist, not machine-translated. If you see something that reads stiff, flag it — we iterate."

---

## 6 · Keyboard cheat sheet

| Binding | Scope | Effect |
| --- | --- | --- |
| `E` | Global | Toggle Presenter mode (hide debug, enlarge type) |
| `N` | Any narrated page | Start scripted walkthrough with highlight overlay |
| `Esc` | Any overlay | Exit overlay, dismiss modal |
| `Cmd/Ctrl+Shift+P` | Global | Cycle brand palette v1.0 ↔ v1.1 |
| `Cmd/Ctrl+Shift+N` | Global | Dump current narration script to console |
| `?narrate=<step-id>` | URL param | Deep-link into a specific narration step |
| Click clearance pill | Title bar | Cycle PUBLIC → INTERNAL → RESTRICTED → CLASSIFIED |
| Click role pill | Dashboard top-right | Switch Data Analyst / Supervisor / Manager |
| Click scenario loader | OSINT Risk Engine → Queue | Load one of five pre-built cases |

---

## 7 · Leave-behind

Send within 24 hours of the meeting.

| Artifact | Where |
| --- | --- |
| Live deploy URL | `https://ameen-oman.vercel.app` (confirm with account team) |
| PDF of this walkthrough | Export this file via `pandoc DEMO_WALKTHROUGH.md -o walkthrough.pdf` or Chrome print-to-PDF |
| Tech Spec v1.0 | Separate secure channel — do not attach to email |
| Integration workshop invite | 2-hour session, on-site at NHQ, dates via account team |
| Contact | SITA Borders MEA — alaafada@gmail.com · Al-Ameen Product Lead |

Email body template:

> Thank you for the time today. Attached is the demo walkthrough with the full script — every tab, every question, every fallback — for your team's reference.
>
> The live deployment is at [URL]. Press `N` on any page for the built-in narrated walkthrough; six key pages have this, covering twenty-seven steps.
>
> Next step from our side is the integration workshop — two hours, on-site at NHQ, focused on the four-week plan to connect the real feed. Proposed dates follow separately.

---

## Appendix A · Feature-to-spec map

Mapping each live feature to the Tech Spec sections it satisfies. Cite the section number when audiences ask "where in the spec does this come from?"

| Feature | Tech Spec section(s) |
| --- | --- |
| Hero + bilingual brand principle | §1 Positioning · §2.4 Bilingual UI |
| Intelligence Layers (16 streams) | §3 Stream catalogue · §3.1 Core / §3.2 Extended |
| Data Flow Architecture | §4 Pipeline · §4.1 Ingest · §4.2 Normalise · §4.3 Score · §4.4 Deliver |
| Login + SSO + OTP fallback | §5 Auth · §5.2 IdP integration · §5.3 Fallback auth |
| Role-based dashboards | §6 Operator shell · §6.1 RBAC |
| OSINT Risk Engine — Overview | §7 Scoring engine · §7.1 KPIs |
| OSINT Risk Engine — Queue | §7.2 Operator queue · §14 Case lifecycle |
| Explainability | §8 Explainability · §8.1 SHAP attributions · §8.2 Coverage strip |
| Sequence Coherence | §7.5 Model 3 · §12 Temporal anomaly detection |
| OSINT Sources + health | §3 Stream catalogue · §9 Source health · §11 Classification |
| Configuration + YAML reload | §10 Operational knobs · §10.2 Weight profiles |
| Model Governance — drift / calibration | §13 Model governance · §13.2 Drift · §13.3 Calibration |
| Model Governance — fairness bars | §13.4 Fairness testing |
| Rasad tab (stub) | §18 Phase 2 · §18.1 Investigative workbench |
| Risk Assessment — Phase 1 | §7.3 Historic binary scoring |
| Risk Assessment — Phase 2 | §7.4 Weighted fusion · §7.6 9-sub-score model |
| Watchlist + targets | §15 Watchlist · §15.2 Fuzzy match threshold |
| Notifications — routing rules | §16 Alerting · §16.1 Severity routing |
| Notifications — channels | §16.2 Channel config · §16.3 Health + test |
| Reports — templates | §17 Reporting · §17.1 Pre-built · §17.2 Custom builder |
| Reports — scheduled | §17.3 Cadence · §17.4 Automated delivery |
| Person 360° | §14.3 Subject dossier · §14.4 Cross-stream timeline |
| Case Management | §14 Case lifecycle · §14.5 Disposition gates |
| Entity Resolution | §4.2.1 Entity matching · §8.4 Human-in-the-loop |
| Audit Log | §19 Audit · §19.1 WORM storage · §19.2 Signed events |
| Classification pill + redaction | §11 Classification · §11.2 Clearance-aware UI |

---

## Appendix B · Narration script coverage

Built-in `N`-key walkthroughs. Twelve pages, fifty steps total. Array lives in `src/mocks/osintData.ts` → `DEMO_NARRATIONS`.

| Route | Steps | What it covers |
| --- | --- | --- |
| `/` | 4 | Hero eyebrow · bilingual tagline · Intelligence Layers · Data Flow |
| `/login` | 3 | Ceremonial pane · SSO primary · session-recording legal note |
| `/dashboard` | 4 | KPI strip · single sidebar · event feed · OSINT engine shortcut |
| `/dashboard/osint-risk-engine` | 7 | Overview → Queue → Explainability → Sequence → Sources → Governance → Config |
| `/dashboard/person-360` | 5 | Subject header → identity cards → movements → relationships → cases |
| `/dashboard/case-management` | 5 | Kanban → case card → disposition → notes → stats |
| `/dashboard/audit-log` | 3 | Filters → immutable event → compliance export |
| `/dashboard/entity-resolution` | 3 | Queue → side-by-side → resolve actions |
| `/dashboard/watchlist` | 4 | Header KPIs → target list → import/export → deterministic role |
| `/dashboard/notifications` | 4 | Inbox → routing rules → rule editor → channel config |
| `/dashboard/reports` | 4 | Template grid → generate now → custom tile → scheduled link |
| `/dashboard/risk-assessment` | 3 | Phase 1 binary → Phase 2 weighted → score config |

**Unattended presenter mode:** queue narration via `?narrate=<step-id>`. Example: `https://ameen-oman.vercel.app/dashboard/osint-risk-engine?narrate=osint-sequence-gap` lands directly on the Sequence Coherence anomaly with the highlight already active. Useful for demo stations that loop without a human at the keyboard.
