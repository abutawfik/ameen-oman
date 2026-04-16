import { SectionCard, FormField, TextInput, SelectInput, RadioGroup, COUNTRIES, GENDERS } from "./FormComponents";

export interface PersonalData {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  nationality: string;
  placeOfBirth: string;
  countryOfResidence: string;
  email: string;
  primaryContact: string;
  secondaryContact: string;
}

interface Props {
  data: PersonalData;
  onChange: (key: keyof PersonalData, value: string) => void;
  isAr: boolean;
  autoFilled?: boolean;
}

const PersonalDetailsSection = ({ data, onChange, isAr, autoFilled }: Props) => {
  const t = {
    title: isAr ? "البيانات الشخصية" : "Personal Details",
    firstName: isAr ? "الاسم الأول" : "First Name",
    lastName: isAr ? "اسم العائلة" : "Last Name",
    gender: isAr ? "الجنس" : "Gender",
    dob: isAr ? "تاريخ الميلاد" : "Date of Birth",
    nationality: isAr ? "الجنسية" : "Nationality",
    placeOfBirth: isAr ? "مكان الميلاد" : "Place of Birth",
    countryOfResidence: isAr ? "دولة الإقامة" : "Country of Residence",
    email: isAr ? "البريد الإلكتروني" : "Email Address",
    primaryContact: isAr ? "رقم الاتصال الأساسي" : "Primary Contact",
    secondaryContact: isAr ? "رقم الاتصال الثانوي" : "Secondary Contact",
  };

  const genderOpts = GENDERS.map((g) => ({
    value: g.value,
    label: isAr ? (g.value === "male" ? "ذكر" : "أنثى") : g.label,
  }));

  return (
    <SectionCard title={t.title} icon="ri-user-line">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField label={t.firstName} required>
          <TextInput
            placeholder={isAr ? "الاسم الأول" : "First name"}
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            autoFilled={autoFilled && !!data.firstName}
          />
        </FormField>

        <FormField label={t.lastName} required>
          <TextInput
            placeholder={isAr ? "اسم العائلة" : "Last name"}
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            autoFilled={autoFilled && !!data.lastName}
          />
        </FormField>

        <FormField label={t.dob} required>
          <TextInput
            type="date"
            value={data.dob}
            onChange={(e) => onChange("dob", e.target.value)}
            autoFilled={autoFilled && !!data.dob}
          />
        </FormField>

        <FormField label={t.gender} required className="sm:col-span-2 lg:col-span-1">
          <RadioGroup
            name="gender"
            options={genderOpts}
            value={data.gender}
            onChange={(v) => onChange("gender", v)}
          />
        </FormField>

        <FormField label={t.nationality} required>
          <SelectInput
            options={COUNTRIES}
            placeholder={isAr ? "اختر الجنسية" : "Select nationality"}
            value={data.nationality}
            onChange={(e) => onChange("nationality", e.target.value)}
          />
        </FormField>

        <FormField label={t.placeOfBirth}>
          <TextInput
            placeholder={isAr ? "مثال: العاصمة" : "e.g. Capital City"}
            value={data.placeOfBirth}
            onChange={(e) => onChange("placeOfBirth", e.target.value)}
            autoFilled={autoFilled && !!data.placeOfBirth}
          />
        </FormField>

        <FormField label={t.countryOfResidence} required>
          <SelectInput
            options={COUNTRIES}
            placeholder={isAr ? "اختر الدولة" : "Select country"}
            value={data.countryOfResidence}
            onChange={(e) => onChange("countryOfResidence", e.target.value)}
          />
        </FormField>

        <FormField label={t.email}>
          <TextInput
            type="email"
            placeholder="guest@email.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            autoFilled={autoFilled && !!data.email}
          />
        </FormField>

        <FormField label={t.primaryContact} required>
          <TextInput
            type="tel"
            placeholder="+XXX XXXX XXXX"
            value={data.primaryContact}
            onChange={(e) => onChange("primaryContact", e.target.value)}
            autoFilled={autoFilled && !!data.primaryContact}
            className="font-['JetBrains_Mono']"
          />
        </FormField>

        <FormField label={t.secondaryContact}>
          <TextInput
            type="tel"
            placeholder="+XXX XXXX XXXX"
            value={data.secondaryContact}
            onChange={(e) => onChange("secondaryContact", e.target.value)}
            className="font-['JetBrains_Mono']"
          />
        </FormField>
      </div>
    </SectionCard>
  );
};

export default PersonalDetailsSection;
