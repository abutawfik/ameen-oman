export const counterTargets = {
  events: 31400000,
  alerts: 1247,
  sources: 14,
  entities: 4892,
};

export const apiEndpoints = [
  { method: "POST", path: "/v1/events/hotel", desc: "Submit hotel intelligence events" },
  { method: "POST", path: "/v1/events/car-rental", desc: "Submit car rental events" },
  { method: "POST", path: "/v1/events/mobile", desc: "Submit mobile operator events" },
  { method: "POST", path: "/v1/events/municipality", desc: "Submit municipality registry events" },
  { method: "POST", path: "/v1/events/payment", desc: "Submit payment intelligence events" },
  { method: "POST", path: "/v1/events/borders", desc: "Submit border & immigration events" },
  { method: "GET", path: "/v1/entity/status", desc: "Get entity integration status" },
  { method: "GET", path: "/v1/entity/events/history", desc: "Retrieve submitted event history" },
];

export const integrationSteps = [
  { step: 1, title: "Request API Access", titleAr: "طلب وصول API", desc: "Submit your organization details and integration requirements to ROP." },
  { step: 2, title: "Receive Credentials", titleAr: "استلام بيانات الاعتماد", desc: "ROP issues your entity ID, API key, and sandbox credentials." },
  { step: 3, title: "Test in Sandbox", titleAr: "الاختبار في البيئة التجريبية", desc: "Validate your integration against the full sandbox environment." },
  { step: 4, title: "Go Live", titleAr: "البدء الفعلي", desc: "After ROP approval, switch to production endpoints and begin live data submission." },
];
