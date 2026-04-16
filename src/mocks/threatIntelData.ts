export type IocType = "ip" | "domain" | "hash" | "email" | "url" | "wallet" | "phone";
export type ThreatCategory = "malware" | "phishing" | "c2" | "ransomware" | "fraud" | "terrorism" | "smuggling" | "darkweb";
export type SeverityLevel = "critical" | "high" | "medium" | "low";
export type IocStatus = "active" | "mitigated" | "investigating" | "false_positive";

export interface IocEntry {
  id: string;
  type: IocType;
  value: string;
  category: ThreatCategory;
  severity: SeverityLevel;
  status: IocStatus;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  hitCount: number;
  linkedSubjects: string[];
  linkedStreams: string[];
  source: string;
  tags: string[];
  description: string;
  tlp: "RED" | "AMBER" | "GREEN" | "WHITE";
}

export interface DarkWebMention {
  id: string;
  platform: string;
  platformIcon: string;
  platformColor: string;
  content: string;
  author: string;
  timestamp: string;
  severity: SeverityLevel;
  category: ThreatCategory;
  keywords: string[];
  linkedIocs: string[];
  verified: boolean;
  translated: boolean;
  originalLang: string;
}

export interface ThreatActor {
  id: string;
  alias: string;
  realName: string | null;
  nationality: string;
  motivation: string;
  ttps: string[];
  linkedIocs: number;
  linkedCases: number;
  riskScore: number;
  lastActivity: string;
  status: "active" | "dormant" | "arrested";
  photo: string;
}

export interface ThreatFeedSource {
  id: string;
  name: string;
  type: "osint" | "commercial" | "government" | "darkweb" | "internal";
  status: "online" | "degraded" | "offline";
  lastSync: string;
  iocCount: number;
  reliability: number;
  color: string;
  icon: string;
}

export const iocEntries: IocEntry[] = [
  {
    id: "ioc-001",
    type: "ip",
    value: "185.220.101.47",
    category: "c2",
    severity: "critical",
    status: "active",
    confidence: 94,
    firstSeen: "2025-03-12",
    lastSeen: "2025-04-06",
    hitCount: 47,
    linkedSubjects: ["Ahmed Al-Rashidi", "Mohammed Al-Balushi"],
    linkedStreams: ["Mobile", "Financial"],
    source: "Internal SIEM",
    tags: ["tor-exit", "c2-server", "apt"],
    description: "Known Tor exit node used as C2 server for APT group. Multiple connections from monitored devices.",
    tlp: "RED",
  },
  {
    id: "ioc-002",
    type: "domain",
    value: "secure-update-oman.net",
    category: "phishing",
    severity: "high",
    status: "active",
    confidence: 88,
    firstSeen: "2025-03-28",
    lastSeen: "2025-04-05",
    hitCount: 23,
    linkedSubjects: ["Fatima Al-Zadjali"],
    linkedStreams: ["Social", "Mobile"],
    source: "OSINT Feed",
    tags: ["phishing", "credential-harvest", "typosquat"],
    description: "Typosquatting domain mimicking official government portal. Used in spear-phishing campaign targeting civil servants.",
    tlp: "AMBER",
  },
  {
    id: "ioc-003",
    type: "hash",
    value: "a3f8c2d1e9b4567890abcdef12345678",
    category: "malware",
    severity: "critical",
    status: "investigating",
    confidence: 97,
    firstSeen: "2025-04-01",
    lastSeen: "2025-04-06",
    hitCount: 8,
    linkedSubjects: ["Khalid Al-Amri"],
    linkedStreams: ["Employment", "Financial"],
    source: "VirusTotal",
    tags: ["trojan", "keylogger", "persistence"],
    description: "MD5 hash of banking trojan variant. Detected on endpoint associated with monitored subject. Exfiltrates credentials.",
    tlp: "RED",
  },
  {
    id: "ioc-004",
    type: "wallet",
    value: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    category: "fraud",
    severity: "high",
    status: "active",
    confidence: 82,
    firstSeen: "2025-02-14",
    lastSeen: "2025-04-04",
    hitCount: 156,
    linkedSubjects: ["Ahmed Al-Rashidi", "Unknown Actor #7"],
    linkedStreams: ["Financial", "E-Commerce"],
    source: "Blockchain Analytics",
    tags: ["bitcoin", "money-laundering", "darkweb-market"],
    description: "Bitcoin wallet linked to dark web marketplace transactions. Total volume: BTC 12.4 (~USD 780,000).",
    tlp: "AMBER",
  },
  {
    id: "ioc-005",
    type: "email",
    value: "admin@rop-secure-portal.com",
    category: "phishing",
    severity: "high",
    status: "mitigated",
    confidence: 91,
    firstSeen: "2025-03-05",
    lastSeen: "2025-03-29",
    hitCount: 34,
    linkedSubjects: [],
    linkedStreams: ["Social", "Border"],
    source: "Email Gateway",
    tags: ["spear-phishing", "impersonation", "rop"],
    description: "Email address impersonating Royal Oman Police. Used in targeted phishing campaign against border officials.",
    tlp: "AMBER",
  },
  {
    id: "ioc-006",
    type: "url",
    value: "http://185.220.101.47:8080/gate.php",
    category: "c2",
    severity: "critical",
    status: "active",
    confidence: 99,
    firstSeen: "2025-04-02",
    lastSeen: "2025-04-06",
    hitCount: 12,
    linkedSubjects: ["Mohammed Al-Balushi"],
    linkedStreams: ["Mobile", "Transport"],
    source: "Internal SIEM",
    tags: ["c2", "botnet", "gate"],
    description: "Active C2 gate URL. Botnet check-in endpoint. Linked to same IP as IOC-001.",
    tlp: "RED",
  },
  {
    id: "ioc-007",
    type: "phone",
    value: "+968 9876 5432",
    category: "smuggling",
    severity: "medium",
    status: "investigating",
    confidence: 71,
    firstSeen: "2025-01-20",
    lastSeen: "2025-04-03",
    hitCount: 89,
    linkedSubjects: ["Unknown Actor #3", "Tariq Al-Farsi"],
    linkedStreams: ["Mobile", "Border", "Marine"],
    source: "HUMINT",
    tags: ["burner-phone", "smuggling-network", "maritime"],
    description: "Burner phone number associated with maritime smuggling network. Frequent calls to UAE and Iran.",
    tlp: "AMBER",
  },
  {
    id: "ioc-008",
    type: "domain",
    value: "darkmarket-oman.onion",
    category: "darkweb",
    severity: "critical",
    status: "active",
    confidence: 85,
    firstSeen: "2025-02-01",
    lastSeen: "2025-04-05",
    hitCount: 203,
    linkedSubjects: ["Ahmed Al-Rashidi", "Unknown Actor #7", "Unknown Actor #12"],
    linkedStreams: ["Financial", "E-Commerce", "Social"],
    source: "Dark Web Monitor",
    tags: ["darkweb", "marketplace", "drugs", "weapons"],
    description: "Active dark web marketplace with Omani-focused listings. Accepts BTC and Monero. 847 active listings.",
    tlp: "RED",
  },
];

export const darkWebMentions: DarkWebMention[] = [
  {
    id: "dw-001",
    platform: "Tor Forum — AlphaBay Mirror",
    platformIcon: "ri-ghost-line",
    platformColor: "#F87171",
    content: "New shipment arriving via Muttrah Port next week. Contact via encrypted channel. Customs officer confirmed.",
    author: "shadow_trader_99",
    timestamp: "2025-04-05 23:41",
    severity: "critical",
    category: "smuggling",
    keywords: ["Muttrah Port", "customs", "shipment"],
    linkedIocs: ["ioc-007"],
    verified: true,
    translated: false,
    originalLang: "en",
  },
  {
    id: "dw-002",
    platform: "Telegram — Encrypted Channel",
    platformIcon: "ri-telegram-line",
    platformColor: "#FB923C",
    content: "تم الحصول على وثائق هوية عُمانية. السعر 500 دولار للمجموعة. التواصل عبر الرسائل المشفرة.",
    author: "doc_seller_gulf",
    timestamp: "2025-04-05 18:22",
    severity: "high",
    category: "fraud",
    keywords: ["وثائق هوية", "عُمانية", "مشفرة"],
    linkedIocs: ["ioc-004"],
    verified: true,
    translated: true,
    originalLang: "ar",
  },
  {
    id: "dw-003",
    platform: "Dark Web Forum — RaidForums Mirror",
    platformIcon: "ri-skull-line",
    platformColor: "#F87171",
    content: "Selling database dump: 50,000 Omani nationals PII. Includes passport numbers, addresses, phone numbers. BTC only.",
    author: "data_broker_x",
    timestamp: "2025-04-04 14:55",
    severity: "critical",
    category: "fraud",
    keywords: ["database", "Omani", "PII", "passport"],
    linkedIocs: ["ioc-008"],
    verified: false,
    translated: false,
    originalLang: "en",
  },
  {
    id: "dw-004",
    platform: "Telegram — Drug Network",
    platformIcon: "ri-telegram-line",
    platformColor: "#FACC15",
    content: "New route established through Salalah. Weekly drops. Need local distributors. High profit margin guaranteed.",
    author: "gulf_connect_2025",
    timestamp: "2025-04-04 09:17",
    severity: "high",
    category: "smuggling",
    keywords: ["Salalah", "route", "distributors"],
    linkedIocs: ["ioc-007"],
    verified: true,
    translated: false,
    originalLang: "en",
  },
  {
    id: "dw-005",
    platform: "I2P Network — Anonymous Board",
    platformIcon: "ri-eye-off-line",
    platformColor: "#A78BFA",
    content: "ROP network credentials for sale. VPN access to internal systems. Verified working. Price negotiable.",
    author: "insider_leak_2025",
    timestamp: "2025-04-03 22:08",
    severity: "critical",
    category: "terrorism",
    keywords: ["ROP", "credentials", "VPN", "internal"],
    linkedIocs: ["ioc-001", "ioc-006"],
    verified: false,
    translated: false,
    originalLang: "en",
  },
  {
    id: "dw-006",
    platform: "Telegram — Financial Fraud",
    platformIcon: "ri-telegram-line",
    platformColor: "#4ADE80",
    content: "Money mule network expanding to Oman. Need local accounts. 20% commission. No questions asked.",
    author: "money_flow_pro",
    timestamp: "2025-04-03 11:34",
    severity: "high",
    category: "fraud",
    keywords: ["money mule", "Oman", "accounts", "commission"],
    linkedIocs: ["ioc-004"],
    verified: true,
    translated: false,
    originalLang: "en",
  },
];

export const threatActors: ThreatActor[] = [
  {
    id: "ta-001",
    alias: "DESERT VIPER",
    realName: null,
    nationality: "Unknown (GCC Region)",
    motivation: "Financial Gain / Espionage",
    ttps: ["Spear Phishing", "Credential Harvesting", "C2 Infrastructure", "Money Laundering"],
    linkedIocs: 12,
    linkedCases: 3,
    riskScore: 94,
    lastActivity: "2025-04-06",
    status: "active",
    photo: "https://readdy.ai/api/search-image?query=dark%20silhouette%20mysterious%20hacker%20figure%20with%20digital%20code%20overlay%2C%20cyberpunk%20aesthetic%2C%20dark%20background%20with%20red%20and%20orange%20glow%2C%20abstract%20threat%20actor%20visualization%2C%20no%20face%20visible&width=80&height=80&seq=ta001&orientation=squarish",
  },
  {
    id: "ta-002",
    alias: "SILVER GHOST",
    realName: "Tariq Al-Farsi (suspected)",
    nationality: "Omani",
    motivation: "Smuggling / Organized Crime",
    ttps: ["Maritime Smuggling", "Encrypted Communications", "Money Laundering", "Document Fraud"],
    linkedIocs: 8,
    linkedCases: 2,
    riskScore: 87,
    lastActivity: "2025-04-03",
    status: "active",
    photo: "https://readdy.ai/api/search-image?query=shadowy%20figure%20in%20dark%20hoodie%20with%20encrypted%20phone%2C%20criminal%20network%20visualization%2C%20dark%20moody%20lighting%2C%20abstract%20criminal%20profile%2C%20surveillance%20aesthetic&width=80&height=80&seq=ta002&orientation=squarish",
  },
  {
    id: "ta-003",
    alias: "PHANTOM BROKER",
    realName: null,
    nationality: "Unknown (Eastern Europe)",
    motivation: "Data Brokerage / Financial Fraud",
    ttps: ["Database Exfiltration", "Dark Web Sales", "Identity Fraud", "Cryptocurrency Laundering"],
    linkedIocs: 6,
    linkedCases: 1,
    riskScore: 79,
    lastActivity: "2025-04-04",
    status: "active",
    photo: "https://readdy.ai/api/search-image?query=abstract%20digital%20phantom%20figure%20with%20data%20streams%20and%20cryptocurrency%20symbols%2C%20dark%20web%20aesthetic%2C%20neon%20green%20and%20dark%20background%2C%20mysterious%20broker%20visualization&width=80&height=80&seq=ta003&orientation=squarish",
  },
  {
    id: "ta-004",
    alias: "IRON HAWK",
    realName: "Mohammed Al-Balushi (confirmed)",
    nationality: "Omani",
    motivation: "Terrorism / Extremism",
    ttps: ["Encrypted Comms", "Financial Support Networks", "Recruitment", "Document Forgery"],
    linkedIocs: 4,
    linkedCases: 2,
    riskScore: 96,
    lastActivity: "2025-04-05",
    status: "active",
    photo: "https://readdy.ai/api/search-image?query=dangerous%20extremist%20profile%20silhouette%20with%20red%20threat%20indicators%2C%20intelligence%20file%20aesthetic%2C%20dark%20background%20with%20warning%20symbols%2C%20high%20risk%20subject%20visualization&width=80&height=80&seq=ta004&orientation=squarish",
  },
];

export const feedSources: ThreatFeedSource[] = [
  { id: "fs-001", name: "Internal SIEM",         type: "internal",    status: "online",   lastSync: "2 min ago",  iocCount: 1247, reliability: 98, color: "#22D3EE", icon: "ri-server-line" },
  { id: "fs-002", name: "VirusTotal",             type: "commercial",  status: "online",   lastSync: "5 min ago",  iocCount: 8934, reliability: 94, color: "#4ADE80", icon: "ri-shield-check-line" },
  { id: "fs-003", name: "OSINT Aggregator",       type: "osint",       status: "online",   lastSync: "12 min ago", iocCount: 3421, reliability: 78, color: "#FACC15", icon: "ri-global-line" },
  { id: "fs-004", name: "Dark Web Monitor",       type: "darkweb",     status: "online",   lastSync: "8 min ago",  iocCount: 567,  reliability: 71, color: "#F87171", icon: "ri-ghost-line" },
  { id: "fs-005", name: "Blockchain Analytics",   type: "commercial",  status: "online",   lastSync: "3 min ago",  iocCount: 2341, reliability: 91, color: "#A78BFA", icon: "ri-coin-line" },
  { id: "fs-006", name: "GCC Intel Sharing",      type: "government",  status: "degraded", lastSync: "1 hr ago",   iocCount: 891,  reliability: 88, color: "#FB923C", icon: "ri-government-line" },
  { id: "fs-007", name: "Interpol I-24/7",        type: "government",  status: "online",   lastSync: "15 min ago", iocCount: 4123, reliability: 96, color: "#38BDF8", icon: "ri-shield-star-line" },
  { id: "fs-008", name: "Telegram Monitor",       type: "osint",       status: "online",   lastSync: "1 min ago",  iocCount: 234,  reliability: 65, color: "#F9A8D4", icon: "ri-telegram-line" },
];
