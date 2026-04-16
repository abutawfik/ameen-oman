import { useState } from "react";
import { messageTemplates, sentMessages, type MessageType, type SentMessage } from "@/mocks/notificationsData";

interface Props {
  isAr: boolean;
}

const msgTypeConfig: Record<MessageType, { label: string; labelAr: string; color: string; bg: string; border: string; icon: string }> = {
  announcement: { label: "Announcement",   labelAr: "إعلان",          color: "#22D3EE", bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.3)",  icon: "ri-megaphone-line" },
  policy:       { label: "Policy Update",  labelAr: "تحديث سياسة",    color: "#FACC15", bg: "rgba(250,204,21,0.08)",  border: "rgba(250,204,21,0.3)",  icon: "ri-file-text-line" },
  compliance:   { label: "Compliance",     labelAr: "امتثال",          color: "#FB923C", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.3)",  icon: "ri-shield-check-line" },
  urgent:       { label: "Urgent Alert",   labelAr: "تنبيه عاجل",     color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)", icon: "ri-alarm-warning-line" },
};

const recipientOptions = [
  { value: "broadcast",    labelEn: "Broadcast — All Entities",       labelAr: "بث — جميع الكيانات" },
  { value: "hotels",       labelEn: "By Type — Hotels (284)",         labelAr: "حسب النوع — الفنادق (284)" },
  { value: "car-rental",   labelEn: "By Type — Car Rental (67)",      labelAr: "حسب النوع — تأجير السيارات (67)" },
  { value: "mobile",       labelEn: "By Type — Mobile Operators (8)", labelAr: "حسب النوع — مشغلو الاتصالات (8)" },
  { value: "muscat",       labelEn: "By Governorate — Muscat",        labelAr: "حسب المحافظة — مسقط" },
  { value: "dhofar",       labelEn: "By Governorate — Dhofar",        labelAr: "حسب المحافظة — ظفار" },
  { value: "analysts",     labelEn: "ROP Analysts (47)",              labelAr: "محللو ROP (47)" },
  { value: "individual",   labelEn: "Individual Entity",              labelAr: "كيان فردي" },
];

const CommunicationHub = ({ isAr }: Props) => {
  const [activeView, setActiveView] = useState<"compose" | "templates" | "sent">("compose");
  const [msgType, setMsgType] = useState<MessageType>("announcement");
  const [recipient, setRecipient] = useState("broadcast");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSend = () => {
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  const applyTemplate = (tplId: string) => {
    const tpl = messageTemplates.find((t) => t.id === tplId);
    if (tpl) {
      setSubject(tpl.subject);
      setBody(tpl.body);
      setMsgType(tpl.type);
      setSelectedTemplate(tplId);
      setActiveView("compose");
    }
  };

  const views = [
    { key: "compose" as const,   icon: "ri-edit-line",       labelEn: "Compose",   labelAr: "إنشاء" },
    { key: "templates" as const, icon: "ri-file-copy-line",  labelEn: "Templates", labelAr: "القوالب" },
    { key: "sent" as const,      icon: "ri-send-plane-line", labelEn: "Sent",      labelAr: "المُرسَل" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}>
            <i className="ri-chat-3-line text-cyan-400 text-sm" />
          </div>
          <div>
            <h2 className="text-white text-sm font-bold font-['Inter']">{isAr ? "مركز الاتصالات" : "Communication Hub"}</h2>
            <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "إدارة ROP" : "ROP Admin"}</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-medium cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: activeView === v.key ? "rgba(34,211,238,0.1)" : "transparent",
              color: activeView === v.key ? "#22D3EE" : "#6B7280",
              border: activeView === v.key ? "1px solid rgba(34,211,238,0.2)" : "1px solid transparent",
            }}
          >
            <i className={`${v.icon} text-xs`} />
            {isAr ? v.labelAr : v.labelEn}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.15) transparent" }}>

        {/* COMPOSE */}
        {activeView === "compose" && (
          <div className="space-y-4">
            {sendSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}>
                <i className="ri-checkbox-circle-line text-green-400" />
                <span className="text-green-400 text-sm font-['Inter']">{isAr ? "تم الإرسال بنجاح!" : "Message sent successfully!"}</span>
              </div>
            )}

            {/* Message type */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-['JetBrains_Mono'] block mb-2">
                {isAr ? "نوع الرسالة" : "Message Type"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(msgTypeConfig) as [MessageType, typeof msgTypeConfig[MessageType]][]).map(([type, cfg]) => (
                  <button
                    key={type}
                    onClick={() => setMsgType(type)}
                    className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all text-left"
                    style={{
                      background: msgType === type ? cfg.bg : "rgba(6,13,26,0.6)",
                      border: msgType === type ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}33` }}>
                      <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                    </div>
                    <span className="text-xs font-['Inter'] font-semibold" style={{ color: msgType === type ? cfg.color : "#6B7280" }}>
                      {isAr ? cfg.labelAr : cfg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-['JetBrains_Mono'] block mb-2">
                {isAr ? "المستلمون" : "Recipients"}
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-['Inter'] cursor-pointer"
                style={{ background: "rgba(6,13,26,0.8)", border: "1px solid rgba(34,211,238,0.2)", color: "#D1D5DB", outline: "none" }}
              >
                {recipientOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: "#0A1628" }}>
                    {isAr ? opt.labelAr : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-['JetBrains_Mono'] block mb-2">
                {isAr ? "الموضوع" : "Subject"}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isAr ? "موضوع الرسالة..." : "Message subject..."}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-['Inter']"
                style={{ background: "rgba(6,13,26,0.8)", border: "1px solid rgba(34,211,238,0.15)", color: "#D1D5DB", outline: "none" }}
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider font-['JetBrains_Mono'] block mb-2">
                {isAr ? "نص الرسالة" : "Message Body"}
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, 500))}
                placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
                rows={5}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-['Inter'] resize-none"
                style={{ background: "rgba(6,13,26,0.8)", border: "1px solid rgba(34,211,238,0.15)", color: "#D1D5DB", outline: "none" }}
              />
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] text-right mt-1">{body.length}/500</p>
            </div>

            {/* Schedule */}
            <div className="p-3 rounded-xl" style={{ background: "rgba(6,13,26,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-['Inter'] font-semibold">{isAr ? "جدولة الإرسال" : "Schedule Delivery"}</span>
                <button
                  onClick={() => setScheduleEnabled(!scheduleEnabled)}
                  className="relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  style={{ background: scheduleEnabled ? "#22D3EE" : "rgba(255,255,255,0.1)" }}
                >
                  <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: "#060D1A", left: scheduleEnabled ? "calc(100% - 18px)" : "2px" }} />
                </button>
              </div>
              {scheduleEnabled && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-['JetBrains_Mono']"
                    style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.15)", color: "#D1D5DB", outline: "none" }}
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs font-['JetBrains_Mono']"
                    style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.15)", color: "#D1D5DB", outline: "none" }}
                  />
                </div>
              )}
            </div>

            {/* Send button */}
            <div className="flex gap-2">
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-['Inter'] cursor-pointer transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {isAr ? "حفظ كمسودة" : "Save Draft"}
              </button>
              <button
                onClick={handleSend}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
                style={{ background: "#22D3EE", color: "#060D1A", boxShadow: "0 0 16px rgba(34,211,238,0.2)" }}
              >
                <i className="ri-send-plane-fill" />
                {scheduleEnabled ? (isAr ? "جدولة" : "Schedule") : (isAr ? "إرسال الآن" : "Send Now")}
              </button>
            </div>
          </div>
        )}

        {/* TEMPLATES */}
        {activeView === "templates" && (
          <div className="grid grid-cols-1 gap-3">
            {messageTemplates.map((tpl) => {
              const cfg = msgTypeConfig[tpl.type];
              return (
                <div
                  key={tpl.id}
                  className="p-4 rounded-xl cursor-pointer transition-all hover:border-opacity-60"
                  style={{ background: "rgba(6,13,26,0.6)", border: `1px solid ${cfg.border}` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold font-['Inter']">{isAr ? tpl.nameAr : tpl.name}</p>
                        <span className="text-[10px] font-['JetBrains_Mono'] uppercase" style={{ color: cfg.color }}>{isAr ? cfg.labelAr : cfg.label}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => applyTemplate(tpl.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer transition-colors whitespace-nowrap flex-shrink-0"
                      style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}
                    >
                      <i className="ri-file-copy-line text-[10px]" />
                      {isAr ? "استخدام" : "Use"}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs font-['Inter'] leading-relaxed line-clamp-2">{tpl.subject}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
                      {isAr ? "استُخدم" : "Used"} {tpl.usageCount}×
                    </span>
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">
                      {isAr ? "آخر استخدام:" : "Last:"} {tpl.lastUsed}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SENT */}
        {activeView === "sent" && (
          <div className="space-y-3">
            {sentMessages.map((msg) => {
              const cfg = msgTypeConfig[msg.type];
              const deliveredPct = Math.round((msg.delivered / msg.total) * 100);
              const readPct = Math.round((msg.read / msg.total) * 100);
              return (
                <div key={msg.id} className="p-4 rounded-xl" style={{ background: "rgba(6,13,26,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono'] uppercase" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {isAr ? cfg.labelAr : cfg.label}
                      </span>
                    </div>
                    <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] flex-shrink-0">{msg.sentAt}</span>
                  </div>
                  <p className="text-white text-xs font-['Inter'] font-semibold mb-1">{msg.subject}</p>
                  <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mb-3 flex items-center gap-1">
                    <i className="ri-group-line" />
                    {msg.recipients}
                  </p>
                  {/* Delivery tracking */}
                  <div className="space-y-2">
                    {[
                      { label: "Sent",      labelAr: "مُرسَل",    value: msg.sent,      total: msg.total, color: "#22D3EE" },
                      { label: "Delivered", labelAr: "مُسلَّم",   value: msg.delivered, total: msg.total, color: "#4ADE80" },
                      { label: "Read",      labelAr: "مقروء",     value: msg.read,      total: msg.total, color: "#A78BFA" },
                    ].map((stat) => {
                      const pct = Math.round((stat.value / stat.total) * 100);
                      return (
                        <div key={stat.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{isAr ? stat.labelAr : stat.label}</span>
                            <span className="text-[10px] font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>
                              {stat.value.toLocaleString()} / {stat.total.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: stat.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;
