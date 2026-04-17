import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
  RadioGroup, SuccessScreen, BRANCHES, PAYMENT_METHODS, CARD_TYPES,
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

const BookingForm = ({ isAr, onCancel, onSaved }: Props) => {
  const [part, setPart] = useState<1 | 2>(1);
  const [bookingType, setBookingType] = useState("individual");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  // Corporate fields
  const [corpMocNo, setCorpMocNo] = useState("");
  const [corpName, setCorpName] = useState("");
  const [corpJobTitle, setCorpJobTitle] = useState("");
  // Event info
  const [branch, setBranch] = useState("");
  const [room, setRoom] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardType, setCardType] = useState("");
  const [arrivalDT, setArrivalDT] = useState("");
  const [departureDT, setDepartureDT] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const t = {
    title: isAr ? "حجز جديد" : "New Booking",
    part1: isAr ? "الجزء 1 — البيانات الشخصية" : "Part 1 — Personal Details",
    part2: isAr ? "الجزء 2 — معلومات الحدث" : "Part 2 — Event Information",
    bookingType: isAr ? "نوع الحجز" : "Booking Type",
    individual: isAr ? "فردي" : "Individual",
    corporate: isAr ? "مؤسسي" : "Corporate",
    corpSection: isAr ? "بيانات المنظمة" : "Corporate Details",
    mocNo: isAr ? "رقم MOC للمنظمة" : "Booking Org MOC No.",
    corpName: isAr ? "اسم المنظمة" : "Organization Name",
    jobTitle: isAr ? "المسمى الوظيفي" : "Job Title",
    eventInfo: isAr ? "معلومات الحدث" : "Event Information",
    branch: isAr ? "الفرع" : "Branch",
    room: isAr ? "رقم الغرفة" : "Room Number",
    payment: isAr ? "طريقة الدفع" : "Payment Method",
    cardType: isAr ? "نوع البطاقة" : "Card Type",
    arrival: isAr ? "تاريخ ووقت الوصول" : "Arrival Date & Time",
    departure: isAr ? "تاريخ ووقت المغادرة" : "Departure Date & Time",
    next: isAr ? "التالي: معلومات الحدث" : "Next: Event Information",
    back: isAr ? "السابق" : "Back",
    tip: isAr
      ? "أكمل البيانات الشخصية أولاً، ثم انتقل إلى معلومات الحدث."
      : "Complete personal details first, then proceed to event information.",
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
        icon="ri-calendar-check-line"
        color="#D4A84B"
        titleEn="Booking Event Saved!"
        titleAr="تم حفظ الحجز!"
        isAr={isAr}
        eventCode="HOTEL_BOOKING"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.3)" }}
        >
          <i className="ri-calendar-line text-gold-400 text-xl" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-['Inter']">{t.title}</h2>
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] tracking-widest">HOTEL_BOOKING</p>
        </div>
      </div>

      {/* Part stepper */}
      <div className="flex items-center gap-0">
        {([1, 2] as const).map((p, idx) => (
          <div key={p} className="flex items-center">
            <button
              type="button"
              onClick={() => { if (p < part || p === 1) setPart(p); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter'] border"
              style={{
                background: part === p ? "rgba(181,142,60,0.12)" : part > p ? "rgba(74,222,128,0.08)" : "rgba(20,29,46,0.6)",
                borderColor: part === p ? "rgba(181,142,60,0.35)" : part > p ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.06)",
                color: part === p ? "#D4A84B" : part > p ? "#4ADE80" : "#4B5563",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: part === p ? "#D4A84B" : part > p ? "#4ADE80" : "rgba(255,255,255,0.08)",
                  color: part === p || part > p ? "#0B1220" : "#6B7280",
                }}
              >
                {part > p ? <i className="ri-check-line text-xs" /> : p}
              </div>
              {p === 1 ? t.part1 : t.part2}
            </button>
            {idx === 0 && (
              <div className="w-8 h-px mx-1" style={{ background: part > 1 ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)" }} />
            )}
          </div>
        ))}
      </div>

      <TipBanner text={t.tip} color="cyan" />

      {/* ── PART 1 ── */}
      {part === 1 && (
        <>
          {/* Booking type */}
          <SectionCard title={t.bookingType} icon="ri-user-settings-line">
            <RadioGroup
              name="bookingType"
              options={[
                { value: "individual", label: t.individual },
                { value: "corporate", label: t.corporate },
              ]}
              value={bookingType}
              onChange={setBookingType}
            />
          </SectionCard>

          {/* Corporate fields */}
          {bookingType === "corporate" && (
            <SectionCard title={t.corpSection} icon="ri-building-line" accentColor="#FACC15">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label={t.mocNo} required>
                  <TextInput
                    placeholder="MOC-XXXXXXXX"
                    value={corpMocNo}
                    onChange={(e) => setCorpMocNo(e.target.value)}
                    className="font-['JetBrains_Mono'] tracking-wider"
                  />
                </FormField>
                <FormField label={t.corpName} required>
                  <TextInput
                    placeholder={isAr ? "اسم الشركة" : "Company name"}
                    value={corpName}
                    onChange={(e) => setCorpName(e.target.value)}
                  />
                </FormField>
                <FormField label={t.jobTitle}>
                  <TextInput
                    placeholder={isAr ? "المسمى الوظيفي" : "Job title"}
                    value={corpJobTitle}
                    onChange={(e) => setCorpJobTitle(e.target.value)}
                  />
                </FormField>
              </div>
            </SectionCard>
          )}

          {/* Personal Details */}
          <PersonalDetailsSection
            data={personal}
            onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))}
            isAr={isAr}
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setPart(2)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
              style={{ background: "#D4A84B", color: "#0B1220" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D4A84B"; }}
            >
              {t.next}
              <i className="ri-arrow-right-line" />
            </button>
          </div>
        </>
      )}

      {/* ── PART 2 ── */}
      {part === 2 && (
        <>
          {/* Two-column: Event Info + Travel Doc */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <SectionCard title={t.eventInfo} icon="ri-calendar-event-line">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t.branch} required>
                  <SelectInput
                    options={BRANCHES}
                    placeholder={isAr ? "اختر الفرع" : "Select branch"}
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </FormField>

                <FormField label={t.room} required>
                  <TextInput
                    placeholder={isAr ? "مثال: 412" : "e.g. 412"}
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
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
                  />
                </FormField>

                <FormField label={t.departure} required>
                  <TextInput
                    type="datetime-local"
                    value={departureDT}
                    onChange={(e) => setDepartureDT(e.target.value)}
                  />
                </FormField>
              </div>
            </SectionCard>

            <TravelDocSection
              data={doc}
              onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
              isAr={isAr}
              scannerConnected
              autoFilled={false}
              onScan={() => {}}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setPart(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
              style={{ background: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#9CA3AF" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
              }}
            >
              <i className="ri-arrow-left-line" />{t.back}
            </button>
            <FormActions onCancel={onCancel} onSave={handleSave} saving={saving} isAr={isAr} />
          </div>
        </>
      )}
    </div>
  );
};

export default BookingForm;
