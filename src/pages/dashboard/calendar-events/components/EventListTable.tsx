import { useState, useMemo } from "react";

interface Props { isAr: boolean; entityType: string; }

interface EventRow {
  id: string;
  type: string;
  typeAr: string;
  typeColor: string;
  ref: string;
  status: "accepted" | "pending" | "rejected";
  person: string;
  docMasked: string;
  date: string;
  time: string;
  amount?: string;
  branch: string;
  branchAr: string;
  detail: string;
  detailAr: string;
  nationality?: string;
  phone?: string;
  module: string;
  operator?: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
}

const ALL_EVENTS: EventRow[] = [
  { id: "r1",  type: "Check-In",             typeAr: "تسجيل دخول",         typeColor: "#4ADE80", ref: "HTL-2025-04891", status: "accepted", person: "Ahmed Al-Rashidi",    docMasked: "***4521", date: "2026-04-05", time: "09:14", amount: "OMR 245.000",    branch: "Al Bustan Palace",    branchAr: "البستان بالاس",    detail: "Room 204, 3 nights",              detailAr: "غرفة 204، 3 ليالٍ",              nationality: "OM", phone: "+968 9234 5678", module: "hotel" },
  { id: "r2",  type: "Booking Created",       typeAr: "إنشاء حجز",          typeColor: "#D4A84B", ref: "HTL-2025-04890", status: "accepted", person: "Sarah Johnson",       docMasked: "***8823", date: "2026-04-05", time: "10:30", amount: "OMR 890.000",    branch: "Al Bustan Palace",    branchAr: "البستان بالاس",    detail: "Suite 512, 3 nights",             detailAr: "جناح 512، 3 ليالٍ",             nationality: "GB", phone: "+44 7700 900123", module: "hotel" },
  { id: "r3",  type: "Room Change",           typeAr: "تغيير غرفة",         typeColor: "#FACC15", ref: "HTL-2025-04889", status: "accepted", person: "Mohammed Al-Balushi", docMasked: "***3312", date: "2026-04-05", time: "14:22", amount: "",               branch: "Al Bustan Palace",    branchAr: "البستان بالاس",    detail: "Room 118 → 220",                  detailAr: "غرفة 118 → 220",                nationality: "OM", phone: "+968 9876 5432", module: "hotel" },
  { id: "r4",  type: "Check-Out",             typeAr: "تسجيل خروج",         typeColor: "#F87171", ref: "HTL-2025-04888", status: "accepted", person: "Fatima Al-Zadjali",  docMasked: "***7891", date: "2026-04-04", time: "11:00", amount: "OMR 1,200.000",  branch: "Al Bustan Palace",    branchAr: "البستان بالاس",    detail: "Room 301, Early Departure",       detailAr: "غرفة 301، مغادرة مبكرة",        nationality: "OM", phone: "+968 9123 4567", module: "hotel" },
  { id: "r5",  type: "Booking Modified",      typeAr: "تعديل حجز",          typeColor: "#A78BFA", ref: "HTL-2025-04887", status: "pending",  person: "Khalid Al-Amri",     docMasked: "***2234", date: "2026-04-04", time: "16:45", amount: "OMR 340.000",    branch: "Al Bustan Palace",    branchAr: "البستان بالاس",    detail: "Extended stay +2 nights",        detailAr: "تمديد الإقامة +2 ليلتين",       nationality: "OM", phone: "+968 9345 6789", module: "hotel" },
  { id: "r6",  type: "Vehicle Pickup",        typeAr: "استلام مركبة",        typeColor: "#4ADE80", ref: "CAR-2025-07234", status: "accepted", person: "Ahmed Al-Rashidi",    docMasked: "***4521", date: "2026-04-05", time: "08:00", amount: "OMR 45.000",     branch: "Muscat Airport",      branchAr: "مطار مسقط",        detail: "Toyota Camry, 3 days",            detailAr: "تويوتا كامري، 3 أيام",           nationality: "OM", phone: "+968 9234 5678", module: "car-rental" },
  { id: "r7",  type: "Rental Booking",        typeAr: "حجز تأجير",          typeColor: "#D4A84B", ref: "CAR-2025-07233", status: "accepted", person: "James Wilson",        docMasked: "***5512", date: "2026-04-05", time: "09:30", amount: "OMR 210.000",    branch: "Muscat Airport",      branchAr: "مطار مسقط",        detail: "Nissan Patrol, 7 days",           detailAr: "نيسان باترول، 7 أيام",           nationality: "GB", phone: "+44 7700 900456", module: "car-rental" },
  { id: "r8",  type: "Rental Extension",      typeAr: "تمديد تأجير",        typeColor: "#FACC15", ref: "CAR-2025-07232", status: "accepted", person: "Priya Nair",          docMasked: "***9901", date: "2026-04-04", time: "15:00", amount: "OMR 60.000",     branch: "Ruwi Branch",         branchAr: "فرع الروي",        detail: "Contract extended +2 days",       detailAr: "تمديد العقد +يومين",             nationality: "IN", phone: "+91 98765 43210", module: "car-rental" },
  { id: "r9",  type: "Vehicle Drop-off",      typeAr: "إعادة مركبة",        typeColor: "#FB923C", ref: "CAR-2025-07231", status: "pending",  person: "Reza Tehrani",        docMasked: "***1122", date: "2026-04-04", time: "17:30", amount: "OMR 180.000",    branch: "Muscat Airport",      branchAr: "مطار مسقط",        detail: "Honda Accord, Damage Report",     detailAr: "هوندا أكورد، تقرير أضرار",       nationality: "IR", phone: "+98 912 345 6789", module: "car-rental", riskLevel: "medium" },
  { id: "r10", type: "SIM Activation",        typeAr: "تفعيل شريحة",        typeColor: "#4ADE80", ref: "MOB-2025-19234", status: "accepted", person: "Omar Al-Farsi",       docMasked: "***6634", date: "2026-04-05", time: "10:15", amount: "OMR 5.000",      branch: "Muscat Main",         branchAr: "مسقط الرئيسي",     detail: "Prepaid SIM, Muscat Branch",      detailAr: "شريحة مدفوعة مسبقاً، مسقط",     nationality: "OM", phone: "+968 9456 7890", module: "mobile", operator: "Omantel" },
  { id: "r11", type: "eSIM Provision",        typeAr: "توفير eSIM",          typeColor: "#A78BFA", ref: "MOB-2025-19233", status: "accepted", person: "Carlos Mendez",       docMasked: "***3341", date: "2026-04-05", time: "11:00", amount: "OMR 8.000",      branch: "Muscat Main",         branchAr: "مسقط الرئيسي",     detail: "iPhone 15 Pro, eSIM",             detailAr: "آيفون 15 برو، eSIM",             nationality: "ES", phone: "+34 612 345 678", module: "mobile", operator: "Ooredoo" },
  { id: "r12", type: "SIM Deactivation",      typeAr: "إلغاء شريحة",        typeColor: "#F87171", ref: "MOB-2025-19230", status: "accepted", person: "Layla Al-Hinai",      docMasked: "***8812", date: "2026-04-04", time: "14:00", amount: "",               branch: "Seeb Branch",         branchAr: "فرع السيب",        detail: "Postpaid SIM deactivated",        detailAr: "إلغاء شريحة مدفوعة",            nationality: "OM", phone: "+968 9567 8901", module: "mobile", operator: "Omantel" },
  { id: "r13", type: "Wire Transfer",         typeAr: "تحويل بنكي",         typeColor: "#4ADE80", ref: "PAY-2025-88234", status: "accepted", person: "Al-Rashidi Trading",  docMasked: "***7723", date: "2026-04-05", time: "09:00", amount: "OMR 45,000.000", branch: "Bank Muscat HQ",      branchAr: "بنك مسقط الرئيسي", detail: "Transfer to HSBC London",         detailAr: "تحويل إلى HSBC لندن",            nationality: "OM", phone: "+968 2412 3456", module: "financial", riskLevel: "medium" },
  { id: "r14", type: "Large Cash Deposit",    typeAr: "إيداع نقدي كبير",    typeColor: "#FACC15", ref: "PAY-2025-88233", status: "pending",  person: "Mohammed Al-Balushi", docMasked: "***3312", date: "2026-04-05", time: "10:45", amount: "OMR 12,500.000", branch: "Bank Muscat HQ",      branchAr: "بنك مسقط الرئيسي", detail: "Cash deposit, Account #AC-44521", detailAr: "إيداع نقدي، حساب #AC-44521",     nationality: "OM", phone: "+968 9876 5432", module: "financial", riskLevel: "high" },
  { id: "r15", type: "Flagged Transaction",   typeAr: "معاملة مُبلَّغة",    typeColor: "#F87171", ref: "PAY-2025-88231", status: "rejected", person: "Reza Tehrani",        docMasked: "***1122", date: "2026-04-04", time: "16:30", amount: "OMR 3,200.000",  branch: "Bank Muscat HQ",      branchAr: "بنك مسقط الرئيسي", detail: "Suspicious pattern detected",     detailAr: "نمط مشبوه مكتشف",               nationality: "IR", phone: "+98 912 345 6789", module: "financial", riskLevel: "critical" },
  { id: "r16", type: "Entry Recorded",        typeAr: "تسجيل دخول",         typeColor: "#60A5FA", ref: "BRD-2025-44891", status: "accepted", person: "Sarah Johnson",       docMasked: "***8823", date: "2026-04-05", time: "07:30", amount: "",               branch: "Muscat Airport",      branchAr: "مطار مسقط",        detail: "UK Passport, Terminal 1",         detailAr: "جواز سفر بريطاني، T1",           nationality: "GB", phone: "+44 7700 900123", module: "border" },
  { id: "r17", type: "Overstay Alert",        typeAr: "تنبيه تجاوز",        typeColor: "#F87171", ref: "BRD-2025-44888", status: "pending",  person: "Unknown Subject",     docMasked: "***8401", date: "2026-04-04", time: "00:00", amount: "",               branch: "System Alert",        branchAr: "تنبيه النظام",     detail: "Visa expired 3 days ago",         detailAr: "انتهت التأشيرة منذ 3 أيام",      nationality: "PK", phone: "N/A", module: "border", riskLevel: "high" },
  { id: "r18", type: "Lease Start",           typeAr: "بدء إيجار",          typeColor: "#4ADE80", ref: "MUN-2025-03421", status: "accepted", person: "Hamad Al-Zadjali",    docMasked: "***5523", date: "2026-04-05", time: "11:30", amount: "OMR 450.000",    branch: "Muscat Municipality", branchAr: "بلدية مسقط",       detail: "Villa 12, Al Khuwair, 12 months", detailAr: "فيلا 12، الخوير، 12 شهراً",      nationality: "OM", phone: "+968 9678 9012", module: "municipality" },
  { id: "r19", type: "Work Permit Issued",    typeAr: "إصدار تصريح عمل",    typeColor: "#F9A8D4", ref: "EMP-2025-33234", status: "accepted", person: "Priya Nair",          docMasked: "***9901", date: "2026-04-05", time: "13:00", amount: "OMR 50.000",     branch: "Ministry of Labour",  branchAr: "وزارة العمل",      detail: "Construction sector, 2 years",    detailAr: "قطاع البناء، سنتان",             nationality: "IN", phone: "+91 98765 43210", module: "employment" },
  { id: "r20", type: "Electricity Connected", typeAr: "توصيل كهرباء",       typeColor: "#FACC15", ref: "UTL-2025-11234", status: "accepted", person: "Nadia Al-Rashidi",    docMasked: "***4412", date: "2026-04-04", time: "09:00", amount: "OMR 25.000",     branch: "OIFC Muscat",         branchAr: "OIFC مسقط",        detail: "Villa 45, Al Azaiba, 3-phase",    detailAr: "فيلا 45، العذيبة، ثلاثي الطور", nationality: "OM", phone: "+968 9789 0123", module: "utility" },
  { id: "r21", type: "Trip Recorded",         typeAr: "رحلة مسجلة",         typeColor: "#4ADE80", ref: "TRP-2025-55123", status: "accepted", person: "Tariq Al-Amri",       docMasked: "***6612", date: "2026-04-05", time: "07:45", amount: "OMR 2.500",      branch: "Muscat Bus Network",  branchAr: "شبكة حافلات مسقط", detail: "Route 12, Ruwi → Airport",        detailAr: "خط 12، الروي → المطار",          nationality: "OM", phone: "+968 9890 1234", module: "transport" },
  { id: "r22", type: "Bulk Purchase Alert",   typeAr: "تنبيه شراء بالجملة", typeColor: "#FACC15", ref: "ECM-2025-77234", status: "pending",  person: "Unknown Buyer",       docMasked: "***3301", date: "2026-04-04", time: "15:20", amount: "OMR 4,500.000",  branch: "Lulu Hypermarket",    branchAr: "لولو هايبرماركت",  detail: "48 prepaid SIM cards purchased",  detailAr: "شراء 48 شريحة مدفوعة مسبقاً",   nationality: "BD", phone: "N/A", module: "ecommerce", riskLevel: "high" },
  { id: "r23", type: "Termination",           typeAr: "إنهاء عقد",          typeColor: "#F87171", ref: "EMP-2025-33230", status: "accepted", person: "Rajesh Kumar",        docMasked: "***7712", date: "2026-04-04", time: "12:00", amount: "",               branch: "Ministry of Labour",  branchAr: "وزارة العمل",      detail: "Absconding — border check active",detailAr: "تغيب — فحص حدودي نشط",          nationality: "IN", phone: "N/A", module: "employment", riskLevel: "high" },
  { id: "r24", type: "Patient Registration",  typeAr: "تسجيل مريض",         typeColor: "#D4A84B", ref: "HLT-2025-22134", status: "accepted", person: "Aisha Al-Balushi",    docMasked: "***9923", date: "2026-04-05", time: "08:30", amount: "OMR 15.000",     branch: "Royal Hospital",      branchAr: "المستشفى الملكي",  detail: "General checkup, OPD",            detailAr: "فحص عام، العيادات الخارجية",     nationality: "OM", phone: "+968 9901 2345", module: "healthcare" },
  { id: "r25", type: "Tour Booking",          typeAr: "حجز جولة",           typeColor: "#34D399", ref: "TOR-2025-44512", status: "accepted", person: "Elena Petrov",        docMasked: "***2201", date: "2026-04-05", time: "10:00", amount: "OMR 85.000",     branch: "Muscat Tourism",      branchAr: "سياحة مسقط",       detail: "Wahiba Sands, 2-day tour",        detailAr: "رمال وهيبة، جولة يومين",         nationality: "RU", phone: "+7 912 345 6789", module: "tourism" },
];

const STATUS_COLORS: Record<string, string> = { accepted: "#4ADE80", pending: "#FACC15", rejected: "#F87171" };
const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  accepted: { en: "Success", ar: "مقبول" },
  pending:  { en: "Pending", ar: "معلق" },
  rejected: { en: "Failed",  ar: "فاشل" },
};
const RISK_COLORS: Record<string, string> = { low: "#4ADE80", medium: "#FACC15", high: "#FB923C", critical: "#F87171" };
const RISK_LABELS: Record<string, { en: string; ar: string }> = {
  low:      { en: "Low",      ar: "منخفض" },
  medium:   { en: "Medium",   ar: "متوسط" },
  high:     { en: "High",     ar: "عالٍ" },
  critical: { en: "Critical", ar: "حرج" },
};

const PAGE_SIZE = 10;

const EventListTable = ({ isAr, entityType }: Props) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [sortCol, setSortCol] = useState<string>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<EventRow | null>(null);
  const [selectedBulk, setSelectedBulk] = useState<string[]>([]);
  const [resubmitSuccess, setResubmitSuccess] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...ALL_EVENTS];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.person.toLowerCase().includes(q) ||
        r.ref.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.typeAr.includes(q)
      );
    }
    if (filterType !== "all") rows = rows.filter((r) => r.type === filterType);
    if (filterStatus !== "all") rows = rows.filter((r) => r.status === filterStatus);
    if (filterBranch !== "all") rows = rows.filter((r) => r.branch === filterBranch);

    rows.sort((a, b) => {
      const va = (a[sortCol as keyof EventRow] as string) || "";
      const vb = (b[sortCol as keyof EventRow] as string) || "";
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return rows;
  }, [search, filterType, filterStatus, filterBranch, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const failedRows = filtered.filter((r) => r.status === "rejected");

  const uniqueTypes = Array.from(new Set(ALL_EVENTS.map((r) => r.type)));
  const uniqueBranches = Array.from(new Set(ALL_EVENTS.map((r) => r.branch)));

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const toggleBulk = (id: string) => {
    setSelectedBulk((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleResubmit = (ref: string) => {
    setResubmitSuccess(ref);
    setTimeout(() => setResubmitSuccess(null), 3000);
  };

  const handleBulkResubmit = () => {
    setResubmitSuccess("BULK");
    setTimeout(() => setResubmitSuccess(null), 3000);
    setSelectedBulk([]);
  };

  const SortIcon = ({ col }: { col: string }) => (
    <i className={`ml-1 text-xs ${sortCol === col ? (sortDir === "asc" ? "ri-arrow-up-line text-gold-400" : "ri-arrow-down-line text-gold-400") : "ri-arrow-up-down-line text-gray-600"}`} />
  );

  return (
    <div className="space-y-4">
      {/* Resubmit success toast */}
      {resubmitSuccess && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl border animate-pulse"
          style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)" }}>
          <i className="ri-checkbox-circle-line text-green-400 text-sm" />
          <span className="text-green-400 text-sm font-semibold">
            {resubmitSuccess === "BULK"
              ? (isAr ? "تمت إعادة إرسال جميع الأحداث الفاشلة بنجاح" : "All failed events re-submitted successfully")
              : (isAr ? `تمت إعادة إرسال ${resubmitSuccess} بنجاح` : `${resubmitSuccess} re-submitted successfully`)}
          </span>
        </div>
      )}

      {/* Filter bar */}
      <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex flex-wrap items-end gap-3">
          {/* Event type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">{isAr ? "نوع الحدث" : "Event Type"}</label>
            <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none transition-colors"
              style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB", minWidth: "160px" }}>
              <option value="all">{isAr ? "الكل" : "All Types"}</option>
              {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">{isAr ? "الحالة" : "Status"}</label>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none transition-colors"
              style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB", minWidth: "130px" }}>
              <option value="all">{isAr ? "الكل" : "All Status"}</option>
              <option value="accepted">{isAr ? "مقبول" : "Success"}</option>
              <option value="pending">{isAr ? "معلق" : "Pending"}</option>
              <option value="rejected">{isAr ? "فاشل" : "Failed"}</option>
            </select>
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">{isAr ? "الفرع" : "Branch"}</label>
            <select value={filterBranch} onChange={(e) => { setFilterBranch(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none transition-colors"
              style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB", minWidth: "160px" }}>
              <option value="all">{isAr ? "كل الفروع" : "All Branches"}</option>
              {uniqueBranches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">{isAr ? "بحث" : "Search"}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={isAr ? "اسم، مرجع، نوع..." : "Name, ref, type..."}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                  style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }}
                />
              </div>
              <button type="button"
                className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
                style={{ background: "#D4A84B", color: "#0B1220" }}>
                {isAr ? "بحث" : "Go"}
              </button>
            </div>
          </div>

          {/* Export */}
          <button type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(181,142,60,0.3)", color: "#D4A84B" }}>
            <i className="ri-download-2-line text-sm" />
            {isAr ? "تصدير" : "Export"}
          </button>
        </div>

        {/* Bulk re-submit bar */}
        {failedRows.length > 0 && (
          <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
            <i className="ri-error-warning-line text-red-400 text-sm" />
            <span className="text-red-400 text-xs font-semibold">
              {failedRows.length} {isAr ? "أحداث فاشلة — يمكن إعادة الإرسال" : "failed events — bulk re-submit available"}
            </span>
            <button type="button" onClick={handleBulkResubmit}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
              style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
              <i className="ri-refresh-line text-xs" />
              {isAr ? "إعادة إرسال الكل" : "Re-submit All"}
            </button>
          </div>
        )}

        {/* Bulk selected bar */}
        {selectedBulk.length > 0 && (
          <div className="mt-3 flex items-center gap-3 px-4 py-2.5 rounded-xl border"
            style={{ background: "rgba(181,142,60,0.06)", borderColor: "rgba(181,142,60,0.2)" }}>
            <i className="ri-checkbox-multiple-line text-gold-400 text-sm" />
            <span className="text-gold-400 text-xs font-semibold font-['JetBrains_Mono']">
              {selectedBulk.length} {isAr ? "محدد" : "selected"}
            </span>
            <button type="button" onClick={() => setSelectedBulk([])}
              className="ml-auto text-gray-500 text-xs cursor-pointer hover:text-white transition-colors">
              {isAr ? "إلغاء التحديد" : "Clear selection"}
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-gray-500 text-sm font-['JetBrains_Mono']">
          {isAr
            ? `عرض ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} من ${filtered.length} حدث`
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} events`}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs">{isAr ? "ترتيب حسب:" : "Sort by:"}</span>
          <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{sortCol} {sortDir === "asc" ? "↑" : "↓"}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr style={{ background: "rgba(181,142,60,0.05)", borderBottom: "1px solid rgba(181,142,60,0.1)" }}>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="cursor-pointer accent-gold-400"
                    onChange={(e) => setSelectedBulk(e.target.checked ? pageRows.map((r) => r.id) : [])}
                    checked={selectedBulk.length === pageRows.length && pageRows.length > 0} />
                </th>
                {[
                  { key: "type",      label: isAr ? "النوع" : "Event Type" },
                  { key: "ref",       label: isAr ? "المرجع" : "Reference" },
                  { key: "status",    label: isAr ? "الحالة" : "Status" },
                  { key: "person",    label: isAr ? "الشخص" : "Person" },
                  { key: "docMasked", label: isAr ? "الوثيقة" : "Document" },
                  { key: "date",      label: isAr ? "التاريخ" : "Date/Time" },
                  { key: "amount",    label: isAr ? "المبلغ" : "Amount" },
                  { key: "branch",    label: isAr ? "الفرع" : "Branch" },
                  { key: "riskLevel", label: isAr ? "المخاطر" : "Risk" },
                ].map((col) => (
                  <th key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                    style={{ color: sortCol === col.key ? "#D4A84B" : "#6B7280" }}>
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => (
                <tr key={row.id}
                  onClick={() => setSelectedRow(selectedRow?.id === row.id ? null : row)}
                  className="cursor-pointer transition-colors border-b"
                  style={{
                    background: selectedRow?.id === row.id
                      ? "rgba(181,142,60,0.07)"
                      : idx % 2 === 0 ? "rgba(20,29,46,0.6)" : "rgba(11,18,32,0.4)",
                    borderColor: "rgba(181,142,60,0.05)",
                    borderLeft: selectedRow?.id === row.id ? "2px solid #D4A84B" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (selectedRow?.id !== row.id) (e.currentTarget as HTMLElement).style.background = "rgba(181,142,60,0.04)"; }}
                  onMouseLeave={(e) => { if (selectedRow?.id !== row.id) (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? "rgba(20,29,46,0.6)" : "rgba(11,18,32,0.4)"; }}>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="cursor-pointer accent-gold-400"
                      checked={selectedBulk.includes(row.id)}
                      onChange={() => toggleBulk(row.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: row.typeColor, boxShadow: `0 0 4px ${row.typeColor}80` }} />
                      <span className="text-white text-xs font-semibold whitespace-nowrap">{isAr ? row.typeAr : row.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gold-400 text-xs font-['JetBrains_Mono'] cursor-pointer hover:underline whitespace-nowrap">{row.ref}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ background: `${STATUS_COLORS[row.status]}15`, color: STATUS_COLORS[row.status], border: `1px solid ${STATUS_COLORS[row.status]}30` }}>
                      {isAr ? STATUS_LABELS[row.status].ar : STATUS_LABELS[row.status].en}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-xs whitespace-nowrap">{row.person}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{row.docMasked}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-gray-300 text-xs font-['JetBrains_Mono'] whitespace-nowrap">{row.date}</div>
                      <div className="text-gray-600 text-xs font-['JetBrains_Mono']">{row.time}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono'] whitespace-nowrap">{row.amount || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-500 text-xs whitespace-nowrap">{isAr ? row.branchAr : row.branch}</span>
                  </td>
                  <td className="px-4 py-3">
                    {row.riskLevel ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                        style={{ background: `${RISK_COLORS[row.riskLevel]}15`, color: RISK_COLORS[row.riskLevel] }}>
                        {isAr ? RISK_LABELS[row.riskLevel].ar : RISK_LABELS[row.riskLevel].en}
                      </span>
                    ) : (
                      <span className="text-gray-700 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
          <span className="text-gray-500 text-xs font-['JetBrains_Mono']">
            {isAr ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage(1)} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border text-xs cursor-pointer disabled:opacity-30 transition-colors"
              style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}>
              <i className="ri-skip-back-line text-xs" />
            </button>
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border text-xs cursor-pointer disabled:opacity-30 transition-colors"
              style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}>
              <i className="ri-arrow-left-s-line text-xs" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} type="button" onClick={() => setPage(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold cursor-pointer transition-colors font-['JetBrains_Mono']"
                  style={{
                    background: page === p ? "#D4A84B" : "transparent",
                    borderColor: page === p ? "#D4A84B" : "rgba(181,142,60,0.2)",
                    color: page === p ? "#0B1220" : "#D4A84B",
                  }}>
                  {p}
                </button>
              );
            })}
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border text-xs cursor-pointer disabled:opacity-30 transition-colors"
              style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}>
              <i className="ri-arrow-right-s-line text-xs" />
            </button>
            <button type="button" onClick={() => setPage(totalPages)} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border text-xs cursor-pointer disabled:opacity-30 transition-colors"
              style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}>
              <i className="ri-skip-forward-line text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Side detail panel */}
      {selectedRow && (
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(11,18,32,0.97)", borderColor: "rgba(181,142,60,0.25)", backdropFilter: "blur(20px)" }}>
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.1)", background: "rgba(181,142,60,0.04)" }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: selectedRow.typeColor, boxShadow: `0 0 8px ${selectedRow.typeColor}` }} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{isAr ? selectedRow.typeAr : selectedRow.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: `${STATUS_COLORS[selectedRow.status]}15`, color: STATUS_COLORS[selectedRow.status] }}>
                    {isAr ? STATUS_LABELS[selectedRow.status].ar : STATUS_LABELS[selectedRow.status].en}
                  </span>
                  {selectedRow.riskLevel && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: `${RISK_COLORS[selectedRow.riskLevel]}15`, color: RISK_COLORS[selectedRow.riskLevel] }}>
                      {isAr ? RISK_LABELS[selectedRow.riskLevel].ar : RISK_LABELS[selectedRow.riskLevel].en}
                    </span>
                  )}
                </div>
                <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{selectedRow.ref}</span>
              </div>
            </div>
            <button type="button" onClick={() => setSelectedRow(null)}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-500 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <i className="ri-close-line text-sm" />
            </button>
          </div>

          {/* Panel body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {[
                { icon: "ri-user-line",        color: "#D4A84B", label: isAr ? "الشخص" : "Person",       value: selectedRow.person },
                { icon: "ri-file-text-line",   color: "#9CA3AF", label: isAr ? "الوثيقة" : "Document",   value: selectedRow.docMasked },
                { icon: "ri-flag-line",        color: "#9CA3AF", label: isAr ? "الجنسية" : "Nationality", value: selectedRow.nationality || "—" },
                { icon: "ri-phone-line",       color: "#4ADE80", label: isAr ? "الهاتف" : "Phone",        value: selectedRow.phone || "—" },
                { icon: "ri-calendar-line",    color: "#D4A84B", label: isAr ? "التاريخ والوقت" : "Date & Time", value: `${selectedRow.date} — ${selectedRow.time}` },
                { icon: "ri-building-line",    color: "#9CA3AF", label: isAr ? "الفرع" : "Branch",        value: isAr ? selectedRow.branchAr : selectedRow.branch },
                { icon: "ri-money-dollar-circle-line", color: "#4ADE80", label: isAr ? "المبلغ" : "Amount", value: selectedRow.amount || "—" },
                { icon: "ri-information-line", color: "#9CA3AF", label: isAr ? "التفاصيل" : "Details",    value: isAr ? selectedRow.detailAr : selectedRow.detail },
                { icon: "ri-apps-line",        color: "#9CA3AF", label: isAr ? "الوحدة" : "Module",       value: selectedRow.module.toUpperCase() },
              ].map((field) => (
                <div key={field.label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`${field.icon} text-xs`} style={{ color: field.color }} />
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">{field.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-200">{field.value}</span>
                </div>
              ))}
            </div>

            {/* AMN Reference */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
              style={{ background: "rgba(181,142,60,0.05)", border: "1px solid rgba(181,142,60,0.15)" }}>
              <i className="ri-qr-code-line text-gold-400 text-sm" />
              <div>
                <div className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mb-0.5">{isAr ? "رمز التأكيد" : "Confirmation Code"}</div>
                <div className="text-gold-400 text-sm font-bold font-['JetBrains_Mono']">AMN-EVT-{selectedRow.date.replace(/-/g, "")}-{selectedRow.ref.split("-").pop()}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {selectedRow.status === "rejected" && (
                <button type="button" onClick={() => handleResubmit(selectedRow.ref)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{ background: "#D4A84B", color: "#0B1220" }}>
                  <i className="ri-refresh-line text-sm" />
                  {isAr ? "إعادة الإرسال" : "Re-submit"}
                </button>
              )}
              <button type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                style={{ background: "transparent", borderColor: "rgba(181,142,60,0.3)", color: "#D4A84B" }}>
                <i className="ri-download-2-line text-sm" />
                {isAr ? "تصدير" : "Export"}
              </button>
              <button type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <i className="ri-user-search-line text-sm" />
                {isAr ? "ملف الشخص 360°" : "Person 360°"}
              </button>
              <button type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <i className="ri-share-line text-sm" />
                {isAr ? "مشاركة" : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListTable;
