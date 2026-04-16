export type CaseStatus = "active" | "pending" | "closed" | "escalated" | "archived";
export type CasePriority = "critical" | "high" | "medium" | "low";
export type CaseType = "terrorism" | "fraud" | "smuggling" | "cybercrime" | "money_laundering" | "identity_fraud" | "organized_crime";
export type EvidenceType = "document" | "photo" | "video" | "audio" | "digital" | "financial" | "communication";
export type TimelineEventType = "border" | "financial" | "mobile" | "hotel" | "transport" | "social" | "employment" | "customs" | "note" | "alert";

export interface CaseSubject {
  id: string;
  name: string;
  role: "primary" | "associate" | "witness" | "unknown";
  riskScore: number;
  nationality: string;
  photo: string;
  linkedStreams: number;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  title: string;
  detail: string;
  location: string;
  subject: string;
  stream: string;
  significance: "critical" | "high" | "medium" | "low";
  verified: boolean;
  linkedEvidence: string[];
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  source: string;
  addedBy: string;
  addedAt: string;
  classification: string;
  size: string;
  tags: string[];
}

export interface CaseNote {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
  pinned: boolean;
  mentions: string[];
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  type: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  classification: string;
  createdAt: string;
  updatedAt: string;
  leadOfficer: string;
  team: string[];
  subjects: CaseSubject[];
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  notes: CaseNote[];
  linkedCases: string[];
  streamsCovered: string[];
  progressPct: number;
  description: string;
  objective: string;
}

export const cases: InvestigationCase[] = [
  {
    id: "case-001",
    caseNumber: "INV-2025-0047",
    title: "Operation Desert Watch",
    type: "money_laundering",
    status: "active",
    priority: "critical",
    classification: "TOP SECRET",
    createdAt: "2025-02-14",
    updatedAt: "2025-04-06",
    leadOfficer: "Maj. Khalid Al-Amri",
    team: ["Cpt. Sara Al-Balushi", "Lt. Ahmed Nasser", "Analyst Fatima Al-Zadjali"],
    description: "Multi-stream investigation into suspected money laundering network operating through shell companies and cryptocurrency exchanges. Subject network spans 3 countries.",
    objective: "Identify full network, freeze assets, prepare prosecution file.",
    progressPct: 68,
    linkedCases: ["case-003", "case-005"],
    streamsCovered: ["Financial", "Border", "Mobile", "E-Commerce", "Employment"],
    subjects: [
      { id: "s1", name: "Ahmed Al-Rashidi", role: "primary", riskScore: 94, nationality: "Omani", photo: "https://readdy.ai/api/search-image?query=professional%20male%20portrait%20middle%20eastern%20man%20in%20formal%20attire%2C%20neutral%20background%2C%20intelligence%20file%20photo%20style%2C%20sharp%20features&width=60&height=60&seq=cs1&orientation=squarish", linkedStreams: 12 },
      { id: "s2", name: "Unknown Actor #7", role: "associate", riskScore: 78, nationality: "Unknown", photo: "https://readdy.ai/api/search-image?query=unknown%20person%20silhouette%20with%20question%20mark%20overlay%2C%20intelligence%20file%20unknown%20subject%2C%20dark%20background%2C%20classified%20profile&width=60&height=60&seq=cs2&orientation=squarish", linkedStreams: 6 },
      { id: "s3", name: "Al-Rashidi Trading LLC", role: "associate", riskScore: 82, nationality: "Omani Entity", photo: "https://readdy.ai/api/search-image?query=corporate%20building%20facade%20with%20suspicious%20activity%20overlay%2C%20shell%20company%20visualization%2C%20dark%20intelligence%20aesthetic&width=60&height=60&seq=cs3&orientation=squarish", linkedStreams: 4 },
    ],
    timeline: [
      { id: "tl-001", type: "financial", timestamp: "2025-02-14 09:23", title: "Suspicious Wire Transfer Detected", detail: "OMR 45,000 transferred to HSBC London account. Pattern matches structuring behavior.", location: "National Bank, Muscat", subject: "Ahmed Al-Rashidi", stream: "Financial", significance: "critical", verified: true, linkedEvidence: ["ev-001"] },
      { id: "tl-002", type: "border", timestamp: "2025-02-18 14:45", title: "Subject Exits to UAE", detail: "Passport scan at Muscat International Airport. Flight WY-201 to Dubai.", location: "Muscat Airport", subject: "Ahmed Al-Rashidi", stream: "Border", significance: "high", verified: true, linkedEvidence: [] },
      { id: "tl-003", type: "financial", timestamp: "2025-02-20 11:12", title: "Cryptocurrency Exchange", detail: "BTC 3.2 purchased via local exchange. Wallet linked to dark web marketplace.", location: "Online", subject: "Ahmed Al-Rashidi", stream: "Financial", significance: "critical", verified: true, linkedEvidence: ["ev-002"] },
      { id: "tl-004", type: "mobile", timestamp: "2025-02-25 16:30", title: "Encrypted Communication Detected", detail: "Signal app usage spike. 47 messages to unknown UAE number over 3 hours.", location: "Muscat", subject: "Ahmed Al-Rashidi", stream: "Mobile", significance: "high", verified: true, linkedEvidence: [] },
      { id: "tl-005", type: "border", timestamp: "2025-03-02 08:15", title: "Subject Returns from UAE", detail: "Entry recorded at Muscat Airport. No declared goods. Customs flagged for secondary screening.", location: "Muscat Airport", subject: "Ahmed Al-Rashidi", stream: "Border", significance: "high", verified: true, linkedEvidence: ["ev-003"] },
      { id: "tl-006", type: "financial", timestamp: "2025-03-08 13:44", title: "Multiple Small Deposits", detail: "12 cash deposits under OMR 1,000 each across 3 banks in 48 hours. Classic structuring pattern.", location: "Multiple Branches, Muscat", subject: "Ahmed Al-Rashidi", stream: "Financial", significance: "critical", verified: true, linkedEvidence: ["ev-001"] },
      { id: "tl-007", type: "note", timestamp: "2025-03-15 10:00", title: "HUMINT Report Received", detail: "Confidential source confirms subject meeting with known money broker in Ruwi district.", location: "Ruwi, Muscat", subject: "Ahmed Al-Rashidi", stream: "HUMINT", significance: "critical", verified: false, linkedEvidence: [] },
      { id: "tl-008", type: "alert", timestamp: "2025-04-01 07:55", title: "Watchlist Hit — Airport", detail: "Subject flagged at departure gate. Secondary screening conducted. No contraband found.", location: "Muscat Airport", subject: "Ahmed Al-Rashidi", stream: "Border", significance: "high", verified: true, linkedEvidence: ["ev-003"] },
    ],
    evidence: [
      { id: "ev-001", type: "financial", title: "Bank Transaction Records — Q1 2025", source: "National Bank", addedBy: "Analyst Fatima Al-Zadjali", addedAt: "2025-03-10", classification: "SECRET", size: "2.4 MB", tags: ["transactions", "structuring", "wire-transfer"] },
      { id: "ev-002", type: "digital", title: "Blockchain Wallet Analysis Report", source: "Blockchain Analytics Platform", addedBy: "Lt. Ahmed Nasser", addedAt: "2025-03-01", classification: "SECRET", size: "1.1 MB", tags: ["bitcoin", "wallet", "darkweb"] },
      { id: "ev-003", type: "document", title: "Border Crossing Records — Feb-Apr 2025", source: "Border Control System", addedBy: "Cpt. Sara Al-Balushi", addedAt: "2025-04-02", classification: "CONFIDENTIAL", size: "0.8 MB", tags: ["travel", "border", "passport"] },
    ],
    notes: [
      { id: "n-001", author: "Maj. Khalid Al-Amri", authorRole: "Lead Officer", content: "Subject appears to be using Al-Rashidi Trading LLC as a front for layering funds. Recommend expanding investigation to include all company directors.", timestamp: "2025-03-20 14:30", pinned: true, mentions: ["Ahmed Al-Rashidi", "Al-Rashidi Trading LLC"] },
      { id: "n-002", author: "Analyst Fatima Al-Zadjali", authorRole: "Financial Analyst", content: "Transaction pattern analysis complete. Confidence level 91% for money laundering. Structuring threshold exceeded 8 times in Q1.", timestamp: "2025-03-25 09:15", pinned: false, mentions: [] },
    ],
  },
  {
    id: "case-002",
    caseNumber: "INV-2025-0052",
    title: "Operation Silver Net",
    type: "smuggling",
    status: "active",
    priority: "high",
    classification: "SECRET",
    createdAt: "2025-03-01",
    updatedAt: "2025-04-05",
    leadOfficer: "Cpt. Nasser Al-Hinai",
    team: ["Lt. Mariam Al-Rashdi", "Analyst Omar Al-Balushi"],
    description: "Investigation into maritime smuggling network operating through Muttrah Port and coastal areas. Suspected contraband includes narcotics and counterfeit goods.",
    objective: "Disrupt smuggling route, identify port insiders, arrest key operatives.",
    progressPct: 45,
    linkedCases: ["case-004"],
    streamsCovered: ["Border", "Marine", "Mobile", "Customs", "Transport"],
    subjects: [
      { id: "s4", name: "Tariq Al-Farsi", role: "primary", riskScore: 87, nationality: "Omani", photo: "https://readdy.ai/api/search-image?query=middle%20eastern%20male%20suspect%20profile%20photo%2C%20intelligence%20file%20style%2C%20neutral%20expression%2C%20formal%20background%2C%20surveillance%20photo%20aesthetic&width=60&height=60&seq=cs4&orientation=squarish", linkedStreams: 8 },
      { id: "s5", name: "Unknown Actor #3", role: "associate", riskScore: 71, nationality: "Unknown", photo: "https://readdy.ai/api/search-image?query=unknown%20suspect%20silhouette%20dark%20background%20intelligence%20file%20classified%20unknown%20identity&width=60&height=60&seq=cs5&orientation=squarish", linkedStreams: 5 },
    ],
    timeline: [
      { id: "tl-101", type: "customs", timestamp: "2025-03-01 03:22", title: "Suspicious Cargo Manifest", detail: "Container MSCU-4421 declared as 'industrial equipment' but weight discrepancy of 340kg flagged.", location: "Muttrah Port", subject: "Tariq Al-Farsi", stream: "Customs", significance: "critical", verified: true, linkedEvidence: [] },
      { id: "tl-102", type: "mobile", timestamp: "2025-03-05 22:15", title: "Burner Phone Activity", detail: "Phone +968 9876 5432 active near port area. 12 calls to UAE and Iran numbers.", location: "Muttrah Port Area", subject: "Tariq Al-Farsi", stream: "Mobile", significance: "high", verified: true, linkedEvidence: [] },
      { id: "tl-103", type: "border", timestamp: "2025-03-12 06:45", title: "Vessel Entry — MV Al-Noor", detail: "Fishing vessel registered to shell company. Arrived from Iranian waters. Crew of 4.", location: "Muttrah Port", subject: "Unknown Actor #3", stream: "Marine", significance: "critical", verified: true, linkedEvidence: [] },
    ],
    evidence: [],
    notes: [
      { id: "n-101", author: "Cpt. Nasser Al-Hinai", authorRole: "Lead Officer", content: "Port insider suspected. Recommend surveillance on dock workers with access to Container Terminal 3.", timestamp: "2025-03-18 16:00", pinned: true, mentions: [] },
    ],
  },
  {
    id: "case-003",
    caseNumber: "INV-2025-0061",
    title: "Operation Iron Hawk",
    type: "terrorism",
    status: "escalated",
    priority: "critical",
    classification: "TOP SECRET",
    createdAt: "2025-03-15",
    updatedAt: "2025-04-06",
    leadOfficer: "Col. Hamad Al-Zadjali",
    team: ["Maj. Khalid Al-Amri", "Cpt. Sara Al-Balushi", "Lt. Ahmed Nasser", "Analyst Fatima Al-Zadjali", "Analyst Omar Al-Balushi"],
    description: "Counter-terrorism investigation targeting suspected extremist cell. Subject has links to international networks and has been observed conducting surveillance on government facilities.",
    objective: "Neutralize threat, identify full cell structure, prevent planned activity.",
    progressPct: 82,
    linkedCases: ["case-001"],
    streamsCovered: ["Financial", "Border", "Mobile", "Social", "Employment", "Hotel"],
    subjects: [
      { id: "s6", name: "Mohammed Al-Balushi", role: "primary", riskScore: 96, nationality: "Omani", photo: "https://readdy.ai/api/search-image?query=high%20risk%20subject%20intelligence%20profile%20photo%20male%20middle%20eastern%20serious%20expression%20surveillance%20file%20classified&width=60&height=60&seq=cs6&orientation=squarish", linkedStreams: 14 },
      { id: "s7", name: "Unknown Actor #12", role: "associate", riskScore: 88, nationality: "Unknown", photo: "https://readdy.ai/api/search-image?query=unknown%20high%20risk%20subject%20silhouette%20red%20threat%20indicator%20intelligence%20file%20dark%20background&width=60&height=60&seq=cs7&orientation=squarish", linkedStreams: 7 },
    ],
    timeline: [
      { id: "tl-201", type: "social", timestamp: "2025-03-15 14:22", title: "Extremist Content Shared", detail: "Subject shared encrypted content on monitored Telegram channel. Content flagged by keyword engine.", location: "Online", subject: "Mohammed Al-Balushi", stream: "Social", significance: "critical", verified: true, linkedEvidence: [] },
      { id: "tl-202", type: "financial", timestamp: "2025-03-20 09:11", title: "Funds Received from Abroad", detail: "OMR 8,500 received via hawala network. Source traced to known extremist financier.", location: "Muscat", subject: "Mohammed Al-Balushi", stream: "Financial", significance: "critical", verified: true, linkedEvidence: [] },
      { id: "tl-203", type: "hotel", timestamp: "2025-03-28 18:30", title: "Meeting at Al Bustan Palace", detail: "Subject checked in with 2 unknown associates. Room 412. Surveillance authorized.", location: "Al Bustan Palace Hotel", subject: "Mohammed Al-Balushi", stream: "Hotel", significance: "critical", verified: true, linkedEvidence: [] },
    ],
    evidence: [],
    notes: [
      { id: "n-201", author: "Col. Hamad Al-Zadjali", authorRole: "Lead Officer", content: "ESCALATED to National Security level. Coordination with GCC partners initiated. All surveillance assets deployed.", timestamp: "2025-04-01 08:00", pinned: true, mentions: ["Mohammed Al-Balushi"] },
    ],
  },
  {
    id: "case-004",
    caseNumber: "INV-2025-0038",
    title: "Operation Phantom ID",
    type: "identity_fraud",
    status: "pending",
    priority: "medium",
    classification: "CONFIDENTIAL",
    createdAt: "2025-01-28",
    updatedAt: "2025-04-03",
    leadOfficer: "Lt. Mariam Al-Rashdi",
    team: ["Analyst Omar Al-Balushi"],
    description: "Investigation into identity document forgery ring. Multiple forged Omani passports and residency permits detected at border crossings.",
    objective: "Identify forgery source, arrest distributors, prevent further document fraud.",
    progressPct: 31,
    linkedCases: ["case-002"],
    streamsCovered: ["Border", "Employment", "Municipality", "Mobile"],
    subjects: [
      { id: "s8", name: "Fatima Al-Zadjali (suspect)", role: "primary", riskScore: 62, nationality: "Omani", photo: "https://readdy.ai/api/search-image?query=female%20suspect%20intelligence%20profile%20photo%20middle%20eastern%20woman%20neutral%20expression%20surveillance%20file&width=60&height=60&seq=cs8&orientation=squarish", linkedStreams: 5 },
    ],
    timeline: [
      { id: "tl-301", type: "border", timestamp: "2025-01-28 11:45", title: "Forged Passport Detected", detail: "Passport #OM-4421891 flagged as forged at Muscat Airport. Holder detained for questioning.", location: "Muscat Airport", subject: "Unknown", stream: "Border", significance: "high", verified: true, linkedEvidence: [] },
    ],
    evidence: [],
    notes: [],
  },
  {
    id: "case-005",
    caseNumber: "INV-2025-0071",
    title: "Operation Cyber Shield",
    type: "cybercrime",
    status: "active",
    priority: "high",
    classification: "SECRET",
    createdAt: "2025-04-01",
    updatedAt: "2025-04-06",
    leadOfficer: "Maj. Khalid Al-Amri",
    team: ["Lt. Ahmed Nasser", "Analyst Fatima Al-Zadjali"],
    description: "Investigation into cyber intrusion targeting government infrastructure. C2 server identified. Malware deployed on multiple endpoints.",
    objective: "Attribute attack, contain malware, harden affected systems, identify insider threat.",
    progressPct: 22,
    linkedCases: ["case-001"],
    streamsCovered: ["Mobile", "Employment", "Social", "Financial"],
    subjects: [
      { id: "s9", name: "DESERT VIPER (Actor)", role: "primary", riskScore: 94, nationality: "Unknown", photo: "https://readdy.ai/api/search-image?query=cyber%20threat%20actor%20dark%20silhouette%20with%20digital%20code%20matrix%20background%20hacker%20profile%20intelligence%20file&width=60&height=60&seq=cs9&orientation=squarish", linkedStreams: 3 },
    ],
    timeline: [
      { id: "tl-401", type: "alert", timestamp: "2025-04-01 02:14", title: "Intrusion Detected — SIEM Alert", detail: "Anomalous outbound traffic to 185.220.101.47. 47 endpoints affected. Data exfiltration suspected.", location: "Government Network", subject: "DESERT VIPER", stream: "Internal SIEM", significance: "critical", verified: true, linkedEvidence: [] },
    ],
    evidence: [],
    notes: [],
  },
];
