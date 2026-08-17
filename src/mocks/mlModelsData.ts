export type ModelStatus  = 'DEPLOYED' | 'TRAINING' | 'DRAFT' | 'RETIRED' | 'FAILED';
export type ModelType    = 'CLASSIFICATION' | 'REGRESSION' | 'ANOMALY' | 'NLP';
export type ExportStatus = 'IDLE' | 'PENDING' | 'RUNNING' | 'DONE' | 'ERROR';

export interface ConfusionMatrix {
  tp: number; fp: number;
  fn: number; tn: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  matrix: ConfusionMatrix;
  trainingSamples: number;
  testSamples: number;
  evaluatedAt: string;
}

export interface TrainingDataExport {
  id: string;
  requestedBy: string;
  requestedAt: string;
  status: ExportStatus;
  recordCount?: number;
  fileSizeMb?: number;
  completedAt?: string;
  errorMsg?: string;
}

export interface MLModel {
  id: string;
  name: string;
  nameAr?: string;
  type: ModelType;
  status: ModelStatus;
  version: string;
  description: string;
  framework: string;
  inputFeatures: string[];
  targetVariable: string;
  metrics?: ModelMetrics;
  exports: TrainingDataExport[];
  deployedAt?: string;
  lastPrediction?: string;
  predictionCount: number;
  createdDate: string;
  createdBy: string;
  notes?: string;
}

export const ML_MODELS: MLModel[] = [
  {
    id: 'ML-001',
    name: 'Travel Risk Classifier v3',
    nameAr: 'مصنف مخاطر السفر ج3',
    type: 'CLASSIFICATION',
    status: 'DEPLOYED',
    version: '3.2.1',
    description: 'Multi-class classifier predicting risk level (low/medium/high/critical) based on travel history, document patterns, and watchlist proximity. Trained on 18 months of labeled operator decisions.',
    framework: 'XGBoost 2.0',
    inputFeatures: ['entry_count_90d', 'avg_stay_days', 'nationality_risk_index', 'doc_days_to_expiry', 'watchlist_proximity_score', 'route_risk_index', 'prior_secondary', 'alias_count'],
    targetVariable: 'risk_level',
    metrics: {
      accuracy:  0.891,
      precision: 0.876,
      recall:    0.863,
      f1:        0.869,
      auc:       0.941,
      matrix: { tp: 312, fp: 44, fn: 51, tn: 1203 },
      trainingSamples: 14200,
      testSamples: 1610,
      evaluatedAt: '2026-07-28T10:00',
    },
    exports: [
      { id: 'EX-001', requestedBy: 'analyst.a', requestedAt: '2026-07-01T09:00', status: 'DONE', recordCount: 14200, fileSizeMb: 42.3, completedAt: '2026-07-01T09:18' },
    ],
    deployedAt: '2026-07-30T08:00',
    lastPrediction: '2026-08-17T11:42',
    predictionCount: 8814,
    createdDate: '2026-04-10',
    createdBy: 'data.science',
  },
  {
    id: 'ML-002',
    name: 'Overstay Propensity Score',
    nameAr: 'درجة ميل تجاوز الإقامة',
    type: 'REGRESSION',
    status: 'DEPLOYED',
    version: '1.4.0',
    description: 'Regression model outputting 0–100 propensity score for a traveler overstaying their visa. Feeds directly into Risk Rule RR-006.',
    framework: 'LightGBM 4.1',
    inputFeatures: ['visa_type', 'nationality_overstay_rate', 'sponsor_type', 'days_since_last_visit', 'employment_record', 'return_ticket_present'],
    targetVariable: 'overstay_propensity',
    metrics: {
      accuracy:  0.834,
      precision: 0.821,
      recall:    0.849,
      f1:        0.835,
      auc:       0.912,
      matrix: { tp: 187, fp: 41, fn: 33, tn: 899 },
      trainingSamples: 8800,
      testSamples: 1160,
      evaluatedAt: '2026-06-15T14:00',
    },
    exports: [],
    deployedAt: '2026-06-20T08:00',
    lastPrediction: '2026-08-17T11:38',
    predictionCount: 5142,
    createdDate: '2026-02-20',
    createdBy: 'data.science',
  },
  {
    id: 'ML-003',
    name: 'Document Anomaly Detector',
    nameAr: 'كاشف شذوذ الوثائق',
    type: 'ANOMALY',
    status: 'DEPLOYED',
    version: '2.0.3',
    description: 'Unsupervised anomaly detection on document metadata patterns. Flags unusual MRZ encodings, chip data mismatches, and issuing-country outliers.',
    framework: 'Isolation Forest (sklearn 1.4)',
    inputFeatures: ['mrz_checksum_valid', 'chip_data_present', 'chip_vs_visual_match', 'issuing_country_volume_zscore', 'series_pattern_anomaly'],
    targetVariable: 'anomaly_score',
    metrics: {
      accuracy:  0.913,
      precision: 0.888,
      recall:    0.871,
      f1:        0.879,
      auc:       0.957,
      matrix: { tp: 98, fp: 12, fn: 15, tn: 1475 },
      trainingSamples: 22000,
      testSamples: 1600,
      evaluatedAt: '2026-08-01T09:00',
    },
    exports: [
      { id: 'EX-002', requestedBy: 'data.science', requestedAt: '2026-08-05T10:00', status: 'DONE', recordCount: 22000, fileSizeMb: 68.1, completedAt: '2026-08-05T10:31' },
    ],
    deployedAt: '2026-08-05T12:00',
    lastPrediction: '2026-08-17T11:40',
    predictionCount: 11201,
    createdDate: '2026-05-14',
    createdBy: 'data.science',
  },
  {
    id: 'ML-004',
    name: 'Name Phonetic Match Engine v2',
    nameAr: 'محرك التطابق الصوتي للأسماء ج2',
    type: 'NLP',
    status: 'TRAINING',
    version: '2.0.0-rc1',
    description: 'NLP phonetic matching model trained on Arabic-Latin transliteration pairs. Successor to v1 rule-based engine. Currently in training — expected deployment Q3 2026.',
    framework: 'Transformers (Arabic BERT fine-tune)',
    inputFeatures: ['name_latin', 'name_arabic', 'nationality', 'dob'],
    targetVariable: 'phonetic_match_confidence',
    metrics: undefined,
    exports: [],
    deployedAt: undefined,
    lastPrediction: undefined,
    predictionCount: 0,
    createdDate: '2026-07-01',
    createdBy: 'nlp.team',
    notes: 'Training started 2026-08-10. ETA 2026-09-01.',
  },
  {
    id: 'ML-005',
    name: 'Network Affiliation Detector v1',
    nameAr: 'كاشف انتماء الشبكات ج1',
    type: 'CLASSIFICATION',
    status: 'RETIRED',
    version: '1.0.0',
    description: 'Retired — superseded by the link analysis module. Detected co-travel patterns indicative of smuggling network affiliation.',
    framework: 'Random Forest (sklearn 1.2)',
    inputFeatures: ['co_traveler_id_hash', 'shared_accommodation', 'shared_transport'],
    targetVariable: 'network_flag',
    metrics: {
      accuracy: 0.74, precision: 0.71, recall: 0.68, f1: 0.69, auc: 0.80,
      matrix: { tp: 22, fp: 9, fn: 10, tn: 189 },
      trainingSamples: 2400, testSamples: 230, evaluatedAt: '2025-06-01T10:00',
    },
    exports: [],
    predictionCount: 1042,
    createdDate: '2025-01-10',
    createdBy: 'data.science',
    notes: 'Retired 2026-01-15 — Link Analysis module (Phase 2) covers this use case.',
  },
];

export const STATUS_COLORS: Record<ModelStatus, string> = {
  DEPLOYED: '#4A8E5A', TRAINING: '#D4922A', DRAFT: '#5B7494', RETIRED: '#374B61', FAILED: '#C94A5E',
};

export const MODEL_TYPE_CONFIG: Record<ModelType, { icon: string; color: string; labelEn: string }> = {
  CLASSIFICATION: { icon: 'ri-list-check-2',          color: '#4A7AA8', labelEn: 'Classification' },
  REGRESSION:     { icon: 'ri-line-chart-line',        color: '#D4922A', labelEn: 'Regression'     },
  ANOMALY:        { icon: 'ri-radar-line',             color: '#C94A5E', labelEn: 'Anomaly'        },
  NLP:            { icon: 'ri-translate-2',            color: '#A78BFA', labelEn: 'NLP'            },
};
