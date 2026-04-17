import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions, LookupButton,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import ConfirmationPanel from "./components/ConfirmationPanel";

const EXTENSION_REASONS = [
  { value: "travel_delay",  label: "Travel Delay" },
  { value: "business",      label: "Business Extension" },
  { value: "personal",      label: "Personal Request" },
  { value: "medical",       label: "Medical Reason" },
  { value: "weather",       label: "Weather Conditions" },
  { value: "other",         label: "Other" },
];

const INSURANCE_TYPES = [
  { value: "basic",   label: "Basic" },
  { value: "full",    label: "Full Coverage" },
  { value: "premium", label: "Premium" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const RentExtendedForm = ({ isAr, onCancel }: Props) => {
  const [bookingRef, setBookingRef] = useState("");
  const [plate, setPlate] = useState("");
  const [renterName, setRenterName] = useState("");
  const [originalReturn, setOriginalReturn] = useState("");
  const [newReturnDate, setNewReturnDate] = useState("");
  const [extensionReason, setExtensionReason] = useState("");
  const [additionalInsurance, setAdditionalInsurance] = useState(false);
  const [insuranceType, setInsuranceType] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [revisedTotal, setRevisedTotal] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const t = {
    tip: isAr
      ? "أدخل رقم الحجز لاسترداد تفاصيل الإيجار الحالي. جرّب: BK-CAR-001"
      : "Enter Booking Reference to retrieve current rental details. Try: BK-CAR-001",
    lookup: isAr ? "بحث عن الحجز" : "Booking Lookup",
    bookingRef: isAr ? "رقم الحجز" : "Booking Reference",
    plate: isAr ? "لوحة المركبة" : "Vehicle Plate",
    renter: isAr ? "اسم المستأجر" : "Renter Name",
    extDetails: isAr ? "تفاصيل التمديد" : "Extension Details",
    originalReturn: isAr ? "تاريخ الإعادة الأصلي" : "Original Return Date",
    newReturn: isAr ? "تاريخ الإعادة الجديد" : "New Return Date",
    extDuration: isAr ? "مدة التمديد" : "Extension Duration",
    reason: isAr ? "سبب التمديد" : "Extension Reason",
    insuranceBilling: isAr ? "التأمين والفاتورة" : "Insurance & Billing",
    addInsurance: isAr ? "تأمين إضافي" : "Additional Insurance",
    addInsuranceDesc: isAr ? "إضافة تغطية تأمينية للفترة الممتدة" : "Add coverage for the extended period",
    insuranceType: isAr ? "نوع التأمين" : "Insurance Type",
    dailyRate: isAr ? "السعر اليومي (LCY)" : "Daily Rate (LCY)",
    revisedTotal: isAr ? "الإجمالي المعدّل (LCY)" : "Revised Total (LCY)",
    extSummary: isAr ? "ملخص التمديد" : "Extension Summary",
    extDays: isAr ? "أيام التمديد" : "Extension Days",
    total: isAr ? "الإجمالي" : "Total",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
  };

  const handleLookup = () => {
    if (bookingRef.toUpperCase() === "BK-CAR-001") {
      setLookupError(false);
      setPlate("NAT-A-4821");
      setRenterName("Khalid Al-Mansouri");
      setOriginalReturn("2026-04-10T14:00");
      setDailyRate("45.000");
      setAutoFilled(true);
    } else {
      setLookupError(true);
    }
  };

  const calcTotal = (newDate: string) => {
    if (!originalReturn || !newDate || !dailyRate) return;
    const diff = Math.ceil((new Date(newDate).getTime() - new Date(originalReturn).getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) setRevisedTotal((diff * parseFloat(dailyRate)).toFixed(3));
  };

  const extensionDays = (() => {
    if (!originalReturn || !newReturnDate) return 0;
    const diff = Math.ceil((new Date(newReturnDate).getTime() - new Date(originalReturn).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      setRefNumber(`AMN-CAR-${Date.now()}-${seq}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed) {
    return (
      <ConfirmationPanel
        refNumber={refNumber}
        eventType={isAr ? "تمديد الإيجار" : "Rent Extension"}
        eventCode="CAR_EXTEND"
        color="#FACC15"
        isAr={isAr}
        onReset={() => { setConfirmed(false); setBookingRef(""); setPlate(""); setRenterName(""); setAutoFilled(false); setRevisedTotal(""); }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner text={t.tip} color="amber" />

      {/* Lookup */}
      <SectionCard title={t.lookup} icon="ri-search-line">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label={t.bookingRef} required>
            <div className="flex gap-2">
              <TextInput
                placeholder="BK-CAR-XXX"
                value={bookingRef}
                onChange={(e) => { setBookingRef(e.target.value); setLookupError(false); }}
                className="flex-1 font-['JetBrains_Mono'] tracking-wider"
              />
              <LookupButton onClick={handleLookup} isAr={isAr} />
            </div>
            {lookupError && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <i className="ri-error-warning-line" />{t.notFound}
              </p>
            )}
          </FormField>
          <FormField label={t.plate}>
            <TextInput
              placeholder="NAT-A-XXXX"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              autoFilled={autoFilled && !!plate}
              className="font-['JetBrains_Mono'] tracking-wider"
            />
          </FormField>
          <FormField label={t.renter}>
            <TextInput
              placeholder={isAr ? "الاسم الكامل" : "Full name"}
              value={renterName}
              onChange={(e) => setRenterName(e.target.value)}
              autoFilled={autoFilled && !!renterName}
            />
          </FormField>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT — Extension Details */}
        <SectionCard title={t.extDetails} icon="ri-time-line" accentColor="#FACC15">
          <div className="space-y-4">
            <FormField label={t.originalReturn}>
              <TextInput
                type="datetime-local"
                value={originalReturn}
                onChange={(e) => setOriginalReturn(e.target.value)}
                autoFilled={autoFilled && !!originalReturn}
              />
            </FormField>

            <FormField label={t.newReturn} required>
              <TextInput
                type="datetime-local"
                value={newReturnDate}
                onChange={(e) => { setNewReturnDate(e.target.value); calcTotal(e.target.value); }}
              />
            </FormField>

            {extensionDays > 0 && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ background: "rgba(250,204,21,0.05)", borderColor: "rgba(250,204,21,0.2)" }}
              >
                <i className="ri-calendar-check-line text-yellow-400" />
                <div>
                  <p className="text-gray-500 text-xs font-['Inter']">{t.extDuration}</p>
                  <p className="text-yellow-400 font-bold font-['JetBrains_Mono']">
                    {extensionDays} {isAr ? "يوم" : extensionDays === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>
            )}

            <FormField label={t.reason} required>
              <SelectInput
                options={EXTENSION_REASONS}
                placeholder={isAr ? "اختر السبب" : "Select reason"}
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* RIGHT — Insurance & Billing */}
        <SectionCard title={t.insuranceBilling} icon="ri-shield-check-line">
          <div className="space-y-4">
            {/* Toggle */}
            <div
              className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all"
              style={{
                background: additionalInsurance ? "rgba(181,142,60,0.05)" : "rgba(255,255,255,0.02)",
                borderColor: additionalInsurance ? "rgba(181,142,60,0.25)" : "rgba(255,255,255,0.07)",
              }}
              onClick={() => setAdditionalInsurance((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    background: additionalInsurance ? "rgba(181,142,60,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${additionalInsurance ? "rgba(181,142,60,0.25)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <i className={`ri-shield-line text-base ${additionalInsurance ? "text-gold-400" : "text-gray-600"}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold font-['Inter']">{t.addInsurance}</p>
                  <p className="text-gray-500 text-xs font-['Inter']">{t.addInsuranceDesc}</p>
                </div>
              </div>
              <div
                className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                style={{ background: additionalInsurance ? "#D4A84B" : "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
                  style={{ left: additionalInsurance ? "calc(100% - 22px)" : "2px" }}
                />
              </div>
            </div>

            {additionalInsurance && (
              <FormField label={t.insuranceType} required>
                <SelectInput
                  options={INSURANCE_TYPES}
                  placeholder={isAr ? "اختر نوع التأمين" : "Select insurance type"}
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                />
              </FormField>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.dailyRate}>
                <div className="relative">
                  <TextInput
                    type="number"
                    placeholder="0.000"
                    value={dailyRate}
                    onChange={(e) => { setDailyRate(e.target.value); calcTotal(newReturnDate); }}
                    autoFilled={autoFilled && !!dailyRate}
                    className="font-['JetBrains_Mono'] pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-['JetBrains_Mono']" style={{ color: "#D4A84B" }}>LCY</span>
                </div>
              </FormField>
              <FormField label={t.revisedTotal}>
                <div className="relative">
                  <TextInput
                    type="number"
                    placeholder="0.000"
                    value={revisedTotal}
                    onChange={(e) => setRevisedTotal(e.target.value)}
                    className="font-['JetBrains_Mono'] pr-12"
                    style={{ color: "#D4A84B" }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-['JetBrains_Mono']" style={{ color: "#D4A84B" }}>LCY</span>
                </div>
              </FormField>
            </div>

            {/* Summary */}
            {revisedTotal && (
              <div
                className="rounded-xl p-4 border"
                style={{ background: "rgba(181,142,60,0.03)", borderColor: "rgba(181,142,60,0.12)" }}
              >
                <p className="text-gray-500 text-xs mb-3 font-['Inter'] uppercase tracking-wide">{t.extSummary}</p>
                {[
                  { label: t.extDays, value: `${extensionDays} ${isAr ? "يوم" : "days"}` },
                  { label: t.dailyRate, value: `LCY ${dailyRate}` },
                  { label: t.total, value: `LCY ${revisedTotal}`, highlight: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <span className="text-gray-500 text-xs font-['Inter']">{row.label}</span>
                    <span
                      className="text-sm font-bold font-['JetBrains_Mono']"
                      style={{ color: row.highlight ? "#D4A84B" : "#D1D5DB" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تأكيد التمديد" : "Confirm Extension"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default RentExtendedForm;
