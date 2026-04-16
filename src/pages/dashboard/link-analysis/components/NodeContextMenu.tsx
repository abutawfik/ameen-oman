import { useEffect, useRef } from "react";
import { GraphNode, nodeTypeConfig, riskColors } from "@/mocks/linkAnalysisData";

interface Props {
  node: GraphNode;
  x: number;
  y: number;
  isAr: boolean;
  onClose: () => void;
  onExpand: (nodeId: string, hops: 1 | 2 | 3) => void;
  onRemove: (nodeId: string) => void;
  onPin: (nodeId: string) => void;
  onAddToWatchlist: (nodeId: string) => void;
  onCreateCase: (nodeId: string) => void;
  onViewProfile: (nodeId: string) => void;
  onFindPath: (nodeId: string) => void;
}

const NodeContextMenu = ({
  node, x, y, isAr, onClose,
  onExpand, onRemove, onPin, onAddToWatchlist, onCreateCase, onViewProfile, onFindPath,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const cfg = nodeTypeConfig[node.type];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Adjust position to stay in viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 320);

  const menuItems = [
    {
      group: isAr ? "توسيع" : "Expand",
      items: [
        { icon: "ri-node-tree", label: isAr ? "توسيع 1 خطوة" : "Expand 1-hop", action: () => { onExpand(node.id, 1); onClose(); }, color: "#22D3EE" },
        { icon: "ri-git-branch-line", label: isAr ? "توسيع 2 خطوة" : "Expand 2-hops", action: () => { onExpand(node.id, 2); onClose(); }, color: "#22D3EE" },
        { icon: "ri-share-line", label: isAr ? "توسيع 3 خطوات" : "Expand 3-hops", action: () => { onExpand(node.id, 3); onClose(); }, color: "#22D3EE" },
      ],
    },
    {
      group: isAr ? "تحليل" : "Analysis",
      items: [
        { icon: "ri-route-line", label: isAr ? "إيجاد مسار" : "Find Path To...", action: () => { onFindPath(node.id); onClose(); }, color: "#A78BFA" },
        { icon: "ri-user-search-line", label: isAr ? "عرض ملف 360°" : "View 360° Profile", action: () => { onViewProfile(node.id); onClose(); }, color: "#4ADE80" },
      ],
    },
    {
      group: isAr ? "إجراءات" : "Actions",
      items: [
        { icon: node.pinned ? "ri-unpin-line" : "ri-pushpin-line", label: node.pinned ? (isAr ? "إلغاء التثبيت" : "Unpin") : (isAr ? "تثبيت" : "Pin Node"), action: () => { onPin(node.id); onClose(); }, color: "#FACC15" },
        { icon: "ri-eye-line", label: isAr ? "إضافة لقائمة المراقبة" : "Add to Watchlist", action: () => { onAddToWatchlist(node.id); onClose(); }, color: "#FB923C" },
        { icon: "ri-folder-add-line", label: isAr ? "إنشاء قضية" : "Create Case", action: () => { onCreateCase(node.id); onClose(); }, color: "#4ADE80" },
        { icon: "ri-delete-bin-line", label: isAr ? "إزالة من الرسم" : "Remove from Graph", action: () => { onRemove(node.id); onClose(); }, color: "#F87171" },
      ],
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] rounded-xl overflow-hidden"
      style={{
        left: adjustedX,
        top: adjustedY,
        background: "rgba(6,13,26,0.98)",
        border: "1px solid rgba(34,211,238,0.25)",
        backdropFilter: "blur(20px)",
        minWidth: "200px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* Node header */}
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 border-b"
        style={{ borderColor: "rgba(34,211,238,0.12)", background: "rgba(34,211,238,0.04)" }}
      >
        <div className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: `${cfg.color}22`, border: `1.5px solid ${cfg.color}66` }}>
          <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold font-['Inter'] truncate">{node.label}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-gray-500 text-[10px] font-['JetBrains_Mono'] uppercase">{node.type}</span>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: riskColors[node.risk] }} />
            <span className="text-[10px] font-['JetBrains_Mono'] capitalize" style={{ color: riskColors[node.risk] }}>{node.risk}</span>
          </div>
        </div>
      </div>

      {/* Menu groups */}
      {menuItems.map((group, gi) => (
        <div key={gi}>
          <div className="px-3 pt-2 pb-0.5">
            <span className="text-[10px] font-bold tracking-widest font-['JetBrains_Mono'] uppercase" style={{ color: "#374151" }}>
              {group.group}
            </span>
          </div>
          {group.items.map((item, ii) => (
            <button
              key={ii}
              onClick={item.action}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
              </div>
              <span className="text-xs text-gray-300 font-['Inter']">{item.label}</span>
            </button>
          ))}
          {gi < menuItems.length - 1 && (
            <div className="mx-3 my-1 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default NodeContextMenu;
