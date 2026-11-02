/**
 * Al-Ameen Integration Workshop — Stub API Server
 *
 * Implements every endpoint defined in docs/AlAmeen-Integration-API-Map.md
 * using the sample fixtures in docs/samples/. All state (hit actions, alert
 * acks, case updates) is held in memory — restart the server to reset.
 *
 * Start: cd server && npm install && npm run dev
 * Port:  3001  (portal on 3004 → CORS configured for http://localhost:3004)
 */

import express from 'express';
import cors    from 'cors';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);
const PORT      = process.env.PORT ?? 3001;

// ── Load sample fixtures ──────────────────────────────────────────────────────

const apisMsg  = JSON.parse(readFileSync(path.join(__dirname, '../docs/samples/apis-sample-WY456.json'), 'utf8'));
const pnrMsg   = JSON.parse(readFileSync(path.join(__dirname, '../docs/samples/pnr-sample-WY456.json'),  'utf8'));

/** Parse the Interpol CSV into objects */
function parseCsv(raw) {
  const [header, ...rows] = raw.trim().split('\n');
  const keys = header.split(',');
  return rows.map(row => {
    const vals = row.match(/(".*?"|[^,]+)(?=,|$)/g) ?? [];
    return Object.fromEntries(keys.map((k, i) => [k.trim(), (vals[i] ?? '').replace(/^"|"$/g, '').trim()]));
  });
}
const watchlistRows = parseCsv(
  readFileSync(path.join(__dirname, '../docs/samples/watchlist-sample-interpol.csv'), 'utf8')
);

// ── Seed state ────────────────────────────────────────────────────────────────

// Checkpoints — 8 Oman border posts
let checkpoints = [
  { id:'MCT-T1', name:'Muscat T1',      nameAr:'مسقط المبنى الأول',  type:'AIR', status:'GREEN',  queue:12, throughputH:842 },
  { id:'MCT-T2', name:'Muscat T2',      nameAr:'مسقط المبنى الثاني', type:'AIR', status:'GREEN',  queue:8,  throughputH:610 },
  { id:'MCT-CG', name:'Seeb Cargo',     nameAr:'شحن السيب',           type:'AIR', status:'AMBER',  queue:34, throughputH:204 },
  { id:'HCT-L1', name:'Hatta Crossing', nameAr:'معبر حتا',            type:'LAND',status:'GREEN',  queue:5,  throughputH:91  },
  { id:'SAL-L1', name:'Al-Salamah',     nameAr:'معبر السلامة',        type:'LAND',status:'GREEN',  queue:7,  throughputH:78  },
  { id:'MUS-L1', name:'Musandam Port',  nameAr:'ميناء مسندم',         type:'LAND',status:'RED',    queue:2,  throughputH:38  },
  { id:'SLL-S1', name:'Salalah Port',   nameAr:'ميناء صلالة',         type:'SEA', status:'GREEN',  queue:0,  throughputH:122 },
  { id:'SOH-S1', name:'Sohar Port',     nameAr:'ميناء صحار',          type:'SEA', status:'GREEN',  queue:0,  throughputH:97  },
];

// Alerts feed
let alerts = [
  { id:'ALT-001', checkpointId:'MCT-T1', type:'HIT_FIRED',       riskLevel:'CRITICAL', flight:'WY456', passenger:'Ahmed Khaleel', watchlist:'INTERPOL Red',     confidence:0.91, firedAt:'2026-11-02T13:52:00Z', status:'OPEN' },
  { id:'ALT-002', checkpointId:'MCT-CG', type:'CARGO_FLAG',       riskLevel:'HIGH',     flight:null,    passenger:null,            watchlist:'Customs Restrict', confidence:null, firedAt:'2026-11-02T13:40:00Z', status:'OPEN' },
  { id:'ALT-003', checkpointId:'MUS-L1', type:'OVERSTAY',         riskLevel:'HIGH',     flight:null,    passenger:'Ravi Patel',    watchlist:'Overstay',        confidence:null, firedAt:'2026-11-02T13:28:00Z', status:'OPEN' },
  { id:'ALT-004', checkpointId:'MCT-T2', type:'DOC_NEAR_EXPIRY',  riskLevel:'MEDIUM',   flight:'WY456', passenger:'Thanh Hoa Nguyen', watchlist:null,            confidence:null, firedAt:'2026-11-02T13:45:00Z', status:'OPEN' },
  { id:'ALT-005', checkpointId:'MCT-T1', type:'GO_SHOW',          riskLevel:'LOW',      flight:'WY456', passenger:'Mohammad Rahman', watchlist:null,             confidence:null, firedAt:'2026-11-02T13:47:00Z', status:'OPEN' },
];

// Target match queue (hits) — seeded from portal mock data
let hits = [
  {
    id:'TH-001', status:'PENDING', confidence:0.91, riskLevel:'CRITICAL',
    matchedMinsAgo:8, flight:'WY456', fromCode:'AMM', toCode:'MCT', eta:'14:35', seat:'22A',
    targetId:'WL-8841', targetName:'Ahmad Khalil', watchlistSrc:'INTERPOL Red',
    targetNat:'JOR', targetDOB:'1981-03-15', targetDoc:'JO4492011',
    targetRisk:'Terrorism financing, cross-border funds movement',
    travelerName:'Ahmed Khaleel', travelerNat:'SYR', travelerDOB:'1981-03-15', travelerDoc:'SY7721039',
    factors:[
      { label:'Name Similarity',      score:94 },
      { label:'Date of Birth',        score:100 },
      { label:'Nationality Proximity',score:72  },
      { label:'Document Pattern',     score:58  },
    ],
    actionLog:[],
  },
  {
    id:'TH-002', status:'PENDING', confidence:0.78, riskLevel:'HIGH',
    matchedMinsAgo:23, flight:'WY102', fromCode:'CAI', toCode:'MCT', eta:'16:50', seat:'14C',
    targetId:'WL-3312', targetName:'Fatima Al-Rashidi', watchlistSrc:'UN Consolidated',
    targetNat:'EGY', targetDOB:'1975-11-02', targetDoc:'EG8812445',
    targetRisk:'Sanctions evasion, smuggling network',
    travelerName:'Fatimah Rashidy', travelerNat:'TUN', travelerDOB:'1975-11-07', travelerDoc:'TU5591223',
    factors:[
      { label:'Name Similarity',      score:82 },
      { label:'Date of Birth',        score:75 },
      { label:'Nationality Proximity',score:55  },
      { label:'Document Pattern',     score:40  },
    ],
    actionLog:[],
  },
  {
    id:'TH-003', status:'CONFIRMED', confidence:0.95, riskLevel:'CRITICAL',
    matchedMinsAgo:91, flight:'EK208', fromCode:'DXB', toCode:'MCT', eta:'11:20', seat:'5F',
    targetId:'WL-0019', targetName:'Hassan Al-Mukhtar', watchlistSrc:'MOI Priority',
    targetNat:'IRQ', targetDOB:'1969-07-30', targetDoc:'IQ1100329',
    targetRisk:'Arms trafficking, threat to national security',
    travelerName:'Hassan Al Mukhtar', travelerNat:'IRQ', travelerDOB:'1969-07-30', travelerDoc:'IQ1100329',
    factors:[
      { label:'Name Similarity',      score:97 },
      { label:'Date of Birth',        score:100 },
      { label:'Nationality Proximity',score:100 },
      { label:'Document Pattern',     score:100 },
    ],
    actionLog:[{ actor:'OFC-2024-0031', action:'CONFIRM', reason:'Exact document match', ts:'2026-11-02T11:21:00Z' }],
  },
  {
    id:'TH-004', status:'PENDING', confidence:0.65, riskLevel:'MEDIUM',
    matchedMinsAgo:4, flight:'EK202', fromCode:'DXB', toCode:'MCT', eta:'15:10', seat:'31B',
    targetId:'WL-5572', targetName:'Mohammed Salim', watchlistSrc:'GCC Watch',
    targetNat:'BGD', targetDOB:'1988-04-20', targetDoc:'BD3310822',
    targetRisk:'Human trafficking intelligence',
    travelerName:'Mohamed Salem', travelerNat:'PAK', travelerDOB:'1987-09-11', travelerDoc:'PK9934001',
    factors:[
      { label:'Name Similarity',      score:71 },
      { label:'Date of Birth',        score:42 },
      { label:'Nationality Proximity',score:48  },
      { label:'Document Pattern',     score:30  },
    ],
    actionLog:[],
  },
];

// Cases — Kanban lanes
let cases = [
  { id:'CASE-001', hitId:'TH-001', title:'Interpol Red — WY456 (Seat 22A)', lane:'OPEN',         priority:'CRITICAL', assignee:'OFC-2024-0042', createdAt:'2026-11-02T13:52:00Z', updatedAt:'2026-11-02T13:52:00Z', notes:[], disposition:null },
  { id:'CASE-002', hitId:'TH-003', title:'MOI Priority — EK208 (Seat 5F)',  lane:'INVESTIGATING', priority:'CRITICAL', assignee:'OFC-2024-0031', createdAt:'2026-11-02T11:18:00Z', updatedAt:'2026-11-02T11:21:00Z', notes:['Identity confirmed against MOI DB'], disposition:null },
  { id:'CASE-003', hitId:'TH-002', title:'UN Sanctions — WY102 (Seat 14C)', lane:'PENDING_REVIEW',priority:'HIGH',     assignee:'OFC-2024-0018', createdAt:'2026-11-02T13:30:00Z', updatedAt:'2026-11-02T14:00:00Z', notes:[], disposition:null },
  { id:'CASE-004', hitId:null,     title:'Cargo hold discrepancy — MCT-CG',  lane:'CLOSED',        priority:'MEDIUM',   assignee:'OFC-2024-0009', createdAt:'2026-11-01T09:00:00Z', updatedAt:'2026-11-01T11:30:00Z', notes:['Manifest error, cleared by customs supervisor'], disposition:'FALSE_POSITIVE' },
];

// Watchlist summary (backed by the CSV rows as targets)
const watchlists = [
  { id:'wl-006', name:'Interpol Red Notices', nameAr:'نشرات الإنتربول الحمراء', type:'interpol', targetCount:watchlistRows.length, hitsToday:1, hitsTotal:12, active:true, lastSyncAt:'2026-11-02T06:00:00Z' },
  { id:'wl-007', name:'Netherlands Sanctions', nameAr:'قائمة العقوبات الهولندية', type:'sanctions', targetCount:485, hitsToday:0, hitsTotal:3, active:true, lastSyncAt:'2026-11-02T08:00:00Z' },
  { id:'wl-001', name:'National Security',    nameAr:'الأمن الوطني', type:'national_security', targetCount:142, hitsToday:2, hitsTotal:89, active:true, lastSyncAt:'2026-11-02T00:00:00Z' },
];

// ── App setup ─────────────────────────────────────────────────────────────────

const app = express();
app.use(cors({ origin: ['http://localhost:3004', 'http://localhost:3003', 'http://localhost:5173', 'https://alameen.tech'] }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString().slice(11,19)} ${req.method} ${req.path}`);
  next();
});

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post('/auth/token', (req, res) => {
  const { username } = req.body ?? {};
  // Stub: accept any username/password, return a fake JWT payload
  const payload = {
    access_token: `stub.${Buffer.from(JSON.stringify({ sub: username ?? 'OFC-DEMO', roles: ['SUPERVISOR'], iat: Date.now() })).toString('base64')}.sig`,
    token_type:   'Bearer',
    expires_in:   3600,
    roles:        ['SUPERVISOR'],
    officerId:    username ?? 'OFC-DEMO',
  };
  res.json(payload);
});

// ── Services Dashboard ────────────────────────────────────────────────────────

const services = [
  {
    id:'WY456-20261102', flightNo:'WY456', airline:'Oman Air', origin:'AMM', dest:'MCT',
    scheduledDep:'2026-11-02T12:15:00Z', scheduledArr:'2026-11-02T14:35:00Z',
    status:'ACTIVE', paxTotal:10, paxBoarded:8, paxNoShow:1, paxGoShow:1,
    hitCount:1, riskLevel:'CRITICAL',
    manifest: apisMsg.passengers.map(p => ({
      seq:p.seq, name:`${p.givenNames} ${p.surname}`, nationality:p.nationality,
      docNumber:p.docNumber, seatNo:p.seatNo, boardingStatus:p.boardingStatus,
      bagCount:p.bagCount, riskIndicator:p.riskIndicator,
    })),
  },
  {
    id:'WY102-20261102', flightNo:'WY102', airline:'Oman Air', origin:'CAI', dest:'MCT',
    scheduledDep:'2026-11-02T14:30:00Z', scheduledArr:'2026-11-02T16:50:00Z',
    status:'ACTIVE', paxTotal:156, paxBoarded:154, paxNoShow:0, paxGoShow:2,
    hitCount:1, riskLevel:'HIGH', manifest:[],
  },
  {
    id:'EK208-20261102', flightNo:'EK208', airline:'Emirates', origin:'DXB', dest:'MCT',
    scheduledDep:'2026-11-02T09:00:00Z', scheduledArr:'2026-11-02T11:20:00Z',
    status:'LANDED', paxTotal:212, paxBoarded:212, paxNoShow:0, paxGoShow:0,
    hitCount:1, riskLevel:'CRITICAL', manifest:[],
  },
  {
    id:'EK202-20261102', flightNo:'EK202', airline:'Emirates', origin:'DXB', dest:'MCT',
    scheduledDep:'2026-11-02T13:00:00Z', scheduledArr:'2026-11-02T15:10:00Z',
    status:'ACTIVE', paxTotal:189, paxBoarded:187, paxNoShow:1, paxGoShow:1,
    hitCount:1, riskLevel:'MEDIUM', manifest:[],
  },
];

app.get('/api/v1/services', (req, res) => {
  const { riskLevel, status, page=1, pageSize=10 } = req.query;
  let rows = [...services];
  if (riskLevel) rows = rows.filter(s => s.riskLevel === riskLevel.toUpperCase());
  if (status)    rows = rows.filter(s => s.status    === status.toUpperCase());
  const start = (Number(page)-1) * Number(pageSize);
  res.json({ data: rows.slice(start, start+Number(pageSize)), total: rows.length, page: Number(page) });
});

app.get('/api/v1/services/:id', (req, res) => {
  const svc = services.find(s => s.id === req.params.id);
  if (!svc) return res.status(404).json({ error: 'Service not found' });
  res.json(svc);
});

// APIS ingest (workshop demo — stores in memory, returns summary)
app.post('/api/v1/flights/:flightId/apis', (req, res) => {
  const { passengers=[] } = req.body ?? {};
  console.log(`  APIS ingest: ${req.params.flightId} — ${passengers.length} pax`);
  res.status(202).json({ accepted: passengers.length, flightId: req.params.flightId, processedAt: new Date().toISOString() });
});

app.post('/api/v1/flights/:flightId/pnr', (req, res) => {
  const { passengers=[] } = req.body ?? {};
  console.log(`  PNR ingest: ${req.params.flightId} — ${passengers.length} records`);
  res.status(202).json({ accepted: passengers.length, flightId: req.params.flightId, processedAt: new Date().toISOString() });
});

// ── Border Dashboard ──────────────────────────────────────────────────────────

app.get('/api/v1/checkpoints', (_req, res) => {
  res.json({ data: checkpoints, fetchedAt: new Date().toISOString() });
});

app.get('/api/v1/checkpoints/alerts', (req, res) => {
  const { status } = req.query;
  const rows = status ? alerts.filter(a => a.status === status.toUpperCase()) : alerts;
  res.json({ data: rows, total: rows.length });
});

app.get('/api/v1/checkpoints/stats', (_req, res) => {
  // 8-hour hourly throughput for Muscat T1
  const base = [142,188,211,240,198,175,163,201];
  const hours = Array.from({length:8}, (_,i) => ({
    hour: `${String(7+i).padStart(2,'0')}:00`, throughput: base[i],
  }));
  res.json({ checkpointId:'MCT-T1', date:'2026-11-02', hours });
});

app.post('/api/v1/checkpoints/alerts/:id/acknowledge', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error:'Alert not found' });
  alert.status = 'ACKNOWLEDGED';
  alert.acknowledgedAt = new Date().toISOString();
  alert.acknowledgedBy = req.body?.officerId ?? 'OFC-DEMO';
  res.json(alert);
});

// ── Watchlist ─────────────────────────────────────────────────────────────────

app.get('/api/v1/watchlist', (_req, res) => {
  res.json({ data: watchlists, total: watchlists.length });
});

app.get('/api/v1/watchlist/:id/targets', (req, res) => {
  const { page=1, pageSize=25 } = req.query;
  if (req.params.id !== 'wl-006') {
    return res.json({ data:[], total:0, page:1, _note:'Only wl-006 (Interpol) is seeded in stub' });
  }
  const start = (Number(page)-1) * Number(pageSize);
  const data  = watchlistRows.slice(start, start+Number(pageSize)).map((r,i) => ({
    id: `TGT-${String(i+1).padStart(3,'0')}`,
    externalId: r.externalId,
    name: `${r.surname}, ${r.givenNames}`,
    dob: r.dob, nationality: r.nationality,
    docNumber: r.docNumber || null, docType: r.docType || null,
    riskCategory: r.riskCategory,
    designationRef: r.designationRef,
    sourceAuthority: r.sourceAuthority,
    effectiveDate: r.effectiveDate,
    active: r.active === 'true',
    aliases: r.aliases ? r.aliases.split(';').map(s=>s.trim()) : [],
    remarks: r.remarks,
  }));
  res.json({ data, total: watchlistRows.length, page: Number(page) });
});

app.post('/api/v1/watchlist/sync', (req, res) => {
  const { sourceId, records=[] } = req.body ?? {};
  console.log(`  Watchlist sync: ${sourceId} — ${records.length} records`);
  res.status(202).json({ sourceId, accepted: records.length, syncedAt: new Date().toISOString() });
});

app.post('/api/v1/watchlist/import', (req, res) => {
  // multipart not needed for stub — just acknowledge
  res.status(202).json({ accepted: true, preview: { added: 6842, updated: 12, errors: 0 }, importId: `IMP-${Date.now()}` });
});

// ── Target Match ──────────────────────────────────────────────────────────────

app.get('/api/v1/hits', (req, res) => {
  const { status, page=1, pageSize=10 } = req.query;
  let rows = hits;
  if (status) rows = rows.filter(h => h.status === status.toUpperCase());
  const start = (Number(page)-1)*Number(pageSize);
  // Return without actionLog in list view
  const data  = rows.slice(start, start+Number(pageSize)).map(({actionLog:_, ...h}) => h);
  res.json({ data, total: rows.length, page: Number(page) });
});

app.get('/api/v1/hits/:id', (req, res) => {
  const hit = hits.find(h => h.id === req.params.id);
  if (!hit) return res.status(404).json({ error:'Hit not found' });
  // Enrich TH-001 with PNR data
  if (hit.id === 'TH-001') {
    const pnrRecord = pnrMsg.passengers.find(p => p.pnrLocator === 'HXKP91');
    return res.json({ ...hit, pnr: pnrRecord ?? null });
  }
  res.json(hit);
});

app.post('/api/v1/hits/:id/action', (req, res) => {
  const hit = hits.find(h => h.id === req.params.id);
  if (!hit) return res.status(404).json({ error:'Hit not found' });
  const { action, reason, deferUntil, officerId='OFC-DEMO' } = req.body ?? {};
  const allowed = ['FALSE_POSITIVE','ESCALATE','CONFIRM','DEFER'];
  if (!allowed.includes(action)) return res.status(400).json({ error:`action must be one of ${allowed.join(', ')}` });

  const statusMap = { CONFIRM:'CONFIRMED', FALSE_POSITIVE:'FALSE_POSITIVE', ESCALATE:'ESCALATED', DEFER:'DEFERRED' };
  hit.status = statusMap[action];
  hit.actionLog.push({ actor:officerId, action, reason:reason??null, deferUntil:deferUntil??null, ts:new Date().toISOString() });

  // Auto-create / update matching case
  const caseRec = cases.find(c => c.hitId === hit.id);
  if (caseRec) {
    if (action === 'ESCALATE') caseRec.lane = 'INVESTIGATING';
    if (action === 'CONFIRM')  caseRec.lane = 'PENDING_REVIEW';
    if (action === 'FALSE_POSITIVE') { caseRec.lane = 'CLOSED'; caseRec.disposition = 'FALSE_POSITIVE'; }
    caseRec.updatedAt = new Date().toISOString();
  }

  res.json({ hit, case: caseRec ?? null });
});

// ── Search ────────────────────────────────────────────────────────────────────

app.get('/api/v1/search', (req, res) => {
  const { q='', domain='events', mode='general', page=1, pageSize=25 } = req.query;
  // Stub: search the APIS manifest for the query string
  const lower = String(q).toLowerCase();
  const manifestHits = apisMsg.passengers
    .filter(p =>
      p.surname.toLowerCase().includes(lower) ||
      p.givenNames.toLowerCase().includes(lower) ||
      p.docNumber.toLowerCase().includes(lower) ||
      p.nationality.toLowerCase().includes(lower)
    )
    .map(p => ({
      id: `SR-${p.seq}`,
      domain,
      matchType: p.docNumber.toLowerCase().includes(lower) ? 'EXACT' : (mode==='phonetic' ? 'PHONETIC' : 'EXACT'),
      name: `${p.givenNames} ${p.surname}`,
      nationality: p.nationality,
      dob: p.dob,
      docNumber: p.docNumber,
      riskLevel: p.riskIndicator === 'WATCHLIST_HIT' ? 'CRITICAL' : p.riskIndicator === 'NO_SHOW' ? 'HIGH' : 'LOW',
      riskScore: p.riskIndicator === 'WATCHLIST_HIT' ? 91 : 10,
      hitCount: p.riskIndicator === 'WATCHLIST_HIT' ? 1 : 0,
      flight: apisMsg.flightNo,
      route: `${apisMsg.originIata}→${apisMsg.destIata}`,
      eventType: 'APIS',
      eventDate: apisMsg.scheduledArr.slice(0,10),
      location: apisMsg.destIata,
    }));
  const start = (Number(page)-1)*Number(pageSize);
  res.json({ results: manifestHits.slice(start, start+Number(pageSize)), total: manifestHits.length, domain, query: q, page: Number(page) });
});

// ── OSINT Risk Engine ─────────────────────────────────────────────────────────

app.get('/api/v1/risk/queue', (_req, res) => {
  res.json({
    data: [
      {
        id:'RSK-001', entityId:'SR-3', name:'Ahmed Khaleel', nationality:'SYR', flight:'WY456',
        riskScore:91, riskLevel:'CRITICAL', status:'PENDING_REVIEW',
        topFactors:[
          { label:'Watchlist match — INTERPOL Red', contribution:40 },
          { label:'One-way ticket, cash payment',   contribution:22 },
          { label:'AMM→MCT→BKK transit pattern',    contribution:18 },
          { label:'Phone linked to known facilitator', contribution:11 },
        ],
        coverageSources:['APIS','PNR','INTERPOL','OSINT_SOCIAL','BORDER_HISTORY'],
        modelConfidence:0.91,
        queuedAt:'2026-11-02T13:52:00Z',
      },
      {
        id:'RSK-002', entityId:'SR-9', name:'Kwame Boateng Osei', nationality:'GHA', flight:'WY456',
        riskScore:62, riskLevel:'HIGH', status:'PENDING_REVIEW',
        topFactors:[
          { label:'No-show with checked bag (ICAO Annex 17)', contribution:55 },
          { label:'Prior irregular travel pattern',            contribution:7  },
        ],
        coverageSources:['APIS','BORDER_HISTORY'],
        modelConfidence:0.74,
        queuedAt:'2026-11-02T13:48:00Z',
      },
    ],
    total: 2,
  });
});

app.get('/api/v1/risk/:entityId', (req, res) => {
  if (req.params.entityId !== 'SR-3') {
    return res.status(404).json({ error:'Entity not in risk queue' });
  }
  res.json({
    entityId:'SR-3', name:'Ahmed Khaleel', nationality:'SYR', dob:'1981-03-15', docNumber:'SY7721039',
    riskScore:91, riskLevel:'CRITICAL', modelVersion:'ThreatScore-v2.4',
    factors:[
      { type:'WATCHLIST', label:'INTERPOL Red Notice — Ahmad Khalil (JO4492011)', contribution:40, source:'INTERPOL', confidence:'HIGH' },
      { type:'PNR',       label:'One-way ticket, cash at AMM counter (T-26h)',   contribution:22, source:'AMADEUS_GDS', confidence:'HIGH' },
      { type:'TPI',       label:'AMM→MCT→BKK route — 8 prior occurrences (co-traveler)', contribution:18, source:'TPI_ENGINE', confidence:'MEDIUM' },
      { type:'OSINT',     label:'Phone +963944112233 linked to known facilitator', contribution:11, source:'OSINT_SOCIAL', confidence:'MEDIUM' },
    ],
    ruleTrace:[
      { ruleId:'R-WL-001', ruleName:'Watchlist Name Phonetic Match', threshold:'score≥0.80', observed:'score=0.94', fired:true },
      { ruleId:'R-DOC-003', ruleName:'Travel Document Country Risk', threshold:'tier≥2',   observed:'SYR tier=3',  fired:true },
      { ruleId:'R-PAY-001', ruleName:'Cash purchase within 48h',    threshold:'leadTime≤2d', observed:'leadTime=1d', fired:true },
    ],
    sourceCoverage:[
      { source:'APIS', covered:true }, { source:'PNR', covered:true },
      { source:'INTERPOL', covered:true }, { source:'BORDER_HISTORY', covered:false },
      { source:'HOTEL', covered:false }, { source:'OSINT_SOCIAL', covered:true },
    ],
    assessedAt:'2026-11-02T13:52:30Z',
  });
});

// ── Case Management ───────────────────────────────────────────────────────────

const LANES = ['OPEN','INVESTIGATING','PENDING_REVIEW','CLOSED'];

app.get('/api/v1/cases', (req, res) => {
  const { lane } = req.query;
  const rows = lane ? cases.filter(c => c.lane === lane.toUpperCase()) : cases;
  res.json({ data: rows, total: rows.length });
});

app.put('/api/v1/cases/:id/status', (req, res) => {
  const caseRec = cases.find(c => c.id === req.params.id);
  if (!caseRec) return res.status(404).json({ error:'Case not found' });
  const { lane } = req.body ?? {};
  if (!LANES.includes(lane)) return res.status(400).json({ error:`lane must be one of ${LANES.join(', ')}` });
  caseRec.lane      = lane;
  caseRec.updatedAt = new Date().toISOString();
  res.json(caseRec);
});

app.post('/api/v1/cases/:id/resolve', (req, res) => {
  const caseRec = cases.find(c => c.id === req.params.id);
  if (!caseRec) return res.status(404).json({ error:'Case not found' });
  const { disposition, notes, officerId='OFC-DEMO' } = req.body ?? {};
  const allowed = ['CONFIRMED_THREAT','FALSE_POSITIVE','INSUFFICIENT_EVIDENCE','TRANSFERRED'];
  if (!allowed.includes(disposition)) return res.status(400).json({ error:`disposition must be one of ${allowed.join(', ')}` });
  caseRec.lane        = 'CLOSED';
  caseRec.disposition = disposition;
  caseRec.resolvedBy  = officerId;
  caseRec.resolvedAt  = new Date().toISOString();
  caseRec.updatedAt   = new Date().toISOString();
  if (notes) caseRec.notes.push(notes);
  res.json(caseRec);
});

// ── Travel Pattern Intelligence ───────────────────────────────────────────────

app.get('/api/v1/tpi/co-traveler', (_req, res) => {
  res.json({
    data:[{
      id:'CT-001', passengerA:{ name:'Alaa Hassan', nationality:'BGD', doc:'BD4401122' },
      passengerB:{ name:'Ahmad Khalil', nationality:'BGD', doc:'BD4401133' },
      occurrences:27, sharedRoute:'AMM→MCT→BKK', lastSeen:'2026-11-02', confidence:'HIGH',
      recommendation:'SECONDARY_SCREENING',
    }],
    total:1,
  });
});

app.get('/api/v1/tpi/trafficking', (_req, res) => {
  res.json({
    data:[{
      id:'TC-001', name:'Fatima Muse Omar', age:22, nationality:'ETH',
      score:92, indicatorsChecked:8, indicatorsFired:6,
      topIndicators:['New passport (<2 months)','One-way ticket','Onward segment booked in-transit','Phone linked to facilitator'],
      facilitator:{ name:'Yusuf Ibrahim', travelledAheadHours:12 },
      recommendation:'REFER_COUNTER_TRAFFICKING',
    }],
    total:1,
  });
});

app.get('/api/v1/tpi/document-anomaly', (_req, res) => {
  res.json({
    data:[{
      id:'DA-001', description:'Passport swap airside — same face, two documents',
      biometricSimilarity:0.91, documentA:'OM3301122 (Omani passport)',
      documentB:'LB8800441 (Lebanese passport)', detectedAt:'2026-11-01T22:14:00Z',
      action:'BOARDING_HALTED',
    }],
    total:1,
  });
});

app.get('/api/v1/tpi/route-signatures', (_req, res) => {
  res.json({ data:[], total:0, _note:'Route signature data not seeded in stub' });
});

// ── Outbound stream events (16 streams — all accept and ack) ─────────────────

const STREAMS = ['hotel','car-rental','mobile','municipality','payment','borders',
                 'health','utility','transport','education','employment','ecommerce',
                 'social','customs','marine','postal'];

for (const stream of STREAMS) {
  app.post(`/v1/events/${stream}`, (req, res) => {
    const { events=[] } = req.body ?? {};
    console.log(`  Stream ${stream}: ${events.length ?? 1} event(s)`);
    res.status(202).json({ stream, accepted: events.length || 1, receivedAt: new Date().toISOString() });
  });
}

app.get('/v1/entity/status', (_req, res) => {
  res.json({ entityId:'DEMO-ENTITY', status:'CONNECTED', lastEvent:'2026-11-02T13:00:00Z', errorRate:0 });
});

app.get('/v1/entity/events/history', (req, res) => {
  const { page=1, pageSize=20 } = req.query;
  res.json({ data:[], total:0, page:Number(page), _note:'No events submitted yet in this session' });
});

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status:'ok', version:'stub-1.0.0', uptime: process.uptime().toFixed(1)+'s', endpoints: 30 });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🟢  Al-Ameen Stub API — http://localhost:${PORT}`);
  console.log(`    Health:     GET  /health`);
  console.log(`    Auth:       POST /auth/token`);
  console.log(`    Flights:    GET  /api/v1/services`);
  console.log(`    Hits:       GET  /api/v1/hits`);
  console.log(`    Watchlist:  GET  /api/v1/watchlist`);
  console.log(`    Checkpoints:GET  /api/v1/checkpoints`);
  console.log(`    Cases:      GET  /api/v1/cases`);
  console.log(`    Search:     GET  /api/v1/search?q=Ahmed`);
  console.log(`    CORS open for: http://localhost:3004, https://alameen.tech\n`);
});
