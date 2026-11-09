import { apiFetch } from './client';

type HitStatus = 'PENDING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'ESCALATED' | 'DEFERRED';

const ACTION_MAP: Record<HitStatus, string> = {
  CONFIRMED:      'CONFIRM',
  FALSE_POSITIVE: 'FALSE_POSITIVE',
  ESCALATED:      'ESCALATE',
  DEFERRED:       'DEFER',
  PENDING:        'DEFER',
};

// Returns the stub hits array, or throws so the caller can keep its initial state.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchHits(): Promise<any[]> {
  const { data } = await apiFetch<{ data: any[]; total: number }>('/api/v1/hits?pageSize=50');
  return data;
}

export async function postHitAction(id: string, newStatus: HitStatus): Promise<void> {
  await apiFetch(`/api/v1/hits/${id}/action`, {
    method: 'POST',
    body: JSON.stringify({ action: ACTION_MAP[newStatus], officerId: 'OFC-DEMO' }),
  });
}
