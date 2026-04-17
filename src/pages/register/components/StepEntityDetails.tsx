import { useState } from "react";

const governorates = [
  "Muscat", "Dhofar", "Musandam", "Al Buraimi", "Ad Dakhiliyah",
  "North Al Batinah", "South Al Batinah", "North Ash Sharqiyah",
  "South Ash Sharqiyah", "Ad Dhahirah", "Al Wusta",
];
const governoratesAr = [
  "مسقط", "ظفار", "مسندم", "البريمي", "الداخلية",
  "شمال الباطنة", "جنوب الباطنة", "شمال الشرقية",
  "جنوب الشرقية", "الظاهرة", "الوسطى",
];

interface Props {
  entityType: string;
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
  isAr: boolean;
}

const inputBase = "w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all font-['Inter']";
const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" };
const selectStyle = { background: "rgba(20,29,46,0.95)", border: "1px solid rgba(255,255,255,0.08)" };

const onFocusCyan = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "rgba(181,142,60,0.5)";
};
const onBlurDefault = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "rgba(255,255,255,0.08)";
};

interface FieldProps { label: string; required?: boolean; children: React.ReactNode; }
const Field = ({ label, required, children }: FieldProps) => (
  <div>
    <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

interface InputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (k: string, v: string) => void;
  type?: string;
}
const Input = ({ name, placeholder, value, onChange, type = "text" }: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(name, e.target.value)}
    placeholder={placeholder}
    className={inputBase}
    style={inputStyle}
    onFocus={onFocusCyan}
    onBlur={onBlurDefault}
  />
);

const SectionHeader = ({ label }: { label: string }) => (
  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3 font-['JetBrains_Mono'] flex items-center gap-2">
    <span className="w-4 h-px bg-gold-400/40 inline-block" />
    {label}
  </p>
);

const StepEntityDetails = ({ entityType, data, onChange, isAr }: Props) => {
  const [branchCount, setBranchCount] = useState(1);

  const isChain = entityType === "hotel" && (data.chain || "").trim().length > 0;

  const t = {
    title: isAr ? "تفاصيل الجهة" : "Entity Details",
    subtitle: isAr ? "أدخل المعلومات الرسمية لجهتك" : "Enter your entity's official information",
    nameEn: isAr ? "اسم الجهة (إنجليزي)" : "Entity Name (English)",
    nameAr: isAr ? "اسم الجهة (عربي)" : "Entity Name (Arabic)",
    commReg: isAr ? "رقم السجل التجاري" : "Commercial Registration No.",
    license: isAr ? "رقم الترخيص" : "License Number",
    gov: isAr ? "المحافظة" : "Governorate",
    address: isAr ? "العنوان التفصيلي" : "Detailed Address",
    gpsLat: isAr ? "خط العرض" : "Latitude",
    gpsLng: isAr ? "خط الطول" : "Longitude",
    contactSection: isAr ? "معلومات جهة الاتصال" : "Contact Information",
    contactName: isAr ? "اسم جهة الاتصال" : "Contact Person Name",
    contactEmail: isAr ? "البريد الإلكتروني" : "Contact Email",
    contactPhone: isAr ? "رقم الهاتف" : "Phone Number",
    contactPos: isAr ? "المنصب الوظيفي" : "Job Position",
    // Hotel
    hotelSection: isAr ? "تفاصيل الفندق" : "Hotel Details",
    stars: isAr ? "تصنيف النجوم" : "Star Rating",
    rooms: isAr ? "عدد الغرف" : "Number of Rooms",
    chain: isAr ? "سلسلة الفنادق (اختياري)" : "Hotel Chain (optional)",
    branches: isAr ? "عدد الفروع" : "Number of Branches",
    branchNote: isAr ? "سيتم إضافة محدد الفرع في لوحة التحكم" : "Branch selector will be added in the dashboard",
    // Mobile
    mobileSection: isAr ? "تفاصيل مشغل الاتصالات" : "Telecom Operator Details",
    crm: isAr ? "عدد مشتركي CRM" : "CRM Subscriber Count",
    // Payment
    paymentSection: isAr ? "تفاصيل المؤسسة المالية" : "Financial Institution Details",
    instType: isAr ? "نوع المؤسسة المالية" : "Financial Institution Type",
    // Utility
    utilitySection: isAr ? "تفاصيل مزود الخدمة" : "Utility Provider Details",
    svcType: isAr ? "نوع الخدمة" : "Service Type",
    // Transport
    transportSection: isAr ? "تفاصيل مشغل النقل" : "Transport Operator Details",
    transportType: isAr ? "نوع وسيلة النقل" : "Transport Type",
    fleetSize: isAr ? "حجم الأسطول" : "Fleet Size",
    // Education
    educationSection: isAr ? "تفاصيل المؤسسة التعليمية" : "Educational Institution Details",
    eduType: isAr ? "نوع المؤسسة" : "Institution Type",
    studentCount: isAr ? "عدد الطلاب" : "Student Count",
    // Customs
    customsSection: isAr ? "تفاصيل سلطة الجمارك" : "Customs Authority Details",
    portType: isAr ? "نوع المنفذ" : "Port/Entry Type",
    annualDeclarations: isAr ? "الإقرارات السنوية (تقريبي)" : "Annual Declarations (approx.)",
  };

  return (
    <div>
      <h3 className="text-white font-bold text-xl font-['Inter'] mb-1">{t.title}</h3>
      <p className="text-gray-500 text-sm font-['Inter'] mb-6">{t.subtitle}</p>

      <div className="space-y-6">
        {/* Entity Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.nameEn} required>
            <Input name="nameEn" placeholder="e.g. Al Bustan Palace Hotel" value={data.nameEn || ""} onChange={onChange} />
          </Field>
          <Field label={t.nameAr} required>
            <Input name="nameAr" placeholder="مثال: فندق البستان بالاس" value={data.nameAr || ""} onChange={onChange} />
          </Field>
        </div>

        {/* Registration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.commReg} required>
            <Input name="commReg" placeholder="CR-XXXXXXXX" value={data.commReg || ""} onChange={onChange} />
          </Field>
          <Field label={t.license}>
            <Input name="license" placeholder="LIC-XXXXXXXX" value={data.license || ""} onChange={onChange} />
          </Field>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.gov}>
            <select
              value={data.governorate || ""}
              onChange={(e) => onChange("governorate", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
              style={selectStyle}
              onFocus={onFocusCyan}
              onBlur={onBlurDefault}
            >
              <option value="">{isAr ? "اختر المحافظة" : "Select Governorate"}</option>
              {governorates.map((g, i) => (
                <option key={g} value={g}>{isAr ? governoratesAr[i] : g}</option>
              ))}
            </select>
          </Field>
          <Field label={t.address}>
            <Input name="address" placeholder={isAr ? "الشارع، المنطقة، المدينة" : "Street, Area, City"} value={data.address || ""} onChange={onChange} />
          </Field>
        </div>

        {/* GPS */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.gpsLat}>
            <Input name="gpsLat" placeholder="23.5880" value={data.gpsLat || ""} onChange={onChange} />
          </Field>
          <Field label={t.gpsLng}>
            <Input name="gpsLng" placeholder="58.3829" value={data.gpsLng || ""} onChange={onChange} />
          </Field>
        </div>

        {/* Contact */}
        <div className="pt-4 border-t border-white/5">
          <SectionHeader label={t.contactSection} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t.contactName}>
              <Input name="contactName" placeholder={isAr ? "الاسم الكامل" : "Full Name"} value={data.contactName || ""} onChange={onChange} />
            </Field>
            <Field label={t.contactPos}>
              <Input name="contactPos" placeholder={isAr ? "مثال: مدير تقنية المعلومات" : "e.g. IT Manager"} value={data.contactPos || ""} onChange={onChange} />
            </Field>
            <Field label={t.contactEmail} required>
              <Input name="contactEmail" placeholder="contact@entity.gov" value={data.contactEmail || ""} onChange={onChange} type="email" />
            </Field>
            <Field label={t.contactPhone}>
              <Input name="contactPhone" placeholder="+968 XXXX XXXX" value={data.contactPhone || ""} onChange={onChange} type="tel" />
            </Field>
          </div>
        </div>

        {/* Hotel-specific */}
        {entityType === "hotel" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.hotelSection} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Field label={t.stars}>
                <select
                  value={data.stars || ""}
                  onChange={(e) => onChange("stars", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
                  style={selectStyle}
                >
                  <option value="">{isAr ? "اختر" : "Select"}</option>
                  {["1★", "2★", "3★", "4★", "5★"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t.rooms}>
                <Input name="rooms" placeholder="e.g. 120" value={data.rooms || ""} onChange={onChange} type="number" />
              </Field>
              <Field label={t.chain}>
                <Input name="chain" placeholder={isAr ? "مثال: ماريوت" : "e.g. Marriott"} value={data.chain || ""} onChange={onChange} />
              </Field>
            </div>
            {/* Multi-property branch selector */}
            {isChain && (
              <div
                className="p-4 rounded-xl border"
                style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-building-4-line text-gold-400 text-sm" />
                  <span className="text-gold-400 text-xs font-semibold font-['Inter']">
                    {isAr ? "إعداد متعدد الفروع" : "Multi-Property Setup"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Field label={t.branches}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBranchCount(Math.max(1, branchCount - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-gold-400 hover:border-gold-400/40 transition-colors cursor-pointer"
                      >
                        <i className="ri-subtract-line text-sm" />
                      </button>
                      <span className="text-white font-bold text-lg font-['JetBrains_Mono'] w-8 text-center">{branchCount}</span>
                      <button
                        type="button"
                        onClick={() => setBranchCount(branchCount + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-gold-400 hover:border-gold-400/40 transition-colors cursor-pointer"
                      >
                        <i className="ri-add-line text-sm" />
                      </button>
                    </div>
                  </Field>
                  <p className="text-gray-500 text-xs font-['Inter'] mt-4">{t.branchNote}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile-specific */}
        {entityType === "mobile" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.mobileSection} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t.crm}>
                <Input name="crm" placeholder="e.g. 2,500,000" value={data.crm || ""} onChange={onChange} type="number" />
              </Field>
            </div>
          </div>
        )}

        {/* Payment-specific */}
        {entityType === "payment" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.paymentSection} />
            <Field label={t.instType}>
              <select
                value={data.instType || ""}
                onChange={(e) => onChange("instType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
                style={selectStyle}
              >
                <option value="">{isAr ? "اختر" : "Select"}</option>
                {["Commercial Bank", "Islamic Bank", "Exchange House", "Investment Firm", "Insurance Company", "Payment Gateway"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Utility-specific */}
        {entityType === "utility" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.utilitySection} />
            <Field label={t.svcType}>
              <select
                value={data.svcType || ""}
                onChange={(e) => onChange("svcType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
                style={selectStyle}
              >
                <option value="">{isAr ? "اختر" : "Select"}</option>
                {["Electricity", "Water", "Internet / ISP", "Electricity & Water", "All Utilities"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Transport-specific */}
        {entityType === "transport" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.transportSection} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t.transportType}>
                <select
                  value={data.transportType || ""}
                  onChange={(e) => onChange("transportType", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
                  style={selectStyle}
                >
                  <option value="">{isAr ? "اختر" : "Select"}</option>
                  {["Bus Operator", "Taxi / Ride-hailing", "Bus & Taxi", "Intercity Coach"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.fleetSize}>
                <Input name="fleetSize" placeholder="e.g. 250" value={data.fleetSize || ""} onChange={onChange} type="number" />
              </Field>
            </div>
          </div>
        )}

        {/* Education-specific */}
        {entityType === "education" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.educationSection} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t.eduType}>
                <select
                  value={data.eduType || ""}
                  onChange={(e) => onChange("eduType", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
                  style={selectStyle}
                >
                  <option value="">{isAr ? "اختر" : "Select"}</option>
                  {["University", "College", "School", "Vocational Institute", "Language Center"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.studentCount}>
                <Input name="studentCount" placeholder="e.g. 15,000" value={data.studentCount || ""} onChange={onChange} type="number" />
              </Field>
            </div>
          </div>
        )}

        {/* Customs-specific */}
        {entityType === "customs" && (
          <div className="pt-4 border-t border-white/5">
            <SectionHeader label={t.customsSection} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t.portType}>
                <select
                  value={data.portType || ""}
                  onChange={(e) => onChange("portType", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none cursor-pointer font-['Inter']"
                  style={selectStyle}
                >
                  <option value="">{isAr ? "اختر" : "Select"}</option>
                  {["Seaport", "Airport", "Land Border", "Free Zone", "Inland Customs"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.annualDeclarations}>
                <Input name="annualDeclarations" placeholder="e.g. 50,000" value={data.annualDeclarations || ""} onChange={onChange} type="number" />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepEntityDetails;
