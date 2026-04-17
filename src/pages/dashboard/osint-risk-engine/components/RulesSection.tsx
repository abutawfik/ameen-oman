// Rules section with YAML toggle (Wave 3 · D1).
// Mirrors the Tech Spec §7.3 rules.yaml contract. Editor is a styled textarea
// with a line-number gutter (Monaco-avoided — no new deps). Validate /
// Reload / Reset / Download controls live above. Read-only by default;
// the Edit toggle unlocks the textarea. The Diff toggle switches to the
// split-column LCS diff view.

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SUB_SCORE_WEIGHTS, type RiskRule } from "@/mocks/osintData";
import { buildRulesYaml, countRulesModified } from "../helpers/yamlSerializer";
import { diffLines } from "../helpers/diffLines";

// Split-column diff view. Left side = "file on disk" (ocean-900, red
// strikethrough for removed lines). Right side = "pending buffer" (ocean-800,
// green background for added lines). Equal lines render muted on both sides
// so the visual delta pops.
const YamlDiffView = ({ isAr, original, current }: { isAr: boolean; original: string; current: string }) => {
  const ops = useMemo(() => diffLines(original, current), [original, current]);
  const added = ops.filter((o) => o.kind === "add").length;
  const removed = ops.filter((o) => o.kind === "remove").length;
  const rulesModified = countRulesModified(ops);

  // Each op produces a paired row — one left cell (original) and one right
  // cell (updated). For `equal` rows both cells show the same text. For
  // `remove` only left has content; for `add` only right has content.
  const rows = ops.map((op, i) => {
    let leftText = "", rightText = "";
    let leftLine: number | undefined, rightLine: number | undefined;
    if (op.kind === "equal") {
      leftText = op.text; rightText = op.text;
      leftLine = op.oldLine; rightLine = op.newLine;
    } else if (op.kind === "remove") {
      leftText = op.text;
      leftLine = op.oldLine;
    } else {
      rightText = op.text;
      rightLine = op.newLine;
    }
    return { key: i, kind: op.kind, leftText, rightText, leftLine, rightLine };
  });

  return (
    <div className="space-y-2">
      {/* Header — summary of what changed */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2 rounded-md"
        style={{ background: "rgba(107,79,174,0.08)", border: "1px solid rgba(107,79,174,0.3)" }}>
        <div className="flex items-center gap-3 text-[11px] font-['JetBrains_Mono']" style={{ color: "#B8A0FF" }}>
          <span className="flex items-center gap-1">
            <i className="ri-git-pull-request-line" />
            {rulesModified} {isAr ? "قواعد معدَّلة" : "rules modified"}
          </span>
          <span style={{ color: "#4ADE80" }}>+ {added} {isAr ? "سطراً مضافاً" : "lines added"}</span>
          <span style={{ color: "#C94A5E" }}>− {removed} {isAr ? "سطراً محذوفاً" : "lines removed"}</span>
        </div>
        <span className="text-[10px] tracking-widest uppercase font-['JetBrains_Mono']" style={{ color: "#B8A0FF" }}>
          {isAr ? "مقارنة ثنائية · الملف ↔ المسودّة" : "Side-by-side · file ↔ pending"}
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-[10px] tracking-widest uppercase font-['JetBrains_Mono'] px-3" style={{ color: "#C94A5E" }}>
          {isAr ? "الأصل (ملف)" : "Original · on disk"}
        </div>
        <div className="text-[10px] tracking-widest uppercase font-['JetBrains_Mono'] px-3" style={{ color: "#4ADE80" }}>
          {isAr ? "الحالي (معلَّق)" : "Current · pending"}
        </div>
      </div>

      {/* Diff body — two scrollable panels sharing a synced row iterator. */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg overflow-auto"
          style={{ background: "var(--alm-ocean-900, #061B30)", border: "1px solid rgba(201,74,94,0.25)", maxHeight: 420, fontFamily: "'JetBrains Mono', monospace" }}>
          {rows.map((r) => {
            const isRemove = r.kind === "remove";
            const bg = isRemove ? "rgba(201,74,94,0.18)" : "transparent";
            const color = isRemove ? "#F7C6CE" : r.leftText ? "#9CA3AF" : "transparent";
            const textDecoration = isRemove ? "line-through" : "none";
            return (
              <div key={`l-${r.key}`}
                className="flex items-start gap-2 px-2 py-[1px]"
                style={{ background: bg, fontSize: 12, lineHeight: 1.55 }}>
                <span style={{ color: "#4A6078", minWidth: 32, textAlign: "right", userSelect: "none" }}>
                  {r.leftLine ?? ""}
                </span>
                <span style={{ color: isRemove ? "#C94A5E" : "transparent", width: 10, userSelect: "none" }}>
                  {isRemove ? "−" : "\u00A0"}
                </span>
                <span style={{ color, textDecoration, whiteSpace: "pre" }}>
                  {r.leftText || "\u00A0"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg overflow-auto"
          style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(74,222,128,0.25)", maxHeight: 420, fontFamily: "'JetBrains Mono', monospace" }}>
          {rows.map((r) => {
            const isAdd = r.kind === "add";
            const bg = isAdd ? "rgba(74,222,128,0.16)" : "transparent";
            const color = isAdd ? "#C7F3CF" : r.rightText ? "#D6B47E" : "transparent";
            return (
              <div key={`r-${r.key}`}
                className="flex items-start gap-2 px-2 py-[1px]"
                style={{ background: bg, fontSize: 12, lineHeight: 1.55 }}>
                <span style={{ color: "#4A6078", minWidth: 32, textAlign: "right", userSelect: "none" }}>
                  {r.rightLine ?? ""}
                </span>
                <span style={{ color: isAdd ? "#4ADE80" : "transparent", width: 10, userSelect: "none" }}>
                  {isAdd ? "+" : "\u00A0"}
                </span>
                <span style={{ color, whiteSpace: "pre" }}>
                  {r.rightText || "\u00A0"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state — means user toggled Diff with no real changes */}
      {added === 0 && removed === 0 && (
        <div className="text-center text-xs py-4 font-['JetBrains_Mono']" style={{ color: "#6B7280" }}>
          {isAr ? "لا اختلاف — المسودّة تطابق الملف." : "No differences — pending buffer matches the file."}
        </div>
      )}
    </div>
  );
};

const RulesSection = ({
  isAr, rules, onRuleToggle,
}: {
  isAr: boolean;
  rules: RiskRule[];
  onRuleToggle: (id: string) => void;
}) => {
  const [view, setView] = useState<"list" | "yaml">("list");
  const [editable, setEditable] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [diffVisible, setDiffVisible] = useState(false);
  const [docReference, setDocReference] = useState(false);
  const [yamlText, setYamlText] = useState(() => buildRulesYaml(rules));
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "reload" | "info" } | null>(null);

  // Snapshot of the original YAML captured once at first render so the diff
  // compares against the "file on disk" rather than whatever the last
  // buildRulesYaml() call produced (which can drift as toggles fire).
  const originalYamlRef = useRef<string>(yamlText);

  // Whenever the rule toggle changes upstream, regenerate the YAML unless the
  // user has actively edited it (then we preserve their pending text).
  useEffect(() => {
    if (!dirty) {
      const next = buildRulesYaml(rules);
      setYamlText(next);
      originalYamlRef.current = next;
    }
  }, [rules, dirty]);

  const fireToast = (msg: string, kind: "ok" | "reload" | "info") => {
    setToast({ msg, kind });
    window.setTimeout(() => setToast(null), 4000);
  };

  const handleValidate = () => {
    fireToast(
      isAr
        ? `✓ ${rules.length} قواعد · صيغة صالحة · تم حل أنواع المسندات`
        : `✓ ${rules.length} rules · syntax valid · predicate types resolved`,
      "ok",
    );
  };

  const handleReload = () => {
    const auditId = `R-RELOAD-${new Date().toISOString().slice(0, 10)}-${String(Math.floor(Math.random() * 900 + 100))}`;
    fireToast(
      isAr
        ? `تمّ التحميل الساخن · تمّ التطبيق على التسجيل المباشر · خلال 340ms · ${auditId}`
        : `Reloading... ✓ Rules applied to live scoring · completed in 340ms · audit entry ${auditId} created`,
      "reload",
    );
    // Promote pending YAML to the new "original" so subsequent edits diff
    // against what just got reloaded.
    originalYamlRef.current = yamlText;
    setDirty(false);
    setDiffVisible(false);
  };

  const handleReset = () => {
    const base = buildRulesYaml(rules);
    setYamlText(base);
    originalYamlRef.current = base;
    setDirty(false);
    setDiffVisible(false);
    fireToast(isAr ? "تمّ استرجاع الملف من الذاكرة" : "Reverted to file contents", "info");
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([yamlText], { type: "text/yaml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rules.yaml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      fireToast(isAr ? "تعذّر التنزيل" : "Download failed", "info");
    }
  };

  const lineCount = yamlText.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="rounded-xl border p-5"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      {/* Section header + view toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-white text-sm font-bold flex items-center gap-2">
            {isAr ? "قواعد التقييم" : "Scoring rules"}
            {dirty && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest font-['JetBrains_Mono']"
                style={{ background: "rgba(201,138,27,0.15)", color: "#C98A1B", border: "1px solid #C98A1B55" }}>
                {isAr ? "تعديلات معلّقة" : "PENDING CHANGES"}
              </span>
            )}
          </h3>
          <p className="text-gray-500 text-[11px] font-['JetBrains_Mono']">
            {rules.filter((r) => r.enabled).length}/{rules.length} {isAr ? "نشطة" : "active"} · {rules.reduce((s, r) => s + r.firesLast24h, 0)} fires · 24h
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle pill */}
          <div className="flex gap-1 p-0.5 rounded-lg"
            style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(184,138,60,0.15)" }}>
            {([
              { id: "list", iconCls: "ri-list-check-2", labelEn: "Toggle list", labelAr: "قائمة التبديل" },
              { id: "yaml", iconCls: "ri-code-s-slash-line", labelEn: "YAML", labelAr: "YAML" },
            ] as const).map((v) => {
              const active = view === v.id;
              return (
                <button key={v.id} type="button" onClick={() => setView(v.id)}
                  className="px-3 py-1 rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  style={{
                    background: active ? "rgba(184,138,60,0.15)" : "transparent",
                    color: active ? "#D6B47E" : "#9CA3AF",
                    border: `1px solid ${active ? "#D6B47E" : "transparent"}`,
                  }}>
                  <i className={v.iconCls} />
                  {isAr ? v.labelAr : v.labelEn}
                </button>
              );
            })}
          </div>

          {view === "yaml" && (
            <>
              <button type="button"
                onClick={() => setEditable((e) => !e)}
                disabled={diffVisible}
                title={diffVisible ? (isAr ? "عرض الفرق نشط — أغلق الفرق للتحرير" : "Diff view active — exit diff to edit") : undefined}
                className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: editable ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                  color: editable ? "#4ADE80" : "#9CA3AF",
                  border: `1px solid ${editable ? "#4ADE8055" : "rgba(255,255,255,0.1)"}`,
                }}>
                <i className={editable ? "ri-edit-fill" : "ri-edit-line"} />
                {editable ? (isAr ? "وضع التحرير" : "Edit mode") : (isAr ? "تحرير" : "Edit")}
              </button>
              {/* Diff toggle — only actionable when there are pending edits */}
              <button type="button"
                onClick={() => {
                  if (!dirty) return;
                  setDiffVisible((d) => {
                    const next = !d;
                    // Entering diff auto-exits edit mode so the Edit button
                    // shows as disabled per the brief.
                    if (next) setEditable(false);
                    return next;
                  });
                }}
                disabled={!dirty}
                className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: diffVisible ? "rgba(107,79,174,0.18)" : "rgba(255,255,255,0.04)",
                  color: diffVisible ? "#B8A0FF" : "#9CA3AF",
                  border: `1px solid ${diffVisible ? "#6B4FAE88" : "rgba(255,255,255,0.1)"}`,
                }}>
                <i className="ri-git-pull-request-line" />
                {isAr ? "الفرق" : "Diff"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-3 rounded-lg border px-3 py-2 text-xs"
          style={{
            background: toast.kind === "ok"
              ? "rgba(74,222,128,0.08)"
              : toast.kind === "reload"
                ? "rgba(107,79,174,0.1)"
                : "rgba(184,138,60,0.08)",
            borderColor: toast.kind === "ok"
              ? "rgba(74,222,128,0.35)"
              : toast.kind === "reload"
                ? "rgba(107,79,174,0.35)"
                : "rgba(184,138,60,0.35)",
            color: toast.kind === "ok" ? "#4ADE80" : toast.kind === "reload" ? "#B8A0FF" : "#D6B47E",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
          {toast.msg}
        </div>
      )}

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {rules.map((r) => {
            const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === r.category)!;
            return (
              <button
                key={r.id}
                onClick={() => onRuleToggle(r.id)}
                className="flex items-start gap-3 px-3 py-2.5 rounded-md text-left cursor-pointer transition-all"
                style={{
                  background: r.enabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                  border: `1px solid ${r.enabled ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.04)"}`,
                  opacity: r.enabled ? 1 : 0.55,
                }}>
                <div className="w-9 h-5 rounded-full relative flex-shrink-0 mt-0.5 transition-colors"
                  style={{ background: r.enabled ? "#D6B47E" : "rgba(255,255,255,0.08)" }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: r.enabled ? "calc(100% - 18px)" : "2px" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold font-['JetBrains_Mono'] text-gray-200">{r.id}</span>
                    <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded"
                      style={{ background: `${meta.color}18`, color: meta.color }}>
                      {meta.labelEn.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-600 font-['JetBrains_Mono']">{r.version}</span>
                  </div>
                  <div className="text-gray-300 text-xs">{r.description}</div>
                  <div className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-0.5">
                    {r.threshold} · {r.firesLast24h} fires · 24h
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleValidate}
              className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5"
              style={{ background: "transparent", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-check-line" />
              {isAr ? "تحقّق" : "Validate"}
            </button>
            <button type="button" onClick={handleReload}
              className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5"
              style={{ background: "#8A1F3C", color: "#FFFFFF", border: "1px solid #C94A5E", fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-refresh-line" />
              {isAr ? "إعادة تحميل" : "Reload rules"}
            </button>
            <button type="button" onClick={handleReset}
              className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-restart-line" />
              {isAr ? "استعادة" : "Reset to file"}
            </button>
            <button type="button" onClick={handleDownload}
              className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-download-2-line" />
              {isAr ? "تنزيل .yaml" : "Download .yaml"}
            </button>
            <span className="ml-auto text-[10px] font-['JetBrains_Mono'] text-gray-500">
              {lineCount} {isAr ? "سطراً" : "lines"} · {yamlText.length.toLocaleString()} {isAr ? "رمزاً" : "chars"}
            </span>
          </div>

          {diffVisible ? (
            <YamlDiffView
              isAr={isAr}
              original={originalYamlRef.current}
              current={yamlText}
            />
          ) : (
            /* Editor — textarea + gutter. Mono theme keeps it honest without
                pulling in Monaco. */
            <div className="rounded-lg overflow-hidden flex"
              style={{ background: "var(--alm-ocean-900, #061B30)", border: "1px solid rgba(184,138,60,0.25)" }}>
              <div className="flex-shrink-0 px-3 py-3 select-none text-right"
                style={{
                  background: "rgba(10,37,64,0.85)",
                  borderRight: "1px solid rgba(184,138,60,0.15)",
                  minWidth: 48,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: "#6B7280",
                }}>
                {lineNumbers.map((n) => <div key={n}>{n}</div>)}
              </div>
              <textarea
                value={yamlText}
                readOnly={!editable}
                spellCheck={false}
                wrap="off"
                onChange={(e) => {
                  setYamlText(e.target.value);
                  setDirty(true);
                }}
                className="flex-1 p-3 min-h-[360px] outline-none resize-vertical"
                style={{
                  background: "transparent",
                  color: "#D6B47E",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.55,
                  whiteSpace: "pre",
                  overflowX: "auto",
                  caretColor: "#D6B47E",
                }}
              />
            </div>
          )}

          {/* Predicate DSL reference — collapsible help panel */}
          <button type="button"
            onClick={() => setDocReference((d) => !d)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-xs font-bold flex items-center gap-2"
              style={{ color: "#D6B47E", fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-book-2-line" />
              {isAr ? "مرجع لغة المسندات" : "Predicate DSL reference"}
            </span>
            <i className={docReference ? "ri-arrow-up-s-line text-gray-400" : "ri-arrow-down-s-line text-gray-400"} />
          </button>
          {docReference && (
            <div className="rounded-md p-3 text-[11px]"
              style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(184,138,60,0.15)", fontFamily: "'JetBrains Mono', monospace", color: "#9CA3AF" }}>
              <pre className="whitespace-pre-wrap">{`predicate: one of
  - fuzzy_match { against, threshold }
  - graph_distance { against, max_hops, decay }
  - threshold { signal, min | max }
  - outbreak_active { source, window_days }
  - signal_exists { signal }
  - and { of: [...] }
  - or { of: [...] }
  - not { of: ... }

contribution: 0.0 - 1.0          # scales the sub-score points
required_sources: [...]          # rule is skipped if any missing
enabled: true | false
audit_level: low | medium | high # controls audit + retention`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RulesSection;
