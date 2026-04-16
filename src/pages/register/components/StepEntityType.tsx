interface EntityTypeItem {
  id: string;
  icon: string;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  badge: "core" | "extended";
  badgeColor: string;
  categoryColor: string;
  streamNum: string;
}

export const entityTypes: EntityTypeItem[] = [
  {
    id: "hotel", icon: "ri-hotel-line", streamNum: "01",
    category: "Core Intelligence", categoryAr: "الاستخبارات الأساسية",
    title: "Hotel Intelligence", titleAr: "الاستخبارات الفندقية",
    description: "Hotels, resorts, serviced apartments submitting guest booking and movement data.",
    descriptionAr: "الفنادق والمنتجعات والشقق المفروشة التي تقدم بيانات الحجز وتنقل النزلاء.",
    badge: "core", badgeColor: "#22D3EE", categoryColor: "#22D3EE",
  },
  {
    id: "car-rental", icon: "ri-car-line", streamNum: "02",
    category: "Core Intelligence", categoryAr: "الاستخبارات الأساسية",
    title: "Car Rental Monitoring", titleAr: "مراقبة تأجير السيارات",
    description: "Licensed vehicle rental operators submitting rental lifecycle events.",
    descriptionAr: "شركات تأجير السيارات المرخصة التي تقدم أحداث دورة حياة التأجير.",
    badge: "core", badgeColor: "#22D3EE", categoryColor: "#22D3EE",
  },
  {
    id: "mobile", icon: "ri-sim-card-line", streamNum: "03",
    category: "Core Intelligence", categoryAr: "الاستخبارات الأساسية",
    title: "Mobile Operators", titleAr: "مشغلو الاتصالات",
    description: "Telecom operators submitting SIM, IMEI, eSIM and roaming events.",
    descriptionAr: "مشغلو الاتصالات الذين يقدمون أحداث الشريحة وIMEI وeSIM والتجوال.",
    badge: "core", badgeColor: "#22D3EE", categoryColor: "#22D3EE",
  },
  {
    id: "municipality", icon: "ri-government-line", streamNum: "04",
    category: "Core Intelligence", categoryAr: "الاستخبارات الأساسية",
    title: "Municipality Registry", titleAr: "سجل البلديات",
    description: "Municipal authorities submitting property lease lifecycle events.",
    descriptionAr: "السلطات البلدية التي تقدم أحداث دورة حياة عقود الإيجار.",
    badge: "core", badgeColor: "#22D3EE", categoryColor: "#22D3EE",
  },
  {
    id: "payment", icon: "ri-bank-card-line", streamNum: "05",
    category: "Financial Intelligence", categoryAr: "الاستخبارات المالية",
    title: "Payment Intelligence", titleAr: "الاستخبارات المالية",
    description: "Banks and exchange houses submitting financial transaction events.",
    descriptionAr: "البنوك وشركات الصرافة التي تقدم أحداث المعاملات المالية.",
    badge: "extended", badgeColor: "#4ADE80", categoryColor: "#4ADE80",
  },
  {
    id: "borders", icon: "ri-passport-line", streamNum: "06",
    category: "Border Control", categoryAr: "مراقبة الحدود",
    title: "Borders & Immigration", titleAr: "الحدود والهجرة",
    description: "Border Control and eVisa systems submitting entry/exit and visa events.",
    descriptionAr: "أنظمة مراقبة الحدود وeVisa التي تقدم أحداث الدخول والخروج والتأشيرة.",
    badge: "extended", badgeColor: "#60A5FA", categoryColor: "#60A5FA",
  },
  {
    id: "health", icon: "ri-heart-pulse-line", streamNum: "07",
    category: "Health Monitoring", categoryAr: "المراقبة الصحية",
    title: "Health Interactions", titleAr: "التفاعلات الصحية",
    description: "Hospitals and clinics submitting patient registration and health events.",
    descriptionAr: "المستشفيات والعيادات التي تقدم أحداث تسجيل المرضى والصحة.",
    badge: "extended", badgeColor: "#F87171", categoryColor: "#F87171",
  },
  {
    id: "utility", icon: "ri-flashlight-line", streamNum: "08",
    category: "Infrastructure", categoryAr: "البنية التحتية",
    title: "Utility Activation", titleAr: "تفعيل المرافق",
    description: "Electricity, water, and internet providers submitting service events.",
    descriptionAr: "مزودو الكهرباء والمياه والإنترنت الذين يقدمون أحداث الخدمة.",
    badge: "extended", badgeColor: "#FACC15", categoryColor: "#FACC15",
  },
  {
    id: "transport", icon: "ri-bus-line", streamNum: "09",
    category: "Mobility Intelligence", categoryAr: "استخبارات التنقل",
    title: "Public Transport", titleAr: "النقل العام",
    description: "Bus and taxi operators submitting journey and route pattern data.",
    descriptionAr: "مشغلو الحافلات والتاكسي الذين يقدمون بيانات الرحلات وأنماط المسارات.",
    badge: "extended", badgeColor: "#FB923C", categoryColor: "#FB923C",
  },
  {
    id: "education", icon: "ri-graduation-cap-line", streamNum: "10",
    category: "Education Registry", categoryAr: "سجل التعليم",
    title: "Educational Enrollment", titleAr: "التسجيل التعليمي",
    description: "Schools and universities submitting student enrollment and visa events.",
    descriptionAr: "المدارس والجامعات التي تقدم أحداث تسجيل الطلاب والتأشيرة.",
    badge: "extended", badgeColor: "#A78BFA", categoryColor: "#A78BFA",
  },
  {
    id: "employment", icon: "ri-briefcase-line", streamNum: "11",
    category: "Labor Intelligence", categoryAr: "استخبارات العمل",
    title: "Employment Registry", titleAr: "سجل التوظيف",
    description: "Ministry of Labor submitting work permit and employment events.",
    descriptionAr: "وزارة العمل التي تقدم أحداث تصاريح العمل والتوظيف.",
    badge: "extended", badgeColor: "#F9A8D4", categoryColor: "#F9A8D4",
  },
  {
    id: "ecommerce", icon: "ri-shopping-cart-line", streamNum: "12",
    category: "Commerce Intelligence", categoryAr: "استخبارات التجارة",
    title: "E-Commerce & Retail", titleAr: "التجارة الإلكترونية",
    description: "Online merchants submitting transaction and bulk purchase events.",
    descriptionAr: "التجار الإلكترونيون الذين يقدمون أحداث المعاملات والمشتريات بالجملة.",
    badge: "extended", badgeColor: "#34D399", categoryColor: "#34D399",
  },
  {
    id: "social", icon: "ri-global-line", streamNum: "13",
    category: "Digital Intelligence", categoryAr: "الاستخبارات الرقمية",
    title: "Social Media Intelligence", titleAr: "استخبارات وسائل التواصل",
    description: "Authorized platforms submitting phone-social linkage and keyword data.",
    descriptionAr: "المنصات المعتمدة التي تقدم بيانات ربط الهاتف بالاجتماعي والكلمات المفتاحية.",
    badge: "extended", badgeColor: "#38BDF8", categoryColor: "#38BDF8",
  },
  {
    id: "customs", icon: "ri-ship-line", streamNum: "14",
    category: "Customs & Trade", categoryAr: "الجمارك والتجارة",
    title: "Customs & Cargo", titleAr: "الجمارك والشحن",
    description: "Customs authorities submitting import/export declarations, cargo manifests, and restricted goods alerts.",
    descriptionAr: "سلطات الجمارك التي تقدم إقرارات الاستيراد والتصدير وبيانات الشحن وتنبيهات البضائع المقيدة.",
    badge: "extended", badgeColor: "#FCD34D", categoryColor: "#FCD34D",
  },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  isAr: boolean;
}

const StepEntityType = ({ selected, onSelect, isAr }: Props) => {
  const coreTypes = entityTypes.filter((e) => e.badge === "core");
  const extendedTypes = entityTypes.filter((e) => e.badge === "extended");

  const renderCard = (et: EntityTypeItem) => {
    const isSelected = selected === et.id;
    return (
      <button
        key={et.id}
        onClick={() => onSelect(et.id)}
        className="flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer group"
        style={{
          background: isSelected ? et.badgeColor + "0D" : "rgba(10,22,40,0.7)",
          borderColor: isSelected ? et.badgeColor + "80" : "rgba(255,255,255,0.07)",
          boxShadow: isSelected ? `0 0 20px ${et.badgeColor}12` : "none",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = et.badgeColor + "40";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 12px ${et.badgeColor}08`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-['JetBrains_Mono'] font-bold px-1.5 py-0.5 rounded"
              style={{ color: "#6B7280", background: "rgba(255,255,255,0.04)" }}
            >
              {et.streamNum}
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full font-['Inter']"
              style={{
                background: et.badgeColor + "18",
                color: et.badgeColor,
                border: `1px solid ${et.badgeColor}35`,
              }}
            >
              {et.badge === "core" ? (isAr ? "أساسي" : "Core") : (isAr ? "موسع" : "Extended")}
            </span>
          </div>
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background: et.categoryColor + "15", border: `1px solid ${et.categoryColor}30` }}
          >
            <i className={`${et.icon} text-base`} style={{ color: et.categoryColor }} />
          </div>
        </div>

        {/* Category */}
        <span className="text-xs font-semibold mb-1 font-['Inter']" style={{ color: et.categoryColor }}>
          {isAr ? et.categoryAr : et.category}
        </span>

        {/* Title */}
        <p className="text-white font-bold text-sm font-['Inter'] mb-1.5 leading-snug">
          {isAr ? et.titleAr : et.title}
        </p>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed font-['Inter'] flex-1">
          {isAr ? et.descriptionAr : et.description}
        </p>

        {/* Selected indicator */}
        {isSelected && (
          <div className="mt-3 flex items-center gap-1.5">
            <i className="ri-checkbox-circle-fill text-sm" style={{ color: et.badgeColor }} />
            <span className="text-xs font-['Inter']" style={{ color: et.badgeColor }}>
              {isAr ? "محدد" : "Selected"}
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div>
      <h3 className="text-white font-bold text-xl font-['Inter'] mb-1">
        {isAr ? "اختر نوع الجهة" : "Select Entity Type"}
      </h3>
      <p className="text-gray-500 text-sm font-['Inter'] mb-6">
        {isAr
          ? "اختر الفئة التي تصف نشاط جهتك بشكل أفضل — 14 مصدر بيانات متاح"
          : "Choose the category that best describes your entity's activity — 14 data streams available"}
      </p>

      {/* Core streams */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1" style={{ background: "rgba(34,211,238,0.15)" }} />
          <span
            className="text-xs font-['JetBrains_Mono'] tracking-widest px-3 py-1 rounded-full"
            style={{ color: "#22D3EE", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}
          >
            {isAr ? "4 مصادر أساسية" : "4 CORE STREAMS"}
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(34,211,238,0.15)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {coreTypes.map(renderCard)}
        </div>
      </div>

      {/* Extended streams */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1" style={{ background: "rgba(74,222,128,0.15)" }} />
          <span
            className="text-xs font-['JetBrains_Mono'] tracking-widest px-3 py-1 rounded-full"
            style={{ color: "#4ADE80", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}
          >
            {isAr ? "10 مصادر موسعة" : "10 EXTENDED STREAMS"}
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(74,222,128,0.15)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {extendedTypes.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

export default StepEntityType;
