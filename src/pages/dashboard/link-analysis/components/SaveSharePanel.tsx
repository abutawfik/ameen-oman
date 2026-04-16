import { useState } from "react";
import { savedWorkspaces, mockAnnotations, Annotation } from "@/mocks/linkAnalysisData";

interface Props {
  isAr: boolean;
  nodeCount: number;
  edgeCount: number;
  annotations: Annotation[];
  onAddAnnotation: () => void;
  onDeleteAnnotation: (id: string) => void;
  onLoadWorkspace: (id: string) => void;
}

const SaveSharePanel = ({
  isAr, nodeCount, edgeCount, annotations,
  onAddAnnotation, onDeleteAnnotation, onLoadWorkspace,
}: Props) => {
  const [activeTab, setActiveTab] = useState<"workspaces" | "annotations" | "history">("workspaces");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (!saveName.trim()) return;
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setShowSaveModal(false); setSaveName(""); }, 1800);
  };

  const tagColors: Record<string, string> = {
    financial: "#4ADE80",
    critical: "#F87171",
    high: "#FB923C",
    medium: "#FACC15",
    hotel: "#22D3EE",
    mobile: "#A78BFA",
  };

  const historyItems = [
    { action: isAr ? "تشغيل أقصر مسار" : "Ran Shortest Path", time: "2 min ago", icon: "ri-route-line", color: "#22D3EE" },
    { action: isAr ? "إضافة عقدة: حساب بنكي" : "Added Node: Bank Account", time: "8 min ago", icon: "ri-add-circle-line", color: "#4ADE80" },
    { action: isAr ? "اكتشاف المجتمعات" : "Community Detection Run", time: "15 min ago", icon: "ri-group-line", color: "#A78BFA" },
    { action: isAr ? "توسيع 2 خطوة من أحمد" : "2-hop Expand from Ahmed", time: "22 min ago", icon: "ri-git-branch-line", color: "#FB923C" },
    { action: isAr ? "تحميل مساحة العمل" : "Loaded Workspace", time: "31 min ago", icon: "ri-folder-open-line", color: "#FACC15" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
        {[
          { key: "workspaces" as const, label: isAr ? "مساحات العمل" : "Workspaces", icon: "ri-folder-line" },
          { key: "annotations" as const, label: isAr ? "الملاحظات" : "Annotations", icon: "ri-sticky-note-line" },
          { key: "history" as const, label: isAr ? "السجل" : "History", icon: "ri-history-line" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-['Inter'] cursor-pointer transition-colors"
            style={{
              color: activeTab === tab.key ? "#22D3EE" : "#6B7280",
              borderBottom: activeTab === tab.key ? "2px solid #22D3EE" : "2px solid transparent",
            }}
          >
            <i className={`${tab.icon} text-sm`} />
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Workspaces tab */}
        {activeTab === "workspaces" && (
          <div className="p-3 space-y-2">
            {/* Current workspace stats */}
            <div
              className="p-3 rounded-lg"
              style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}
            >
              <p className="text-cyan-400 text-xs font-semibold font-['Inter'] mb-2">
                {isAr ? "مساحة العمل الحالية" : "Current Workspace"}
              </p>
              <div className="flex gap-4">
                <div>
                  <p className="text-white text-lg font-black font-['JetBrains_Mono']">{nodeCount}</p>
                  <p className="text-gray-600 text-[10px] font-['Inter']">{isAr ? "عقدة" : "nodes"}</p>
                </div>
                <div>
                  <p className="text-white text-lg font-black font-['JetBrains_Mono']">{edgeCount}</p>
                  <p className="text-gray-600 text-[10px] font-['Inter']">{isAr ? "رابط" : "edges"}</p>
                </div>
                <div>
                  <p className="text-white text-lg font-black font-['JetBrains_Mono']">{annotations.length}</p>
                  <p className="text-gray-600 text-[10px] font-['Inter']">{isAr ? "ملاحظة" : "notes"}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex-1 py-1.5 rounded text-xs font-['Inter'] font-semibold cursor-pointer"
                  style={{ background: "#22D3EE", color: "#060D1A" }}
                >
                  <i className="ri-save-line mr-1" />
                  {isAr ? "حفظ" : "Save"}
                </button>
                <button
                  className="flex-1 py-1.5 rounded text-xs font-['Inter'] cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}
                >
                  <i className="ri-share-line mr-1" />
                  {isAr ? "مشاركة" : "Share"}
                </button>
              </div>
            </div>

            {/* Saved workspaces */}
            <p className="text-gray-600 text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase px-1">
              {isAr ? "المحفوظة" : "SAVED"}
            </p>
            {savedWorkspaces.map(ws => (
              <div
                key={ws.id}
                className="p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => onLoadWorkspace(ws.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-gray-200 text-xs font-semibold font-['Inter'] leading-tight">{ws.name}</p>
                  {ws.shared && (
                    <span className="text-[10px] font-['JetBrains_Mono'] flex-shrink-0" style={{ color: "#4ADE80" }}>
                      <i className="ri-share-line mr-0.5" />shared
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{ws.nodeCount}N · {ws.edgeCount}E</span>
                  <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{ws.updatedAt}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ws.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono']"
                      style={{ background: `${tagColors[tag] || "#9CA3AF"}15`, color: tagColors[tag] || "#9CA3AF", border: `1px solid ${tagColors[tag] || "#9CA3AF"}30` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Annotations tab */}
        {activeTab === "annotations" && (
          <div className="p-3 space-y-2">
            <button
              onClick={onAddAnnotation}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-colors"
              style={{ background: "rgba(250,204,21,0.08)", border: "1px dashed rgba(250,204,21,0.3)", color: "#FACC15" }}
            >
              <i className="ri-add-line" />
              {isAr ? "إضافة ملاحظة على الرسم" : "Add Annotation to Canvas"}
            </button>
            {annotations.length === 0 && (
              <p className="text-gray-600 text-xs text-center py-6 font-['Inter']">
                {isAr ? "لا توجد ملاحظات بعد" : "No annotations yet"}
              </p>
            )}
            {annotations.map(ann => (
              <div
                key={ann.id}
                className="p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ann.color}30` }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: ann.color }} />
                  <p className="text-gray-300 text-xs font-['Inter'] flex-1 leading-relaxed">{ann.text}</p>
                  <button
                    onClick={() => onDeleteAnnotation(ann.id)}
                    className="text-gray-700 hover:text-red-400 cursor-pointer flex-shrink-0"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-[10px] font-['Inter']">{ann.author}</span>
                  <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{ann.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History tab */}
        {activeTab === "history" && (
          <div className="p-3 space-y-1">
            {historyItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-xs font-['Inter'] truncate">{item.action}</p>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div
            className="w-80 rounded-xl p-5"
            style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(34,211,238,0.25)" }}
          >
            <h3 className="text-white text-sm font-bold font-['Inter'] mb-4">
              {isAr ? "حفظ مساحة العمل" : "Save Workspace"}
            </h3>
            {saveSuccess ? (
              <div className="flex items-center gap-2 py-3 text-green-400">
                <i className="ri-checkbox-circle-line text-xl" />
                <span className="text-sm font-['Inter']">{isAr ? "تم الحفظ بنجاح!" : "Saved successfully!"}</span>
              </div>
            ) : (
              <>
                <input
                  autoFocus
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder={isAr ? "اسم مساحة العمل..." : "Workspace name..."}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none mb-4 font-['Inter']"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(34,211,238,0.2)" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 rounded-lg text-sm font-['Inter'] font-semibold cursor-pointer"
                    style={{ background: "#22D3EE", color: "#060D1A" }}
                  >
                    {isAr ? "حفظ" : "Save"}
                  </button>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveSharePanel;
