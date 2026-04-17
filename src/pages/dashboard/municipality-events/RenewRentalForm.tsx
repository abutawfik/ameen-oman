import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import MunConfirmation from "./components/MunConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const RenewRentalForm = ({ isAr, onCancel }: Props) => {
  const [agreementRef, setAgreementRef] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [currentEndDate, setCurrentEndDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [currentRent, setCurrentRent] = useState("");
  const [newRent, setNewRent] = useState("");
  const [occupantChanges, setOccupantChanges] = useState("no");
  const [occupantNotes, setOccupantNotes] = useState("");
  const [renewalNotes, setRenewalNotes] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const MOCK_AGREEMENTS: Record<string, { tenant: string; address: string; endDate: string; rent: string }> = {
    "AGR-2024-001": { tenant: "Mohammed Al-Farsi", address: "Block 7, Northern District, Capital Region", endDate: "2026-06-30", rent: "1200.000" },
    "AGR-2024-002": { tenant: "Sarah Johnson", address: "Unit 4B, Eastern Area, Coastal Region", endDate: "2026-03-31", rent: "850.000" },
  };

  const handleLookup = () => {
    const found = MOCK_AGREEMENTS[agreementRef.toUpperCase()];
    if (found) {
      setTenantName(found.tenant);
      setPropertyAddress(found.address);
      setCurrentEndDate(found.endDate);
      setCurrentRent(found.rent);
      setAutoFilled(true);
      setLookupError(false);
    } else {
      setLookupError(true);
      setAutoFilled(false);
    }
  };

  const rentDiff = (() => {
    const c = parseFloat(currentRent);
    const n = parseFloat(newRent);
    if (!isNaN(c) && !isNaN(n) && c > 0) {
      const pct = (((n - c) / c) * 100).toFixed(1);
      return { diff: (n - c).toFixed(3), pct, up: n >= c };
    }
    return null;
  })();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const seq = Math.floor(Math.random() * 9000) + 1000;
      setRefNumber(`AMN-MUN-${Date.now()}-${seq}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed)
    return (
      <MunConfirmation
        refNumber={refNumber}
        eventType={isAr ? "تجديد إيجار" : "Renew Rental"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setAgreementRef(""); setAutoFilled(false); }}
      />
    );

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "أدخل رقم مرجع العقد لاسترداد تفاصيل الإيجار الحالي. جرّب: AGR-2024-001" : "Enter Agreement Reference to retrieve current rental details. Try: AGR-2024-001"}
        color="amber"
      />

      {/* Lookup */}
      <SectionCard title={isAr ? "بحث عن العقد" : "Agreement Lookup"} icon="ri-search-line">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-48">
            <FormField label={isAr ? "رقم مرجع العقد" : "Agreement Reference"} required>
              <div className="flex gap-2">
                <TextInput
                  placeholder="AGR-XXXX-XXX"
                  value={agreementRef}
                  onChange={(e) => { setAgreementRef(e.target.value); setLookupError(false); }}
                  className="font-['JetBrains_Mono']"
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
                  style={{ background: "rgba(184,138,60,0.12)", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.12)"; }}
                >
                  <i className="ri-search-line text-xs" />{isAr ? "بحث" : "Lookup"}
                </button>
              </div>
            </FormField>
          </div>
          {autoFilled && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
              <i className="ri-checkbox-circle-line text-green-400 text-sm" />
              <span className="text-green-400 text-xs font-semibold">{isAr ? "تم العثور على العقد" : "Agreement found"}</span>
            </div>
          )}
          {lookupError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.2)" }}>
              <i className="ri-close-circle-line text-red-400 text-sm" />
              <span className="text-red-400 text-xs font-semibold">{isAr ? "لم يُعثر على العقد" : "Agreement not found"}</span>
            </div>
          )}
        </div>
        {autoFilled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <FormField label={isAr ? "اسم المستأجر" : "Tenant Name"}>
              <TextInput value={tenantName} onChange={(e) => setTenantName(e.target.value)} autoFilled />
            </FormField>
            <FormField label={isAr ? "عنوان العقار" : "Property Address"}>
              <TextInput value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} autoFilled />
            </FormField>
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Renewal Dates */}
        <SectionCard title={isAr ? "تفاصيل التجديد" : "Renewal Details"} icon="ri-refresh-line">
          <div className="space-y-4">
            <FormField label={isAr ? "تاريخ انتهاء العقد الحالي" : "Current End Date"}>
              <TextInput type="date" value={currentEndDate} onChange={(e) => setCurrentEndDate(e.target.value)} autoFilled={autoFilled && !!currentEndDate} />
            </FormField>
            <FormField label={isAr ? "تاريخ الانتهاء الجديد" : "New End Date"} required>
              <TextInput type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "ملاحظات التجديد" : "Renewal Notes"}>
              <textarea
                rows={4}
                placeholder={isAr ? "أي ملاحظات حول التجديد..." : "Any notes about the renewal..."}
                value={renewalNotes}
                onChange={(e) => setRenewalNotes(e.target.value)}
                maxLength={500}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 resize-none"
                style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter, sans-serif" }}
                onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; e.target.style.boxShadow = "0 0 0 2px rgba(184,138,60,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
              <p className="text-gray-600 text-xs mt-1 text-right font-['JetBrains_Mono']">{renewalNotes.length}/500</p>
            </FormField>
          </div>
        </SectionCard>

        {/* Rent & Occupants */}
        <SectionCard title={isAr ? "الإيجار والساكنون" : "Rent & Occupants"} icon="ri-money-dollar-circle-line">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الإيجار الحالي (LCY)" : "Current Rent (LCY)"}>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} autoFilled={autoFilled && !!currentRent} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
              <FormField label={isAr ? "الإيجار الجديد (LCY)" : "New Rent (LCY)"} required>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={newRent} onChange={(e) => setNewRent(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
            </div>

            {rentDiff && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: rentDiff.up ? "rgba(201,138,27,0.05)" : "rgba(74,222,128,0.05)",
                  borderColor: rentDiff.up ? "rgba(201,138,27,0.2)" : "rgba(74,222,128,0.2)",
                }}
              >
                <i className={`${rentDiff.up ? "ri-arrow-up-line text-orange-400" : "ri-arrow-down-line text-green-400"} text-lg`} />
                <div>
                  <p className="font-bold text-sm font-['JetBrains_Mono']" style={{ color: rentDiff.up ? "#C98A1B" : "#4ADE80" }}>
                    {rentDiff.up ? "+" : ""}{rentDiff.diff} LCY ({rentDiff.up ? "+" : ""}{rentDiff.pct}%)
                  </p>
                  <p className="text-gray-500 text-xs">{isAr ? "تغيير الإيجار" : "Rent change"}</p>
                </div>
              </div>
            )}

            <FormField label={isAr ? "تغييرات في الساكنين؟" : "Occupant Changes?"} required>
              <SelectInput
                options={[
                  { value: "no",      label: isAr ? "لا تغييرات" : "No changes" },
                  { value: "added",   label: isAr ? "تمت إضافة ساكنين" : "Occupants added" },
                  { value: "removed", label: isAr ? "تمت إزالة ساكنين" : "Occupants removed" },
                  { value: "both",    label: isAr ? "إضافة وإزالة" : "Both added & removed" },
                ]}
                placeholder={isAr ? "اختر" : "Select"}
                value={occupantChanges}
                onChange={(e) => setOccupantChanges(e.target.value)}
              />
            </FormField>

            {occupantChanges !== "no" && (
              <FormField label={isAr ? "تفاصيل التغييرات" : "Change Details"} required>
                <textarea
                  rows={3}
                  placeholder={isAr ? "اذكر أسماء الساكنين المضافين أو المُزالين..." : "List names of added/removed occupants..."}
                  value={occupantNotes}
                  onChange={(e) => setOccupantNotes(e.target.value)}
                  maxLength={500}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 resize-none"
                  style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter, sans-serif" }}
                  onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; e.target.style.boxShadow = "0 0 0 2px rgba(184,138,60,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </FormField>
            )}
          </div>
        </SectionCard>
      </div>

      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تأكيد التجديد" : "Confirm Renewal"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default RenewRentalForm;
