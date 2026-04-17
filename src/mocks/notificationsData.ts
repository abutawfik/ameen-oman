export type NotifPriority = "critical" | "high" | "medium" | "low";
export type NotifCategory = "event" | "system" | "account";
export type MessageType = "announcement" | "policy" | "compliance" | "urgent";
export type DeliveryChannel = "in-app" | "email" | "sms";

export interface EntityNotification {
  id: string;
  category: NotifCategory;
  title: string;
  titleAr: string;
  detail: string;
  detailAr: string;
  time: string;
  color: string;
  icon: string;
  read: boolean;
  actionable: boolean;
  ref?: string;
}

export interface PoliceAlert {
  id: string;
  priority: NotifPriority;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  source: string;
  time: string;
  acknowledged: boolean;
  assignedTo?: string;
  category: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  nameAr: string;
  type: MessageType;
  subject: string;
  body: string;
  usageCount: number;
  lastUsed: string;
}

export interface SentMessage {
  id: string;
  subject: string;
  type: MessageType;
  recipients: string;
  sentAt: string;
  sent: number;
  delivered: number;
  read: number;
  total: number;
}

export interface AlertRule {
  id: string;
  name: string;
  nameAr: string;
  enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  triggerCount: number;
  lastTriggered: string;
  priority: NotifPriority;
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: string;
  connector?: "AND" | "OR";
}

export interface RuleAction {
  type: string;
  target: string;
  channel: string;
}

export const entityNotifications: EntityNotification[] = [
  {
    id: "n1", category: "event",
    title: "Event Accepted", titleAr: "تم قبول الحدث",
    detail: "AMN-HTL-001 — Check-in for Ahmed Al-Rashidi accepted successfully.",
    detailAr: "AMN-HTL-001 — تم قبول تسجيل دخول أحمد الراشدي بنجاح.",
    time: "2 min ago", color: "#4ADE80", icon: "ri-checkbox-circle-line", read: false, actionable: false, ref: "AMN-HTL-001",
  },
  {
    id: "n2", category: "event",
    title: "Event Rejected — Invalid Document", titleAr: "رُفض الحدث — مستند غير صالح",
    detail: "AMN-HTL-002 — Booking rejected: passport expiry date invalid. Click to resubmit.",
    detailAr: "AMN-HTL-002 — رُفض الحجز: تاريخ انتهاء جواز السفر غير صالح. انقر لإعادة الإرسال.",
    time: "8 min ago", color: "#F87171", icon: "ri-close-circle-line", read: false, actionable: true, ref: "AMN-HTL-002",
  },
  {
    id: "n3", category: "event",
    title: "Batch Upload Complete", titleAr: "اكتمل الرفع الجماعي",
    detail: "Batch #BT-2025-441: 45 events accepted, 3 rejected. Review rejected items.",
    detailAr: "دفعة #BT-2025-441: 45 حدثاً مقبولاً، 3 مرفوضة. راجع العناصر المرفوضة.",
    time: "22 min ago", color: "#FACC15", icon: "ri-upload-cloud-2-line", read: false, actionable: true, ref: "BT-2025-441",
  },
  {
    id: "n4", category: "event",
    title: "Event Accepted", titleAr: "تم قبول الحدث",
    detail: "AMN-HTL-003 — Check-out for Room 204 processed successfully.",
    detailAr: "AMN-HTL-003 — تمت معالجة تسجيل خروج الغرفة 204 بنجاح.",
    time: "35 min ago", color: "#4ADE80", icon: "ri-checkbox-circle-line", read: true, actionable: false, ref: "AMN-HTL-003",
  },
  {
    id: "n5", category: "event",
    title: "Event Rejected — Duplicate Entry", titleAr: "رُفض الحدث — إدخال مكرر",
    detail: "AMN-HTL-004 — Duplicate booking reference detected. Original: BK-88234.",
    detailAr: "AMN-HTL-004 — تم اكتشاف مرجع حجز مكرر. الأصلي: BK-88234.",
    time: "1 hr ago", color: "#F87171", icon: "ri-close-circle-line", read: true, actionable: true, ref: "AMN-HTL-004",
  },
  {
    id: "n6", category: "system",
    title: "Scheduled Maintenance", titleAr: "صيانة مجدولة",
    detail: "System maintenance scheduled for April 5, 02:00–04:00 AST. Brief downtime expected.",
    detailAr: "صيانة النظام مجدولة في 5 أبريل، 02:00–04:00. توقع انقطاع مؤقت.",
    time: "2 hr ago", color: "#9CA3AF", icon: "ri-tools-line", read: false, actionable: false,
  },
  {
    id: "n7", category: "system",
    title: "API Upgraded to v2.1", titleAr: "ترقية API إلى v2.1",
    detail: "Al-Ameen API updated to version 2.1. New endpoints available. Review changelog.",
    detailAr: "تم تحديث Al-Ameen API إلى الإصدار 2.1. نقاط نهاية جديدة متاحة. راجع سجل التغييرات.",
    time: "4 hr ago", color: "#D4A84B", icon: "ri-code-s-slash-line", read: false, actionable: true,
  },
  {
    id: "n8", category: "system",
    title: "Compliance Rating Upgraded — Gold", titleAr: "ترقية تقييم الامتثال — ذهبي",
    detail: "Your entity compliance rating has been upgraded to Gold tier. Benefits unlocked.",
    detailAr: "تمت ترقية تقييم امتثال كيانك إلى المستوى الذهبي. تم فتح المزايا.",
    time: "1 day ago", color: "#FACC15", icon: "ri-medal-line", read: true, actionable: false,
  },
  {
    id: "n9", category: "account",
    title: "New User Added", titleAr: "تمت إضافة مستخدم جديد",
    detail: "User Mohammed Al-Balushi (Reception) added to your account by Admin.",
    detailAr: "تمت إضافة المستخدم محمد البلوشي (استقبال) إلى حسابك بواسطة المسؤول.",
    time: "3 hr ago", color: "#D4A84B", icon: "ri-user-add-line", read: false, actionable: false,
  },
  {
    id: "n10", category: "account",
    title: "API Key Expires in 7 Days", titleAr: "مفتاح API ينتهي خلال 7 أيام",
    detail: "Your Al-Ameen API key (AMN-KEY-****4521) expires on April 12. Renew to avoid disruption.",
    detailAr: "مفتاح Al-Ameen API الخاص بك (AMN-KEY-****4521) ينتهي في 12 أبريل. جدد لتجنب الانقطاع.",
    time: "5 hr ago", color: "#FACC15", icon: "ri-key-line", read: false, actionable: true,
  },
  {
    id: "n11", category: "account",
    title: "Password Changed", titleAr: "تم تغيير كلمة المرور",
    detail: "Account password changed successfully. If this was not you, contact support immediately.",
    detailAr: "تم تغيير كلمة مرور الحساب بنجاح. إذا لم تكن أنت، اتصل بالدعم فوراً.",
    time: "1 day ago", color: "#4ADE80", icon: "ri-lock-password-line", read: true, actionable: false,
  },
];

export const policeAlerts: PoliceAlert[] = [
  {
    id: "ra1", priority: "critical",
    title: "Watchlist Person Detected — Border Entry",
    titleAr: "شخص في قائمة المراقبة — دخول الحدود",
    description: "Passport PK-8823401 matched against active watchlist. Capital Airport T1. Immediate action required.",
    descriptionAr: "جواز PK-8823401 مطابق لقائمة المراقبة النشطة. مطار العاصمة T1. مطلوب إجراء فوري.",
    source: "Border Control System", time: "1 min ago", acknowledged: false, category: "Watchlist",
  },
  {
    id: "ra2", priority: "critical",
    title: "System Failure — Hotel Event Replication Lag",
    titleAr: "فشل النظام — تأخر تكرار أحداث الفنادق",
    description: "VIS replication lag exceeded 8 minutes for Hotel stream. 234 events queued. Investigate immediately.",
    descriptionAr: "تجاوز تأخر تكرار VIS 8 دقائق لتدفق الفنادق. 234 حدثاً في قائمة الانتظار.",
    source: "System Monitor", time: "4 min ago", acknowledged: false, category: "System",
  },
  {
    id: "ra3", priority: "critical",
    title: "Critical Pattern Rule Triggered — Coordinated Entry",
    titleAr: "قاعدة نمط حرجة — دخول منسق",
    description: "Rule RULE-007 (Coordinated Entry) triggered for 5 persons arriving on same flight. Score: 94.",
    descriptionAr: "قاعدة RULE-007 (دخول منسق) تفعّلت لـ 5 أشخاص وصلوا بنفس الرحلة. النتيجة: 94.",
    source: "Pattern Engine", time: "7 min ago", acknowledged: false, category: "Pattern",
  },
  {
    id: "ra4", priority: "high",
    title: "Multiple Flags — Person P-2025-00441",
    titleAr: "تنبيهات متعددة — الشخص P-2025-00441",
    description: "5 pattern alerts triggered for Khalid Al-Rashidi in 21 days. Risk score elevated to 78.",
    descriptionAr: "5 تنبيهات نمط لخالد الراشدي في 21 يوماً. ارتفع مستوى المخاطرة إلى 78.",
    source: "Risk Engine", time: "15 min ago", acknowledged: false, assignedTo: "Analyst Fatima", category: "Risk",
  },
  {
    id: "ra5", priority: "high",
    title: "Entity Suspended — Al-Noor Hotel",
    titleAr: "تعليق كيان — فندق النور",
    description: "Al-Noor Hotel (AMN-ENT-HTL-0089) suspended due to 3 consecutive compliance failures.",
    descriptionAr: "تم تعليق فندق النور (AMN-ENT-HTL-0089) بسبب 3 إخفاقات امتثال متتالية.",
    source: "Compliance Engine", time: "28 min ago", acknowledged: false, category: "Compliance",
  },
  {
    id: "ra6", priority: "high",
    title: "High Rejection Rate — Northern Car Rental",
    titleAr: "معدل رفض مرتفع — تأجير سيارات الشمال",
    description: "Northern Car Rental Co. rejection rate reached 34% (threshold: 20%). 47 events rejected today.",
    descriptionAr: "وصل معدل رفض شركة تأجير سيارات الشمال إلى 34% (الحد: 20%). 47 حدثاً مرفوضاً اليوم.",
    source: "Quality Monitor", time: "41 min ago", acknowledged: true, assignedTo: "Officer Khalid", category: "Quality",
  },
  {
    id: "ra7", priority: "medium",
    title: "New Entity Registration — Central Guesthouse",
    titleAr: "تسجيل كيان جديد — استراحة المركز",
    description: "New hotel entity registered: Central Mountain Guesthouse. Pending verification and approval.",
    descriptionAr: "تم تسجيل كيان فندقي جديد: استراحة جبال المركز. في انتظار التحقق والموافقة.",
    source: "Registration System", time: "1 hr ago", acknowledged: false, category: "Registration",
  },
  {
    id: "ra8", priority: "medium",
    title: "Batch Upload Anomaly — 18% Rejection",
    titleAr: "شذوذ في الرفع الجماعي — رفض 18%",
    description: "Batch BT-2025-440 from Capital Marriott: 18% rejection rate. Common error: missing nationality field.",
    descriptionAr: "دفعة BT-2025-440 من ماريوت العاصمة: معدل رفض 18%. الخطأ الشائع: حقل الجنسية مفقود.",
    source: "Batch Processor", time: "1.5 hr ago", acknowledged: true, category: "Quality",
  },
  {
    id: "ra9", priority: "low",
    title: "Routine Sync Complete — Mobile Stream",
    titleAr: "مزامنة روتينية مكتملة — تدفق الاتصالات",
    description: "Daily sync for Mobile Operators stream completed. 12,891 events processed. 0 errors.",
    descriptionAr: "اكتملت المزامنة اليومية لتدفق مشغلي الاتصالات. 12,891 حدثاً معالجاً. 0 أخطاء.",
    source: "Sync Engine", time: "2 hr ago", acknowledged: true, category: "Sync",
  },
  {
    id: "ra10", priority: "low",
    title: "Scheduled Report Generated",
    titleAr: "تم إنشاء التقرير المجدول",
    description: "Weekly intelligence summary report generated and distributed to 12 recipients.",
    descriptionAr: "تم إنشاء تقرير الملخص الاستخباراتي الأسبوعي وتوزيعه على 12 مستلماً.",
    source: "Report Engine", time: "3 hr ago", acknowledged: true, category: "Report",
  },
];

export const messageTemplates: MessageTemplate[] = [
  {
    id: "tpl1", name: "Monthly Compliance Reminder", nameAr: "تذكير الامتثال الشهري",
    type: "compliance",
    subject: "Monthly Compliance Submission Reminder — Al-Ameen Platform",
    body: "Dear Entity Administrator,\n\nThis is a reminder that your monthly compliance report is due by [DATE]. Please ensure all events from [MONTH] are submitted and verified.\n\nFailure to comply may result in rating downgrade.\n\nAl-Ameen Compliance Team",
    usageCount: 47, lastUsed: "2025-04-01",
  },
  {
    id: "tpl2", name: "API Key Expiry Warning", nameAr: "تحذير انتهاء مفتاح API",
    type: "announcement",
    subject: "Action Required: Your Al-Ameen API Key Expires Soon",
    body: "Dear [ENTITY_NAME],\n\nYour Al-Ameen API key (ending [KEY_SUFFIX]) will expire in [DAYS] days on [DATE].\n\nPlease log in to the Al-Ameen Portal to renew your key before expiry to avoid service interruption.\n\nAl-Ameen Technical Team",
    usageCount: 234, lastUsed: "2025-04-04",
  },
  {
    id: "tpl3", name: "Entity Suspension Notice", nameAr: "إشعار تعليق الكيان",
    type: "urgent",
    subject: "URGENT: Entity Account Suspended — Immediate Action Required",
    body: "Dear [ENTITY_NAME],\n\nYour Al-Ameen account has been suspended effective [DATE] due to [REASON].\n\nTo reinstate your account, please contact your assigned liaison officer within 48 hours.\n\nAl-Ameen Compliance Division",
    usageCount: 12, lastUsed: "2025-03-28",
  },
  {
    id: "tpl4", name: "System Maintenance Notice", nameAr: "إشعار صيانة النظام",
    type: "announcement",
    subject: "Scheduled System Maintenance — Al-Ameen Platform",
    body: "Dear Al-Ameen Users,\n\nThe Al-Ameen Platform will undergo scheduled maintenance on [DATE] from [START_TIME] to [END_TIME] local time.\n\nDuring this period, event submission will be unavailable. Please plan accordingly.\n\nAl-Ameen Operations Team",
    usageCount: 8, lastUsed: "2025-04-03",
  },
  {
    id: "tpl5", name: "New Policy Update", nameAr: "تحديث سياسة جديدة",
    type: "policy",
    subject: "Policy Update: New Document Validation Requirements",
    body: "Dear Entity Administrators,\n\nEffective [DATE], new document validation requirements will be enforced on the Al-Ameen Platform.\n\nKey changes:\n- Passport expiry must be >6 months from event date\n- Visa type must match event category\n\nPlease update your systems accordingly.\n\nAl-Ameen Policy Team",
    usageCount: 23, lastUsed: "2025-03-15",
  },
  {
    id: "tpl6", name: "Urgent Security Alert", nameAr: "تنبيه أمني عاجل",
    type: "urgent",
    subject: "URGENT SECURITY ALERT — Immediate Action Required",
    body: "PRIORITY ALERT\n\nThis is an urgent security notification from the National Police Al-Ameen Division.\n\n[ALERT_DETAILS]\n\nPlease take immediate action as directed. Contact your liaison officer if you require assistance.\n\nNational Police Al-Ameen Security Division",
    usageCount: 3, lastUsed: "2025-02-20",
  },
];

export const sentMessages: SentMessage[] = [
  { id: "sm1", subject: "Monthly Compliance Reminder — April 2025", type: "compliance", recipients: "All Hotel Entities (284)", sentAt: "2025-04-01 09:00", sent: 284, delivered: 281, read: 203, total: 284 },
  { id: "sm2", subject: "API v2.1 Release Notes", type: "announcement", recipients: "All Entities (1,203)", sentAt: "2025-03-30 14:00", sent: 1203, delivered: 1198, read: 891, total: 1203 },
  { id: "sm3", subject: "URGENT: Watchlist Update — April 2025", type: "urgent", recipients: "All Analysts (47)", sentAt: "2025-03-28 08:30", sent: 47, delivered: 47, read: 45, total: 47 },
  { id: "sm4", subject: "New Document Validation Policy", type: "policy", recipients: "Capital Governorate (312)", sentAt: "2025-03-25 11:00", sent: 312, delivered: 308, read: 234, total: 312 },
  { id: "sm5", subject: "Scheduled Maintenance — April 5", type: "announcement", recipients: "All Entities (1,203)", sentAt: "2025-04-03 16:00", sent: 1203, delivered: 1201, read: 1089, total: 1203 },
];

export const alertRules: AlertRule[] = [
  {
    id: "ar1",
    name: "High-Risk Person New Event",
    nameAr: "حدث جديد لشخص عالي المخاطرة",
    enabled: true,
    conditions: [
      { field: "person.riskScore", operator: ">", value: "75" },
      { field: "event.type", operator: "=", value: "any", connector: "AND" },
    ],
    actions: [
      { type: "Push Notification", target: "Assigned Analyst", channel: "in-app" },
      { type: "Email Alert", target: "Duty Officer", channel: "email" },
    ],
    triggerCount: 234, lastTriggered: "2025-04-05 14:22", priority: "high",
  },
  {
    id: "ar2",
    name: "Entity High Rejection Rate",
    nameAr: "معدل رفض مرتفع للكيان",
    enabled: true,
    conditions: [
      { field: "entity.rejectionRate", operator: ">", value: "20%", connector: "AND" },
      { field: "entity.status", operator: "=", value: "active" },
    ],
    actions: [
      { type: "In-App Alert", target: "Entity Admin", channel: "in-app" },
      { type: "Email Notice", target: "Entity Admin + Police Compliance", channel: "email" },
    ],
    triggerCount: 47, lastTriggered: "2025-04-05 11:30", priority: "high",
  },
  {
    id: "ar3",
    name: "Pattern Rule Triggered",
    nameAr: "تفعّل قاعدة نمط",
    enabled: true,
    conditions: [
      { field: "patternRule.triggered", operator: "=", value: "true" },
    ],
    actions: [
      { type: "Route per Rule Config", target: "Rule-Assigned Analyst", channel: "in-app" },
      { type: "SMS Alert", target: "Duty Officer (if critical)", channel: "sms" },
    ],
    triggerCount: 891, lastTriggered: "2025-04-05 14:07", priority: "critical",
  },
  {
    id: "ar4",
    name: "VIS Replication Lag",
    nameAr: "تأخر تكرار VIS",
    enabled: true,
    conditions: [
      { field: "vis.replicationLag", operator: ">", value: "5 min" },
    ],
    actions: [
      { type: "Critical Alert", target: "System Admin", channel: "in-app" },
      { type: "SMS + Email", target: "System Admin + CTO", channel: "sms" },
    ],
    triggerCount: 8, lastTriggered: "2025-04-05 04:22", priority: "critical",
  },
  {
    id: "ar5",
    name: "Watchlist Match at Border",
    nameAr: "تطابق قائمة المراقبة عند الحدود",
    enabled: true,
    conditions: [
      { field: "person.watchlistStatus", operator: "=", value: "active" },
      { field: "event.stream", operator: "=", value: "border", connector: "AND" },
    ],
    actions: [
      { type: "Critical Push", target: "Border Officer + Command", channel: "in-app" },
      { type: "SMS Alert", target: "Duty Commander", channel: "sms" },
    ],
    triggerCount: 12, lastTriggered: "2025-04-05 06:42", priority: "critical",
  },
  {
    id: "ar6",
    name: "New Entity Registration",
    nameAr: "تسجيل كيان جديد",
    enabled: true,
    conditions: [
      { field: "entity.status", operator: "=", value: "pending_verification" },
    ],
    actions: [
      { type: "In-App Notification", target: "Registration Officer", channel: "in-app" },
      { type: "Email Summary", target: "Compliance Team", channel: "email" },
    ],
    triggerCount: 156, lastTriggered: "2025-04-05 10:15", priority: "medium",
  },
  {
    id: "ar7",
    name: "API Key Expiry Warning",
    nameAr: "تحذير انتهاء مفتاح API",
    enabled: true,
    conditions: [
      { field: "apiKey.daysToExpiry", operator: "<", value: "7" },
    ],
    actions: [
      { type: "In-App Warning", target: "Entity Admin", channel: "in-app" },
      { type: "Email Reminder", target: "Entity Admin", channel: "email" },
    ],
    triggerCount: 89, lastTriggered: "2025-04-04 08:00", priority: "medium",
  },
];

export const notifPreferences: Record<string, Record<string, boolean>> = {
  "Event Accepted":    { "in-app": true,  "email": false, "sms": false },
  "Event Rejected":   { "in-app": true,  "email": true,  "sms": false },
  "Batch Complete":   { "in-app": true,  "email": true,  "sms": false },
  "System Maintenance":{ "in-app": true, "email": true,  "sms": true  },
  "API Updates":      { "in-app": true,  "email": false, "sms": false },
  "Rating Change":    { "in-app": true,  "email": true,  "sms": false },
  "User Added":       { "in-app": true,  "email": true,  "sms": false },
  "API Key Expiry":   { "in-app": true,  "email": true,  "sms": true  },
  "Password Change":  { "in-app": true,  "email": true,  "sms": true  },
};
