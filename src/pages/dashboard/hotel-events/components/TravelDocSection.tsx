import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup,
  ExpiryDateInput, ScannerWidget, COUNTRIES, DOC_TYPES, HOLDER_STATUS,
} from "./FormComponents";

export interface TravelDocData {
  holderStatus: string;
  docType: string;
  docNumber: string;
  issuingCountry: string;
  placeOfIssue: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
}

interface Props {
  data: TravelDocData;
  onChange: (key: keyof TravelDocData, value: string) => void;
  isAr: boolean;
  scannerConnected: boolean;
  autoFilled: boolean;
  onScan: () => void;
}

const TravelDocSection = ({ data, onChange, isAr, scannerConnected, autoFilled, onScan }: Props) => {
  const t = {
    title: isAr ? "وثيقة السفر" : "Travel Document",
    holderStatus: isAr ? "حالة حامل الوثيقة" : "Document Holder Status",
    docType: isAr ? "نوع الوثيقة" : "Document Type",
    docNumber: isAr ? "رقم الوثيقة" : "Document Number",
    issuingCountry: isAr ? "دولة الإصدار" : "Issuing Country",
    placeOfIssue: isAr ? "مكان الإصدار" : "Place of Issue",
    issuingAuthority: isAr ? "جهة الإصدار" : "Issuing Authority",
    issueDate: isAr ? "تاريخ الإصدار" : "Issue Date",
    expiryDate: isAr ? "تاريخ الانتهاء" : "Expiry Date",
  };

  const holderOpts = HOLDER_STATUS.map((h) => ({
    value: h.value,
    label: isAr ? (h.value === "primary" ? "النزيل الرئيسي" : "النزيل الثانوي") : h.label,
  }));

  const docTypeOpts = DOC_TYPES.map((d) => ({
    value: d.value,
    label: isAr
      ? d.value === "passport" ? "جواز سفر"
        : d.value === "national_id" ? "بطاقة هوية وطنية"
        : d.value === "resident_card" ? "بطاقة إقامة"
        : d.value === "gcc_id" ? "هوية دول الخليج"
        : "وثيقة سفر"
      : d.label,
  }));

  return (
    <SectionCard title={t.title} icon="ri-passport-line">
      <ScannerWidget connected={scannerConnected} onScan={onScan} isAr={isAr} />

      <div className="space-y-4">
        <FormField label={t.holderStatus} required>
          <RadioGroup
            name="holderStatus"
            options={holderOpts}
            value={data.holderStatus}
            onChange={(v) => onChange("holderStatus", v)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.docType} required>
            <SelectInput
              options={docTypeOpts}
              placeholder={isAr ? "اختر النوع" : "Select type"}
              value={data.docType}
              onChange={(e) => onChange("docType", e.target.value)}
            />
          </FormField>
          <FormField label={t.docNumber} required>
            <TextInput
              placeholder={isAr ? "رقم الوثيقة" : "e.g. A12345678"}
              value={data.docNumber}
              onChange={(e) => onChange("docNumber", e.target.value)}
              autoFilled={autoFilled && !!data.docNumber}
              className="font-['JetBrains_Mono'] tracking-wider"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.issuingCountry} required>
            <SelectInput
              options={COUNTRIES}
              placeholder={isAr ? "اختر الدولة" : "Select country"}
              value={data.issuingCountry}
              onChange={(e) => onChange("issuingCountry", e.target.value)}
            />
          </FormField>
          <FormField label={t.placeOfIssue}>
            <TextInput
              placeholder={isAr ? "مثال: العاصمة" : "e.g. Capital City"}
              value={data.placeOfIssue}
              onChange={(e) => onChange("placeOfIssue", e.target.value)}
              autoFilled={autoFilled && !!data.placeOfIssue}
            />
          </FormField>
        </div>

        <FormField label={t.issuingAuthority}>
          <TextInput
            placeholder={isAr ? "مثال: وزارة الداخلية" : "e.g. Ministry of Interior"}
            value={data.issuingAuthority}
            onChange={(e) => onChange("issuingAuthority", e.target.value)}
            autoFilled={autoFilled && !!data.issuingAuthority}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.issueDate} required>
            <TextInput
              type="date"
              value={data.issueDate}
              onChange={(e) => onChange("issueDate", e.target.value)}
              autoFilled={autoFilled && !!data.issueDate}
            />
          </FormField>
          <ExpiryDateInput
            label={t.expiryDate}
            required
            value={data.expiryDate}
            onChange={(v) => onChange("expiryDate", v)}
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default TravelDocSection;
