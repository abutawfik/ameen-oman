export interface HotelProfile {
  nameEn: string;
  nameAr: string;
  licenseNumber: string;
  starRating: number;
  address: string;
  city: string;
  phone: string;
  email: string;
  totalRooms: number;
  ameenRegNumber: string;
  brand?: string;
  branchCode?: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: 'single' | 'double' | 'twin' | 'suite' | 'family';
  maxOccupancy: number;
  rateOMR: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  amenities: string[];
}

export interface Guest {
  id: string;
  nameEn: string;
  nameAr: string;
  docType: 'passport' | 'national_id' | 'residence';
  docNumber: string;
  nationality: string;
  nationalityFlag: string;
  dob: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

export interface Booking {
  id: string;
  guestId: string;
  guestName: string;
  guestDoc: string;
  nationalityFlag: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rateOMR: number;
  totalOMR: number;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  paymentStatus: 'paid' | 'pending' | 'partial';
  ameenSynced: boolean;
  createdAt: string;
  notes?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  eventType: string;
  guestName: string;
  status: 'success' | 'pending' | 'failed';
  ameenRef?: string;
}

export const hotelProfile: HotelProfile = {
  nameEn: 'Al Wadi Guesthouse',
  nameAr: 'استراحة الوادي',
  licenseNumber: 'TL-2024-08234',
  starRating: 2,
  address: 'Building 12, Al Khuwair Street',
  city: 'Muscat',
  phone: '+968 2441 2345',
  email: 'info@alwadiguesthouse.com',
  totalRooms: 24,
  ameenRegNumber: 'AMN-HTL-2024-00891',
};

export const rooms: Room[] = [
  { id: 'R101', number: '101', floor: 1, type: 'single',  maxOccupancy: 1, rateOMR: 18.0, status: 'occupied',     amenities: ['WiFi', 'AC', 'TV'] },
  { id: 'R102', number: '102', floor: 1, type: 'double',  maxOccupancy: 2, rateOMR: 25.0, status: 'available',    amenities: ['WiFi', 'AC', 'TV', 'Minibar'] },
  { id: 'R103', number: '103', floor: 1, type: 'twin',    maxOccupancy: 2, rateOMR: 25.0, status: 'occupied',     amenities: ['WiFi', 'AC', 'TV'] },
  { id: 'R104', number: '104', floor: 1, type: 'single',  maxOccupancy: 1, rateOMR: 18.0, status: 'maintenance',  amenities: ['WiFi', 'AC'] },
  { id: 'R105', number: '105', floor: 1, type: 'double',  maxOccupancy: 2, rateOMR: 25.0, status: 'reserved',     amenities: ['WiFi', 'AC', 'TV', 'Minibar'] },
  { id: 'R106', number: '106', floor: 1, type: 'single',  maxOccupancy: 1, rateOMR: 18.0, status: 'available',    amenities: ['WiFi', 'AC'] },
  { id: 'R201', number: '201', floor: 2, type: 'double',  maxOccupancy: 2, rateOMR: 28.0, status: 'available',    amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe'] },
  { id: 'R202', number: '202', floor: 2, type: 'twin',    maxOccupancy: 2, rateOMR: 28.0, status: 'occupied',     amenities: ['WiFi', 'AC', 'TV', 'Safe'] },
  { id: 'R203', number: '203', floor: 2, type: 'family',  maxOccupancy: 4, rateOMR: 42.0, status: 'available',    amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Bathtub'] },
  { id: 'R204', number: '204', floor: 2, type: 'suite',   maxOccupancy: 2, rateOMR: 55.0, status: 'occupied',     amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Bathtub', 'Lounge'] },
  { id: 'R205', number: '205', floor: 2, type: 'double',  maxOccupancy: 2, rateOMR: 28.0, status: 'available',    amenities: ['WiFi', 'AC', 'TV'] },
  { id: 'R206', number: '206', floor: 2, type: 'twin',    maxOccupancy: 2, rateOMR: 28.0, status: 'reserved',     amenities: ['WiFi', 'AC', 'TV', 'Safe'] },
  { id: 'R301', number: '301', floor: 3, type: 'suite',   maxOccupancy: 3, rateOMR: 65.0, status: 'available',    amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Bathtub', 'Lounge', 'Balcony'] },
  { id: 'R302', number: '302', floor: 3, type: 'family',  maxOccupancy: 4, rateOMR: 42.0, status: 'occupied',     amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe'] },
  { id: 'R303', number: '303', floor: 3, type: 'double',  maxOccupancy: 2, rateOMR: 30.0, status: 'reserved',     amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Balcony'] },
  { id: 'R304', number: '304', floor: 3, type: 'single',  maxOccupancy: 1, rateOMR: 20.0, status: 'available',    amenities: ['WiFi', 'AC', 'TV'] },
  { id: 'R305', number: '305', floor: 3, type: 'double',  maxOccupancy: 2, rateOMR: 30.0, status: 'occupied',     amenities: ['WiFi', 'AC', 'TV', 'Balcony'] },
  { id: 'R306', number: '306', floor: 3, type: 'suite',   maxOccupancy: 3, rateOMR: 65.0, status: 'maintenance',  amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Bathtub', 'Lounge'] },
];

export const guests: Guest[] = [
  { id: 'G001', nameEn: 'Ahmed Al-Rashidi',    nameAr: 'أحمد الراشدي',     docType: 'passport',    docNumber: 'OM-4412891', nationality: 'Omani',   nationalityFlag: '🇴🇲', dob: '1985-03-12', gender: 'male',   phone: '+968 9234 5678', email: 'ahmed@email.com' },
  { id: 'G002', nameEn: 'Sarah Johnson',        nameAr: 'سارة جونسون',      docType: 'passport',    docNumber: 'UK-8823401', nationality: 'British', nationalityFlag: '🇬🇧', dob: '1990-07-22', gender: 'female', phone: '+44 7700 900123', email: 'sarah@email.com' },
  { id: 'G003', nameEn: 'Mohammed Al-Balushi',  nameAr: 'محمد البلوشي',     docType: 'national_id', docNumber: 'OM-2291884', nationality: 'Omani',   nationalityFlag: '🇴🇲', dob: '1978-11-05', gender: 'male',   phone: '+968 9876 5432', email: 'mbalushi@email.com' },
  { id: 'G004', nameEn: 'Ravi Krishnamurthy',   nameAr: 'رافي كريشنامورثي', docType: 'passport',    docNumber: 'IN-7823401', nationality: 'Indian',  nationalityFlag: '🇮🇳', dob: '1982-04-18', gender: 'male',   phone: '+91 98765 43210', email: 'ravi@email.com' },
  { id: 'G005', nameEn: 'Fatima Al-Zadjali',    nameAr: 'فاطمة الزدجالية',  docType: 'national_id', docNumber: 'OM-8834221', nationality: 'Omani',   nationalityFlag: '🇴🇲', dob: '1995-09-30', gender: 'female', phone: '+968 9112 3344', email: 'fatima@email.com' },
  { id: 'G006', nameEn: 'Chen Wei',             nameAr: 'تشن وي',           docType: 'passport',    docNumber: 'CN-3345891', nationality: 'Chinese', nationalityFlag: '🇨🇳', dob: '1988-02-14', gender: 'male',   phone: '+86 138 0013 8000', email: 'chenwei@email.com' },
  { id: 'G007', nameEn: 'Khalid Al-Amri',       nameAr: 'خالد العامري',     docType: 'national_id', docNumber: 'OM-6612334', nationality: 'Omani',   nationalityFlag: '🇴🇲', dob: '1975-06-08', gender: 'male',   phone: '+968 9445 6677', email: 'khalid@email.com' },
  { id: 'G008', nameEn: 'Aisha Al-Harthi',      nameAr: 'عائشة الحارثية',   docType: 'national_id', docNumber: 'OM-1123445', nationality: 'Omani',   nationalityFlag: '🇴🇲', dob: '1992-12-25', gender: 'female', phone: '+968 9223 4455', email: 'aisha@email.com' },
  { id: 'G009', nameEn: 'James Whitfield',      nameAr: 'جيمس ويتفيلد',    docType: 'passport',    docNumber: 'US-9912345', nationality: 'American',nationalityFlag: '🇺🇸', dob: '1979-08-11', gender: 'male',   phone: '+1 555 234 5678', email: 'james@email.com' },
  { id: 'G010', nameEn: 'Nadia Al-Siyabi',      nameAr: 'نادية السيابية',   docType: 'national_id', docNumber: 'OM-3312889', nationality: 'Omani',   nationalityFlag: '🇴🇲', dob: '1988-05-20', gender: 'female', phone: '+968 9334 5566', email: 'nadia@email.com' },
];

export const bookings: Booking[] = [
  { id: 'BK-2025-001', guestId: 'G001', guestName: 'Ahmed Al-Rashidi',   guestDoc: 'OM-4412891', nationalityFlag: '🇴🇲', roomId: 'R101', roomNumber: '101', roomType: 'Single',  checkIn: '2025-04-05', checkOut: '2025-04-08', nights: 3, adults: 1, children: 0, rateOMR: 18.0, totalOMR: 54.0,  status: 'checked_in',  paymentStatus: 'paid',    ameenSynced: true,  createdAt: '2025-04-04 14:22', notes: 'Early check-in requested' },
  { id: 'BK-2025-002', guestId: 'G002', guestName: 'Sarah Johnson',       guestDoc: 'UK-8823401', nationalityFlag: '🇬🇧', roomId: 'R103', roomNumber: '103', roomType: 'Twin',    checkIn: '2025-04-05', checkOut: '2025-04-10', nights: 5, adults: 2, children: 0, rateOMR: 25.0, totalOMR: 125.0, status: 'checked_in',  paymentStatus: 'paid',    ameenSynced: true,  createdAt: '2025-04-03 09:15' },
  { id: 'BK-2025-003', guestId: 'G004', guestName: 'Ravi Krishnamurthy',  guestDoc: 'IN-7823401', nationalityFlag: '🇮🇳', roomId: 'R202', roomNumber: '202', roomType: 'Twin',    checkIn: '2025-04-05', checkOut: '2025-04-07', nights: 2, adults: 1, children: 0, rateOMR: 28.0, totalOMR: 56.0,  status: 'checked_in',  paymentStatus: 'pending', ameenSynced: true,  createdAt: '2025-04-05 08:30' },
  { id: 'BK-2025-004', guestId: 'G006', guestName: 'Chen Wei',            guestDoc: 'CN-3345891', nationalityFlag: '🇨🇳', roomId: 'R204', roomNumber: '204', roomType: 'Suite',   checkIn: '2025-04-05', checkOut: '2025-04-09', nights: 4, adults: 2, children: 1, rateOMR: 55.0, totalOMR: 220.0, status: 'checked_in',  paymentStatus: 'paid',    ameenSynced: true,  createdAt: '2025-04-02 16:45' },
  { id: 'BK-2025-005', guestId: 'G003', guestName: 'Mohammed Al-Balushi', guestDoc: 'OM-2291884', nationalityFlag: '🇴🇲', roomId: 'R302', roomNumber: '302', roomType: 'Family',  checkIn: '2025-04-05', checkOut: '2025-04-06', nights: 1, adults: 2, children: 2, rateOMR: 42.0, totalOMR: 42.0,  status: 'checked_in',  paymentStatus: 'paid',    ameenSynced: true,  createdAt: '2025-04-05 11:00' },
  { id: 'BK-2025-006', guestId: 'G005', guestName: 'Fatima Al-Zadjali',   guestDoc: 'OM-8834221', nationalityFlag: '🇴🇲', roomId: 'R105', roomNumber: '105', roomType: 'Double',  checkIn: '2025-04-06', checkOut: '2025-04-08', nights: 2, adults: 1, children: 0, rateOMR: 25.0, totalOMR: 50.0,  status: 'confirmed',   paymentStatus: 'pending', ameenSynced: false, createdAt: '2025-04-05 13:20' },
  { id: 'BK-2025-007', guestId: 'G007', guestName: 'Khalid Al-Amri',      guestDoc: 'OM-6612334', nationalityFlag: '🇴🇲', roomId: 'R303', roomNumber: '303', roomType: 'Double',  checkIn: '2025-04-07', checkOut: '2025-04-10', nights: 3, adults: 2, children: 0, rateOMR: 30.0, totalOMR: 90.0,  status: 'confirmed',   paymentStatus: 'pending', ameenSynced: false, createdAt: '2025-04-05 15:10' },
  { id: 'BK-2025-008', guestId: 'G008', guestName: 'Aisha Al-Harthi',     guestDoc: 'OM-1123445', nationalityFlag: '🇴🇲', roomId: 'R201', roomNumber: '201', roomType: 'Double',  checkIn: '2025-04-04', checkOut: '2025-04-05', nights: 1, adults: 1, children: 0, rateOMR: 28.0, totalOMR: 28.0,  status: 'checked_out', paymentStatus: 'paid',    ameenSynced: true,  createdAt: '2025-04-03 18:00' },
  { id: 'BK-2025-009', guestId: 'G009', guestName: 'James Whitfield',     guestDoc: 'US-9912345', nationalityFlag: '🇺🇸', roomId: 'R305', roomNumber: '305', roomType: 'Double',  checkIn: '2025-04-05', checkOut: '2025-04-12', nights: 7, adults: 1, children: 0, rateOMR: 30.0, totalOMR: 210.0, status: 'checked_in',  paymentStatus: 'paid',    ameenSynced: true,  createdAt: '2025-04-04 20:00' },
  { id: 'BK-2025-010', guestId: 'G010', guestName: 'Nadia Al-Siyabi',     guestDoc: 'OM-3312889', nationalityFlag: '🇴🇲', roomId: 'R206', roomNumber: '206', roomType: 'Twin',    checkIn: '2025-04-06', checkOut: '2025-04-07', nights: 1, adults: 2, children: 0, rateOMR: 28.0, totalOMR: 28.0,  status: 'confirmed',   paymentStatus: 'pending', ameenSynced: false, createdAt: '2025-04-05 17:30' },
];

export const syncLogs: SyncLog[] = [
  { id: 'SL001', timestamp: '14:32:11', eventType: 'Check-In',        guestName: 'Ahmed Al-Rashidi',    status: 'success', ameenRef: 'AMN-EVT-2025-44891' },
  { id: 'SL002', timestamp: '14:28:44', eventType: 'Check-In',        guestName: 'Ravi Krishnamurthy',  status: 'success', ameenRef: 'AMN-EVT-2025-44890' },
  { id: 'SL003', timestamp: '13:55:22', eventType: 'Booking Created', guestName: 'Fatima Al-Zadjali',   status: 'pending' },
  { id: 'SL004', timestamp: '13:42:08', eventType: 'Check-Out',       guestName: 'Aisha Al-Harthi',     status: 'success', ameenRef: 'AMN-EVT-2025-44889' },
  { id: 'SL005', timestamp: '12:18:55', eventType: 'Check-In',        guestName: 'Chen Wei',            status: 'success', ameenRef: 'AMN-EVT-2025-44888' },
  { id: 'SL006', timestamp: '11:44:30', eventType: 'Check-In',        guestName: 'Mohammed Al-Balushi', status: 'success', ameenRef: 'AMN-EVT-2025-44887' },
  { id: 'SL007', timestamp: '11:02:15', eventType: 'Booking Created', guestName: 'Khalid Al-Amri',      status: 'failed' },
  { id: 'SL008', timestamp: '10:30:44', eventType: 'Check-In',        guestName: 'Sarah Johnson',       status: 'success', ameenRef: 'AMN-EVT-2025-44886' },
  { id: 'SL009', timestamp: '09:55:12', eventType: 'Check-In',        guestName: 'James Whitfield',     status: 'success', ameenRef: 'AMN-EVT-2025-44885' },
  { id: 'SL010', timestamp: '09:20:33', eventType: 'Booking Created', guestName: 'Nadia Al-Siyabi',     status: 'pending' },
];

export const hospitalityNavItems = [
  { key: 'dashboard',   icon: 'ri-home-5-line',         labelEn: 'Home',               labelAr: 'الرئيسية',          group: 'main' },
  { key: 'rooms',       icon: 'ri-hotel-bed-line',      labelEn: 'Room Status',        labelAr: 'حالة الغرف',        group: 'main' },
  { key: 'calendar',    icon: 'ri-calendar-line',       labelEn: 'Calendar',           labelAr: 'التقويم',           group: 'main' },
  { key: 'eventlist',   icon: 'ri-list-check-2',        labelEn: 'Event List',         labelAr: 'قائمة الأحداث',    group: 'main' },
  { key: 'upload',      icon: 'ri-upload-cloud-2-line', labelEn: 'Upload Events File', labelAr: 'رفع ملف الأحداث',  group: 'main' },
  { key: 'sync',        icon: 'ri-cloud-line',          labelEn: 'AMEEN Sync Log',     labelAr: 'سجل مزامنة أمين',  group: 'system' },
  { key: 'users',       icon: 'ri-team-line',           labelEn: 'Manage Users',       labelAr: 'إدارة المستخدمين', group: 'system' },
  { key: 'help',        icon: 'ri-question-line',       labelEn: 'Help',               labelAr: 'المساعدة',          group: 'system' },
];

export const recentActivities = [
  { id: 'A001', type: 'check-in',    icon: 'ri-login-box-line',     color: '#4ADE80', guestName: 'Ahmed Al-Rashidi',    room: '101', time: '14:32', flag: '🇴🇲' },
  { id: 'A002', type: 'booking',     icon: 'ri-calendar-check-line',color: '#D4A84B', guestName: 'Sarah Johnson',        room: '103', time: '14:18', flag: '🇬🇧' },
  { id: 'A003', type: 'check-out',   icon: 'ri-logout-box-line',    color: '#FB923C', guestName: 'Aisha Al-Harthi',      room: '201', time: '13:55', flag: '🇴🇲' },
  { id: 'A004', type: 'check-in',    icon: 'ri-login-box-line',     color: '#4ADE80', guestName: 'Ravi Krishnamurthy',   room: '202', time: '13:42', flag: '🇮🇳' },
  { id: 'A005', type: 'change-room', icon: 'ri-door-line',          color: '#FACC15', guestName: 'Mohammed Al-Balushi',  room: '302', time: '12:30', flag: '🇴🇲' },
  { id: 'A006', type: 'booking',     icon: 'ri-calendar-check-line',color: '#D4A84B', guestName: 'Chen Wei',             room: '204', time: '11:55', flag: '🇨🇳' },
  { id: 'A007', type: 'check-in',    icon: 'ri-login-box-line',     color: '#4ADE80', guestName: 'James Whitfield',      room: '305', time: '11:20', flag: '🇺🇸' },
  { id: 'A008', type: 'check-out',   icon: 'ri-logout-box-line',    color: '#FB923C', guestName: 'Khalid Al-Amri',       room: '303', time: '10:45', flag: '🇴🇲' },
];
