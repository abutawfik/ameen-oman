import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
  LookupButton, SuccessScreen, BRANCHES, PAYMENT_METHODS, CARD_TYPES,
} from "./components/FormComponents";
import TravelDocSection, { type TravelDocData } from "./components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "./components/PersonalDetailsSection";

// ─── Mock booking lookup ──────────────────────────────────────────────────────
const MOCK_BOOKINGS: Record<string, {
  room: string; arrival: string; departure: string;
  personal: Partial<PersonalData>; doc: Partial<TravelDocData>;
}> = {
  "BK-88234": {
    room: "412",
    arrival: "2026-04-05T14:00",
    departure: "2026-04-09T12:00",
    personal: {
      firstName: "Khalid", lastName: "Al-Mansouri", gender: "male",
      dob: "1982-07-18", nationality: "SA", placeOfBirth: "Riyadh",
      countryOfResidence: "SA", email: "khalid.mansouri@email.com",
      primaryContact: "+966 5512 3456",
    },
    doc: {
      holderStatus: "primary", docType: "passport", docNumber: "G8823401",
      issuingCountry: "SA", placeOfIssue: "Riyadh",
      issuingAuthority: "Ministry of Interior",
      issueDate: "2021-03-10", expiryDate: "2031-03-09",
    },
  },
  "BK-55901": {
    room: "207",
    arrival: "2026-04-05T15:30",
    departure: "2026-04-07T11:00",
    personal: {
      firstName: "Priya", lastName: "Sharma", gender: "female",
      dob: "1990-11-25", nationality: "IN", placeOfBirth: "Mumbai",
      countryOfResidence: "AE", email: "priya.sharma@corp.ae",
      primaryContact: "+971 5098 7654",
    },
    doc: {
      holderStatus: "primary", docType: "passport", docNumber: "P4490123",
      issuingCountry: "IN", placeOfIssue: "Mumbai",
      issuingAuthority: "Passport Seva Kendra",
      issueDate: "2019-06-15", expiryDate: "2029-06-14",
    },
  },
};

interface GuestBlock {
  id: number;
  personal: PersonalData;
  doc: TravelDocData;
  autoFilled: boolean;
}

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});
const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface Props { isAr: boolean; onCancel: () => void; onSaved: () => void; }

const CheckInForm = ({ isAr, onCancel, onSaved }: Props) => {
  const [branch, setBranch] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [room, setRoom] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardType, setCardType] = useState("");
  const [arrivalDT, setArrivalDT] = useState("");
  const [departureDT, setDepartureDT] = useState("");
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [guests, setGuests] = useState<GuestBlock[]>([
    { id: 1, personal: emptyPersonal(), doc: emptyDoc(), autoFilled: false },
  ]);

  const t = {
    title: isAr ? "تسجيل دخول جديد" : "New Check-In",
    tip: isAr
      ? "أدخل رقم مرجع الحجز للحصول على التفاصيل المعبأة مسبقاً."
      : "Enter Booking Reference to get prefilled details.",
    eventInfo: isAr ? "معلومات الحدث" : "Event Information",
    branch: isAr ? "الفرع" : "Branch",
    bookingRef: isAr ? "مرجع الحجز" : "Booking Reference",
    room: isAr ? "رقم الغرفة" : "Room Number",
    payment: isAr ? "طريقة الدفع" : "Payment Method",
    cardType: isAr ? "نوع البطاقة" : "Card Type",
    arrival: isAr ? "تاريخ ووقت الوصول" : "Arrival Date & Time",
    departure: isAr ? "تاريخ ووقت المغادرة" : "Departure Date & Time",
    addGuest: isAr ? "إضافة نزيل آخر" : "Add Another Guest",
    guest: isAr ? "النزيل" : "Guest",
    remove: isAr ? "إزالة" : "Remove",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
  };

  const lookupBooking = () => {
    const mock = MOCK_BOOKINGS[bookingRef.toUpperCase()];
    if (mock) {
      setLookupError(false);
      setRoom(mock.room);
      setArrivalDT(mock.arrival);
      setDepartureDT(mock.departure);
      setGuests((prev) =>
        prev.map((g, i) =>
          i === 0
            ? {
                ...g,
                personal: { ...emptyPersonal(), ...mock.personal },
                doc: { ...emptyDoc(), ...mock.doc },
                autoFilled: true,
              }
            : g
        )
      );
    } else {
      setLookupError(true);
    }
  };

  const updateGuest = (id: number, field: "personal" | "doc", key: string, value: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: { ...g[field], [key]: value } } : g))
    );
  };

  const addGuest = () => {
    const newId = Math.max(...guests.map((g) => g.id)) + 1;
    setGuests((prev) => [
      ...prev,
      { id: newId, personal: emptyPersonal(), doc: { ...emptyDoc(), holderStatus: "secondary" }, autoFilled: false },
    ]);
  };

  const removeGuest = (id: number) => {
    if (guests.length > 1) setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => { setSaved(false); onSaved(); }, 2000);
    }, 1500);
  };

  if (saved) {
    return (
      <SuccessScreen
        icon="ri-login-box-line"
        color="#4ADE80"
        titleEn="Check-In Event Saved!"
        titleAr="تم حفظ حدث تسجيل الدخول!"
        isAr={isAr}
        eventCode="HOTEL_CHECKIN"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}
        >
          <i className="ri-login-box-line text-green-400 text-xl" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-['Inter']">{t.title}</h2>
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] tracking-widest">HOTEL_CHECKIN</p>
        </div>
      </div>

      <TipBanner text={t.tip} color="amber" />

      {/* ── Two-column: Event Info (left) + Travel Doc (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT — Event Info */}
        <SectionCard title={t.eventInfo} icon="ri-calendar-event-line">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t.branch} required>
              <SelectInput
                options={BRANCHES.map((b) => ({
                  value: b.value,
                  label: isAr ? b.label.replace("Main Branch", "الفرع الرئيسي").replace("Branch", "فرع").replace("Capital", "العاصمة").replace("Northern Region", "المنطقة الشمالية").replace("Southern Region", "المنطقة الجنوبية").replace("Eastern Region", "المنطقة الشرقية") : b.label,
                }))}
                placeholder={isAr ? "اختر الفرع" : "Select branch"}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </FormField>

            <FormField label={t.bookingRef} required>
              <div className="flex gap-2">
                <TextInput
                  placeholder="BK-XXXXX"
                  value={bookingRef}
                  onChange={(e) => { setBookingRef(e.target.value); setLookupError(false); }}
                  className="flex-1 font-['JetBrains_Mono'] tracking-wider"
                />
                <LookupButton onClick={lookupBooking} isAr={isAr} />
              </div>
              {lookupError && (
                <p className="text-red-400 text-xs mt-1 font-['Inter'] flex items-center gap-1">
                  <i className="ri-error-warning-line" />{t.notFound}
                </p>
              )}
            </FormField>

            <FormField label={t.room} required>
              <TextInput
                placeholder={isAr ? "مثال: 412" : "e.g. 412"}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                autoFilled={!!room && guests[0]?.autoFilled}
                className="font-['JetBrains_Mono']"
              />
            </FormField>

            <FormField label={t.payment} required>
              <SelectInput
                options={PAYMENT_METHODS}
                placeholder={isAr ? "اختر طريقة الدفع" : "Select payment method"}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </FormField>

            {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
              <FormField label={t.cardType}>
                <SelectInput
                  options={CARD_TYPES}
                  placeholder={isAr ? "اختر نوع البطاقة" : "Select card type"}
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                />
              </FormField>
            )}

            <FormField label={t.arrival} required>
              <TextInput
                type="datetime-local"
                value={arrivalDT}
                onChange={(e) => setArrivalDT(e.target.value)}
                autoFilled={!!arrivalDT && guests[0]?.autoFilled}
              />
            </FormField>

            <FormField label={t.departure} required>
              <TextInput
                type="datetime-local"
                value={departureDT}
                onChange={(e) => setDepartureDT(e.target.value)}
                autoFilled={!!departureDT && guests[0]?.autoFilled}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* RIGHT — Travel Doc (first guest) */}
        <TravelDocSection
          data={guests[0].doc}
          onChange={(key, value) => updateGuest(guests[0].id, "doc", key, value)}
          isAr={isAr}
          scannerConnected={scannerConnected}
          autoFilled={guests[0].autoFilled}
          onScan={() => {}}
        />
      </div>

      {/* ── Full-width: Personal Details (first guest) ── */}
      <PersonalDetailsSection
        data={guests[0].personal}
        onChange={(key, value) => updateGuest(guests[0].id, "personal", key, value)}
        isAr={isAr}
        autoFilled={guests[0].autoFilled}
      />

      {/* ── Additional guests ── */}
      {guests.slice(1).map((guest, idx) => (
        <div key={guest.id} className="space-y-5">
          {/* Guest divider */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 flex items-center justify-center rounded-full"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}
            >
              <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{idx + 2}</span>
            </div>
            <span className="text-white font-semibold text-sm font-['Inter']">
              {t.guest} {idx + 2}
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(34,211,238,0.08)" }} />
            <button
              type="button"
              onClick={() => removeGuest(guest.id)}
              className="flex items-center gap-1 text-red-400 text-xs hover:text-red-300 cursor-pointer font-['Inter'] transition-colors"
            >
              <i className="ri-delete-bin-line" />{t.remove}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div /> {/* No event info for additional guests */}
            <TravelDocSection
              data={guest.doc}
              onChange={(key, value) => updateGuest(guest.id, "doc", key, value)}
              isAr={isAr}
              scannerConnected={false}
              autoFilled={false}
              onScan={() => {}}
            />
          </div>

          <PersonalDetailsSection
            data={guest.personal}
            onChange={(key, value) => updateGuest(guest.id, "personal", key, value)}
            isAr={isAr}
          />
        </div>
      ))}

      {/* Add Another Guest */}
      <button
        type="button"
        onClick={addGuest}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-colors font-['Inter'] whitespace-nowrap w-full justify-center"
        style={{
          background: "rgba(34,211,238,0.04)",
          borderColor: "rgba(34,211,238,0.18)",
          color: "#22D3EE",
          borderStyle: "dashed",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.04)"; }}
      >
        <i className="ri-user-add-line" />
        {t.addGuest}
      </button>

      <FormActions onCancel={onCancel} onSave={handleSave} saving={saving} isAr={isAr} />
    </div>
  );
};

export default CheckInForm;
