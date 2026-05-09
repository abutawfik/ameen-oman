// Shared reactive event store — bridges Deiyafa, Rasad, Portal, and all entity
// submissions into the main AMEEN dashboard feed. Persists via localStorage;
// cross-component reactivity via a custom DOM event within the SPA.

import { useState, useEffect } from "react";

export type EventSource   = "deiyafa" | "rasad" | "portal" | "rop_internal" | "mobile" | "financial" | "car_rental" | "system";
export type EventStatus   = "success" | "pending" | "failed";
export type EventSeverity = "clear" | "info" | "review" | "flagged" | "critical";
export type EventCategory =
  | "rop_internal"   // visa, AMR, entry/exit — ROP generated
  | "hotel"          // Deiyafa / PMS
  | "car_rental"
  | "mobile"         // SIM activations
  | "financial"      // wire, exchange
  | "border"
  | "alert"          // system-generated flags
  | "risk_assessment";

export interface AmeenEvent {
  id: string;
  timestamp: string;           // HH:MM:SS — when AMEEN received it
  occurredAt?: string;         // ISO string — actual event time in scenario
  source: EventSource;
  eventType: string;
  category?: EventCategory;

  // Subject correlation
  subjectId?: string;
  subjectName?: string;
  subjectNationality?: string;
  subjectDocNumber?: string;

  // Event-specific fields
  guestName?: string;
  docNumber?: string;
  nationality?: string;
  roomNumber?: string;
  hotelBranch?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  imei?: string;
  msisdn?: string;
  simCount?: number;           // for IMEI_MULTI_SIM_ALERT
  amount?: number;
  currency?: string;
  transferTo?: string;
  location?: string;

  // Risk
  severity?: EventSeverity;
  riskFlag?: string;
  riskFlagAr?: string;

  ameenRef: string;
  status: EventStatus;
  classificationLabel?: string;
  deltaScore?: number;
}

const STORAGE_KEY = "ameen_event_feed_v2";
const MAX_EVENTS  = 200;
const DOM_EVENT   = "ameen:event";

function load(): AmeenEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AmeenEvent[]) : [];
  } catch { return []; }
}

function persist(events: AmeenEvent[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS))); } catch { /* quota */ }
}

function nextRef(): string {
  return `AMN-EVT-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export function pushEvent(ev: Omit<AmeenEvent, "id" | "timestamp" | "ameenRef">): AmeenEvent {
  const full: AmeenEvent = {
    ...ev,
    id: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    ameenRef: nextRef(),
    status: ev.status ?? "success",
  };
  const updated = [full, ...load()].slice(0, MAX_EVENTS);
  persist(updated);
  window.dispatchEvent(new CustomEvent(DOM_EVENT, { detail: full }));
  return full;
}

export function getEvents(source?: EventSource): AmeenEvent[] {
  const all = load();
  return source ? all.filter((e) => e.source === source) : all;
}

export function getSubjectEvents(subjectId: string): AmeenEvent[] {
  return load().filter((e) => e.subjectId === subjectId);
}

export function clearEvents() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(DOM_EVENT, { detail: null }));
}

export function clearSubjectEvents(subjectId: string) {
  persist(load().filter((e) => e.subjectId !== subjectId));
  window.dispatchEvent(new CustomEvent(DOM_EVENT, { detail: null }));
}

// ── React hooks ──────────────────────────────────────────────────────────────

export function useAmeenFeed(source?: EventSource): AmeenEvent[] {
  const [events, setEvents] = useState<AmeenEvent[]>(() => getEvents(source));
  useEffect(() => {
    const handler = () => setEvents(getEvents(source));
    window.addEventListener(DOM_EVENT, handler);
    return () => window.removeEventListener(DOM_EVENT, handler);
  }, [source]);
  return events;
}

export function useSubjectFeed(subjectId: string): AmeenEvent[] {
  const [events, setEvents] = useState<AmeenEvent[]>(() => getSubjectEvents(subjectId));
  useEffect(() => {
    const handler = () => setEvents(getSubjectEvents(subjectId));
    window.addEventListener(DOM_EVENT, handler);
    return () => window.removeEventListener(DOM_EVENT, handler);
  }, [subjectId]);
  return events;
}

// ── Demo scenario: "Ali arrives in Oman" ────────────────────────────────────
// 13-event sequence covering the full travel-to-crime pattern:
// Visa → Entry (AMR) → Hotel → Car rental → 5 SIMs (same IMEI!) →
// OMR 5,000 wire → system alerts → risk assessment.

export const DEMO_SUBJECT = {
  subjectId:          "demo-ali-mansouri",
  subjectName:        "Ali Mohammed Al-Mansouri",
  subjectNationality: "JO",
  subjectDocNumber:   "JO-8823491",
};

const DEMO_IMEI = "352819110123456";

type ScenarioEvent = Omit<AmeenEvent, "id" | "timestamp" | "ameenRef">;

const SCENARIO_EVENTS: ScenarioEvent[] = [
  // 1. Visa issued (ROP internal)
  {
    ...DEMO_SUBJECT,
    source: "rop_internal", category: "rop_internal", severity: "info",
    eventType: "VISA_ISSUED",
    occurredAt: "2026-05-08T07:15:00Z",
    location: "Muscat — ROP Visa Centre",
    status: "success",
    riskFlag: undefined,
  },
  // 2. Border entry — Actual Movement Record (AMR)
  {
    ...DEMO_SUBJECT,
    source: "rop_internal", category: "border", severity: "info",
    eventType: "BORDER_ENTRY",
    occurredAt: "2026-05-08T10:22:00Z",
    location: "Muscat International Airport — Terminal 1",
    status: "success",
  },
  // 3. Hotel check-in (Deiyafa)
  {
    ...DEMO_SUBJECT,
    source: "deiyafa", category: "hotel", severity: "clear",
    eventType: "HOTEL_CHECKIN",
    occurredAt: "2026-05-08T11:45:00Z",
    hotelBranch: "Al Bustan Palace Hotel",
    roomNumber: "412",
    location: "Al Qurum, Muscat",
    status: "success",
  },
  // 4. Car rental — vehicle pickup
  {
    ...DEMO_SUBJECT,
    source: "car_rental", category: "car_rental", severity: "clear",
    eventType: "CAR_PICKUP",
    occurredAt: "2026-05-08T13:10:00Z",
    vehiclePlate: "م ٤٤ ٨٩١",
    vehicleModel: "Nissan Patrol 2025",
    location: "Oman Car Rental — Airport Branch",
    status: "success",
  },
  // 5–9. Five SIM activations on the SAME IMEI
  {
    ...DEMO_SUBJECT,
    source: "mobile", category: "mobile", severity: "review",
    eventType: "SIM_ACTIVATION",
    occurredAt: "2026-05-08T14:15:00Z",
    msisdn: "+968 9201 4411",
    imei: DEMO_IMEI,
    location: "Omantel — Muscat Airport Branch",
    status: "success",
  },
  {
    ...DEMO_SUBJECT,
    source: "mobile", category: "mobile", severity: "review",
    eventType: "SIM_ACTIVATION",
    occurredAt: "2026-05-08T14:22:00Z",
    msisdn: "+968 9201 4412",
    imei: DEMO_IMEI,
    location: "Omantel — Muscat Airport Branch",
    status: "success",
  },
  {
    ...DEMO_SUBJECT,
    source: "mobile", category: "mobile", severity: "flagged",
    eventType: "SIM_ACTIVATION",
    occurredAt: "2026-05-08T14:31:00Z",
    msisdn: "+968 9888 7723",
    imei: DEMO_IMEI,
    location: "Ooredoo — Mutrah Branch",
    status: "success",
  },
  {
    ...DEMO_SUBJECT,
    source: "mobile", category: "mobile", severity: "flagged",
    eventType: "SIM_ACTIVATION",
    occurredAt: "2026-05-08T14:39:00Z",
    msisdn: "+968 9201 4414",
    imei: DEMO_IMEI,
    location: "Omantel — CBD Branch",
    status: "success",
  },
  {
    ...DEMO_SUBJECT,
    source: "mobile", category: "mobile", severity: "flagged",
    eventType: "SIM_ACTIVATION",
    occurredAt: "2026-05-08T14:47:00Z",
    msisdn: "+968 9201 4415",
    imei: DEMO_IMEI,
    location: "Omantel — CBD Branch",
    status: "success",
  },
  // 10. System alert — IMEI multi-SIM flag
  {
    ...DEMO_SUBJECT,
    source: "system", category: "alert", severity: "critical",
    eventType: "IMEI_MULTI_SIM_ALERT",
    occurredAt: "2026-05-08T14:48:00Z",
    imei: DEMO_IMEI,
    simCount: 5,
    riskFlag: "5 SIM cards activated on identical IMEI within 33 minutes across 3 branches",
    riskFlagAr: "5 شرائح SIM مُفعَّلة على نفس IMEI خلال 33 دقيقة في 3 فروع",
    status: "success",
  },
  // 11. Wire transfer — OMR 5,000
  {
    ...DEMO_SUBJECT,
    source: "financial", category: "financial", severity: "flagged",
    eventType: "WIRE_TRANSFER",
    occurredAt: "2026-05-08T15:30:00Z",
    amount: 5000,
    currency: "OMR",
    transferTo: "Anonymous intermediary — Dubai, UAE",
    location: "Al-Rashidi Exchange — Ruwi Branch",
    status: "success",
    riskFlag: "Transfer to unregistered intermediary exceeds AML threshold",
    riskFlagAr: "تحويل إلى وسيط غير مسجّل يتجاوز حد مكافحة غسل الأموال",
  },
  // 12. System alert — large transfer
  {
    ...DEMO_SUBJECT,
    source: "system", category: "alert", severity: "critical",
    eventType: "AML_THRESHOLD_ALERT",
    occurredAt: "2026-05-08T15:31:00Z",
    amount: 5000,
    currency: "OMR",
    riskFlag: "AML: OMR 5,000 wire to unregistered intermediary on day of arrival",
    riskFlagAr: "AML: تحويل 5,000 ريال إلى وسيط غير مسجّل في يوم الوصول",
    status: "success",
  },
  // 13. Risk assessment — AMEEN auto-generated
  {
    ...DEMO_SUBJECT,
    source: "system", category: "risk_assessment", severity: "critical",
    eventType: "RISK_ASSESSMENT",
    occurredAt: "2026-05-08T16:00:00Z",
    riskFlag: "AMEEN Score: 84 · HIGH RISK — Multi-SIM pattern + AML threshold breach on day of arrival",
    riskFlagAr: "درجة أمين: 84 · خطر مرتفع — نمط SIM متعدد + خرق حد غسل الأموال في يوم الوصول",
    status: "success",
  },
];

let scenarioRunning = false;

export function runDemoScenario(onDone?: () => void): void {
  if (scenarioRunning) return;
  scenarioRunning = true;
  clearSubjectEvents(DEMO_SUBJECT.subjectId);

  SCENARIO_EVENTS.forEach((ev, i) => {
    setTimeout(() => {
      pushEvent(ev);
      if (i === SCENARIO_EVENTS.length - 1) {
        scenarioRunning = false;
        onDone?.();
      }
    }, i * 1400);
  });
}
