import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
  LookupButton, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import FuelGauge, { type FuelLevel } from "./components/FuelGauge";
import PhotoUploadZones from "./components/PhotoUploadZones";
import ConfirmationPanel from "./components/ConfirmationPanel";

interface Props { isAr: boolean; onCancel: () => void; }

const VehiclePickUpForm = ({ isAr, onCancel }: Props) => {
  const [bookingRef, setBookingRef] = useState("");
  const [branch, setBranch] = useState("");
  const [plate, setPlate] = useState("");
  const [renterName, setRenterName] = useState("");
  const [actualPickupDateTime, setActualPickupDateTime] = useState("");
  const [odometer, setOdometer] = useState("");
  const [fuelLevel, setFuelLevel] = useState<FuelLevel>("full");
  const [conditionNotes, setConditionNotes] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const t = {
    tip: isAr
      ? "أدخل رقم الحجز لاسترداد تفاصيل المركبة والمستأجر تلقائياً. جرّب: BK-CAR-001"
      : "Enter Booking Reference to auto-retrieve vehicle and renter details. Try: BK-CAR-001",
    lookup: isAr ? "بحث عن الحجز" : "Booking Lookup",
    bookingRef: isAr ? "رقم الحجز" : "Booking Reference",
    plate: isAr ? "لوحة المركبة" : "Vehicle Plate",
    renter: isAr ? "اسم المستأجر" : "Renter Name",
    pickupDetails: isAr ? "تفاصيل الاستلام" : "Pick-Up Details",
    branch: isAr ? "الفرع" : "Branch",
    actualDT: isAr ? "تاريخ ووقت الاستلام الفعلي" : "Actual Pick-Up Date/Time",
    odometer: isAr ? "قراءة عداد المسافة (كم)" : "Odometer Reading (km)",
    conditionNotes: isAr ? "ملاحظات الحالة" : "Condition Notes",
    conditionPlaceholder: isAr ? "أي ملاحظات حول حالة المركبة عند الاستلام..." : "Any notes about vehicle condition at pick-up...",
    panel: isAr ? "لوحة البيانات" : "Instrument Panel",
    fuelAtPickup: isAr ? "الوقود عند الاستلام" : "Fuel at Pick-Up",
    checklist: isAr ? "قائمة التحقق" : "Pick-Up Checklist",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
  };

  const handleLookup = () => {
    if (bookingRef.toUpperCase() === "BK-CAR-001") {
      setLookupError(false);
      setPlate("NAT-A-4821");
      setRenterName("Khalid Al-Mansouri");
      setBranch("main");
      setAutoFilled(true);
    } else {
      setLookupError(true);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      setRefNumber(`AMN-CAR-${Date.now()}-${seq}`);
      setConfirmed(true);
    }, 1800);
  };

  const fuelLabel = {
    full: isAr ? "ممتلئ" : "Full",
    "three-quarter": "3/4",
    half: "1/2",
    quarter: "1/4",
    empty: isAr ? "فارغ" : "Empty",
  }[fuelLevel];

  if (confirmed) {
    return (
      <ConfirmationPanel
        refNumber={refNumber}
        eventType={isAr ? "استلام مركبة" : "Vehicle Pick-Up"}
        eventCode="CAR_PICKUP"
        color="#4ADE80"
        isAr={isAr}
        onReset={() => { setConfirmed(false); setBookingRef(""); setPlate(""); setRenterName(""); setAutoFilled(false); }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner text={t.tip} color="amber" />

      {/* Booking Lookup */}
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

      {/* Two-column: Pick-Up Details + Instrument Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT — Pick-Up Details */}
        <SectionCard title={t.pickupDetails} icon="ri-key-2-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.branch} required>
                <SelectInput
                  options={BRANCHES}
                  placeholder={isAr ? "اختر الفرع" : "Select branch"}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </FormField>
              <FormField label={t.actualDT} required>
                <TextInput
                  type="datetime-local"
                  value={actualPickupDateTime}
                  onChange={(e) => setActualPickupDateTime(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label={t.odometer} required>
              <div className="relative">
                <TextInput
                  type="number"
                  placeholder="e.g. 24500"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="font-['JetBrains_Mono'] pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">km</span>
              </div>
            </FormField>

            <FuelGauge value={fuelLevel} onChange={setFuelLevel} isAr={isAr} />

            <FormField label={t.conditionNotes}>
              <textarea
                rows={4}
                placeholder={t.conditionPlaceholder}
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 font-['Inter'] resize-none"
                style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => { e.target.style.borderColor = "#D4A84B"; e.target.style.boxShadow = "0 0 0 2px rgba(181,142,60,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* RIGHT — Instrument Panel */}
        <SectionCard title={t.panel} icon="ri-dashboard-3-line">
          <div className="space-y-4">
            {/* Odometer display */}
            <div
              className="rounded-xl p-5 flex flex-col items-center"
              style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-gray-600 text-xs mb-3 font-['JetBrains_Mono'] tracking-widest uppercase">
                {isAr ? "عداد المسافة" : "Odometer"}
              </p>
              <div
                className="flex items-center gap-1 px-5 py-3 rounded-xl"
                style={{ background: "#0B1220", border: "1px solid rgba(181,142,60,0.18)" }}
              >
                {(odometer || "000000").padStart(6, "0").split("").map((digit, i) => (
                  <div
                    key={i}
                    className="w-9 h-12 flex items-center justify-center rounded-lg text-xl font-bold font-['JetBrains_Mono']"
                    style={{
                      background: "rgba(181,142,60,0.04)",
                      border: "1px solid rgba(181,142,60,0.12)",
                      color: digit !== "0" || odometer ? "#D4A84B" : "#1E3A4A",
                    }}
                  >
                    {digit}
                  </div>
                ))}
                <span className="text-gray-600 text-xs ml-2 font-['JetBrains_Mono']">km</span>
              </div>
            </div>

            {/* Fuel summary */}
            <div
              className="flex items-center gap-4 px-4 py-3 rounded-xl border"
              style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.15)" }}
              >
                <i className="ri-gas-station-fill text-gold-400 text-lg" />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-['Inter']">{t.fuelAtPickup}</p>
                <p className="text-white font-bold text-lg font-['JetBrains_Mono']">{fuelLabel}</p>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <p className="text-gray-500 text-xs mb-2 font-['Inter'] uppercase tracking-wide">{t.checklist}</p>
              {[
                { label: isAr ? "تم التحقق من الوثائق" : "Documents verified", done: true },
                { label: isAr ? "تم فحص المركبة" : "Vehicle inspected", done: true },
                { label: isAr ? "تم تسليم المفاتيح" : "Keys handed over", done: false },
                { label: isAr ? "تم توقيع العقد" : "Contract signed", done: false },
                { label: isAr ? "تم تصوير المركبة" : "Vehicle photographed", done: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-2 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      background: item.done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${item.done ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {item.done && <i className="ri-check-line text-green-400 text-xs" />}
                  </div>
                  <span className="text-xs font-['Inter']" style={{ color: item.done ? "#D1D5DB" : "#4B5563" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Photo Upload */}
      <SectionCard title={isAr ? "صور حالة المركبة" : "Vehicle Condition Photos"} icon="ri-camera-line">
        <PhotoUploadZones isAr={isAr} />
      </SectionCard>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تأكيد الاستلام" : "Confirm Pick-Up"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default VehiclePickUpForm;
