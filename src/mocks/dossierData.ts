export type ClassificationLevel = "UNCLASSIFIED" | "RESTRICTED" | "CONFIDENTIAL" | "SECRET" | "TOP SECRET";
export type DossierFormat = "PDF" | "DOCX" | "ENCRYPTED_PDF";
export type DossierStatus = "draft" | "generating" | "ready" | "expired" | "archived";
export type SectionKey =
  | "cover_page" | "executive_summary" | "identity_documents" | "biometric_data"
  | "border_movements" | "hotel_stays" | "car_rentals" | "mobile_activity"
  | "financial_transactions" | "employment_history" | "municipality_records"
  | "healthcare_records" | "transport_activity" | "education_records"
  | "ecommerce_activity" | "social_intelligence" | "marine_activity"
  | "postal_records" | "customs_cargo" | "tourism_activity"
  | "utility_records" | "risk_assessment" | "pattern_alerts"
  | "connections_network" | "watchlist_status" | "investigator_notes"
  | "appendix_raw_data";

export interface DossierSection {
  key: SectionKey;
  label: string;
  stream: string;
  streamIcon: string;
  streamColor: string;
  description: string;
  dataPoints: number;
  required: boolean;
  classificationMin: ClassificationLevel;
  estimatedPages: number;
}

export interface DossierTemplate {
  id: string;
  name: string;
  description: string;
  classification: ClassificationLevel;
  sections: SectionKey[];
  format: DossierFormat;
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  icon: string;
  color: string;
  category: "investigation" | "compliance" | "border" | "financial" | "full";
}

export interface GeneratedDossier {
  id: string;
  ref: string;
  subjectName: string;
  subjectDoc: string;
  subjectNationality: string;
  classification: ClassificationLevel;
  format: DossierFormat;
  sections: SectionKey[];
  status: DossierStatus;
  generatedBy: string;
  generatedAt: string;
  expiresAt: string;
  fileSize: string;
  pageCount: number;
  streamCount: number;
  eventCount: number;
  alertCount: number;
  downloadCount: number;
  purpose: string;
  caseRef?: string;
  watermark: boolean;
  encrypted: boolean;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  action: string;
  user: string;
  timestamp: string;
  detail: string;
  ip: string;
}

export interface SubjectSearchResult {
  id: string;
  nameEn: string;
  docNumber: string;
  nationality: string;
  nationalityFlag: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  status: "in-country" | "departed" | "unknown";
  streamCount: number;
  eventCount: number;
  alertCount: number;
  lastSeen: string;
  photo: string;
}

export const classificationConfig: Record<ClassificationLevel, { color: string; bg: string; border: string; icon: string; description: string }> = {
  "UNCLASSIFIED": { color: "#9CA3AF", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.3)", icon: "ri-lock-unlock-line", description: "No restrictions — general distribution" },
  "RESTRICTED":   { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)",  icon: "ri-lock-line",        description: "Limited distribution — authorized personnel" },
  "CONFIDENTIAL": { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)",  icon: "ri-shield-line",      description: "Sensitive — need-to-know basis" },
  "SECRET":       { color: "#C98A1B", bg: "rgba(201,138,27,0.1)",  border: "rgba(201,138,27,0.3)",  icon: "ri-shield-star-line", description: "Highly sensitive — senior officers only" },
  "TOP SECRET":   { color: "#C94A5E", bg: "rgba(201,74,94,0.1)", border: "rgba(201,74,94,0.3)", icon: "ri-shield-keyhole-line", description: "Maximum classification — director level" },
};

export const dossierSections: DossierSection[] = [
  { key: "cover_page",            label: "Cover Page & Classification Header", stream: "System",      streamIcon: "ri-file-text-line",        streamColor: "#9CA3AF", description: "Document header, classification banner, subject photo, case reference", dataPoints: 0,  required: true,  classificationMin: "UNCLASSIFIED", estimatedPages: 1 },
  { key: "executive_summary",     label: "Executive Summary",                  stream: "System",      streamIcon: "ri-article-line",          streamColor: "#9CA3AF", description: "AI-generated summary of key findings, risk level, and recommended actions", dataPoints: 0,  required: true,  classificationMin: "UNCLASSIFIED", estimatedPages: 2 },
  { key: "identity_documents",    label: "Identity & Documents",               stream: "Identity",    streamIcon: "ri-id-card-line",          streamColor: "#D6B47E", description: "Passport, national ID, visa details, biographic data, aliases", dataPoints: 12, required: true,  classificationMin: "RESTRICTED",   estimatedPages: 2 },
  { key: "biometric_data",        label: "Biometric Records",                  stream: "Identity",    streamIcon: "ri-fingerprint-line",      streamColor: "#D6B47E", description: "Fingerprint records, facial recognition matches, biometric flags", dataPoints: 4,  required: false, classificationMin: "SECRET",       estimatedPages: 1 },
  { key: "risk_assessment",       label: "Risk Assessment & Score",            stream: "Risk",        streamIcon: "ri-shield-cross-line",     streamColor: "#C94A5E", description: "Composite risk score, contributing factors, risk trend over time", dataPoints: 8,  required: true,  classificationMin: "CONFIDENTIAL", estimatedPages: 3 },
  { key: "pattern_alerts",        label: "Pattern Alerts & Anomalies",         stream: "Risk",        streamIcon: "ri-alert-line",            streamColor: "#C94A5E", description: "All detected behavioral patterns, anomalies, and cross-stream correlations", dataPoints: 5,  required: true,  classificationMin: "CONFIDENTIAL", estimatedPages: 3 },
  { key: "watchlist_status",      label: "Watchlist & Sanctions Status",       stream: "Watchlist",   streamIcon: "ri-eye-line",              streamColor: "#C98A1B", description: "Watchlist membership, sanctions screening, Interpol notices", dataPoints: 3,  required: false, classificationMin: "SECRET",       estimatedPages: 1 },
  { key: "border_movements",      label: "Border Movements & Travel History",  stream: "Borders",     streamIcon: "ri-passport-line",         streamColor: "#60A5FA", description: "All entry/exit records, visa history, ports of entry, travel patterns", dataPoints: 3,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 3 },
  { key: "hotel_stays",           label: "Hotel & Accommodation Records",      stream: "Hotel",       streamIcon: "ri-hotel-line",            streamColor: "#D6B47E", description: "All hotel check-ins/outs, room details, co-guests, payment methods", dataPoints: 3,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 2 },
  { key: "car_rentals",           label: "Car Rental & Vehicle Activity",      stream: "Car Rental",  streamIcon: "ri-car-line",              streamColor: "#C98A1B", description: "Vehicle rentals, pickup/dropoff locations, mileage, co-drivers", dataPoints: 1,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 1 },
  { key: "mobile_activity",       label: "Mobile & Telecom Activity",          stream: "Mobile",      streamIcon: "ri-sim-card-line",         streamColor: "#A78BFA", description: "SIM cards, IMEI records, roaming activity, device sharing flags", dataPoints: 2,  required: false, classificationMin: "CONFIDENTIAL", estimatedPages: 2 },
  { key: "financial_transactions",label: "Financial Transactions",             stream: "Financial",   streamIcon: "ri-bank-card-line",        streamColor: "#4ADE80", description: "Bank transactions, wire transfers, cash deposits, currency exchanges", dataPoints: 4,  required: false, classificationMin: "CONFIDENTIAL", estimatedPages: 4 },
  { key: "employment_history",    label: "Employment & Work Permits",          stream: "Employment",  streamIcon: "ri-briefcase-line",        streamColor: "#F9A8D4", description: "Work permits, employer history, contract details, sector classification", dataPoints: 1,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 2 },
  { key: "municipality_records",  label: "Municipality & Residency Records",   stream: "Municipality",streamIcon: "ri-government-line",       streamColor: "#34D399", description: "Lease agreements, address history, property registrations", dataPoints: 1,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 1 },
  { key: "healthcare_records",    label: "Healthcare & Medical Records",       stream: "Healthcare",  streamIcon: "ri-heart-pulse-line",      streamColor: "#C94A5E", description: "Hospital visits, prescriptions, emergency admissions, diagnoses", dataPoints: 0,  required: false, classificationMin: "SECRET",       estimatedPages: 2 },
  { key: "transport_activity",    label: "Transport & Movement Activity",      stream: "Transport",   streamIcon: "ri-bus-line",              streamColor: "#FACC15", description: "Bus journeys, taxi bookings, flagged routes, cross-governorate trips", dataPoints: 6,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 2 },
  { key: "education_records",     label: "Education & Academic Records",       stream: "Education",   streamIcon: "ri-graduation-cap-line",   streamColor: "#A78BFA", description: "Enrollment history, institution transfers, visa extensions, dropout flags", dataPoints: 0,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 1 },
  { key: "ecommerce_activity",    label: "E-Commerce & Online Purchases",      stream: "E-Commerce",  streamIcon: "ri-shopping-cart-line",    streamColor: "#38BDF8", description: "Online purchases, bulk orders, high-value transactions, merchant activity", dataPoints: 2,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 2 },
  { key: "social_intelligence",   label: "Social Media Intelligence",          stream: "Social",      streamIcon: "ri-global-line",           streamColor: "#C94A5E", description: "Social profiles, flagged posts, keyword matches, network analysis", dataPoints: 3,  required: false, classificationMin: "CONFIDENTIAL", estimatedPages: 3 },
  { key: "marine_activity",       label: "Marine & Maritime Activity",         stream: "Marine",      streamIcon: "ri-anchor-line",           streamColor: "#DDB96B", description: "Boat rentals, marina docking, diving registrations, vessel movements", dataPoints: 1,  required: false, classificationMin: "CONFIDENTIAL", estimatedPages: 1 },
  { key: "postal_records",        label: "Postal & Parcel Records",            stream: "Postal",      streamIcon: "ri-mail-send-line",        streamColor: "#C084FC", description: "PO box registrations, parcel receipts, suspicious package flags", dataPoints: 0,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 1 },
  { key: "customs_cargo",         label: "Customs & Cargo Declarations",       stream: "Customs",     streamIcon: "ri-ship-line",             streamColor: "#FCD34D", description: "Import/export declarations, cargo clearances, HS codes, value variances", dataPoints: 2,  required: false, classificationMin: "CONFIDENTIAL", estimatedPages: 2 },
  { key: "tourism_activity",      label: "Tourism & Attraction Activity",      stream: "Tourism",     streamIcon: "ri-map-2-line",            streamColor: "#34D399", description: "Tour bookings, attraction entries, adventure activities", dataPoints: 0,  required: false, classificationMin: "UNCLASSIFIED", estimatedPages: 1 },
  { key: "utility_records",       label: "Utility & Infrastructure Records",   stream: "Utility",     streamIcon: "ri-flashlight-line",       streamColor: "#FACC15", description: "Electricity, water, internet connections and address linkages", dataPoints: 0,  required: false, classificationMin: "RESTRICTED",   estimatedPages: 1 },
  { key: "connections_network",   label: "Connections & Network Analysis",     stream: "Analysis",    streamIcon: "ri-share-line",            streamColor: "#D6B47E", description: "Known associates, co-guests, shared devices, network visualization", dataPoints: 7,  required: false, classificationMin: "SECRET",       estimatedPages: 4 },
  { key: "investigator_notes",    label: "Investigator Notes & Annotations",   stream: "System",      streamIcon: "ri-edit-line",             streamColor: "#9CA3AF", description: "Manual notes, case annotations, officer observations", dataPoints: 0,  required: false, classificationMin: "CONFIDENTIAL", estimatedPages: 2 },
  { key: "appendix_raw_data",     label: "Appendix — Raw Data Export",         stream: "System",      streamIcon: "ri-database-line",         streamColor: "#9CA3AF", description: "Full raw event data tables for all selected streams", dataPoints: 0,  required: false, classificationMin: "SECRET",       estimatedPages: 8 },
];

export const dossierTemplates: DossierTemplate[] = [
  {
    id: "tpl-001",
    name: "Full Intelligence Dossier",
    description: "Complete 360° profile pulling from all 16 streams. Maximum detail for senior investigations.",
    classification: "TOP SECRET",
    sections: ["cover_page","executive_summary","identity_documents","biometric_data","risk_assessment","pattern_alerts","watchlist_status","border_movements","hotel_stays","car_rentals","mobile_activity","financial_transactions","employment_history","municipality_records","healthcare_records","transport_activity","education_records","ecommerce_activity","social_intelligence","marine_activity","postal_records","customs_cargo","tourism_activity","utility_records","connections_network","investigator_notes","appendix_raw_data"],
    format: "ENCRYPTED_PDF",
    usageCount: 47,
    lastUsed: "2026-04-05",
    createdBy: "Director Al-Amri",
    icon: "ri-file-shield-2-line",
    color: "#C94A5E",
    category: "full",
  },
  {
    id: "tpl-002",
    name: "Border & Travel Profile",
    description: "Focused on movement patterns — border crossings, hotel stays, transport, and vehicle activity.",
    classification: "CONFIDENTIAL",
    sections: ["cover_page","executive_summary","identity_documents","risk_assessment","border_movements","hotel_stays","car_rentals","transport_activity","marine_activity","tourism_activity","connections_network"],
    format: "PDF",
    usageCount: 134,
    lastUsed: "2026-04-05",
    createdBy: "Col. Al-Rashidi",
    icon: "ri-passport-line",
    color: "#60A5FA",
    category: "border",
  },
  {
    id: "tpl-003",
    name: "Financial Crime Report",
    description: "Deep-dive into financial activity — transactions, wire transfers, currency exchanges, and customs.",
    classification: "SECRET",
    sections: ["cover_page","executive_summary","identity_documents","risk_assessment","pattern_alerts","financial_transactions","ecommerce_activity","customs_cargo","employment_history","watchlist_status","connections_network","appendix_raw_data"],
    format: "ENCRYPTED_PDF",
    usageCount: 89,
    lastUsed: "2026-04-04",
    createdBy: "FIU Director",
    icon: "ri-bank-card-line",
    color: "#4ADE80",
    category: "financial",
  },
  {
    id: "tpl-004",
    name: "Compliance Summary",
    description: "Standard compliance check — identity, employment, residency, and utility records.",
    classification: "RESTRICTED",
    sections: ["cover_page","executive_summary","identity_documents","employment_history","municipality_records","utility_records","education_records","border_movements"],
    format: "DOCX",
    usageCount: 312,
    lastUsed: "2026-04-05",
    createdBy: "Compliance Unit",
    icon: "ri-shield-check-line",
    color: "#34D399",
    category: "compliance",
  },
  {
    id: "tpl-005",
    name: "Counter-Terrorism Brief",
    description: "High-priority brief for CT operations — watchlist, social intel, connections, and pattern alerts.",
    classification: "TOP SECRET",
    sections: ["cover_page","executive_summary","identity_documents","biometric_data","risk_assessment","pattern_alerts","watchlist_status","social_intelligence","mobile_activity","connections_network","financial_transactions","border_movements","marine_activity","investigator_notes"],
    format: "ENCRYPTED_PDF",
    usageCount: 23,
    lastUsed: "2026-04-03",
    createdBy: "CT Division",
    icon: "ri-shield-star-line",
    color: "#C98A1B",
    category: "investigation",
  },
  {
    id: "tpl-006",
    name: "Quick Identity Check",
    description: "Minimal report for rapid identity verification — documents, border, and risk score only.",
    classification: "RESTRICTED",
    sections: ["cover_page","identity_documents","border_movements","risk_assessment"],
    format: "PDF",
    usageCount: 891,
    lastUsed: "2026-04-05",
    createdBy: "System Default",
    icon: "ri-id-card-line",
    color: "#D6B47E",
    category: "compliance",
  },
];

export const generatedDossiers: GeneratedDossier[] = [
  {
    id: "dos-001",
    ref: "AMEEN-DOS-2026-00441",
    subjectName: "Khalid Mohammed Al-Rashidi",
    subjectDoc: "PK-8823401",
    subjectNationality: "Pakistani",
    classification: "TOP SECRET",
    format: "ENCRYPTED_PDF",
    sections: ["cover_page","executive_summary","identity_documents","biometric_data","risk_assessment","pattern_alerts","watchlist_status","border_movements","hotel_stays","car_rentals","mobile_activity","financial_transactions","employment_history","municipality_records","transport_activity","ecommerce_activity","social_intelligence","marine_activity","customs_cargo","connections_network","investigator_notes"],
    status: "ready",
    generatedBy: "Col. Ahmed Al-Amri",
    generatedAt: "2026-04-05 14:30",
    expiresAt: "2026-04-12 14:30",
    fileSize: "4.7 MB",
    pageCount: 42,
    streamCount: 13,
    eventCount: 19,
    alertCount: 7,
    downloadCount: 3,
    purpose: "Active Investigation — Operation Desert Watch",
    caseRef: "OPS-2026-DW-441",
    watermark: true,
    encrypted: true,
    auditLog: [
      { action: "Generated", user: "Col. Ahmed Al-Amri", timestamp: "2026-04-05 14:30", detail: "Full dossier generated — 21 sections, 13 streams", ip: "10.0.1.44" },
      { action: "Downloaded", user: "Col. Ahmed Al-Amri", timestamp: "2026-04-05 14:32", detail: "PDF downloaded — encrypted", ip: "10.0.1.44" },
      { action: "Shared", user: "Col. Ahmed Al-Amri", timestamp: "2026-04-05 15:10", detail: "Shared with Director Al-Rashidi (secure channel)", ip: "10.0.1.44" },
      { action: "Downloaded", user: "Director Al-Rashidi", timestamp: "2026-04-05 15:45", detail: "PDF downloaded — encrypted", ip: "10.0.2.12" },
      { action: "Viewed", user: "Maj. Al-Balushi", timestamp: "2026-04-05 16:20", detail: "Document viewed in secure viewer", ip: "10.0.1.88" },
    ],
  },
  {
    id: "dos-002",
    ref: "AMEEN-DOS-2026-00389",
    subjectName: "Tariq Hussain",
    subjectDoc: "PK-9934521",
    subjectNationality: "Pakistani",
    classification: "SECRET",
    format: "ENCRYPTED_PDF",
    sections: ["cover_page","executive_summary","identity_documents","risk_assessment","pattern_alerts","border_movements","mobile_activity","financial_transactions","connections_network"],
    status: "ready",
    generatedBy: "Maj. Al-Balushi",
    generatedAt: "2026-04-04 09:15",
    expiresAt: "2026-04-11 09:15",
    fileSize: "2.1 MB",
    pageCount: 18,
    streamCount: 6,
    eventCount: 11,
    alertCount: 4,
    downloadCount: 2,
    purpose: "IMEI Sharing Investigation",
    caseRef: "OPS-2026-DW-441",
    watermark: true,
    encrypted: true,
    auditLog: [
      { action: "Generated", user: "Maj. Al-Balushi", timestamp: "2026-04-04 09:15", detail: "Dossier generated — 9 sections, 6 streams", ip: "10.0.1.88" },
      { action: "Downloaded", user: "Maj. Al-Balushi", timestamp: "2026-04-04 09:18", detail: "PDF downloaded", ip: "10.0.1.88" },
    ],
  },
  {
    id: "dos-003",
    ref: "AMEEN-DOS-2026-00312",
    subjectName: "Ravi Kumar",
    subjectDoc: "IN-4523891",
    subjectNationality: "Indian",
    classification: "CONFIDENTIAL",
    format: "PDF",
    sections: ["cover_page","executive_summary","identity_documents","risk_assessment","border_movements","hotel_stays","car_rentals","employment_history","connections_network"],
    status: "ready",
    generatedBy: "Lt. Al-Zadjali",
    generatedAt: "2026-04-03 16:45",
    expiresAt: "2026-04-10 16:45",
    fileSize: "1.8 MB",
    pageCount: 14,
    streamCount: 5,
    eventCount: 8,
    alertCount: 2,
    downloadCount: 1,
    purpose: "Co-Driver Background Check",
    watermark: true,
    encrypted: false,
    auditLog: [
      { action: "Generated", user: "Lt. Al-Zadjali", timestamp: "2026-04-03 16:45", detail: "Dossier generated — 9 sections, 5 streams", ip: "10.0.1.55" },
      { action: "Downloaded", user: "Lt. Al-Zadjali", timestamp: "2026-04-03 16:47", detail: "PDF downloaded", ip: "10.0.1.55" },
    ],
  },
  {
    id: "dos-004",
    ref: "AMEEN-DOS-2026-00278",
    subjectName: "Yusuf Al-Siyabi",
    subjectDoc: "OM-5512890",
    subjectNationality: "Omani",
    classification: "CONFIDENTIAL",
    format: "DOCX",
    sections: ["cover_page","executive_summary","identity_documents","risk_assessment","border_movements","marine_activity","connections_network"],
    status: "expired",
    generatedBy: "Sgt. Al-Harthi",
    generatedAt: "2026-03-28 11:00",
    expiresAt: "2026-04-04 11:00",
    fileSize: "0.9 MB",
    pageCount: 9,
    streamCount: 3,
    eventCount: 4,
    alertCount: 1,
    downloadCount: 1,
    purpose: "Boat Passenger Verification",
    watermark: false,
    encrypted: false,
    auditLog: [
      { action: "Generated", user: "Sgt. Al-Harthi", timestamp: "2026-03-28 11:00", detail: "Dossier generated — 7 sections, 3 streams", ip: "10.0.1.77" },
      { action: "Downloaded", user: "Sgt. Al-Harthi", timestamp: "2026-03-28 11:02", detail: "DOCX downloaded", ip: "10.0.1.77" },
      { action: "Expired", user: "System", timestamp: "2026-04-04 11:00", detail: "Document expired — 7-day retention policy", ip: "system" },
    ],
  },
  {
    id: "dos-005",
    ref: "AMEEN-DOS-2026-00201",
    subjectName: "Ahmed Al-Farsi",
    subjectDoc: "OM-1234567",
    subjectNationality: "Omani",
    classification: "RESTRICTED",
    format: "PDF",
    sections: ["cover_page","identity_documents","border_movements","risk_assessment"],
    status: "archived",
    generatedBy: "System Auto",
    generatedAt: "2026-03-20 08:00",
    expiresAt: "2026-03-27 08:00",
    fileSize: "0.4 MB",
    pageCount: 5,
    streamCount: 2,
    eventCount: 3,
    alertCount: 0,
    downloadCount: 0,
    purpose: "Routine Co-Guest Check",
    watermark: false,
    encrypted: false,
    auditLog: [
      { action: "Generated", user: "System Auto", timestamp: "2026-03-20 08:00", detail: "Auto-generated — quick identity check template", ip: "system" },
      { action: "Archived", user: "System", timestamp: "2026-03-27 08:00", detail: "Archived after expiry", ip: "system" },
    ],
  },
];

export const subjectSearchResults: SubjectSearchResult[] = [
  {
    id: "P-2026-00441",
    nameEn: "Khalid Mohammed Al-Rashidi",
    docNumber: "PK-8823401",
    nationality: "Pakistani",
    nationalityFlag: "🇵🇰",
    riskLevel: "critical",
    riskScore: 82,
    status: "in-country",
    streamCount: 13,
    eventCount: 19,
    alertCount: 7,
    lastSeen: "2026-04-05 14:22",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20a%20south%20asian%20man%20in%20his%20early%2030s%2C%20neutral%20expression%2C%20plain%20light%20background%2C%20formal%20dark%20shirt%2C%20high%20quality%20portrait%20photography%2C%20sharp%20focus%2C%20studio%20lighting&width=80&height=80&seq=dos-sub-001&orientation=squarish",
  },
  {
    id: "P-2026-00389",
    nameEn: "Tariq Hussain",
    docNumber: "PK-9934521",
    nationality: "Pakistani",
    nationalityFlag: "🇵🇰",
    riskLevel: "critical",
    riskScore: 82,
    status: "in-country",
    streamCount: 6,
    eventCount: 11,
    alertCount: 4,
    lastSeen: "2026-04-04 11:30",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20a%20south%20asian%20man%20in%20his%20late%2020s%2C%20neutral%20expression%2C%20plain%20white%20background%2C%20formal%20attire%2C%20high%20quality%20portrait%20photography%2C%20sharp%20focus&width=80&height=80&seq=dos-sub-002&orientation=squarish",
  },
  {
    id: "P-2026-00312",
    nameEn: "Ravi Kumar",
    docNumber: "IN-4523891",
    nationality: "Indian",
    nationalityFlag: "🇮🇳",
    riskLevel: "high",
    riskScore: 61,
    status: "in-country",
    streamCount: 5,
    eventCount: 8,
    alertCount: 2,
    lastSeen: "2026-04-03 09:15",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20an%20indian%20man%20in%20his%20mid%2030s%2C%20neutral%20expression%2C%20plain%20light%20gray%20background%2C%20formal%20shirt%2C%20high%20quality%20portrait%20photography%2C%20sharp%20focus&width=80&height=80&seq=dos-sub-003&orientation=squarish",
  },
  {
    id: "P-2026-00278",
    nameEn: "Yusuf Al-Siyabi",
    docNumber: "OM-5512890",
    nationality: "Omani",
    nationalityFlag: "🇴🇲",
    riskLevel: "high",
    riskScore: 71,
    status: "in-country",
    streamCount: 3,
    eventCount: 4,
    alertCount: 1,
    lastSeen: "2026-03-28 15:00",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20an%20arab%20man%20in%20his%20early%2040s%2C%20neutral%20expression%2C%20plain%20white%20background%2C%20formal%20traditional%20attire%2C%20high%20quality%20portrait%20photography%2C%20sharp%20focus&width=80&height=80&seq=dos-sub-004&orientation=squarish",
  },
  {
    id: "P-2026-00201",
    nameEn: "Ahmed Al-Farsi",
    docNumber: "OM-1234567",
    nationality: "Omani",
    nationalityFlag: "🇴🇲",
    riskLevel: "medium",
    riskScore: 45,
    status: "in-country",
    streamCount: 4,
    eventCount: 6,
    alertCount: 1,
    lastSeen: "2026-04-02 16:00",
    photo: "https://readdy.ai/api/search-image?query=professional%20passport%20photo%20of%20an%20arab%20man%20in%20his%20late%2030s%2C%20neutral%20expression%2C%20plain%20light%20background%2C%20formal%20business%20attire%2C%20high%20quality%20portrait%20photography%2C%20sharp%20focus&width=80&height=80&seq=dos-sub-005&orientation=squarish",
  },
];
