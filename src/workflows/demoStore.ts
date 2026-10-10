type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export function readDemoRecords<T extends { id: string }>(storage: Pick<StoragePort, 'getItem'>, key: string, seed: T[]): T[] {
  const raw = storage.getItem(key);
  if (!raw) return seed;
  const records = JSON.parse(raw);
  if (!Array.isArray(records) || records.some(record => !record || typeof record.id !== 'string')) throw new Error('Stored demo records could not be read');
  return records;
}
export function writeDemoRecords<T extends { id: string }>(storage: Pick<StoragePort, 'setItem'>, key: string, records: T[]) {
  storage.setItem(key, JSON.stringify(records));
}
