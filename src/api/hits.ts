import { apiFetch } from './client';
import { HITS, type TravelHit, type HitStatus } from '@/mocks/targetMatchData';

const ACTION_MAP: Record<HitStatus, string> = {
  CONFIRMED:      'CONFIRM',
  FALSE_POSITIVE: 'FALSE_POSITIVE',
  ESCALATED:      'ESCALATE',
  DEFERRED:       'DEFER',
  PENDING:        'DEFER',
};

export async function fetchHits(): Promise<TravelHit[]> {
  try {
    const { data } = await apiFetch<{ data: TravelHit[]; total: number }>('/api/v1/hits?pageSize=50');
    return data;
  } catch {
    return HITS;
  }
}

export async function postHitAction(id: string, newStatus: HitStatus): Promise<void> {
  await apiFetch(`/api/v1/hits/${id}/action`, {
    method: 'POST',
    body: JSON.stringify({ action: ACTION_MAP[newStatus], officerId: 'OFC-DEMO' }),
  });
}
