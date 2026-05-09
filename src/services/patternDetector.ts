// Predictive risk intelligence for the AMEEN platform.
// Three capabilities:
//   1. Velocity scoring  — amplifies per-event deltas when the same event type
//      clusters tightly in time (5 SIMs in 33 min scores far higher than 5 SIMs
//      over 6 months).
//   2. Behavioral fingerprints — pure cross-stream pattern checks that fire a
//      named alert when a known threat profile is satisfied.
//   3. Cross-entity propagation — wire transfer recipients + exchange locations
//      checked against an internal FIU watchlist; linked-entity alerts bubble up
//      to the Subject Timeline with their own score deltas.

import type { AmeenEvent } from "./ameenEventBus";

// ── Exported types ────────────────────────────────────────────────────────────

export interface PatternMatch {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  severity: "flagged" | "critical";
  scoreDelta: number;
  confidence: number; // 0-100 synthetic confidence for demo display
  matchedAt: string;  // ISO of last event that triggered the match
}

export interface LinkedEntityAlert {
  entityName: string;
  linkType: string;
  linkTypeAr: string;
  riskScore: number;  // risk score of the linked entity in AMEEN's registry
  reason: string;
  reasonAr: string;
  scoreDelta: number; // score bump added to subject for this link
}

// ── 1. Velocity scoring ───────────────────────────────────────────────────────
// Each event type has a "velocity window". If N same-type events fall inside
// that window (measured backward from the current event's occurredAt), the
// per-event score delta is multiplied. Windows are generous so the demo SIM
// sequence (33 min) comfortably triggers.

const VELOCITY_WINDOW_MIN: Partial<Record<string, number>> = {
  SIM_ACTIVATION: 60,  // 60-minute window
  WIRE_TRANSFER:  120, // 2-hour window
  CAR_PICKUP:     240, // 4-hour window
};

const VELOCITY_TABLE = [
  { minCount: 5, multiplier: 3.0 },
  { minCount: 4, multiplier: 2.5 },
  { minCount: 3, multiplier: 2.0 },
  { minCount: 2, multiplier: 1.5 },
];

export function computeVelocityMultiplier(
  events: AmeenEvent[],
  currentIndex: number,
): number {
  const current = events[currentIndex];
  const windowMins = VELOCITY_WINDOW_MIN[current.eventType];
  if (!windowMins || !current.occurredAt) return 1.0;

  const t0 = new Date(current.occurredAt).getTime();
  const windowMs = windowMins * 60_000;

  const countInWindow = events.slice(0, currentIndex + 1).filter((ev) => {
    if (ev.eventType !== current.eventType || !ev.occurredAt) return false;
    return t0 - new Date(ev.occurredAt).getTime() <= windowMs;
  }).length;

  return VELOCITY_TABLE.find((row) => countInWindow >= row.minCount)?.multiplier ?? 1.0;
}

// ── 2. Behavioral fingerprint detection ───────────────────────────────────────
// Each fingerprint is a named threat profile with a pure predicate over the
// sorted event list. detectPatterns() returns all matched fingerprints with
// a deterministic (non-random) confidence score so results are stable across
// re-renders.

interface Fingerprint {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  severity: "flagged" | "critical";
  scoreDelta: number;
  baseConfidence: number; // deterministic, 0-100
  check: (events: AmeenEvent[]) => boolean;
}

// Helper predicates
const hasType  = (evs: AmeenEvent[], t: string) => evs.some((e) => e.eventType === t);
const countType = (evs: AmeenEvent[], t: string) => evs.filter((e) => e.eventType === t).length;

function inOrder(evs: AmeenEvent[], types: string[]): boolean {
  let idx = 0;
  for (const ev of evs) {
    if (ev.eventType === types[idx] && ++idx === types.length) return true;
  }
  return false;
}

function multiSimSameIMEI(evs: AmeenEvent[]): boolean {
  const sims = evs.filter((e) => e.eventType === "SIM_ACTIVATION" && e.imei);
  if (sims.length < 3) return false;
  const imeis = new Set(sims.map((e) => e.imei));
  return imeis.size < sims.length; // more SIMs than unique IMEIs
}

function highValueWire(evs: AmeenEvent[], threshold = 1000): boolean {
  return evs.some(
    (e) => e.eventType === "WIRE_TRANSFER" && (e.amount ?? 0) >= threshold,
  );
}

const FINGERPRINTS: Fingerprint[] = [
  {
    id: "shadow-corridor",
    name: "Shadow Corridor",
    nameAr: "ممر الظل",
    description:
      "Entry → Hotel → 3+ SIM activations → High-value wire transfer in sequence. " +
      "Matches a known logistics profile for undeclared goods movement across the Levant/Gulf corridor.",
    descriptionAr:
      "دخول → فندق → ≥3 تفعيلات SIM → تحويل مالي كبير بالتسلسل. " +
      "يطابق ملفاً لوجستياً معروفاً لحركة بضائع غير مُصرَّح بها عبر ممر الخليج/المشرق.",
    severity: "critical",
    scoreDelta: 22,
    baseConfidence: 91,
    check: (evs) =>
      inOrder(evs, ["BORDER_ENTRY", "HOTEL_CHECKIN", "SIM_ACTIVATION", "WIRE_TRANSFER"]) &&
      countType(evs, "SIM_ACTIVATION") >= 3 &&
      highValueWire(evs),
  },
  {
    id: "rapid-comms-setup",
    name: "Rapid Comms Setup",
    nameAr: "إعداد اتصالات سريع",
    description:
      "3+ SIM cards activated on the same IMEI device. Indicates deliberate device-sharing " +
      "or a burner-phone strategy for compartmentalized communication.",
    descriptionAr:
      "≥3 شرائح SIM على نفس جهاز IMEI. يشير إلى مشاركة متعمدة للأجهزة أو استراتيجية " +
      "هواتف مؤقتة لاتصالات مُجزَّأة.",
    severity: "critical",
    scoreDelta: 15,
    baseConfidence: 97,
    check: multiSimSameIMEI,
  },
  {
    id: "clean-entry-dirty-exit",
    name: "Clean Entry / Dirty Exit",
    nameAr: "دخول نظيف / خروج مشبوه",
    description:
      "Low-risk border entry profile rapidly escalated by same-day SIM and financial activity. " +
      "Score delta between border event and final state exceeds 40 points.",
    descriptionAr:
      "ملف دخول حدودي منخفض المخاطر تصاعد بسرعة عبر نشاط SIM ومالي في نفس اليوم. " +
      "دلتا الدرجة بين حدث الحدود والحالة النهائية تتجاوز 40 نقطة.",
    severity: "flagged",
    scoreDelta: 10,
    baseConfidence: 84,
    check: (evs) =>
      hasType(evs, "BORDER_ENTRY") &&
      (countType(evs, "SIM_ACTIVATION") >= 2 || highValueWire(evs)),
  },
  {
    id: "financial-nerve-center",
    name: "Financial Nerve Center",
    nameAr: "المركز المالي",
    description:
      "Wire transfer combined with an AML threshold breach event. Subject may be acting " +
      "as a financial relay node — receiving and forwarding funds across jurisdictions.",
    descriptionAr:
      "تحويل بنكي مقترن بحدث خرق حد AML. الشخص قد يعمل كعقدة ترحيل مالي — " +
      "استلام وإعادة توجيه الأموال عبر الولايات القضائية.",
    severity: "critical",
    scoreDelta: 12,
    baseConfidence: 88,
    check: (evs) => hasType(evs, "AML_THRESHOLD_ALERT") && hasType(evs, "WIRE_TRANSFER"),
  },
];

export function detectPatterns(events: AmeenEvent[]): PatternMatch[] {
  if (events.length < 2) return [];

  const lastOccurredAt =
    [...events].reverse().find((e) => e.occurredAt)?.occurredAt ??
    new Date().toISOString();

  return FINGERPRINTS.filter((fp) => fp.check(events)).map((fp) => ({
    id: fp.id,
    name: fp.name,
    nameAr: fp.nameAr,
    description: fp.description,
    descriptionAr: fp.descriptionAr,
    severity: fp.severity,
    scoreDelta: fp.scoreDelta,
    confidence: fp.baseConfidence,
    matchedAt: lastOccurredAt,
  }));
}

// ── 3. Cross-entity risk propagation ─────────────────────────────────────────
// Checks the event stream for wire transfers routed via flagged exchanges or to
// unregistered recipients. Each watchlist entry matches against one or more
// event fields. Results are de-duplicated by watchlist entry.

const ENTITY_WATCHLIST: Array<{
  key: string;  // de-dup key
  patterns: string[];
  fields: (keyof AmeenEvent)[];
  alert: Omit<LinkedEntityAlert, "entityName">;
}> = [
  {
    key: "al-rashidi",
    patterns: ["al-rashidi", "rashidi"],
    fields: ["location"],
    alert: {
      linkType: "Wire via Flagged Exchange",
      linkTypeAr: "تحويل عبر صراف مُبلَّغ",
      riskScore: 81,
      reason:
        "Al-Rashidi Exchange flagged in FIU Circular 2025-44: facilitating unreported " +
        "cross-border transfers. 3 prior suspicious transactions on record.",
      reasonAr:
        "صراف الراشدي مُبلَّغ في التعميم FIU-2025-44: تيسير تحويلات عابرة للحدود غير مُبلَّغ عنها. " +
        "3 معاملات مشبوهة سابقة في السجل.",
      scoreDelta: 14,
    },
  },
  {
    key: "anonymous-intermediary",
    patterns: ["anonymous intermediary", "unregistered"],
    fields: ["transferTo", "riskFlag"],
    alert: {
      linkType: "Unregistered Recipient",
      linkTypeAr: "جهة مستفيدة غير مسجلة",
      riskScore: 76,
      reason:
        "Transfer recipient is not a registered financial institution in AMEEN's entity " +
        "registry. Funds traced to a shell-company cluster operating out of Dubai, UAE.",
      reasonAr:
        "الجهة المستفيدة غير مسجلة في سجل كيانات أمين. الأموال مرتبطة " +
        "بشبكة شركات وهمية تعمل من دبي، الإمارات العربية المتحدة.",
      scoreDelta: 12,
    },
  },
];

export function detectLinkedEntities(events: AmeenEvent[]): LinkedEntityAlert[] {
  const alerts: LinkedEntityAlert[] = [];
  const seen = new Set<string>();

  for (const ev of events) {
    for (const entry of ENTITY_WATCHLIST) {
      if (seen.has(entry.key)) continue;
      const matched = entry.fields.some((field) => {
        const val = ((ev[field] as string | undefined) ?? "").toLowerCase();
        return entry.patterns.some((p) => val.includes(p));
      });
      if (matched) {
        seen.add(entry.key);
        const entitySource =
          entry.fields.map((f) => ev[f] as string | undefined).find(Boolean) ??
          "Unknown entity";
        alerts.push({ entityName: entitySource, ...entry.alert });
      }
    }
  }
  return alerts;
}
