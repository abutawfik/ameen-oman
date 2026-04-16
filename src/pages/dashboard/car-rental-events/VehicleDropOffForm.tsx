import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions,
  LookupButton, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import FuelGauge, { type FuelLevel } from "./components/FuelGauge";
import ConfirmationPanel from "./components/ConfirmationPanel";

const CONDITION_OPTIONS = [
  { value: "good",  label: "Good — No Damage" },
  { value: "minor", label: "Minor Damage" },
  { value: "major", label: "Major Damage" },
];

const CHARGE_TYPES = [
  { value: "none",     label: "No Additional Charges" },
  { value: "fuel",     label: "Fuel Charge" },
  { value: "damage",   label: "Damage Charge" },
  { value: "late",     label: "Late Return Fee" },
  { value: "cleaning", label: "Cleaning Fee" },
  { value: "multiple", label: "Multiple Charges" },
];

const RETURN_LOCATIONS = [
  { value: "capital_airport",  label: "Capital International Airport" },
  { value: "capital_city",     label: "Capital City Office" },
  { value: "northern_airport", label: "Northern Region Airport" },
  { value: "northern_city",    label: "Northern City Office" },
  { value: "southern_branch",  label: "Southern Branch" },
  { value: "eastern_branch",   label: "Eastern Branch" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const VehicleDropOffForm = ({ isAr, onCancel }: Props) => {
  const [bookingRef, setBookingRef] = useState("");
  const [plate, setPlate] = useState("");
  const [renterName, setRenterName] = useState("");
  const [branch, setBranch] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [odometer, setOdometer] = useState("");
  const [pickupOdometer, setPickupOdometer] = useState("");
  const [fuelLevel, setFuelLevel] = useState<FuelLevel>("half");
  const [condition, setCondition] = useState("good");
  const [damageNotes, setDamageNotes] = useState("");
  const [chargeType, setChargeType] = useState("none");
  const [chargeAmount, setChargeAmount] = useState("");
  const [rentalTotal, setRentalTotal] = useState("");
  const [finalInvoice, setFinalInvoice] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const t = {
    tip: isAr
      ? "أدخل رقم الحجز لاسترداد تفاصيل الإيجار وإتمام عملية الإعادة. جرّب: BK-CAR-001"
      : "Enter Booking Reference to retrieve rental details and complete the drop-off. Try: BK-CAR-001",
    lookup: isAr ? "بحث عن الحجز" : "Booking Lookup",
    bookingRef: isAr ? "رقم الحجز" : "Booking Reference",
    plate: isAr ? "لوحة المركبة" : "Vehicle Plate",
    renter: isAr ? "اسم المستأجر" : "Renter Name",
    returnDetails: isAr ? "تفاصيل الإعادة" : "Return Details",
    branch: isAr ? "الفرع" : "Branch",
    returnLoc: isAr ? "موقع الإعادة" : "Return Location",
    returnDT: isAr ? "تاريخ ووقت الإعادة الفعلي" : "Actual Return Date/Time",
    pickupOdo: isAr ? "عداد الاستلام (كم)" : "Pick-Up Odometer (km)",
    returnOdo: isAr ? "عداد الإعادة (كم)" : "Return Odometer (km)",
    totalDist: isAr ? "إجمالي المسافة المقطوعة:" : "Total Distance Driven:",
    condCharges: isAr ? "الحالة والرسوم" : "Condition & Charges",
    vehicleCondition: isAr ? "حالة المركبة" : "Vehicle Condition",
    damageNotes: isAr ? "ملاحظات الأضرار" : "Damage Notes",
    damagePlaceholder: isAr ? "وصف الأضرار بالتفصيل..." : "Describe damage in detail...",
    extraCharges: isAr ? "الرسوم الإضافية" : "Additional Charges",
    chargeAmount: isAr ? "مبلغ الرسوم (LCY)" : "Charge Amount (LCY)",
    rentalTotal: isAr ? "إجمالي الإيجار (LCY)" : "Rental Total (LCY)",
    finalInvoice: isAr ? "الفاتورة النهائية (LCY)" : "Final Invoice (LCY)",
    autoCalc: isAr ? "يُحسب تلقائياً" : "Auto-calculated",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
  };

  const conditionOpts = CONDITION_OPTIONS.map((c) => ({
    value: c.value,
    label: isAr
      ? c.value === "good" ? "جيد — لا أضرار"
        : c.value === "minor" ? "أضرار طفيفة"
        : "أضرار كبيرة"
      : c.label,
  }));

  const handleLookup = () => {
    if (bookingRef.toUpperCase() === "BK-CAR-001") {
      setLookupError(false);
      setPlate("NAT-A-4821");
      setRenterName("Khalid Al-Mansouri");
      setBranch("main");
      setPickupOdometer("24500");
      setRentalTotal("225.000");
      setAutoFilled(true);
    } else {
      setLookupError(true);
    }
  };

  const totalKm = (() => {
    const p = parseFloat(pickupOdometer);
    const d = parseFloat(odometer);
    if (!isNaN(p) && !isNaN(d) && d > p) return (d - p).toFixed(0);
    return null;
  })();

  const calcFinalInvoice = (base: string, extra: string) => {
    const b = parseFloat(base) || 0;
    const e = parseFloat(extra) || 0;
    setFinalInvoice((b + e).toFixed(3));
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

  if (confirmed) {
    return (
      <ConfirmationPanel
        refNumber={refNumber}
        eventType={isAr ? "إعادة مركبة" : "Vehicle Drop-Off"}
        eventCode="CAR_DROPOFF"
        color="#FB923C"
        isAr={isAr}
        onReset={() => { setConfirmed(false); setBookingRef(""); setPlate(""); setRenterName(""); setAutoFilled(false); setFinalInvoice(""); }}
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
        {/* LEFT — Return Details */}
        <SectionCard title={t.returnDetails} icon="ri-parking-box-line" accentColor="#FB923C">
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
              <FormField label={t.returnLoc} required>
                <SelectInput
                  options={RETURN_LOCATIONS}
                  placeholder={isAr ? "اختر الموقع" : "Select location"}
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label={t.returnDT} required>
              <TextInput
                type="datetime-local"
                value={returnDateTime}
                onChange={(e) => setReturnDateTime(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.pickupOdo}>
                <div className="relative">
                  <TextInput
                    type="number"
                    placeholder="24500"
                    value={pickupOdometer}
                    onChange={(e) => setPickupOdometer(e.target.value)}
                    autoFilled={autoFilled && !!pickupOdometer}
                    className="font-['JetBrains_Mono'] pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-['JetBrains_Mono']">km</span>
                </div>
              </FormField>
              <FormField label={t.returnOdo} required>
                <div className="relative">
                  <TextInput
                    type="number"
                    placeholder="25800"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="font-['JetBrains_Mono'] pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-['JetBrains_Mono']">km</span>
                </div>
              </FormField>
            </div>

            {totalKm && (
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}
              >
                <i className="ri-route-line text-cyan-400 text-sm" />
                <span className="text-gray-400 text-xs font-['Inter']">{t.totalDist}</span>
                <span className="text-cyan-400 font-bold font-['JetBrains_Mono']">{totalKm} km</span>
              </div>
            )}

            <FuelGauge value={fuelLevel} onChange={setFuelLevel} isAr={isAr} />
          </div>
        </SectionCard>

        {/* RIGHT — Condition & Charges */}
        <SectionCard title={t.condCharges} icon="ri-file-damage-line">
          <div className="space-y-4">
            <FormField label={t.vehicleCondition} required>
              <RadioGroup
                name="condition"
                options={conditionOpts}
                value={condition}
                onChange={setCondition}
              />
            </FormField>

            {/* Condition indicator */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{
                background: condition === "good" ? "rgba(74,222,128,0.04)" : condition === "minor" ? "rgba(250,204,21,0.04)" : "rgba(248,113,113,0.04)",
                borderColor: condition === "good" ? "rgba(74,222,128,0.18)" : condition === "minor" ? "rgba(250,204,21,0.18)" : "rgba(248,113,113,0.18)",
              }}
            >
              <i
                className={`text-lg ${condition === "good" ? "ri-checkbox-circle-line" : condition === "minor" ? "ri-alert-line" : "ri-error-warning-line"}`}
                style={{ color: condition === "good" ? "#4ADE80" : condition === "minor" ? "#FACC15" : "#F87171" }}
              />
              <span
                className="text-sm font-semibold font-['Inter']"
                style={{ color: condition === "good" ? "#4ADE80" : condition === "minor" ? "#FACC15" : "#F87171" }}
              >
                {condition === "good"
                  ? (isAr ? "المركبة في حالة جيدة" : "Vehicle returned in good condition")
                  : condition === "minor"
                  ? (isAr ? "أضرار طفيفة — يرجى التوثيق" : "Minor damage — please document")
                  : (isAr ? "أضرار كبيرة — مطلوب تقرير" : "Major damage — report required")}
              </span>
            </div>

            {condition !== "good" && (
              <FormField label={t.damageNotes} required>
                <textarea
                  rows={3}
                  placeholder={t.damagePlaceholder}
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 font-['Inter'] resize-none"
                  style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={(e) => { e.target.style.borderColor = "#22D3EE"; e.target.style.boxShadow = "0 0 0 2px rgba(34,211,238,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </FormField>
            )}

            <FormField label={t.extraCharges}>
              <SelectInput
                options={CHARGE_TYPES}
                placeholder={isAr ? "اختر نوع الرسوم" : "Select charge type"}
                value={chargeType}
                onChange={(e) => setChargeType(e.target.value)}
              />
            </FormField>

            {chargeType !== "none" && chargeType !== "" && (
              <FormField label={t.chargeAmount}>
                <div className="relative">
                  <TextInput
                    type="number"
                    placeholder="0.000"
                    value={chargeAmount}
                    onChange={(e) => { setChargeAmount(e.target.value); calcFinalInvoice(rentalTotal, e.target.value); }}
                    className="font-['JetBrains_Mono'] pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-['JetBrains_Mono']" style={{ color: "#22D3EE" }}>LCY</span>
                </div>
              </FormField>
            )}

            {/* Final Invoice */}
            <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t.rentalTotal}>
                  <div className="relative">
                    <TextInput
                      type="number"
                      placeholder="0.000"
                      value={rentalTotal}
                      onChange={(e) => { setRentalTotal(e.target.value); calcFinalInvoice(e.target.value, chargeAmount); }}
                      autoFilled={autoFilled && !!rentalTotal}
                      className="font-['JetBrains_Mono'] pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-['JetBrains_Mono']" style={{ color: "#22D3EE" }}>LCY</span>
                  </div>
                </FormField>
                <FormField label={t.finalInvoice}>
                  <div
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-bold font-['JetBrains_Mono'] flex items-center justify-between"
                    style={{
                      background: "rgba(34,211,238,0.06)",
                      border: "1px solid rgba(34,211,238,0.2)",
                      color: "#22D3EE",
                      minHeight: "42px",
                    }}
                  >
                    <span>{finalInvoice ? `LCY ${finalInvoice}` : t.autoCalc}</span>
                    {finalInvoice && <i className="ri-checkbox-circle-line text-sm" />}
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تأكيد الإعادة وإصدار الفاتورة" : "Confirm Drop-Off & Issue Invoice"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default VehicleDropOffForm;
