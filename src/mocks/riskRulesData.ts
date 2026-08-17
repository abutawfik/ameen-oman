export type RuleType     = 'WATCHLIST_MATCH' | 'PROFILE_MATCH' | 'DOCUMENT_VALIDATION' | 'EXTERNAL_SOURCE';
export type RuleStatus   = 'ACTIVE' | 'INACTIVE' | 'DRAFT';
export type ActionType   = 'ALERT' | 'SECONDARY_SCREENING' | 'EMAIL_NOTIFICATION' | 'WORKFLOW_TRIGGER' | 'DENY_BOARDING';
export type DecisionStatus = 'ACTIVE' | 'INACTIVE';

export interface RiskRule {
  id: string;
  name: string;
  nameAr?: string;
  type: RuleType;
  status: RuleStatus;
  weight: number;
  minScore: number;
  maxScore: number;
  activeDateFrom: string;
  activeDateTo?: string;
  locationScope: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  triggerCount: number;
  lastTriggered?: string;
}

export interface MatchDecisionRule {
  id: string;
  name: string;
  nameAr?: string;
  actionType: ActionType;
  threshold: number;
  emailRecipients: string[];
  workflowId?: string;
  status: DecisionStatus;
  description: string;
  triggerCount: number;
  lastTriggered?: string;
  createdDate: string;
}

// ── Risk Rules ─────────────────────────────────────────────────
export const RISK_RULES: RiskRule[] = [
  {
    id: 'RR-001',
    name: 'INTERPOL Red Notice Match — Critical',
    nameAr: 'تطابق النشرة الحمراء للإنتربول',
    type: 'WATCHLIST_MATCH',
    status: 'ACTIVE',
    weight: 100,
    minScore: 90,
    maxScore: 100,
    activeDateFrom: '2024-01-01',
    locationScope: 'ALL',
    description: 'Applies maximum weight when a passenger matches an INTERPOL Red Notice. Always triggers secondary screening and supervisor alert.',
    createdDate: '2024-01-01',
    modifiedDate: '2026-07-15',
    createdBy: 'admin.system',
    triggerCount: 12,
    lastTriggered: '2026-08-10',
  },
  {
    id: 'RR-002',
    name: 'National Security Watchlist Match',
    nameAr: 'تطابق قائمة الأمن الوطني',
    type: 'WATCHLIST_MATCH',
    status: 'ACTIVE',
    weight: 85,
    minScore: 75,
    maxScore: 100,
    activeDateFrom: '2024-03-01',
    locationScope: 'MCT,SLL,MUS',
    description: 'Applies high weight on national security watchlist matches. Scope limited to Oman airports only.',
    createdDate: '2024-03-01',
    modifiedDate: '2026-05-02',
    createdBy: 'admin.system',
    triggerCount: 31,
    lastTriggered: '2026-08-16',
  },
  {
    id: 'RR-003',
    name: 'High-Frequency Entry Profile Match',
    nameAr: 'تطابق نمط الدخول المتكرر',
    type: 'PROFILE_MATCH',
    status: 'ACTIVE',
    weight: 72,
    minScore: 60,
    maxScore: 85,
    activeDateFrom: '2026-01-20',
    locationScope: 'ALL',
    description: 'Linked to PRF-001. Applies score contribution when traveler matches the high-frequency entry pattern.',
    createdDate: '2026-01-20',
    modifiedDate: '2026-07-02',
    createdBy: 'analyst.a',
    triggerCount: 14,
    lastTriggered: '2026-08-14',
  },
  {
    id: 'RR-004',
    name: 'Expired Document Presented',
    nameAr: 'تقديم وثيقة منتهية الصلاحية',
    type: 'DOCUMENT_VALIDATION',
    status: 'ACTIVE',
    weight: 60,
    minScore: 50,
    maxScore: 70,
    activeDateFrom: '2024-06-01',
    locationScope: 'ALL',
    description: 'Applied when a presented travel document is expired. Triggers secondary validation queue.',
    createdDate: '2024-06-01',
    modifiedDate: '2024-06-01',
    createdBy: 'admin.system',
    triggerCount: 88,
    lastTriggered: '2026-08-17',
  },
  {
    id: 'RR-005',
    name: 'OFAC Sanctions List Match',
    nameAr: 'تطابق قائمة العقوبات OFAC',
    type: 'EXTERNAL_SOURCE',
    status: 'ACTIVE',
    weight: 95,
    minScore: 85,
    maxScore: 100,
    activeDateFrom: '2024-01-01',
    locationScope: 'ALL',
    description: 'Matches against US OFAC SDN list. External feed updated daily.',
    createdDate: '2024-01-01',
    modifiedDate: '2026-06-15',
    createdBy: 'admin.system',
    triggerCount: 8,
    lastTriggered: '2026-07-30',
  },
  {
    id: 'RR-006',
    name: 'Transit Overstay Alert',
    nameAr: 'تنبيه تجاوز إقامة العبور',
    type: 'PROFILE_MATCH',
    status: 'ACTIVE',
    weight: 88,
    minScore: 80,
    maxScore: 100,
    activeDateFrom: '2025-11-01',
    locationScope: 'MCT',
    description: 'Linked to PRF-003. Fires when a transit visa holder passes the permitted stay window.',
    createdDate: '2025-11-01',
    modifiedDate: '2026-06-20',
    createdBy: 'admin.system',
    triggerCount: 31,
    lastTriggered: '2026-08-16',
  },
  {
    id: 'RR-007',
    name: 'Biometric Mismatch',
    nameAr: 'عدم تطابق البيانات البيومترية',
    type: 'DOCUMENT_VALIDATION',
    status: 'DRAFT',
    weight: 70,
    minScore: 65,
    maxScore: 80,
    activeDateFrom: '2026-09-01',
    locationScope: 'MCT',
    description: 'Draft — pending ECS biometric integration sign-off. Will flag when live biometric does not match passport chip.',
    createdDate: '2026-08-01',
    modifiedDate: '2026-08-01',
    createdBy: 'analyst.c',
    triggerCount: 0,
  },
];

// ── Match Decision Rules ────────────────────────────────────────
export const DECISION_RULES: MatchDecisionRule[] = [
  {
    id: 'DR-001',
    name: 'Critical Score — Immediate Alert + Hold',
    nameAr: 'درجة حرجة — تنبيه فوري + إيقاف',
    actionType: 'SECONDARY_SCREENING',
    threshold: 85,
    emailRecipients: ['security.ops@rop.gov.om', 'supervisor@rop.gov.om'],
    workflowId: 'WF-HOLD',
    status: 'ACTIVE',
    description: 'Triggers immediate secondary screening and supervisor email for any combined score ≥ 85. Most urgent escalation path.',
    triggerCount: 22,
    lastTriggered: '2026-08-16',
    createdDate: '2024-01-01',
  },
  {
    id: 'DR-002',
    name: 'High Score — Email Alert to Ops',
    nameAr: 'درجة عالية — تنبيه بريد إلكتروني للعمليات',
    actionType: 'EMAIL_NOTIFICATION',
    threshold: 65,
    emailRecipients: ['ops.duty@rop.gov.om'],
    status: 'ACTIVE',
    description: 'Sends duty officer email for scores between 65–84. No hold issued but officer is alerted to review before subject exits.',
    triggerCount: 87,
    lastTriggered: '2026-08-17',
    createdDate: '2024-01-01',
  },
  {
    id: 'DR-003',
    name: 'INTERPOL Match — Workflow: Notify NCB',
    nameAr: 'تطابق إنتربول — تدفق عمل: إخطار المكتب الوطني',
    actionType: 'WORKFLOW_TRIGGER',
    threshold: 90,
    emailRecipients: ['interpol.ncb@rop.gov.om'],
    workflowId: 'WF-NCB-NOTIFY',
    status: 'ACTIVE',
    description: 'Specifically for INTERPOL rule matches ≥ 90. Triggers the NCB notification workflow and logs the incident reference.',
    triggerCount: 12,
    lastTriggered: '2026-08-10',
    createdDate: '2024-02-01',
  },
  {
    id: 'DR-004',
    name: 'Overstay Confirmed — Deny Boarding',
    nameAr: 'تأكيد تجاوز الإقامة — رفض الصعود',
    actionType: 'DENY_BOARDING',
    threshold: 88,
    emailRecipients: ['immigration@rop.gov.om'],
    workflowId: 'WF-DENY',
    status: 'ACTIVE',
    description: 'Blocks departure boarding for confirmed overstay subjects. Requires supervisor override to lift.',
    triggerCount: 5,
    lastTriggered: '2026-08-12',
    createdDate: '2025-11-15',
  },
  {
    id: 'DR-005',
    name: 'Medium Score — Alert (Monitoring Only)',
    nameAr: 'درجة متوسطة — تنبيه (مراقبة فقط)',
    actionType: 'ALERT',
    threshold: 40,
    emailRecipients: [],
    status: 'ACTIVE',
    description: 'Logs an in-system alert for scores 40–64. No email sent. Visible in the hit queue for routine review.',
    triggerCount: 204,
    lastTriggered: '2026-08-17',
    createdDate: '2024-01-01',
  },
];

export const RULE_TYPE_CONFIG: Record<RuleType, { icon: string; color: string; labelEn: string; labelAr: string }> = {
  WATCHLIST_MATCH:      { icon: 'ri-eye-line',            color: '#C94A5E', labelEn: 'Watchlist Match',      labelAr: 'تطابق قائمة' },
  PROFILE_MATCH:        { icon: 'ri-user-search-line',    color: '#D4922A', labelEn: 'Profile Match',        labelAr: 'تطابق نمط'  },
  DOCUMENT_VALIDATION:  { icon: 'ri-file-shield-2-line',  color: '#4A7AA8', labelEn: 'Document Validation',  labelAr: 'تحقق وثيقة' },
  EXTERNAL_SOURCE:      { icon: 'ri-global-line',          color: '#A78BFA', labelEn: 'External Source',      labelAr: 'مصدر خارجي' },
};

export const ACTION_TYPE_CONFIG: Record<ActionType, { icon: string; color: string; labelEn: string; labelAr: string }> = {
  ALERT:               { icon: 'ri-alarm-warning-line',  color: '#D6B47E', labelEn: 'Alert (In-System)',     labelAr: 'تنبيه داخلي'    },
  SECONDARY_SCREENING: { icon: 'ri-shield-cross-line',   color: '#C94A5E', labelEn: 'Secondary Screening',   labelAr: 'فحص ثانوي'     },
  EMAIL_NOTIFICATION:  { icon: 'ri-mail-send-line',      color: '#4A8E5A', labelEn: 'Email Notification',    labelAr: 'بريد إلكتروني'  },
  WORKFLOW_TRIGGER:    { icon: 'ri-git-branch-line',     color: '#D4922A', labelEn: 'Workflow Trigger',      labelAr: 'تشغيل سير عمل' },
  DENY_BOARDING:       { icon: 'ri-flight-takeoff-line', color: '#A78BFA', labelEn: 'Deny Boarding',         labelAr: 'رفض الصعود'    },
};
