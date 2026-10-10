export function selectTargetHit<T extends { id: string }>(hits: T[], id: string | null): T | null {
  return id ? hits.find(hit => hit.id === id) ?? null : hits[0] ?? null;
}
