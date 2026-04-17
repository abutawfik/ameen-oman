import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions } from "@/pages/dashboard/hotel-events/components/FormComponents";

interface Props { isAr: boolean; }

type FormType = "bus" | "taxi" | "ridehail";

const ROUTES = [
  { value: "route_1", label: "Route 1 — Capital ↔ North District" },
  { value: "route_2", label: "Route 2 — West ↔ North District" },
  { value: "route_5", label: "Route 5 — Central ↔ East District" },
  { value: "route_7", label: "Route 7 — Capital ↔ Coastal Town" },
  { value: "route_14", label: "Route 14 — Central ↔ Industrial Zone" },
  { value: "route_22", label: "Route 22 — Capital ↔ Northern City" },
];

const STOPS = [
  { value: "central_station", label: "Central Bus Station" },
  { value: "capital_airport", label: "Capital Airport" },
  { value: "north_district", label: "North District" },
  { value: "west_district", label: "West District" },
  { value: "east_district", label: "East District" },
  { value: "industrial_zone", label: "Industrial Zone" },
  { value: "coastal_town", label: "Coastal Town" },
  { value: "northern_city", label: "Northern City" },
  { value: "central_city", label: "Central City" },
  { value: "southern_city", label: "Southern City" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" }, { value: "card", label: "Card" },
  { value: "transit_card", label: "Transit Card" }, { value: "app", label: "In-App Payment" },
];

const PROVIDERS_BUS = [{ value: "nat_bus", label: "National Bus Co." }];
const PROVIDERS_TAXI = [{ value: "taxi_a", label: "Taxi Co. A" }, { value: "taxi_b", label: "Taxi Co. B" }];
const PROVIDERS_RIDEHAIL = [{ value: "ridehail_a", label: "Ride-Hail App A" }, { value: "ridehail_b", label: "Ride-Hail App B" }];

const MATCH_METHODS = [
  { value: "transit_card", label: "Transit Card" }, { value: "phone", label: "Phone Number" },
  { value: "payment_card", label: "Payment Card" }, { value: "anonymous", label: "Anonymous" },
];

const genRef = (prefix: string) => `AMN-TRN-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

const ConfirmBanner = ({ refCode, label, color, onReset, isAr }: { refCode: string; label: string; color: string; onReset: () => void; isAr: boolean }) => (
  <div className="rounded-2xl border p-10 flex flex-col items-center text-center" style={{ background: "rgba(20,29,46,0.9)", borderColor: `${color}30`, backdropFilter: "blur(20px)" }}>
    <div className="relative mb-6">
      <div className="w-20 h-20 flex items-center justify-center rounded-full" style={{ background: `${color}10`, border: `2px solid ${color}40`, boxShadow: `0 0 40px ${color}18` }}>
        <i className="ri-checkbox-circle-line text-4xl" style={{ color }} />
      </div>
      <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: `2px solid ${color}` }} />
    </div>
    <h2 className="text-white text-xl font-bold mb-2">{isAr ? "تم تسجيل الرحلة بنجاح" : "Trip Recorded Successfully"}</h2>
    <p className="text-gray-400 text-sm mb-6">{label}</p>
    <div className="px-8 py-4 rounded-2xl border mb-8 w-full max-w-md" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
      <p className="text-gray-500 text-xs mb-1 uppercase tracking-widest">{isAr ? "رمز المرجع" : "Reference Code"}</p>
      <p className="text-xl font-bold font-['JetBrains_Mono'] tracking-wider" style={{ color: "#D4A84B" }}>{refCode}</p>
    </div>
    <button type="button" onClick={onReset} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap" style={{ background: "#D4A84B", color: "#0B1220" }}>
      <i className="ri-add-line" />{isAr ? "تسجيل رحلة أخرى" : "Record Another Trip"}
    </button>
  </div>
);

const BusJourneyForm = ({ isAr, onCancel }: { isAr: boolean; onCancel: () => void }) => {
  const [cardId, setCardId] = useState(""); const [route, setRoute] = useState(""); const [boardingStop, setBoardingStop] = useState("");
  const [alightingStop, setAlightingStop] = useState(""); const [dateTime, setDateTime] = useState(""); const [fare, setFare] = useState("");
  const [saving, setSaving] = useState(false); const [confirmed, setConfirmed] = useState(false); const [refCode, setRefCode] = useState("");

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefCode(genRef("BUS")); setConfirmed(true); }, 1400); };
  if (confirmed) return <ConfirmBanner refCode={refCode} label={isAr ? "رحلة حافلة — شركة الحافلات الوطنية" : "Bus Journey — National Bus Co."} color="#D4A84B" onReset={() => setConfirmed(false)} isAr={isAr} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "بيانات الحافلة تُرسَل تلقائياً عبر API من شركة الحافلات الوطنية. هذا النموذج للإدخال اليدوي فقط." : "Bus data is auto-submitted via API from National Bus Co. This form is for manual entry only."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل الرحلة" : "Journey Details"} icon="ri-bus-line" accentColor="#D4A84B">
          <div className="space-y-4">
            <FormField label={isAr ? "معرّف البطاقة" : "Card ID"} required>
              <TextInput placeholder="CARD-XXXXXXXXXXXX" value={cardId} onChange={(e) => setCardId(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "رقم الخط" : "Route Number"} required>
              <SelectInput options={ROUTES} placeholder={isAr ? "اختر الخط" : "Select route"} value={route} onChange={(e) => setRoute(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "محطة الصعود" : "Boarding Stop"} required>
                <SelectInput options={STOPS} placeholder={isAr ? "اختر" : "Select"} value={boardingStop} onChange={(e) => setBoardingStop(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "محطة النزول" : "Alighting Stop"} required>
                <SelectInput options={STOPS} placeholder={isAr ? "اختر" : "Select"} value={alightingStop} onChange={(e) => setAlightingStop(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "التاريخ والوقت" : "Date / Time"} required>
              <TextInput type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "الأجرة (LCY)" : "Fare (LCY)"} required>
              <div className="relative">
                <TextInput type="number" placeholder="0.200" value={fare} onChange={(e) => setFare(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>
          </div>
        </SectionCard>
        <SectionCard title={isAr ? "تطابق الهوية" : "Identity Match"} icon="ri-fingerprint-line">
          <div className="space-y-4">
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
              <i className="ri-information-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs">{isAr ? "Al-Ameen يطابق معرّف البطاقة تلقائياً مع وثيقة السفر المسجّلة في قاعدة البيانات." : "Al-Ameen auto-matches Card ID with the registered travel document in the database."}</p>
            </div>
            <FormField label={isAr ? "طريقة التطابق" : "Match Method"}>
              <SelectInput options={MATCH_METHODS} placeholder={isAr ? "اختر" : "Select"} value="transit_card" onChange={() => {}} />
            </FormField>
            <FormField label={isAr ? "مزود الخدمة" : "Provider"} required>
              <SelectInput options={PROVIDERS_BUS} value="nat_bus" onChange={() => {}} />
            </FormField>
            <div className="px-4 py-3 rounded-xl border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">API CONNECTED</span>
              </div>
              <p className="text-gray-400 text-xs">{isAr ? "تغذية مباشرة من شركة الحافلات الوطنية — آخر مزامنة: 14:32:07" : "Live feed from National Bus Co. — Last sync: 14:32:07"}</p>
            </div>
          </div>
        </SectionCard>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل رحلة الحافلة" : "Record Bus Journey"} isAr={isAr} saving={saving} />
    </div>
  );
};

const TaxiTripForm = ({ isAr, onCancel }: { isAr: boolean; onCancel: () => void }) => {
  const [bookingRef, setBookingRef] = useState(""); const [provider, setProvider] = useState(""); const [pickupLocation, setPickupLocation] = useState("");
  const [pickupTime, setPickupTime] = useState(""); const [dropoffLocation, setDropoffLocation] = useState(""); const [dropoffTime, setDropoffTime] = useState("");
  const [distance, setDistance] = useState(""); const [fare, setFare] = useState(""); const [payment, setPayment] = useState(""); const [passengerDoc, setPassengerDoc] = useState("");
  const [saving, setSaving] = useState(false); const [confirmed, setConfirmed] = useState(false); const [refCode, setRefCode] = useState("");

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefCode(genRef("TAXI")); setConfirmed(true); }, 1400); };
  if (confirmed) return <ConfirmBanner refCode={refCode} label={isAr ? "رحلة تاكسي" : "Taxi Trip"} color="#4ADE80" onReset={() => setConfirmed(false)} isAr={isAr} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "بيانات التاكسي تُرسَل عبر API من شركات التاكسي المرخّصة. وثيقة الراكب اختيارية إذا كان مسجّلاً." : "Taxi data submitted via API from licensed operators. Passenger document optional if registered."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل الرحلة" : "Trip Details"} icon="ri-taxi-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "مرجع الحجز" : "Booking Ref"} required>
                <TextInput placeholder="BK-XXXXXXXXXX" value={bookingRef} onChange={(e) => setBookingRef(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "المشغّل" : "Operator"} required>
                <SelectInput options={PROVIDERS_TAXI} placeholder={isAr ? "اختر" : "Select"} value={provider} onChange={(e) => setProvider(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "موقع الاستلام" : "Pickup Location"} required>
                <SelectInput options={STOPS} placeholder={isAr ? "اختر" : "Select"} value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "وقت الاستلام" : "Pickup Time"} required>
                <TextInput type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "موقع الإنزال" : "Dropoff Location"} required>
                <SelectInput options={STOPS} placeholder={isAr ? "اختر" : "Select"} value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "وقت الإنزال" : "Dropoff Time"}>
                <TextInput type="datetime-local" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "المسافة (كم)" : "Distance (km)"}>
                <TextInput type="number" placeholder="0.0" value={distance} onChange={(e) => setDistance(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "الأجرة (LCY)" : "Fare (LCY)"} required>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={fare} onChange={(e) => setFare(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
            </div>
            <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
              <SelectInput options={PAYMENT_METHODS} placeholder={isAr ? "اختر" : "Select"} value={payment} onChange={(e) => setPayment(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "وثيقة الراكب (اختياري)" : "Passenger Document (optional)"}>
              <TextInput placeholder="P-XXXXXXXX" value={passengerDoc} onChange={(e) => setPassengerDoc(e.target.value)} className="font-['JetBrains_Mono']" />
              <p className="text-gray-600 text-xs mt-1">{isAr ? "إذا كان الراكب مسجّلاً في النظام" : "If passenger is registered in the system"}</p>
            </FormField>
          </div>
        </SectionCard>
        <SectionCard title={isAr ? "معلومات التطابق" : "Match Information"} icon="ri-fingerprint-line">
          <div className="space-y-4">
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
              <i className="ri-information-line text-green-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs">{isAr ? "Al-Ameen يطابق الراكب باستخدام: وثيقة السفر المسجّلة، رقم الهاتف (تدفق SIM)، أو بطاقة الدفع." : "Al-Ameen matches passenger using: registered travel document, phone number (SIM stream), or payment card."}</p>
            </div>
            {[
              { icon: "ri-bank-card-line", color: "#D4A84B", label: isAr ? "بطاقة عبور → وثيقة" : "Transit Card → Document" },
              { icon: "ri-smartphone-line", color: "#4ADE80", label: isAr ? "رقم الهاتف → تدفق SIM" : "Phone Number → SIM Stream" },
              { icon: "ri-secure-payment-line", color: "#A78BFA", label: isAr ? "بطاقة دفع → التدفق المالي" : "Payment Card → Financial Stream" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${m.color}12` }}>
                  <i className={`${m.icon} text-xs`} style={{ color: m.color }} />
                </div>
                <span className="text-gray-300 text-xs">{m.label}</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل رحلة التاكسي" : "Record Taxi Trip"} isAr={isAr} saving={saving} />
    </div>
  );
};

const RideHailTripForm = ({ isAr, onCancel }: { isAr: boolean; onCancel: () => void }) => {
  const [tripId, setTripId] = useState(""); const [provider, setProvider] = useState(""); const [pickupGps, setPickupGps] = useState("");
  const [dropoffGps, setDropoffGps] = useState(""); const [dateTime, setDateTime] = useState(""); const [driverId, setDriverId] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState(""); const [passengerPhone, setPassengerPhone] = useState(""); const [fare, setFare] = useState("");
  const [saving, setSaving] = useState(false); const [confirmed, setConfirmed] = useState(false); const [refCode, setRefCode] = useState("");

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefCode(genRef("RH")); setConfirmed(true); }, 1400); };
  if (confirmed) return <ConfirmBanner refCode={refCode} label={isAr ? "رحلة توصيل" : "Ride-Hail Trip"} color="#A78BFA" onReset={() => setConfirmed(false)} isAr={isAr} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "بيانات التوصيل تُرسَل عبر شراكة API. رقم الهاتف يُطابَق مع تدفق SIM لتأكيد الهوية." : "Ride-hail data submitted via API partnership. Phone number matched with SIM stream for identity confirmation."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل الرحلة" : "Trip Details"} icon="ri-car-line" accentColor="#A78BFA">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "معرّف الرحلة" : "Trip ID"} required>
                <TextInput placeholder="TRIP-XXXXXXXXXXXX" value={tripId} onChange={(e) => setTripId(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "التطبيق" : "App Provider"} required>
                <SelectInput options={PROVIDERS_RIDEHAIL} placeholder={isAr ? "اختر" : "Select"} value={provider} onChange={(e) => setProvider(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "إحداثيات GPS — الاستلام" : "Pickup GPS Coordinates"} required>
              <TextInput placeholder="23.5880° N, 58.3829° E" value={pickupGps} onChange={(e) => setPickupGps(e.target.value)} className="font-['JetBrains_Mono'] text-xs" />
            </FormField>
            <FormField label={isAr ? "إحداثيات GPS — الإنزال" : "Dropoff GPS Coordinates"} required>
              <TextInput placeholder="23.6012° N, 58.5934° E" value={dropoffGps} onChange={(e) => setDropoffGps(e.target.value)} className="font-['JetBrains_Mono'] text-xs" />
            </FormField>
            <FormField label={isAr ? "التاريخ والوقت" : "Date / Time"} required>
              <TextInput type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "معرّف السائق" : "Driver ID"} required>
                <TextInput placeholder="DRV-XXXXXXXX" value={driverId} onChange={(e) => setDriverId(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "لوحة المركبة" : "Vehicle Plate"} required>
                <TextInput placeholder="XXX-XXXX" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={isAr ? "الأجرة (LCY)" : "Fare (LCY)"} required>
              <div className="relative">
                <TextInput type="number" placeholder="0.000" value={fare} onChange={(e) => setFare(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>
          </div>
        </SectionCard>
        <SectionCard title={isAr ? "ربط هوية الراكب" : "Passenger Identity Link"} icon="ri-smartphone-line">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم هاتف الراكب" : "Passenger Phone Number"} required>
              <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} className="font-['JetBrains_Mono']" />
              <p className="text-gray-600 text-xs mt-1">{isAr ? "يُطابَق مع تدفق SIM لتأكيد الهوية" : "Matched with SIM stream for identity confirmation"}</p>
            </FormField>
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)" }}>
              <i className="ri-shield-check-line text-purple-400 text-sm mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-400 text-xs font-bold mb-0.5">{isAr ? "توازن الخصوصية" : "Privacy Balance"}</p>
                <p className="text-gray-400 text-xs">{isAr ? "Al-Ameen يستقبل بيانات على مستوى المسار، وليس تتبع GPS في الوقت الفعلي. التحليل استرجاعي." : "Al-Ameen receives route-level data, not real-time GPS tracking. Pattern analysis is retrospective."}</p>
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">SIM STREAM ACTIVE</span>
              </div>
              <p className="text-gray-400 text-xs">{isAr ? "تطابق تلقائي عبر رقم الهاتف مع قاعدة بيانات SIM" : "Auto-match via phone number with SIM database"}</p>
            </div>
          </div>
        </SectionCard>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل رحلة التوصيل" : "Record Ride-Hail Trip"} isAr={isAr} saving={saving} />
    </div>
  );
};

const FORM_CARDS = [
  { id: "bus" as FormType, icon: "ri-bus-line", label: "Bus Journey", labelAr: "رحلة حافلة", desc: "Record bus journey with card ID, route, boarding/alighting stop and fare", descAr: "تسجيل رحلة حافلة مع معرّف البطاقة والخط ومحطات الصعود والنزول والأجرة", color: "#D4A84B", code: "AMN-TRN-BUS" },
  { id: "taxi" as FormType, icon: "ri-taxi-line", label: "Taxi Trip", labelAr: "رحلة تاكسي", desc: "Record taxi trip with booking ref, pickup/dropoff, distance, fare and payment", descAr: "تسجيل رحلة تاكسي مع مرجع الحجز والاستلام والإنزال والمسافة والأجرة", color: "#4ADE80", code: "AMN-TRN-TAXI" },
  { id: "ridehail" as FormType, icon: "ri-car-line", label: "Ride-Hail Trip", labelAr: "رحلة توصيل", desc: "Record ride-hail trip with GPS coordinates, driver ID, vehicle plate and passenger phone", descAr: "تسجيل رحلة توصيل مع إحداثيات GPS ومعرّف السائق ولوحة المركبة وهاتف الراكب", color: "#A78BFA", code: "AMN-TRN-RH" },
];

const TripSubmissionForms = ({ isAr }: Props) => {
  const [activeForm, setActiveForm] = useState<FormType | null>(null);
  const [formKey, setFormKey] = useState(0);
  const activeCard = FORM_CARDS.find(c => c.id === activeForm);

  const handleSwitch = (id: FormType) => { setActiveForm(id); setFormKey(k => k + 1); };

  return (
    <div className="space-y-6">
      {!activeForm && (
        <>
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
            <i className="ri-robot-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-gray-400 text-sm">{isAr ? "معظم بيانات النقل تُرسَل تلقائياً عبر API من المزودين. هذه النماذج للإدخال اليدوي والتصحيح فقط." : "Most transport data is auto-submitted via API from providers. These forms are for manual entry and corrections only."}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FORM_CARDS.map(card => (
              <button key={card.id} type="button" onClick={() => handleSwitch(card.id)}
                className="group relative rounded-2xl border p-6 text-left cursor-pointer transition-all duration-300 flex flex-col gap-4"
                style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = `${card.color}50`; el.style.background = `${card.color}08`; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(181,142,60,0.12)"; el.style.background = "rgba(20,29,46,0.8)"; el.style.transform = "translateY(0)"; }}>
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}>
                  <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-bold text-base">{isAr ? card.labelAr : card.label}</h3>
                    <i className="ri-arrow-right-up-line text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{isAr ? card.descAr : card.desc}</p>
                </div>
                <div className="self-start px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${card.color}15`, color: card.color, border: `1px solid ${card.color}30` }}>{card.code}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {activeForm && (
        <>
          <div className="flex gap-1 p-1 rounded-xl mb-2 overflow-x-auto" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.1)" }}>
            {FORM_CARDS.map(card => (
              <button key={card.id} type="button" onClick={() => handleSwitch(card.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
                style={{ background: activeForm === card.id ? `${card.color}12` : "transparent", border: `1px solid ${activeForm === card.id ? `${card.color}30` : "transparent"}`, color: activeForm === card.id ? card.color : "#6B7280" }}>
                <i className={`${card.icon} text-xs`} />{isAr ? card.labelAr : card.label}
              </button>
            ))}
          </div>
          <div key={formKey}>
            {activeForm === "bus"      && <BusJourneyForm  isAr={isAr} onCancel={() => setActiveForm(null)} />}
            {activeForm === "taxi"     && <TaxiTripForm    isAr={isAr} onCancel={() => setActiveForm(null)} />}
            {activeForm === "ridehail" && <RideHailTripForm isAr={isAr} onCancel={() => setActiveForm(null)} />}
          </div>
        </>
      )}
    </div>
  );
};

export default TripSubmissionForms;
