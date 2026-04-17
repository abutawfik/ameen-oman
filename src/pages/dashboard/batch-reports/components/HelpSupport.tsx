import { useState } from "react";

interface Props { isAr: boolean; }

const FAQS = [
  {
    q: "How do I submit a batch upload file?",
    qAr: "كيف أرفع ملف دُفعة؟",
    a: "Navigate to the Batch Upload tab, select your entity type, download the template, fill in your data, then drag and drop the file into the upload zone. Click Proceed to submit.",
    aAr: "انتقل إلى تبويب رفع الدُفعة، اختر نوع الكيان، نزّل القالب، أدخل بياناتك، ثم اسحب الملف وأسقطه في منطقة الرفع. انقر على المتابعة للإرسال.",
  },
  {
    q: "What file formats are supported?",
    qAr: "ما هي صيغ الملفات المدعومة؟",
    a: "AMEEN supports CSV, XLS, and XLSX formats. Maximum file size is 5MB per file. You can upload multiple files simultaneously.",
    aAr: "يدعم AMEEN صيغ CSV وXLS وXLSX. الحد الأقصى لحجم الملف هو 5 ميجابايت لكل ملف. يمكنك رفع ملفات متعددة في وقت واحد.",
  },
  {
    q: "Why was my event rejected?",
    qAr: "لماذا تم رفض حدثي؟",
    a: "Events are rejected for validation errors such as missing required fields, invalid document numbers, incorrect date formats, or duplicate references. Click on a rejected row in the status table to see specific error details.",
    aAr: "يُرفض الحدث بسبب أخطاء التحقق مثل الحقول المطلوبة المفقودة، أرقام الوثائق غير الصالحة، تنسيقات التاريخ غير الصحيحة، أو المراجع المكررة. انقر على الصف المرفوض في جدول الحالة لرؤية تفاصيل الأخطاء.",
  },
  {
    q: "How do I re-submit failed events?",
    qAr: "كيف أعيد إرسال الأحداث الفاشلة؟",
    a: "In the Upload Status tab, click on any rejected row to see the validation errors. Fix the issues in your source file and re-upload, or use the Fix & Re-submit button for individual rows.",
    aAr: "في تبويب حالة الرفع، انقر على أي صف مرفوض لرؤية أخطاء التحقق. صحح المشكلات في ملفك المصدر وأعد الرفع، أو استخدم زر التصحيح وإعادة الإرسال للصفوف الفردية.",
  },
  {
    q: "What is the AMN confirmation code?",
    qAr: "ما هو رمز تأكيد AMN؟",
    a: "Each successfully processed event receives a unique AMN confirmation code (e.g., AMN-HTL-20260405-4891). This code is your proof of submission and can be used for audit trails and cross-referencing.",
    aAr: "يحصل كل حدث تمت معالجته بنجاح على رمز تأكيد AMN فريد (مثل AMN-HTL-20260405-4891). هذا الرمز هو دليل إرسالك ويمكن استخدامه لمسارات التدقيق والمقارنة.",
  },
  {
    q: "How is data privacy maintained?",
    qAr: "كيف يتم الحفاظ على خصوصية البيانات؟",
    a: "AMEEN operates under National Police data governance policies. All data is encrypted in transit and at rest. Access is role-based and logged. Personal data is masked in exports. The system complies with Oman's Personal Data Protection Law.",
    aAr: "يعمل AMEEN وفق سياسات حوكمة بيانات الشرطة الوطنية. جميع البيانات مشفرة أثناء النقل والتخزين. الوصول قائم على الأدوار ومسجّل. البيانات الشخصية مُخفاة في التصديرات. النظام متوافق مع قانون حماية البيانات الشخصية العُماني.",
  },
];

const GUIDES = [
  { icon: "ri-file-pdf-line",    color: "#F87171", title: "AMEEN User Manual v3.2",       titleAr: "دليل مستخدم AMEEN v3.2",       size: "4.2 MB", type: "PDF" },
  { icon: "ri-file-excel-2-line",color: "#4ADE80", title: "Batch Upload Template Guide",  titleAr: "دليل قالب رفع الدُفعة",        size: "1.1 MB", type: "XLSX" },
  { icon: "ri-file-text-line",   color: "#D4A84B", title: "API Integration Specification",titleAr: "مواصفات تكامل API",             size: "2.8 MB", type: "PDF" },
  { icon: "ri-file-text-line",   color: "#FACC15", title: "Data Dictionary v2.1",         titleAr: "قاموس البيانات v2.1",           size: "0.9 MB", type: "PDF" },
];

const VIDEOS = [
  { icon: "ri-play-circle-line", color: "#D4A84B", title: "Getting Started with AMEEN",   titleAr: "البدء مع AMEEN",               duration: "8:24" },
  { icon: "ri-play-circle-line", color: "#4ADE80", title: "Batch Upload Walkthrough",     titleAr: "شرح رفع الدُفعة",              duration: "12:15" },
  { icon: "ri-play-circle-line", color: "#FACC15", title: "Reports & Analytics Deep Dive",titleAr: "تعمق في التقارير والتحليلات",  duration: "18:42" },
  { icon: "ri-play-circle-line", color: "#A78BFA", title: "Person 360 Profile Tutorial",  titleAr: "شرح ملف الشخص 360",            duration: "10:08" },
];

const HelpSupport = ({ isAr }: Props) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", priority: "medium", description: "" });
  const [ticketSent, setTicketSent] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 4000);
    setTicketForm({ subject: "", priority: "medium", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* Emergency hotline */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-4 rounded-2xl border"
        style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
        <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}>
          <i className="ri-phone-line text-red-400 text-lg" />
        </div>
        <div className="flex-1">
          <p className="text-red-400 font-bold text-sm">{isAr ? "خط الطوارئ" : "Emergency Hotline"}</p>
          <p className="text-gray-400 text-xs">{isAr ? "متاح 24/7 للمشكلات الحرجة" : "Available 24/7 for critical issues"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-white font-black text-lg font-['JetBrains_Mono']">+968 2412 3456</div>
            <div className="text-gray-500 text-xs">{isAr ? "الخط الرئيسي" : "Main Line"}</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-black text-lg font-['JetBrains_Mono']">1234</div>
            <div className="text-gray-500 text-xs">{isAr ? "داخلي" : "Extension"}</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-question-answer-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-colors text-left"
                style={{ background: openFaq === i ? "rgba(181,142,60,0.04)" : "transparent" }}
                onMouseEnter={(e) => { if (openFaq !== i) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { if (openFaq !== i) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <span className="text-white text-sm font-semibold text-left">{isAr ? faq.qAr : faq.q}</span>
                <i className={`text-gold-400 text-sm transition-transform flex-shrink-0 ml-4 ${openFaq === i ? "ri-subtract-line" : "ri-add-line"}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400 text-sm leading-relaxed">{isAr ? faq.aAr : faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guides + Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Guides */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <i className="ri-book-open-line text-gold-400 text-sm" />
            </div>
            <h3 className="text-white font-bold text-sm">{isAr ? "أدلة المستخدم" : "User Guides"}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
            {GUIDES.map((g) => (
              <div key={g.title} className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${g.color}12`, border: `1px solid ${g.color}20` }}>
                  <i className={`${g.icon} text-sm`} style={{ color: g.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{isAr ? g.titleAr : g.title}</p>
                  <p className="text-gray-500 text-xs">{g.type} · {g.size}</p>
                </div>
                <button type="button"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs cursor-pointer whitespace-nowrap"
                  style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}>
                  <i className="ri-download-2-line text-xs" />
                  {isAr ? "تنزيل" : "Download"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <i className="ri-video-line text-gold-400 text-sm" />
            </div>
            <h3 className="text-white font-bold text-sm">{isAr ? "دروس الفيديو" : "Video Tutorials"}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
            {VIDEOS.map((v) => (
              <div key={v.title} className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${v.color}12`, border: `1px solid ${v.color}20` }}>
                  <i className={`${v.icon} text-sm`} style={{ color: v.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{isAr ? v.titleAr : v.title}</p>
                  <p className="text-gray-500 text-xs">{v.duration}</p>
                </div>
                <button type="button"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs cursor-pointer whitespace-nowrap"
                  style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}>
                  <i className="ri-play-line text-xs" />
                  {isAr ? "مشاهدة" : "Watch"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="rounded-2xl border p-6"
        style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-customer-service-2-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "تذكرة دعم" : "Support Ticket"}</h3>
        </div>
        {ticketSent ? (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <i className="ri-checkbox-circle-line text-green-400 text-lg" />
            <div>
              <p className="text-green-400 font-bold text-sm">{isAr ? "تم إرسال التذكرة" : "Ticket Submitted"}</p>
              <p className="text-gray-400 text-xs">{isAr ? "سيتواصل معك الفريق خلال 2-4 ساعات" : "Our team will respond within 2-4 hours"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الموضوع" : "Subject"}</label>
                <input type="text" value={ticketForm.subject} onChange={(e) => setTicketForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder={isAr ? "وصف موجز للمشكلة" : "Brief description of issue"}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-gold-400 transition-colors"
                  style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }} />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الأولوية" : "Priority"}</label>
                <select value={ticketForm.priority} onChange={(e) => setTicketForm((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
                  style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }}>
                  <option value="low">{isAr ? "منخفضة" : "Low"}</option>
                  <option value="medium">{isAr ? "متوسطة" : "Medium"}</option>
                  <option value="high">{isAr ? "عالية" : "High"}</option>
                  <option value="critical">{isAr ? "حرجة" : "Critical"}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider block mb-1">{isAr ? "الوصف" : "Description"}</label>
              <textarea value={ticketForm.description} onChange={(e) => setTicketForm((p) => ({ ...p, description: e.target.value }))}
                rows={4} maxLength={500}
                placeholder={isAr ? "اشرح المشكلة بالتفصيل..." : "Describe the issue in detail..."}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-gold-400 transition-colors resize-none"
                style={{ background: "rgba(11,18,32,0.8)", borderColor: "rgba(181,142,60,0.15)", color: "#D1D5DB" }} />
              <div className="text-right text-gray-600 text-xs mt-1">{ticketForm.description.length}/500</div>
            </div>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
              style={{ background: "#D4A84B", color: "#0B1220" }}>
              <i className="ri-send-plane-line text-sm" />
              {isAr ? "إرسال التذكرة" : "Submit Ticket"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
