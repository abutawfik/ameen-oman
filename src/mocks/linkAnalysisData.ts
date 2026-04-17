export type NodeType = "person" | "organization" | "location" | "vehicle" | "phone" | "bank" | "property" | "document" | "social";
export type EdgeType = "employer" | "tenant" | "co-guest" | "co-driver" | "family" | "wire-transfer" | "payment" | "rental" | "shared-phone" | "shared-imei" | "same-hotel" | "same-property" | "same-workplace" | "whatsapp-group";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  labelAr: string;
  initials?: string;
  risk: RiskLevel;
  x: number;
  y: number;
  pinned?: boolean;
  streams?: string[];
  details: Record<string, string>;
  detailsAr?: Record<string, string>;
  degree?: number;
  betweenness?: number;
  community?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: string;
  labelAr: string;
  confidence: number;
  weight: number;
  startDate?: string;
  endDate?: string;
  attributes?: Record<string, string>;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
  color: string;
}

export interface SavedWorkspace {
  id: string;
  name: string;
  nameAr: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
  tags: string[];
  shared: boolean;
}

export const nodeTypeConfig: Record<NodeType, { icon: string; color: string; shape: string; labelEn: string; labelAr: string }> = {
  person:       { icon: "ri-user-line",           color: "#D6B47E", shape: "circle",   labelEn: "Person",        labelAr: "شخص" },
  organization: { icon: "ri-building-2-line",     color: "#A78BFA", shape: "hexagon",  labelEn: "Organization",  labelAr: "منظمة" },
  location:     { icon: "ri-map-pin-line",         color: "#4ADE80", shape: "pin",      labelEn: "Location",      labelAr: "موقع" },
  vehicle:      { icon: "ri-car-line",             color: "#FACC15", shape: "diamond",  labelEn: "Vehicle",       labelAr: "مركبة" },
  phone:        { icon: "ri-smartphone-line",      color: "#60A5FA", shape: "circle",   labelEn: "Phone/IMEI",    labelAr: "هاتف/IMEI" },
  bank:         { icon: "ri-bank-line",            color: "#FCD34D", shape: "square",   labelEn: "Bank Account",  labelAr: "حساب بنكي" },
  property:     { icon: "ri-home-4-line",          color: "#2DD4BF", shape: "square",   labelEn: "Property",      labelAr: "عقار" },
  document:     { icon: "ri-file-text-line",       color: "#9CA3AF", shape: "square",   labelEn: "Document",      labelAr: "وثيقة" },
  social:       { icon: "ri-global-line",          color: "#F472B6", shape: "circle",   labelEn: "Social Account",labelAr: "حساب اجتماعي" },
};

export const edgeTypeConfig: Record<EdgeType, { color: string; dash?: boolean; labelEn: string; labelAr: string }> = {
  "employer":       { color: "#A78BFA", labelEn: "Employer",         labelAr: "صاحب عمل" },
  "tenant":         { color: "#2DD4BF", labelEn: "Tenant",           labelAr: "مستأجر" },
  "co-guest":       { color: "#D6B47E", labelEn: "Co-Guest",         labelAr: "نزيل مشترك" },
  "co-driver":      { color: "#FACC15", labelEn: "Co-Driver",        labelAr: "سائق مشترك" },
  "family":         { color: "#F472B6", labelEn: "Family",           labelAr: "عائلة" },
  "wire-transfer":  { color: "#4ADE80", labelEn: "Wire Transfer",    labelAr: "تحويل بنكي" },
  "payment":        { color: "#FCD34D", labelEn: "Payment",          labelAr: "دفع" },
  "rental":         { color: "#C98A1B", labelEn: "Rental Contract",  labelAr: "عقد إيجار" },
  "shared-phone":   { color: "#60A5FA", dash: true, labelEn: "Shared Phone",    labelAr: "هاتف مشترك" },
  "shared-imei":    { color: "#38BDF8", dash: true, labelEn: "Shared IMEI",     labelAr: "IMEI مشترك" },
  "same-hotel":     { color: "#D6B47E", dash: true, labelEn: "Same Hotel",      labelAr: "نفس الفندق" },
  "same-property":  { color: "#2DD4BF", dash: true, labelEn: "Same Property",   labelAr: "نفس العقار" },
  "same-workplace": { color: "#A78BFA", dash: true, labelEn: "Same Workplace",  labelAr: "نفس مكان العمل" },
  "whatsapp-group": { color: "#4ADE80", dash: true, labelEn: "WhatsApp Group",  labelAr: "مجموعة واتساب" },
};

export const riskColors: Record<RiskLevel, string> = {
  low:      "#4ADE80",
  medium:   "#FACC15",
  high:     "#C98A1B",
  critical: "#C94A5E",
};

export const initialNodes: GraphNode[] = [
  {
    id: "p1", type: "person", label: "Ahmed Al-Rashidi", labelAr: "أحمد الراشدي",
    initials: "AR", risk: "critical", x: 420, y: 280,
    streams: ["Hotel", "Financial", "Mobile", "Border"],
    details: { nationality: "OMN", dob: "1982-04-15", passport: "OM-4523891", phone: "+968 9234 5678", employer: "Al-Rashidi Trading LLC" },
    degree: 8, betweenness: 0.72, community: 1,
  },
  {
    id: "p2", type: "person", label: "Khalid Al-Balushi", labelAr: "خالد البلوشي",
    initials: "KB", risk: "high", x: 680, y: 180,
    streams: ["Hotel", "Car Rental", "Mobile"],
    details: { nationality: "OMN", dob: "1979-11-22", passport: "OM-7823401", phone: "+968 9876 5432" },
    degree: 5, betweenness: 0.41, community: 1,
  },
  {
    id: "p3", type: "person", label: "Mohammed Al-Zadjali", labelAr: "محمد الزدجالي",
    initials: "MZ", risk: "medium", x: 200, y: 180,
    streams: ["Employment", "Mobile", "Financial"],
    details: { nationality: "OMN", dob: "1990-07-08", passport: "OM-3312890", phone: "+968 9112 3344" },
    degree: 4, betweenness: 0.28, community: 2,
  },
  {
    id: "p4", type: "person", label: "Fatima Al-Amri", labelAr: "فاطمة العامري",
    initials: "FA", risk: "low", x: 420, y: 480,
    streams: ["Hotel", "Healthcare"],
    details: { nationality: "OMN", dob: "1988-03-19", passport: "OM-9934512", phone: "+968 9445 6677" },
    degree: 3, betweenness: 0.12, community: 1,
  },
  {
    id: "p5", type: "person", label: "Tariq Hassan", labelAr: "طارق حسن",
    initials: "TH", risk: "high", x: 680, y: 400,
    streams: ["Financial", "Border", "Mobile"],
    details: { nationality: "PAK", dob: "1985-09-30", passport: "PK-8823401", phone: "+92 300 1234567" },
    degree: 5, betweenness: 0.55, community: 3,
  },
  {
    id: "p6", type: "person", label: "Sara Al-Hinai", labelAr: "سارة الهنائية",
    initials: "SH", risk: "low", x: 200, y: 400,
    streams: ["Hotel", "Municipality"],
    details: { nationality: "OMN", dob: "1993-12-05", passport: "OM-1122334", phone: "+968 9667 8899" },
    degree: 2, betweenness: 0.08, community: 2,
  },
  {
    id: "o1", type: "organization", label: "Al-Rashidi Trading LLC", labelAr: "شركة الراشدي للتجارة",
    risk: "high", x: 140, y: 300,
    streams: ["Employment", "Financial"],
    details: { crNumber: "CR-2019-44521", sector: "Trading", employees: "47", established: "2019" },
    degree: 4, betweenness: 0.35, community: 1,
  },
  {
    id: "o2", type: "organization", label: "Gulf Star Investments", labelAr: "شركة نجم الخليج للاستثمار",
    risk: "critical", x: 780, y: 300,
    streams: ["Financial"],
    details: { crNumber: "CR-2021-88234", sector: "Investment", employees: "12", established: "2021" },
    degree: 3, betweenness: 0.44, community: 3,
  },
  {
    id: "l1", type: "location", label: "Grand Palace Hotel, Muscat", labelAr: "فندق القصر الكبير، مسقط",
    risk: "medium", x: 420, y: 120,
    streams: ["Hotel"],
    details: { address: "Al Khuwair, Muscat", type: "Hotel", rooms: "312", stars: "5" },
    degree: 4, betweenness: 0.22, community: 1,
  },
  {
    id: "l2", type: "location", label: "Villa 45, Al Azaiba", labelAr: "فيلا 45، العذيبة",
    risk: "low", x: 560, y: 520,
    streams: ["Municipality", "Utility"],
    details: { address: "Al Azaiba, Muscat", type: "Residential", area: "450 sqm" },
    degree: 2, betweenness: 0.09, community: 2,
  },
  {
    id: "v1", type: "vehicle", label: "Toyota Camry — OM-12345", labelAr: "تويوتا كامري — OM-12345",
    risk: "medium", x: 560, y: 100,
    streams: ["Car Rental", "Transport"],
    details: { plate: "OM-12345", make: "Toyota", model: "Camry", year: "2023", color: "White" },
    degree: 2, betweenness: 0.15, community: 1,
  },
  {
    id: "ph1", type: "phone", label: "+968 9234 5678", labelAr: "+968 9234 5678",
    risk: "high", x: 300, y: 80,
    streams: ["Mobile", "Social"],
    details: { number: "+968 9234 5678", imei: "358234091234567", operator: "Omantel", type: "Postpaid" },
    degree: 3, betweenness: 0.31, community: 1,
  },
  {
    id: "b1", type: "bank", label: "Account #AC-44521", labelAr: "حساب #AC-44521",
    risk: "critical", x: 680, y: 520,
    streams: ["Financial"],
    details: { bank: "National Bank of Oman", type: "Corporate", balance: "OMR 2.4M", opened: "2020-03-15" },
    degree: 3, betweenness: 0.38, community: 3,
  },
  {
    id: "s1", type: "social", label: "@ahmed_rashidi_88", labelAr: "@ahmed_rashidi_88",
    risk: "medium", x: 300, y: 520,
    streams: ["Social"],
    details: { platform: "Twitter/X", followers: "1,234", posts: "892", linked: "+968 9234 5678" },
    degree: 2, betweenness: 0.11, community: 1,
  },
];

export const initialEdges: GraphEdge[] = [
  { id: "e1",  source: "p1", target: "o1", type: "employer",      label: "Director",        labelAr: "مدير",              confidence: 95, weight: 3, startDate: "2019-01-01" },
  { id: "e2",  source: "p1", target: "p2", type: "co-guest",      label: "Co-Guest",        labelAr: "نزيل مشترك",        confidence: 88, weight: 2, startDate: "2025-01-15", endDate: "2025-01-18", attributes: { hotel: "Grand Palace", room: "Suite 512" } },
  { id: "e3",  source: "p1", target: "p3", type: "same-workplace",label: "Same Workplace",  labelAr: "نفس مكان العمل",    confidence: 72, weight: 1 },
  { id: "e4",  source: "p1", target: "p4", type: "family",        label: "Spouse",          labelAr: "زوجة",              confidence: 99, weight: 3 },
  { id: "e5",  source: "p1", target: "ph1",type: "shared-phone",  label: "Registered Owner",labelAr: "مالك مسجل",         confidence: 100,weight: 3 },
  { id: "e6",  source: "p1", target: "l1", type: "same-hotel",    label: "Checked In",      labelAr: "سجّل دخول",         confidence: 100,weight: 2, startDate: "2025-01-15" },
  { id: "e7",  source: "p1", target: "b1", type: "wire-transfer", label: "OMR 45,000",      labelAr: "45,000 ريال",       confidence: 100,weight: 3, startDate: "2025-03-22", attributes: { amount: "OMR 45,000", direction: "outgoing" } },
  { id: "e8",  source: "p2", target: "l1", type: "same-hotel",    label: "Checked In",      labelAr: "سجّل دخول",         confidence: 100,weight: 2, startDate: "2025-01-15" },
  { id: "e9",  source: "p2", target: "v1", type: "co-driver",     label: "Co-Driver",       labelAr: "سائق مشترك",        confidence: 85, weight: 2 },
  { id: "e10", source: "p2", target: "o2", type: "employer",      label: "Shareholder",     labelAr: "مساهم",             confidence: 78, weight: 2 },
  { id: "e11", source: "p3", target: "o1", type: "employer",      label: "Employee",        labelAr: "موظف",              confidence: 95, weight: 2 },
  { id: "e12", source: "p3", target: "ph1",type: "shared-phone",  label: "Shared Device",   labelAr: "جهاز مشترك",        confidence: 65, weight: 1, attributes: { imei: "358234091234567" } },
  { id: "e13", source: "p4", target: "l2", type: "tenant",        label: "Tenant",          labelAr: "مستأجر",            confidence: 100,weight: 2, startDate: "2024-06-01" },
  { id: "e14", source: "p5", target: "o2", type: "employer",      label: "Director",        labelAr: "مدير",              confidence: 90, weight: 3 },
  { id: "e15", source: "p5", target: "b1", type: "wire-transfer", label: "OMR 120,000",     labelAr: "120,000 ريال",      confidence: 100,weight: 3, startDate: "2025-02-14", attributes: { amount: "OMR 120,000", direction: "incoming" } },
  { id: "e16", source: "p5", target: "p2", type: "whatsapp-group",label: "WhatsApp Group",  labelAr: "مجموعة واتساب",     confidence: 70, weight: 1 },
  { id: "e17", source: "p6", target: "l2", type: "same-property", label: "Co-Tenant",       labelAr: "مستأجر مشترك",      confidence: 88, weight: 2 },
  { id: "e18", source: "p1", target: "s1", type: "shared-phone",  label: "Linked Account",  labelAr: "حساب مرتبط",        confidence: 82, weight: 1 },
  { id: "e19", source: "o1", target: "b1", type: "payment",       label: "Corporate Account",labelAr: "حساب مؤسسي",       confidence: 95, weight: 3 },
  { id: "e20", source: "v1", target: "p1", type: "rental",        label: "Rented By",       labelAr: "مستأجر من قِبَل",   confidence: 100,weight: 2, startDate: "2025-03-10", endDate: "2025-03-17" },
];

export const savedWorkspaces: SavedWorkspace[] = [
  { id: "ws1", name: "Al-Rashidi Network Investigation", nameAr: "تحقيق شبكة الراشدي", createdBy: "Ahmed Al-Amri", createdAt: "2025-03-15", updatedAt: "2025-04-05", nodeCount: 14, edgeCount: 20, tags: ["financial", "critical"], shared: true },
  { id: "ws2", name: "Gulf Star Shell Company Analysis", nameAr: "تحليل شركة نجم الخليج الوهمية", createdBy: "Fatima Al-Zadjali", createdAt: "2025-03-28", updatedAt: "2025-04-03", nodeCount: 8, edgeCount: 11, tags: ["financial", "high"], shared: false },
  { id: "ws3", name: "Hotel Co-Guest Cluster Jan 2025", nameAr: "مجموعة نزلاء الفندق يناير 2025", createdBy: "Ahmed Al-Amri", createdAt: "2025-02-10", updatedAt: "2025-02-18", nodeCount: 22, edgeCount: 34, tags: ["hotel", "medium"], shared: true },
  { id: "ws4", name: "SIM Swap Fraud Ring", nameAr: "حلقة احتيال استبدال الشريحة", createdBy: "Khalid Al-Balushi", createdAt: "2025-01-22", updatedAt: "2025-03-01", nodeCount: 17, edgeCount: 28, tags: ["mobile", "critical"], shared: false },
];

export const mockAnnotations: Annotation[] = [
  { id: "a1", x: 460, y: 200, text: "Key hub — 8 connections. Possible money laundering via Gulf Star.", author: "Ahmed Al-Amri", timestamp: "2025-04-05 09:14", color: "#C94A5E" },
  { id: "a2", x: 700, y: 460, text: "OMR 120K transfer on 14 Feb — investigate source of funds.", author: "Fatima Al-Zadjali", timestamp: "2025-04-04 14:32", color: "#FACC15" },
];
