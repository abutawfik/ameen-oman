import { apiFetch } from './client';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type ServiceStatus = 'BOARDING' | 'IN_FLIGHT' | 'ARRIVED' | 'DELAYED';

export interface ApiPassenger {
  name: string;
  nationality: string;
  seat: string;
  risk: RiskLevel;
  hit: boolean;
}

export interface ApiService {
  id: string;
  flight: string;
  from: string;
  to: string;
  airline: string;
  status: ServiceStatus;
  etd: string;
  eta: string;
  pax: number;
  hits: number;
  risk: RiskLevel;
  manifest?: ApiPassenger[];
}

interface StubPassenger {
  seq: number;
  name: string;
  nationality: string;
  seatNo: string;
  riskIndicator: string;
}

interface StubService {
  id: string;
  flightNo: string;
  airline: string;
  origin: string;
  dest: string;
  scheduledDep: string;
  scheduledArr: string;
  status: 'ACTIVE' | 'LANDED';
  paxTotal: number;
  paxBoarded: number;
  hitCount: number;
  riskLevel: string;
  manifest?: StubPassenger[];
}

function toHHMM(iso: string): string {
  return iso.slice(11, 16);
}

function mapStubStatus(s: StubService): ServiceStatus {
  if (s.status === 'LANDED') return 'ARRIVED';
  if (s.paxBoarded < s.paxTotal) return 'BOARDING';
  return 'IN_FLIGHT';
}

function mapPassenger(p: StubPassenger): ApiPassenger {
  const ri = p.riskIndicator ?? 'NONE';
  const risk: RiskLevel =
    ri === 'WATCHLIST_HIT'  ? 'CRITICAL' :
    ri === 'NO_SHOW'        ? 'HIGH' :
    ri === 'GO_SHOW'        ? 'MEDIUM' :
    ri === 'DOC_NEAR_EXPIRY'? 'MEDIUM' : 'LOW';
  return { name: p.name, nationality: p.nationality, seat: p.seatNo, risk, hit: ri === 'WATCHLIST_HIT' };
}

function adaptService(s: StubService): ApiService {
  return {
    id:       s.id,
    flight:   s.flightNo,
    from:     s.origin,
    to:       s.dest,
    airline:  s.airline,
    status:   mapStubStatus(s),
    etd:      toHHMM(s.scheduledDep),
    eta:      toHHMM(s.scheduledArr),
    pax:      s.paxTotal,
    hits:     s.hitCount,
    risk:     s.riskLevel as RiskLevel,
    manifest: s.manifest?.length ? s.manifest.map(mapPassenger) : undefined,
  };
}

export async function fetchServices(): Promise<ApiService[] | null> {
  try {
    const { data } = await apiFetch<{ data: StubService[] }>('/api/v1/services?pageSize=20');
    return data.map(adaptService);
  } catch {
    return null;
  }
}
