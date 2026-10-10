import type { Booking, Room } from '../mocks/hospitalityData';
export interface CheckInInput {
  [key: string]: string;
  firstName: string; lastName: string; docNumber: string; nationality: string; room: string;
  arrivalDate: string; arrivalTime: string; departureDate: string; departureTime: string;
}
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export const CHECK_IN_KEY = 'ameen-demo-checkins-v1';
export function validateCheckIn(input: Partial<CheckInInput>, rooms: Room[]) {
  const errors: Record<string, string> = {};
  for (const field of ['firstName', 'lastName', 'docNumber', 'nationality', 'room', 'arrivalDate', 'arrivalTime', 'departureDate', 'departureTime']) {
    if (!input[field]?.trim()) errors[field] = 'Required';
  }
  const room = rooms.find(r => r.number === input.room);
  if (input.room && (!room || room.status !== 'available')) errors.room = 'Select an available room';
  const arrival = Date.parse(`${input.arrivalDate}T${input.arrivalTime}`), departure = Date.parse(`${input.departureDate}T${input.departureTime}`);
  if (input.arrivalDate && !Number.isFinite(arrival)) errors.arrivalDate = 'Enter a valid arrival date and time';
  if (input.departureDate && (!Number.isFinite(departure) || departure <= arrival)) errors.departureDate = 'Departure must be after arrival';
  return errors;
}
export function readCheckIns(storage: StoragePort): Booking[] {
  const raw = storage.getItem(CHECK_IN_KEY);
  if (!raw) return [];
  const records = JSON.parse(raw);
  if (!Array.isArray(records) || records.some(r => !r.id || !r.roomNumber || !r.guestDoc)) throw new Error('Stored check-ins could not be read');
  return records;
}
export function saveCheckIn(input: CheckInInput, rooms: Room[], storage: StoragePort): Booking {
  const records = readCheckIns(storage);
  const effectiveRooms = rooms.map(room => records.some(r => r.roomNumber === room.number && r.status === 'checked_in') ? { ...room, status: 'occupied' as const } : room);
  if (Object.keys(validateCheckIn(input, effectiveRooms)).length) throw new Error('Check-in contains invalid fields');
  const room = rooms.find(r => r.number === input.room)!;
  const nights = Math.max(1, Math.ceil((Date.parse(input.departureDate) - Date.parse(input.arrivalDate)) / 86400000));
  const id = `DEMO-CI-${crypto.randomUUID()}`;
  const booking: Booking & { checkInDetails: CheckInInput } = { id, guestId: id, guestName: `${input.firstName.trim()} ${input.lastName.trim()}`, guestDoc: input.docNumber.trim(), nationalityFlag: '', roomId: room.id, roomNumber: room.number, roomType: room.type, checkIn: input.arrivalDate, checkOut: input.departureDate, nights, adults: 1, children: 0, rateOMR: room.rateOMR, totalOMR: nights * room.rateOMR, status: 'checked_in', paymentStatus: 'pending', ameenSynced: false, createdAt: new Date().toISOString(), checkInDetails: { ...input }, notes: 'Saved locally in demo mode; awaiting a connected sync service.' };
  storage.setItem(CHECK_IN_KEY, JSON.stringify([booking, ...records]));
  return booking;
}
