# Al-Ameen — Demo Walkthrough Script
Version 1.7 · ROP Operator Audience · 30-minute Technical

---

## 0 · Before You Start

### Machine setup

| Item | What to do |
|------|-----------|
| Browser | Chrome or Edge, latest. One window, one tab. Full screen (F11). |
| Display | External monitor if projecting. Native 1080p minimum; 1440p preferred. |
| Audio | Muted. |
| Network | Use the live Vercel deployment — no local server needed. |
| Dev tools | Closed. |

### URLs

| Target | URL |
|--------|-----|
| **Primary (live)** | `https://alameen.tech` |
| Local fallback | `http://localhost:3002` after `npm run dev` in `~/Claude Workspace/Code/ameen-oman` |

### Login credentials (demo)

Log in as **Supervisor** — this role sees the full operator workflow without admin-only clutter.

| Field | Value |
|-------|-------|
| Officer ID | `OFC-2024-0042` |
| Password | any (demo bypass) |

### Keyboard bindings

| Key | Effect |
|-----|--------|
| `N` | Start narration walkthrough on the current page |
| `E` | Toggle Presenter mode (larger fonts) |
| `Esc` | Exit any overlay or modal |

### Demo scenario preload

Before the audience walks in:
1. Open `https://alameen.tech` and log in.
2. Navigate to `/dashboard/border-dashboard` — leave it on the Operations tab.
3. The audience's first view should be a live operational picture, not a login screen.

---

## 1 · Positioning (2 minutes, no click)

Three lines before you touch the keyboard.

> "Al-Ameen is the national risk and targeting platform for Royal Oman Police border operations. Every traveller entering Oman — air, sea, land — is scored and checked in under 100 milliseconds before the officer makes a decision.
>
> What you're going to see today is the operator portal: the screen your officers work from. Not a prototype — this is the actual interface. We'll walk the full daily workflow in 25 minutes.
>
> Starting where an operator starts their shift — the Border Dashboard."

---

## 2 · Thirty-Minute Technical Demo

Budget 60 seconds of slack per beat. Tight answers are in Section 3.

---

### Beat 1 · Border Dashboard — Operational Picture (3 min)
**Route:** `/dashboard/border-dashboard`

| What | How |
|------|-----|
| Already open | Operations tab is the default. |
| Say | "This is what greets the supervisor at shift start. Eight active checkpoints — Muscat Airport T1/T2, Seeb Cargo, three land crossings, two seaports. Green means processing normally. Amber means the queue is building. Red means a hit is waiting for action." |
| Click | The Alert Feed tab. |
| Say | "Every alert that fired in the last 60 minutes — real-time. Source, confidence, checkpoint, status. The Acknowledge button closes the alert from any officer's screen instantly." |
| Click | Acknowledge on the top alert. |
| Say | "Done. Every officer at that checkpoint sees the same update with no page reload. The Stats tab gives the supervisor shift-level throughput." |
| If interrupted | "Checkpoint data feeds from the SITA I:Sight integration. This surface is real-time, not batch." |

---

### Beat 2 · Services Dashboard — Flight Manifest (3 min)
**Route:** `/dashboard/services-dashboard`

| What | How |
|------|-----|
| Navigate | Sidebar → Services Dashboard. |
| Say | "Flight-level view. 47 active services today, 8,234 passengers processed, 23 flagged as high-risk, 11 open hits. Click any row." |
| Click | The first row in the table. |
| Say | "Service detail panel — full manifest, boarding status per passenger. Boarded, no-show, go-show icons. High-risk passengers are red. Hit badge shows how many active watchlist hits are on this flight." |
| Say | "A supervisor can see the entire risk picture for an inbound flight before it lands." |
| If interrupted | "Go-Show means the passenger arrived without a prior reservation — that's a specific risk indicator. No-Show means they checked in but didn't board." |

---

### Beat 3 · Ad Hoc Search — Finding a Traveller (4 min)
**Route:** `/dashboard/search`

| What | How |
|------|-----|
| Navigate | Sidebar → Search. Land on Ad Hoc tab. |
| Say | "Any officer can search across four domains: Events, Hits, Identities, Services. Start with a name." |
| Type | `Ahmed Ibrahim` in the search bar. |
| Say | "Phonetic matching is on by default. This returns exact matches, phonetic matches like Ahmad or Ibraheem, and transliterated Arabic equivalents — all in one result set. The EXACT / PHONETIC / FUZZY badge on each row tells you why it matched." |
| Click | Table View toggle → Card View toggle. |
| Say | "Officers who prefer a card layout get this. Same data, different density. Column manager on table view lets each officer show the fields they care about." |
| Click | Hit Search tab. |
| Say | "Hit Search is how a supervisor reviews open alerts. Filter by status — New, Acknowledged, Under Review. By watchlist. By risk level. By nationality. Results link directly to the full traveller dossier." |
| If interrupted | "The Advanced Query Builder on the first tab lets officers build multi-condition queries — attribute, comparator, AND/OR logic — and save them as named queries for reuse." |

---

### Beat 4 · Watchlist — Netherlands Sanctions + Interpol Red Notices (4 min)
**Route:** `/dashboard/watchlist`

| What | How |
|------|-----|
| Navigate | Sidebar → Watchlist. Land on Dashboard tab. |
| Say | "Seven active watchlists. The two newest were added this week — Netherlands Sanctions List and Interpol Red Notices. Both are seeded from the most recent published data." |
| Point to | The `wl-007 Netherlands Sanctions` card (orange border). |
| Say | "485 designated individuals — EU and UN designations: ISIL facilitators, Russia sanctions under EU Regulation 269/2014, DPRK proliferation, Iran. Orange = Sanctions type. Interpol Red Notices in red — 6,842 records, 5 new this cycle." |
| Click | Import/Export tab → Import tab. |
| Say | "This is how new data gets in. Drag a CSV or XML from your sanctions authority, or pull direct from a connected source. The Netherlands Sanctions List and Interpol are both configured as connected sources — they sync automatically at 06:00 and 08:00 daily. Last sync: today." |
| Drag a test file (or click browse) | Drag any CSV onto the drop zone. |
| Say | "The system validates the file, maps fields, shows you exactly how many records will be added, updated, or errored before anything commits." |
| Click | Manage Watchlists tab → click `wl-007`. |
| Say | "10 targets in this watchlist from today's sync. Nationality breakdown, alias list, designation reference, source authority. Click any target for full detail including associated aliases and risk indicators." |
| If interrupted | "Adding a target manually — the New Target button — goes through a draft/review/active lifecycle. Nothing goes live without a supervisor approval step." |

---

### Beat 5 · Target Match — Handling a Watchlist Hit (3 min)
**Route:** `/dashboard/target-match`

| What | How |
|------|-----|
| Navigate | Sidebar → Target Match. |
| Say | "This is the dedicated hit-resolution workflow. The queue shows every traveller who triggered a watchlist match on inbound flights in the last 24 hours, ranked by confidence score." |
| Click | Top candidate in the queue. |
| Say | "Side-by-side comparison — the watchlist target on the left, the live traveller record on the right. Four match factors with confidence bars: name token ratio, document number similarity, nationality, date of birth proximity. The overall confidence score is at the top." |
| Say | "Officer has four options: Defer to the next shift, mark as False Positive, Escalate to supervisor, or Confirm the match. Each action is logged with actor and timestamp." |
| Click | The Escalate button. |
| Say | "Escalated. The case now appears in the supervisor's queue with full history attached. The original officer's decision is preserved — audit trail is immutable." |
| If interrupted | "Near-matches — say 82% confidence — are held here for human review. 100% exact matches on document number are flagged as automatic alerts to the checkpoint." |

---

### Beat 6 · OSINT Risk Engine — Explainability (3 min)
**Route:** `/dashboard/osint-risk-engine`

| What | How |
|------|-----|
| Navigate | Sidebar → OSINT Risk Engine → Queue tab. |
| Say | "The Queue is every traveller with an active risk flag waiting for analyst review. Click the top row." |
| Click | Top high-risk row. |
| Say | "Every score has an explanation. Top contributing factors — which signals pushed the score up. Bottom factors — what reduced it. Coverage strip shows which of the 17 intelligence sources actually had data on this person. Confidence gauge shows model certainty." |
| Scroll to | Rule trace section. |
| Say | "Every rule that fired is listed with its threshold and the actual value that triggered it. An officer can read exactly why this traveller scored high. No black box — every decision has a paper trail a supervisor can defend." |
| If interrupted | "Sequence Coherence tab — press that — catches time-gap anomalies rules miss. A 62-hour gap between an APIS arrival record and the first hotel check-in is invisible to a rule engine but the model flags it. That's the ML contribution." |

---

### Beat 7 · Case Management — Closing a Hit (2 min)
**Route:** `/dashboard/case-management`

| What | How |
|------|-----|
| Navigate | Sidebar → Case Management. |
| Say | "Every escalated hit becomes a case. Kanban: Open → Investigating → Pending Review → Closed. Drag a card across." |
| Drag | One card from Open to Investigating. |
| Say | "Status updates in real time on every officer's screen. Now close it." |
| Click | Resolve button on any card. |
| Say | "Closing requires a disposition — Confirmed Threat, False Positive, Insufficient Evidence, Transferred. This isn't optional. The disposition is what feeds the model's next calibration cycle. False positive labels are how threshold tuning works." |
| If interrupted | "Officers can add a note at close. Pre-defined reasons are in the dropdown — 'Referred for secondary screening', 'Identity confirmed, no risk', 'Transferred to case' — plus a free text field for anything specific." |

---

### Beat 8 · Travel Pattern Intelligence — Five Years in Five Minutes (5 min)
**Route:** `/dashboard/travel-pattern-intelligence`

| What | How |
|------|-----|
| Navigate | Sidebar → Travel Pattern Intel. Land on Overview tab. |
| Say | "This is the predictive layer. Instead of waiting for a traveller to trigger a rule, it mines five years of transit history — 14 million records — looking for relationships and patterns that no single officer could spot. Five detection engines, all running in parallel." |
| Point to | The five engine cards on the Overview tab. |
| Say | "Each engine is grounded in INTERPOL, UNODC, and ICAO methodology — not invented in-house. The intelligence is standard; what we've built is the system that applies it automatically to Oman's actual transit data." |
| Click | Co-Traveler Networks tab. |
| Say | "This is what the system is designed to catch. Two people — Alaa Hassan and Ahmad Khalil — both Bangladeshi, always on the same EK-549 flight into Muscat, always transiting to Dubai, every ten weeks for five years. Twenty-seven times. Separate bookings, no shared contact. A rule engine never flags either of them individually. The network engine flags the pair after the third occurrence." |
| Click | CT-001 in the left list. |
| Say | "27 co-occurrences. 3 to 5 hours of overlap in Terminal 1 Gate G each time. The system recommends secondary screening for the next transit. The case is already escalated — it's sitting in Case Management waiting for a supervisor action." |
| Click | Trafficking Indicators tab. |
| Say | "Here's the human trafficking engine. It scores against UNODC 2025 key indicators — same criteria your counter-trafficking unit uses, but automated. This is Fatima Muse Omar, 22, Ethiopian. New passport 2 months old. One-way ticket to Bangkok. Onward segment booked 2 hours and 41 minutes after she landed in Muscat — that's the 'ticket-in-stages' pattern UNODC documents for trafficking networks. The same phone number is in her facilitator's booking. Score: 92 out of 100." |
| Click | TC-001 in the left list. |
| Say | "Eight indicators checked. Six confirmed. The system also matched her facilitator — Yusuf, traveling 12 hours ahead on the same route. This is the eighth time they've transited together. The case is escalated directly to the Counter-Trafficking Unit and logged in Case Management with all the evidence attached." |
| Click | Document Anomaly tab. |
| Say | "Last one — document integrity. A passenger enters transit on an Omani passport. 35 minutes later a different passport — Lebanese — is scanned at the departure gate on the same flight. Biometric comparison says the two faces are 91 percent similar. That's a passport swap inside Muscat airside. The system halted boarding on that flight before we even had an officer at the gate." |
| If interrupted | "The Co-Traveler engine uses the same statistical methodology published by the MIT Media Lab — likelihood ratio scoring, not just co-occurrence counting. A shared flight on a rare route carries 40 times the evidential weight of a shared flight on a high-frequency route." |

---

### Beat 9 · Questions buffer (3 min)

See Section 3 for tight answers. Most-likely questions from ROP operators:

1. "What happens if the system flags the wrong person?" → False Positive workflow, immutable audit
2. "Can we search in Arabic?" → Yes, full RTL, press the language toggle top-right
3. "Who can add to a watchlist?" → Role-based — Supervisor and above; all changes are logged
4. "How current is the data?" → Interpol syncs every 6h; NL Sanctions daily; APIS is real-time
5. "How far back does the pattern data go?" → 5-year lookback on transit data; co-traveler engine flags from the 3rd occurrence

---

## 3 · Operator Talking Points

### Hit workflow

| Q | A |
|---|---|
| "What do I do when I get a hit?" | "Target Match queue. Compare the profile, decide: False Positive, Escalate, or Confirm. Each choice has a dropdown reason + notes field. Takes under 90 seconds." |
| "Can I see what the last officer did on this person?" | "Yes — Audit tab on any traveller record. Every access, every status change, actor and timestamp, immutable." |
| "What if two officers are looking at the same hit?" | "The first officer to action it locks it for 5 minutes — the other sees a 'Being reviewed by OFC-0042' banner. No double-actioning." |

### Watchlist management

| Q | A |
|---|---|
| "How do I add a new name to a watchlist?" | "Watchlist → Manage Watchlists → open the list → New Target button. Fields: name, aliases, nationality, document numbers, designation reference. Goes to draft → supervisor approves → active." |
| "How long until a new target is live?" | "After supervisor approval, it's active immediately on all checkpoints. No overnight batch." |
| "Can I import a whole list at once?" | "Yes — Import/Export tab → Import. CSV or XML. The system shows you a preview (added/updated/errors) before committing." |

### Search

| Q | A |
|---|---|
| "The name is spelled differently in the passport" | "Phonetic mode is on by default. It matches across transliterations and common spelling variations. The PHONETIC badge on the result confirms it." |
| "I need to search multiple conditions at once" | "Advanced Query Builder tab — add conditions, choose AND/OR logic, save it as a named query so you don't rebuild it every time." |

### System access

| Q | A |
|---|---|
| "Can I use this on a tablet or mobile?" | "Yes — responsive layout works on tablet. Full Arabic RTL support — press the language toggle in the top-right corner." |
| "What if I forget my password?" | "Forgot Password on the login page — sends a recovery link to your registered email. First-time login goes through Set Password which forces a strong password." |
| "Who can see my actions?" | "Your Supervisor and Admin roles can view your audit log. You can also review your own activity in your User Profile." |

---

## 4 · Closing Frame

After questions:

> "What you've seen is the complete operator workflow — from shift start on the Border Dashboard through search, watchlist matching, target resolution, case closure, and predictive pattern intelligence. Every action is logged. Every score is explainable. Full Arabic support throughout.
>
> The Travel Pattern Intelligence engine is what separates this from a rule-based system. It finds the threats no single officer and no single rule could catch — because they only become visible across five years of history and thousands of unconnected records.
>
> The portal is live at `alameen.tech` today. Next step is the integration workshop — wiring the live APIS and PNR feeds."

---

## 5 · Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-17 | 1.0 | Initial — OSINT Risk Engine focus, executive audience |
| 2026-10-05 | 1.6 | Full rewrite for ROP operator audience. 25-min technical format. Covers all Phase 1–5 modules: Border Dashboard, Services Dashboard, Search, Watchlist (NL Sanctions + Interpol Red Notices), Target Match, OSINT explainability, Case Management. URL updated to alameen.tech. |
| 2026-10-09 | 1.7 | Added Beat 8 — Travel Pattern Intelligence (5 min). Extended to 30-min format (9 beats). Covers 5 TPI engines: Co-Traveler Networks (Alaa+Ahmad 27×), Route Signatures (KRT→MCT→BKK cluster), Transit Overlap, Trafficking Indicators (UNODC 2025, TC-001), Document Anomaly (passport swap DA-001). Updated closing frame. Added Q5 to questions buffer. |
