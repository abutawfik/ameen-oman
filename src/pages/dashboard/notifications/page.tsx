// Notifications — Wave 2 · Deliverable 4
// Three-tab module: Inbox · Routing Rules · Channel Config.

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import { useBrandFonts } from "@/brand/typography";
import EntityNotifPanel from "./components/EntityNotifPanel";
import {
  ROUTING_RULES,
  NOTIFICATION_CHANNELS,
  type NotificationChannel,
  type RoutingRule,
} from "@/mocks/osintData";

type Tab = "inbox" | "rules" | "channels";

const SEVERITY_COLOR: Record<RoutingRule["severity"], string> = {
  CRITICAL: "#8A1F3C",
  HIGH:     "#C94A5E",
  MEDIUM:   "#C98A1B",
  LOW:      "#4A8E3A",
};

const CHANNEL_ICON: Record<RoutingRule["channels"][number], string> = {
  in_app:  "ri-notification-3-line",
  email:   "ri-mail-line",
  sms:     "ri-smartphone-line",
  webhook: "ri-plug-line",
  voice:   "ri-phone-line",
};

const CHANNEL_LABEL: Record<string, { en: string; ar: string }> = {
  in_app:  { en: "In-app",  ar: "داخل التطبيق" },
  email:   { en: "Email",   ar: "البريد" },
  sms:     { en: "SMS",     ar: "رسالة نصية" },
  webhook: { en: "Webhook", ar: "ويب هوك" },
  voice:   { en: "Voice",   ar: "صوت" },
};

const HEALTH_COLOR: Record<NotificationChannel["health"], string> = {
  healthy:  "#4A8E3A",
  degraded: "#C98A1B",
  down:     "#C94A5E",
};

const fmtMinutes = (mins: number | null, isAr: boolean): string => {
  if (mins === null) return "—";
  if (mins < 60) return isAr ? `${mins} د` : `${mins} min`;
  const h = mins / 60;
  if (h < 24) return isAr ? `${h} س` : `${h} hr`;
  return isAr ? `نهاية الوردية` : "end of shift";
};

const NotificationsPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const fonts = useBrandFonts();
  const [tab, setTab] = useState<Tab>("inbox");
  const [rules, setRules] = useState<RoutingRule[]>(ROUTING_RULES);
  const [channels, setChannels] = useState<NotificationChannel[]>(NOTIFICATION_CHANNELS);
  const [editingSev, setEditingSev] = useState<RoutingRule["severity"] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const testChannel = (id: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, lastTestAt: new Date().toISOString() } : c));
    showToast(isAr ? "تم تشغيل اختبار القناة" : "Channel test triggered");
  };

  const toggleChannel = (id: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const tabs: { key: Tab; labelEn: string; labelAr: string; icon: string }[] = [
    { key: "inbox",    labelEn: "Inbox",         labelAr: "الوارد",           icon: "ri-inbox-line" },
    { key: "rules",    labelEn: "Routing Rules", labelAr: "قواعد التوجيه",   icon: "ri-git-branch-line" },
    { key: "channels", labelEn: "Channel Config", labelAr: "إعداد القنوات",  icon: "ri-send-plane-line" },
  ];

  return (
    <div className="p-5 min-h-full" style={{ background: "var(--alm-ocean-800, #0A2540)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: fonts.display }}>
            {isAr ? "نظام الإشعارات" : "Notification System"}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: fonts.mono }}>
            {isAr ? "صندوق الوارد · قواعد التوجيه · إعداد القنوات" : "Inbox · Routing rules · Channel config"}
          </p>
        </div>
        {toast && (
          <div className="rounded-lg px-4 py-2 flex items-center gap-2"
            style={{ background: "rgba(74,142,58,0.18)", border: "1px solid #4A8E3A66", fontFamily: fonts.sans }}>
            <i className="ri-check-line" style={{ color: "#4A8E3A" }} />
            <span className="text-white text-xs">{toast}</span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label={isAr ? "أقسام نظام الإشعارات" : "Notifications sections"}
        className="flex items-center gap-1 p-1 rounded-xl mb-4 inline-flex"
        style={{ background: "rgba(10,37,64,0.65)", border: "1px solid rgba(184,138,60,0.1)" }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const idx = tabs.findIndex((tk) => tk.key === tab);
          const delta = (isAr ? -1 : 1) * (e.key === "ArrowRight" ? 1 : -1);
          const next = tabs[(idx + delta + tabs.length) % tabs.length];
          if (next) {
            e.preventDefault();
            setTab(next.key);
          }
        }}
      >
        {tabs.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              aria-controls={`notif-panel-${t.key}`}
              id={`notif-tab-${t.key}`}
              onClick={() => setTab(t.key)}
              data-narrate-id={
                t.key === "inbox"
                  ? "notifications-inbox-tab"
                  : t.key === "rules"
                  ? "notifications-routing-rules"
                  : t.key === "channels"
                  ? "notifications-channel-config"
                  : undefined
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-all"
              style={{
                background: isActive ? "rgba(184,138,60,0.12)" : "transparent",
                color: isActive ? "#D6B47E" : "#9CA3AF",
                border: `1px solid ${isActive ? "rgba(184,138,60,0.25)" : "transparent"}`,
                fontFamily: fonts.sans,
                fontWeight: isActive ? 700 : 500,
              }}
            >
              <i className={t.icon} aria-hidden="true" />
              {isAr ? t.labelAr : t.labelEn}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "inbox" && (
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
          <EntityNotifPanel isAr={isAr} />
        </div>
      )}

      {tab === "rules" && (
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { k: "sev",     labelEn: "Severity",         labelAr: "الخطورة" },
                  { k: "rec",     labelEn: "Recipients",        labelAr: "المستلمون" },
                  { k: "ch",      labelEn: "Channels",          labelAr: "القنوات" },
                  { k: "sla",     labelEn: "Ack SLA",           labelAr: "SLA للإقرار" },
                  { k: "esc",     labelEn: "Escalation after",   labelAr: "تصعيد بعد" },
                  { k: "act",     labelEn: "",                    labelAr: "" },
                ].map((h) => (
                  <th key={h.k} className="text-left px-4 py-3 text-[10px] tracking-widest font-bold text-gray-400"
                    style={{ fontFamily: fonts.mono }}>
                    {isAr ? h.labelAr : h.labelEn}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((r, idx) => (
                <tr key={r.severity} className="border-b"
                  data-narrate-id={idx === 0 ? "notifications-rules-row" : undefined}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] tracking-widest font-bold"
                      style={{ background: `${SEVERITY_COLOR[r.severity]}22`, color: SEVERITY_COLOR[r.severity], border: `1px solid ${SEVERITY_COLOR[r.severity]}55`, fontFamily: fonts.mono }}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300" style={{ fontFamily: fonts.sans }}>
                    {r.recipients.length === 0 ? (isAr ? "—" : "none") : r.recipients.join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {r.channels.map((ch) => (
                        <span key={ch} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
                          style={{ background: "rgba(255,255,255,0.04)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>
                          <i className={CHANNEL_ICON[ch]} />
                          {isAr ? CHANNEL_LABEL[ch]?.ar : CHANNEL_LABEL[ch]?.en}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300" style={{ fontFamily: fonts.mono }}>
                    {fmtMinutes(r.ackSlaMinutes, isAr)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300" style={{ fontFamily: fonts.sans }}>
                    {r.escalateAfterMinutes !== null
                      ? (isAr ? `${fmtMinutes(r.escalateAfterMinutes, isAr)} → ${r.escalateTo}` : `${fmtMinutes(r.escalateAfterMinutes, isAr)} → ${r.escalateTo}`)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditingSev(r.severity)}
                      className="px-3 py-1 rounded text-[10px] font-bold cursor-pointer"
                      style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid #D6B47E44", fontFamily: fonts.mono }}>
                      {isAr ? "تعديل" : "Edit"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <div key={ch.id} className="rounded-xl border p-4"
              style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(184,138,60,0.12)", border: "1px solid #D6B47E33" }}>
                    <i className={ch.icon} style={{ color: "#D6B47E" }} />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>{ch.name}</h3>
                    <p className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>{ch.provider}</p>
                  </div>
                </div>
                <button onClick={() => toggleChannel(ch.id)}
                  className="w-10 h-5 rounded-full relative cursor-pointer"
                  style={{
                    background: ch.enabled ? "#4A8E3A" : "rgba(255,255,255,0.1)",
                    transition: "background 0.2s",
                  }}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: ch.enabled ? "22px" : "2px" }} />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: HEALTH_COLOR[ch.health] }} />
                <span className="text-[10px] tracking-widest font-bold" style={{ color: HEALTH_COLOR[ch.health], fontFamily: fonts.mono }}>
                  {ch.health.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 mb-3 text-[11px]">
                {Object.entries(ch.config).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-gray-500" style={{ fontFamily: fonts.sans }}>{k}</span>
                    <span className="text-gray-200 truncate max-w-[170px]" style={{ fontFamily: fonts.mono }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t flex items-center justify-between text-[10px]" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-gray-500" style={{ fontFamily: fonts.mono }}>
                  {isAr ? "آخر اختبار" : "Last test"}: {ch.lastTestAt.slice(0, 16).replace("T", " ")}
                </span>
                <button onClick={() => testChannel(ch.id)}
                  className="px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                  style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: fonts.mono }}>
                  <i className="ri-pulse-line mr-1" />
                  {isAr ? "اختبار" : "Test"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit rule modal */}
      {editingSev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(5,20,40,0.85)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "rgba(10,37,64,0.95)", border: "1px solid rgba(184,138,60,0.3)" }}>
            <h3 className="text-white text-lg font-bold mb-4" style={{ fontFamily: fonts.display }}>
              {isAr ? `تعديل قاعدة ${editingSev}` : `Edit ${editingSev} rule`}
            </h3>
            <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: fonts.sans }}>
              {isAr ? "التعديلات متاحة في العرض التوضيحي فقط — إعادة تحميل القواعد مرحلة 2." : "Edits available in demo only — rules reload is Phase 2."}
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingSev(null)}
                className="px-4 py-2 rounded-lg text-xs cursor-pointer"
                style={{ background: "transparent", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.sans }}>
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={() => { setEditingSev(null); showToast(isAr ? "تم (إعادة التحميل مرحلة 2)" : "Saved (reload is Phase 2)"); }}
                className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                style={{ background: "#D6B47E", color: "#051428", fontFamily: fonts.sans }}>
                {isAr ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
