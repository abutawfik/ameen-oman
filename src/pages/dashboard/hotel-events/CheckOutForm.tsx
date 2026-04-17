import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
  LookupButton, SuccessScreen, BRANCHES, PAYMENT_METHODS,
} from "./components/FormComponents";
import TravelDocSection, { type TravelDocData } from "./components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "./components/PersonalDetailsSection";

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});
const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface Props { isAr: boolean; onCancel: () => void; onSaved: () => void; }

const CheckOutForm = ({ isAr, onCancel, onSaved }: Props) => {
  const [branch, setBranch] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [room, setRoom] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [balance, setBalance] = useState("");
  const [scheduledDeparture, setScheduledDeparture] = useState("");
  const [actualDeparture, setActualDeparture] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const t = {
    title: isAr ? "تسجيل خروج جديد" : "New Check-Out",
    tip: isAr
      ? "أدخل رقم مرجع الحجز للحصول على التفاصيل المعبأة مسبقاً."
      : "Enter Booking Reference to get prefilled details.",
    eventInfo: isAr ? "معلومات الحدث" : "Event Information",
    branch: isAr ? "الفرع" : "Branch",
    bookingRef: isAr ? "مرجع الحجز" : "Booking Reference",
    room: isAr ? "رقم الغرفة" : "Room Number",
    payment: isAr ? "طريقة الدفع" : "Payment Method",
    balance: isAr ? "رصيد النزيل (LCY)" : "Guest Balance (LCY)",
    scheduledDep: isAr ? "تاريخ المغادرة المجدولة" : "Scheduled Departure",
    actualDep: isAr ? "تاريخ المغادرة الفعلية" : "Actual Departure Date & Time",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
  };

  const lookupBooking = () => {
    if (bookingRef.toUpperCase() === "BK-88234") {
      setLookupError(false);
      setRoom("412");
      setScheduledDeparture("2026-04-09T12:00");
      setPersonal({
        firstName: "Khalid", lastName: "Al-Mansouri", gender: "male",
        dob: "1982-07-18", nationality: "SA", placeOfBirth: "Riyadh",
        countryOfResidence: "SA", email: "khalid.mansouri@email.com",
        primaryContact: "+966 5512 3456", secondaryContact: "",
      });
      setDoc({
        holderStatus: "primary", docType: "passport", docNumber: "G8823401",
        issuingCountry: "SA", placeOfIssue: "Riyadh",
        issuingAuthority: "Government",
        issueDate: "2021-03-10", expiryDate: "2031-03-09",
      });
      setAutoFilled(true);
    } else {
      setLookupError(true);
    }
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
        icon="ri-logout-box-line"
        color="#FB923C"
        titleEn="Check-Out Event Saved!"
        titleAr="تم حفظ حدث تسجيل الخروج!"
        isAr={isAr}
        eventCode="HOTEL_CHECKOUT"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)" }}
        >
          <i className="ri-logout-box-line text-orange-400 text-xl" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-['Inter']">{t.title}</h2>
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] tracking-widest">HOTEL_CHECKOUT</p>
        </div>
      </div>

      <TipBanner text={t.tip} color="amber" />

      {/* ── Two-column: Event Info (left) + Travel Doc (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT — Event Info */}
        <SectionCard title={t.eventInfo} icon="ri-calendar-event-line" accentColor="#FB923C">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t.branch} required>
              <SelectInput
                options={BRANCHES}
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
                autoFilled={autoFilled && !!room}
                className="font-['JetBrains_Mono']"
              />
            </FormField>

            <FormField label={t.payment} required>
              <SelectInput
                options={PAYMENT_METHODS}
                placeholder={isAr ? "اختر طريقة الدفع" : "Select payment"}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </FormField>

            <FormField label={t.balance}>
              <div className="relative">
                <TextInput
                  type="number"
                  placeholder="0.000"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="font-['JetBrains_Mono'] pr-14"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-['JetBrains_Mono']"
                  style={{ color: "#22D3EE" }}
                >
                  LCY
                </span>
              </div>
            </FormField>

            <FormField label={t.scheduledDep}>
              <TextInput
                type="datetime-local"
                value={scheduledDeparture}
                onChange={(e) => setScheduledDeparture(e.target.value)}
                autoFilled={autoFilled && !!scheduledDeparture}
              />
            </FormField>

            <FormField label={t.actualDep} required className="sm:col-span-2">
              <TextInput
                type="datetime-local"
                value={actualDeparture}
                onChange={(e) => setActualDeparture(e.target.value)}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* RIGHT — Travel Doc */}
        <TravelDocSection
          data={doc}
          onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
          isAr={isAr}
          scannerConnected
          autoFilled={autoFilled}
          onScan={() => {}}
        />
      </div>

      {/* ── Full-width: Personal Details ── */}
      <PersonalDetailsSection
        data={personal}
        onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))}
        isAr={isAr}
        autoFilled={autoFilled}
      />

      <FormActions onCancel={onCancel} onSave={handleSave} saving={saving} isAr={isAr} />
    </div>
  );
};

export default CheckOutForm;
