export interface ApiKey {
  id: string;
  name: string;
  key: string;
  entity: string;
  entityType: string;
  environment: "production" | "sandbox";
  status: "active" | "revoked" | "expired";
  permissions: string[];
  rateLimit: number;
  requestsToday: number;
  requestsTotal: number;
  lastUsed: string;
  created: string;
  expiresAt: string;
}

export interface ApiEndpoint {
  id: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  stream: string;
  streamCode: string;
  category: string;
  description: string;
  requestBody: Record<string, unknown>;
  responseExample: Record<string, unknown>;
  requiredFields: string[];
  headers: { name: string; required: boolean; description: string }[];
  queryParams?: { name: string; type: string; required: boolean; description: string }[];
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "paused" | "failed";
  secret: string;
  lastDelivery: string;
  successRate: number;
  totalDeliveries: number;
}

export interface StreamGuide {
  id: string;
  stream: string;
  code: string;
  icon: string;
  color: string;
  description: string;
  eventTypes: string[];
  authMethod: string;
  rateLimit: string;
  dataFormat: string;
  sampleCode: string;
}

export const apiKeys: ApiKey[] = [
  {
    id: "k1",
    name: "Grand Palace Hotel — Production",
    key: "amn_live_HTL_a8f3c2d1e9b4f7a2c5d8e1f4a7b0c3d6",
    entity: "Grand Palace Hotel",
    entityType: "Hotel",
    environment: "production",
    status: "active",
    permissions: ["hotel:write", "hotel:read", "batch:upload"],
    rateLimit: 1000,
    requestsToday: 847,
    requestsTotal: 124891,
    lastUsed: "2 min ago",
    created: "2024-01-15",
    expiresAt: "2026-01-15",
  },
  {
    id: "k2",
    name: "Grand Palace Hotel — Sandbox",
    key: "amn_test_HTL_b9e4d3c2f1a8b5c8d1e4f7a0b3c6d9e2",
    entity: "Grand Palace Hotel",
    entityType: "Hotel",
    environment: "sandbox",
    status: "active",
    permissions: ["hotel:write", "hotel:read"],
    rateLimit: 100,
    requestsToday: 23,
    requestsTotal: 4521,
    lastUsed: "1 hr ago",
    created: "2024-01-15",
    expiresAt: "2026-01-15",
  },
  {
    id: "k3",
    name: "National Car Rental — Production",
    key: "amn_live_CAR_c1f5e4d3b2a9c6d9e2f5a8b1c4d7e0f3",
    entity: "National Car Rental Co.",
    entityType: "Car Rental",
    environment: "production",
    status: "active",
    permissions: ["car-rental:write", "car-rental:read", "batch:upload"],
    rateLimit: 500,
    requestsToday: 312,
    requestsTotal: 67234,
    lastUsed: "5 min ago",
    created: "2024-03-01",
    expiresAt: "2026-03-01",
  },
  {
    id: "k4",
    name: "National Telecom — Production",
    key: "amn_live_MOB_d2a6f5e4c3b0d7e0f3a6b9c2d5e8f1a4",
    entity: "National Telecom",
    entityType: "Mobile",
    environment: "production",
    status: "active",
    permissions: ["mobile:write", "mobile:read", "batch:upload"],
    rateLimit: 5000,
    requestsToday: 4891,
    requestsTotal: 891234,
    lastUsed: "30 sec ago",
    created: "2023-11-01",
    expiresAt: "2025-11-01",
  },
  {
    id: "k5",
    name: "National Bank — Production",
    key: "amn_live_FIN_e3b7a6f5d4c1e8f1a4b7c0d3e6f9a2b5",
    entity: "National Bank",
    entityType: "Financial",
    environment: "production",
    status: "expired",
    permissions: ["financial:write", "financial:read"],
    rateLimit: 2000,
    requestsToday: 0,
    requestsTotal: 234891,
    lastUsed: "3 days ago",
    created: "2023-04-01",
    expiresAt: "2025-04-01",
  },
  {
    id: "k6",
    name: "Test Integration Key",
    key: "amn_test_GEN_f4c8b7a6e5d2f9a2b5c8d1e4f7a0b3c6",
    entity: "Development Team",
    entityType: "General",
    environment: "sandbox",
    status: "revoked",
    permissions: ["hotel:read", "car-rental:read"],
    rateLimit: 50,
    requestsToday: 0,
    requestsTotal: 891,
    lastUsed: "2 weeks ago",
    created: "2024-06-01",
    expiresAt: "2025-06-01",
  },
];

export const endpoints: ApiEndpoint[] = [
  // Hotel
  {
    id: "ep1",
    method: "POST",
    path: "/v2/hotel/booking",
    summary: "Submit Hotel Booking",
    stream: "Hotel & Accommodation",
    streamCode: "AMN-HTL",
    category: "Hotel",
    description: "Submit a new hotel booking reservation. The booking will be validated against required fields and processed in real-time.",
    requiredFields: ["guestName", "documentNumber", "nationality", "checkInDate", "checkOutDate", "roomNumber", "hotelCode"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
      { name: "X-Entity-Code", required: true, description: "Your registered entity code" },
    ],
    requestBody: {
      guestName: "Ahmed Al-Rashidi",
      documentNumber: "AB123456",
      nationality: "NAT",
      checkInDate: "2025-04-10",
      checkOutDate: "2025-04-13",
      roomNumber: "204",
      hotelCode: "HTL-001",
      guestCount: 2,
      purposeOfVisit: "tourism",
    },
    responseExample: {
      status: "accepted",
      referenceId: "HTL-2025-04891",
      timestamp: "2025-04-05T09:41:22Z",
      riskScore: 12,
      message: "Booking submitted successfully",
    },
  },
  {
    id: "ep2",
    method: "POST",
    path: "/v2/hotel/checkin",
    summary: "Submit Check-In",
    stream: "Hotel & Accommodation",
    streamCode: "AMN-HTL",
    category: "Hotel",
    description: "Record a guest check-in event. Must reference an existing booking.",
    requiredFields: ["bookingRef", "documentNumber", "checkInTime", "roomNumber"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      bookingRef: "HTL-2025-04891",
      documentNumber: "AB123456",
      checkInTime: "2025-04-10T14:30:00Z",
      roomNumber: "204",
      keyCardIssued: true,
    },
    responseExample: {
      status: "accepted",
      referenceId: "CHK-2025-08234",
      timestamp: "2025-04-10T14:30:05Z",
      message: "Check-in recorded successfully",
    },
  },
  {
    id: "ep3",
    method: "POST",
    path: "/v2/hotel/checkout",
    summary: "Submit Check-Out",
    stream: "Hotel & Accommodation",
    streamCode: "AMN-HTL",
    category: "Hotel",
    description: "Record a guest check-out event.",
    requiredFields: ["bookingRef", "documentNumber", "checkOutTime"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      bookingRef: "HTL-2025-04891",
      documentNumber: "AB123456",
      checkOutTime: "2025-04-13T11:00:00Z",
      earlyDeparture: false,
    },
    responseExample: {
      status: "accepted",
      referenceId: "OUT-2025-03421",
      timestamp: "2025-04-13T11:00:08Z",
      message: "Check-out recorded successfully",
    },
  },
  {
    id: "ep4",
    method: "POST",
    path: "/v2/hotel/room-change",
    summary: "Submit Room Change",
    stream: "Hotel & Accommodation",
    streamCode: "AMN-HTL",
    category: "Hotel",
    description: "Record a room change for an active guest.",
    requiredFields: ["bookingRef", "fromRoom", "toRoom", "changeTime"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      bookingRef: "HTL-2025-04891",
      fromRoom: "204",
      toRoom: "312",
      changeTime: "2025-04-11T10:00:00Z",
      reason: "guest_request",
    },
    responseExample: {
      status: "accepted",
      referenceId: "RCH-2025-01234",
      timestamp: "2025-04-11T10:00:03Z",
      message: "Room change recorded",
    },
  },
  // Car Rental
  {
    id: "ep5",
    method: "POST",
    path: "/v2/car-rental/booking",
    summary: "Submit Car Rental Booking",
    stream: "Car Rental",
    streamCode: "AMN-CAR",
    category: "Car Rental",
    description: "Submit a new vehicle rental booking.",
    requiredFields: ["driverName", "documentNumber", "vehiclePlate", "pickupDate", "returnDate"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      driverName: "Mohammed Al-Balushi",
      documentNumber: "CD789012",
      vehiclePlate: "NAT-12345",
      vehicleType: "sedan",
      pickupDate: "2025-04-10",
      returnDate: "2025-04-13",
      pickupLocation: "Capital Airport",
    },
    responseExample: {
      status: "accepted",
      referenceId: "CAR-2025-07234",
      timestamp: "2025-04-05T09:41:22Z",
      riskScore: 8,
      message: "Car rental booking submitted",
    },
  },
  {
    id: "ep6",
    method: "POST",
    path: "/v2/car-rental/pickup",
    summary: "Submit Vehicle Pickup",
    stream: "Car Rental",
    streamCode: "AMN-CAR",
    category: "Car Rental",
    description: "Record vehicle pickup event.",
    requiredFields: ["bookingRef", "documentNumber", "pickupTime", "vehiclePlate", "odometerStart"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      bookingRef: "CAR-2025-07234",
      documentNumber: "CD789012",
      pickupTime: "2025-04-10T09:00:00Z",
      vehiclePlate: "NAT-12345",
      odometerStart: 45231,
      fuelLevel: "full",
    },
    responseExample: {
      status: "accepted",
      referenceId: "PKP-2025-02341",
      timestamp: "2025-04-10T09:00:05Z",
      message: "Vehicle pickup recorded",
    },
  },
  // Mobile
  {
    id: "ep7",
    method: "POST",
    path: "/v2/mobile/sim-purchase",
    summary: "Submit SIM Purchase",
    stream: "Mobile Operators",
    streamCode: "AMN-MOB",
    category: "Mobile",
    description: "Record a new SIM card purchase and activation.",
    requiredFields: ["subscriberName", "documentNumber", "imei", "simSerial", "phoneNumber"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      subscriberName: "Fatima Al-Zadjali",
      documentNumber: "EF345678",
      imei: "358234091234567",
      simSerial: "8968010112345678901",
      phoneNumber: "+96892345678",
      planType: "prepaid",
      activationDate: "2025-04-05",
    },
    responseExample: {
      status: "accepted",
      referenceId: "MOB-2025-19234",
      timestamp: "2025-04-05T09:41:22Z",
      riskScore: 5,
      message: "SIM purchase recorded",
    },
  },
  // Financial
  {
    id: "ep8",
    method: "POST",
    path: "/v2/financial/large-cash",
    summary: "Submit Large Cash Transaction",
    stream: "Financial Services",
    streamCode: "AMN-FIN",
    category: "Financial",
    description: "Report a large cash transaction above the threshold. Required for AML compliance.",
    requiredFields: ["accountHolder", "documentNumber", "amount", "currency", "transactionType", "branchCode"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      accountHolder: "Khalid Al-Amri",
      documentNumber: "GH901234",
      amount: 15000,
      currency: "LOCAL",
      transactionType: "deposit",
      branchCode: "NB-001",
      transactionDate: "2025-04-05",
      sourceOfFunds: "business_income",
    },
    responseExample: {
      status: "flagged",
      referenceId: "FIN-2025-88234",
      timestamp: "2025-04-05T09:41:22Z",
      riskScore: 67,
      flags: ["large_cash_threshold"],
      message: "Transaction recorded — flagged for review",
    },
  },
  // Batch
  {
    id: "ep9",
    method: "POST",
    path: "/v2/batch/upload",
    summary: "Batch Upload Events",
    stream: "All Streams",
    streamCode: "AMN-ALL",
    category: "Batch",
    description: "Upload multiple events in a single request. Supports up to 1000 events per batch.",
    requiredFields: ["streamCode", "events"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
      { name: "Content-Type", required: true, description: "application/json" },
    ],
    requestBody: {
      streamCode: "AMN-HTL",
      batchRef: "BATCH-2025-441",
      events: [
        { type: "booking", guestName: "Ahmed Al-Rashidi", documentNumber: "AB123456" },
        { type: "checkin", bookingRef: "HTL-2025-04891", documentNumber: "AB123456" },
      ],
    },
    responseExample: {
      status: "processing",
      batchId: "BATCH-2025-441",
      total: 2,
      accepted: 2,
      rejected: 0,
      timestamp: "2025-04-05T09:41:22Z",
    },
  },
  // Status
  {
    id: "ep10",
    method: "GET",
    path: "/v2/status/{referenceId}",
    summary: "Get Event Status",
    stream: "All Streams",
    streamCode: "AMN-ALL",
    category: "Status",
    description: "Retrieve the processing status of a previously submitted event.",
    requiredFields: ["referenceId"],
    headers: [
      { name: "X-API-Key", required: true, description: "Your Al-Ameen API key" },
    ],
    queryParams: [
      { name: "referenceId", type: "string", required: true, description: "The reference ID returned from submission" },
    ],
    requestBody: {},
    responseExample: {
      referenceId: "HTL-2025-04891",
      status: "accepted",
      riskScore: 12,
      processedAt: "2025-04-05T09:41:22Z",
      stream: "AMN-HTL",
      flags: [],
    },
  },
];

export const webhooks: WebhookConfig[] = [
  {
    id: "wh1",
    name: "Hotel Events — Production",
    url: "https://api.grandpalacehotel.com/ameen/webhook",
    events: ["event.accepted", "event.rejected", "event.flagged", "batch.completed"],
    status: "active",
    secret: "whsec_a8f3c2d1e9b4f7a2c5d8e1f4a7b0c3d6",
    lastDelivery: "2 min ago",
    successRate: 99.8,
    totalDeliveries: 45234,
  },
  {
    id: "wh2",
    name: "Risk Alerts — Production",
    url: "https://api.grandpalacehotel.com/ameen/risk-alerts",
    events: ["risk.high", "risk.critical", "pattern.triggered"],
    status: "active",
    secret: "whsec_b9e4d3c2f1a8b5c8d1e4f7a0b3c6d9e2",
    lastDelivery: "15 min ago",
    successRate: 98.4,
    totalDeliveries: 1234,
  },
  {
    id: "wh3",
    name: "Batch Status — Staging",
    url: "https://staging.grandpalacehotel.com/ameen/batch",
    events: ["batch.completed", "batch.failed"],
    status: "paused",
    secret: "whsec_c1f5e4d3b2a9c6d9e2f5a8b1c4d7e0f3",
    lastDelivery: "3 days ago",
    successRate: 94.2,
    totalDeliveries: 891,
  },
  {
    id: "wh4",
    name: "System Notifications",
    url: "https://api.grandpalacehotel.com/ameen/system",
    events: ["api.key_expiry", "rate_limit.warning"],
    status: "failed",
    secret: "whsec_d2a6f5e4c3b0d7e0f3a6b9c2d5e8f1a4",
    lastDelivery: "1 hr ago",
    successRate: 71.3,
    totalDeliveries: 234,
  },
];

export const streamGuides: StreamGuide[] = [
  {
    id: "sg1",
    stream: "Hotel & Accommodation",
    code: "AMN-HTL",
    icon: "ri-hotel-line",
    color: "#22D3EE",
    description: "Submit hotel bookings, check-ins, check-outs, and room changes in real-time.",
    eventTypes: ["booking", "checkin", "checkout", "room_change", "extended_stay", "cancellation"],
    authMethod: "API Key (X-API-Key header)",
    rateLimit: "1,000 req/min (production), 100 req/min (sandbox)",
    dataFormat: "JSON — UTF-8 encoded",
    sampleCode: `curl -X POST https://api.alameen.gov/v2/hotel/booking \\
  -H "X-API-Key: amn_live_HTL_a8f3c2d1..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "guestName": "Ahmed Al-Rashidi",
    "documentNumber": "AB123456",
    "nationality": "NAT",
    "checkInDate": "2025-04-10",
    "checkOutDate": "2025-04-13",
    "roomNumber": "204",
    "hotelCode": "HTL-001"
  }'`,
  },
  {
    id: "sg2",
    stream: "Car Rental",
    code: "AMN-CAR",
    icon: "ri-car-line",
    color: "#22D3EE",
    description: "Report vehicle bookings, pickups, drop-offs, and rental extensions.",
    eventTypes: ["booking", "pickup", "dropoff", "extension", "contract_modification"],
    authMethod: "API Key (X-API-Key header)",
    rateLimit: "500 req/min (production), 100 req/min (sandbox)",
    dataFormat: "JSON — UTF-8 encoded",
    sampleCode: `curl -X POST https://api.alameen.gov/v2/car-rental/pickup \\
  -H "X-API-Key: amn_live_CAR_c1f5e4d3..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "bookingRef": "CAR-2025-07234",
    "documentNumber": "CD789012",
    "pickupTime": "2025-04-10T09:00:00Z",
    "vehiclePlate": "NAT-12345",
    "odometerStart": 45231,
    "fuelLevel": "full"
  }'`,
  },
  {
    id: "sg3",
    stream: "Mobile Operators",
    code: "AMN-MOB",
    icon: "ri-sim-card-line",
    color: "#22D3EE",
    description: "Report SIM activations, deactivations, eSIM provisioning, and roaming events.",
    eventTypes: ["sim_purchase", "sim_activation", "sim_deactivation", "esim_provision", "roaming_activated", "number_porting"],
    authMethod: "API Key (X-API-Key header)",
    rateLimit: "5,000 req/min (production), 500 req/min (sandbox)",
    dataFormat: "JSON — UTF-8 encoded",
    sampleCode: `curl -X POST https://api.alameen.gov/v2/mobile/sim-purchase \\
  -H "X-API-Key: amn_live_MOB_d2a6f5e4..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "subscriberName": "Fatima Al-Zadjali",
    "documentNumber": "EF345678",
    "imei": "358234091234567",
    "simSerial": "8968010112345678901",
    "phoneNumber": "+96892345678",
    "planType": "prepaid"
  }'`,
  },
  {
    id: "sg4",
    stream: "Financial Services",
    code: "AMN-FIN",
    icon: "ri-bank-card-line",
    color: "#4ADE80",
    description: "Report large cash transactions, wire transfers, currency exchanges, and account openings.",
    eventTypes: ["large_cash", "wire_transfer", "currency_exchange", "account_opening"],
    authMethod: "API Key (X-API-Key header) + mTLS certificate",
    rateLimit: "2,000 req/min (production), 200 req/min (sandbox)",
    dataFormat: "JSON — UTF-8 encoded, TLS 1.3 required",
    sampleCode: `curl -X POST https://api.alameen.gov/v2/financial/large-cash \\
  -H "X-API-Key: amn_live_FIN_e3b7a6f5..." \\
  -H "Content-Type: application/json" \\
  --cert client.crt --key client.key \\
  -d '{
    "accountHolder": "Khalid Al-Amri",
    "documentNumber": "GH901234",
    "amount": 15000,
    "currency": "LOCAL",
    "transactionType": "deposit"
  }'`,
  },
];

export const sandboxLogs = [
  { id: "sl1", time: "09:41:22", method: "POST", path: "/v2/hotel/booking", status: 200, latency: "42ms", result: "accepted" },
  { id: "sl2", time: "09:40:18", method: "POST", path: "/v2/hotel/checkin", status: 200, latency: "38ms", result: "accepted" },
  { id: "sl3", time: "09:39:05", method: "POST", path: "/v2/mobile/sim-purchase", status: 422, latency: "21ms", result: "rejected" },
  { id: "sl4", time: "09:38:44", method: "GET",  path: "/v2/status/HTL-2025-04891", status: 200, latency: "15ms", result: "accepted" },
  { id: "sl5", time: "09:37:31", method: "POST", path: "/v2/financial/large-cash", status: 200, latency: "67ms", result: "flagged" },
  { id: "sl6", time: "09:36:12", method: "POST", path: "/v2/batch/upload", status: 202, latency: "124ms", result: "processing" },
];
