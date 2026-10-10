import type { SearchResult, SearchDomain, QueryCondition } from '../mocks/searchData';

const normalize = (value: unknown) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').toLowerCase().trim();
// Deterministic demo name matching; not a production identity-matching engine.
const phonetic = (value: string) => normalize(value).replace(/[^a-z\u0621-\u064a]/g, '').replace(/[aeiou]/g, '').replace(/(.)\1+/g, '$1');

export function searchRecords(rows: SearchResult[], domain: SearchDomain, query: string, usePhonetic = false) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  return rows.filter(row => row.domain === domain && tokens.every(q =>
    [row.name, row.nameAr, row.nationality, row.nationalityCode, row.docNumber, row.flight, row.route, row.location, row.watchlistName, row.hitStatus].some(v => normalize(v).includes(q)) ||
    (usePhonetic && phonetic(q).length >= 2 && row.name.split(/\s+/).some(name => phonetic(name) === phonetic(q)))
  ));
}

function fieldValue(row: SearchResult, field: string): unknown {
  switch (field) {
    case 'traveler.firstName': case 'identity.firstName': return row.name.split(' ')[0];
    case 'traveler.lastName': case 'identity.lastName': return row.name.split(' ').slice(1).join(' ');
    case 'traveler.dob': case 'identity.dob': return row.dob;
    case 'traveler.nationality': case 'identity.nationality': return [row.nationality, row.nationalityCode];
    case 'traveler.docNumber': case 'identity.docNumber': return row.docNumber;
    case 'event.flightNo': case 'service.flightNo': return row.flight;
    case 'event.origin': case 'service.origin': return row.route?.split(/→|->/)[0];
    case 'event.destination': case 'service.destination': return row.route?.split(/→|->/)[1];
    case 'event.date': case 'hit.date': case 'service.date': return row.eventDate;
    case 'event.type': return row.eventType;
    case 'event.bagCount': return row.bags?.count;
    case 'hit.status': return row.hitStatus;
    case 'hit.riskLevel': return row.riskLevel;
    case 'hit.watchlist': return row.watchlistName;
    case 'service.airline': return row.journey?.find(leg => leg.isCurrent)?.airline;
    case 'service.status': return row.eventType;
    default: return undefined;
  }
}
function matches(row: SearchResult, condition: QueryCondition) {
  const raw = fieldValue(row, condition.field);
  if (raw === undefined || !condition.value.trim()) return false;
  const q = condition.value.trim().toUpperCase() === 'TODAY' ? new Date().toISOString().slice(0,10) : normalize(condition.value);
  const values = Array.isArray(raw) ? raw : [raw];
  if (condition.operator === 'not_equals') return values.every(v => normalize(v) !== q);
  return values.some(value => {
    const v = normalize(value);
    switch (condition.operator) {
      case 'equals': return v === q;
      case 'contains': return v.includes(q);
      case 'starts_with': return v.startsWith(q);
      case 'ends_with': return v.endsWith(q);
      case 'before': return /^\d{4}-\d{2}-\d{2}$/.test(q) && v < q;
      case 'after': return /^\d{4}-\d{2}-\d{2}$/.test(q) && v > q;
      case 'greater_than': return Number.isFinite(Number(q)) && Number(v) > Number(q);
      case 'less_than': return Number.isFinite(Number(q)) && Number(v) < Number(q);
      default: return false;
    }
  });
}
export function queryRecords(rows: SearchResult[], domain: SearchDomain, conditions: QueryCondition[]) {
  if (!conditions.length || conditions.some(c => !c.value.trim())) return [];
  // AND groups bind more tightly than OR, as in the displayed query language.
  return rows.filter(row => {
    if (row.domain !== domain) return false;
    let group = matches(row, conditions[0]), result = false;
    for (const condition of conditions.slice(1)) {
      if (condition.connector === 'OR') { result ||= group; group = matches(row, condition); }
      else group = group && matches(row, condition);
    }
    return result || group;
  });
}
