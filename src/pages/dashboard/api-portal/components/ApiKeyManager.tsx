import { useState } from "react";
import { apiKeys, type ApiKey } from "@/mocks/apiPortalData";

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  active:  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  dot: "#4ADE80" },
  revoked: { color: "#F87171", bg: "rgba(248,113,113,0.1)", dot: "#F87171" },
  expired: { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  dot: "#FACC15" },
};

const envConfig: Record<string, { color: string; bg: string }> = {
  production: { color: "#4ADE80", bg: "rgba(74,222,128,0.08)" },
  sandbox:    { color: "#FACC15", bg: "rgba(250,204,21,0.08)" },
};

const ApiKeyManager = () => {
  const [keys, setKeys] = useState<ApiKey[]>(apiKeys);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"production" | "sandbox">("sandbox");
  const [newKeyPerms, setNewKeyPerms] = useState<string[]>(["hotel:read"]);
  const [filterEnv, setFilterEnv] = useState<"all" | "production" | "sandbox">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "revoked" | "expired">("all");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const allPerms = ["hotel:read", "hotel:write", "car-rental:read", "car-rental:write", "mobile:read", "mobile:write", "financial:read", "financial:write", "batch:upload"];

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.map((k) => k.id === id ? { ...k, status: "revoked" } : k));
  };

  const handleCreate = () => {
    const newKey: ApiKey = {
      id: `k${Date.now()}`,
      name: newKeyName || "New API Key",
      key: `amn_${newKeyEnv === "production" ? "live" : "test"}_GEN_${Math.random().toString(36).slice(2, 34)}`,
      entity: "Al Bustan Palace Hotel",
      entityType: "Hotel",
      environment: newKeyEnv,
      status: "active",
      permissions: newKeyPerms,
      rateLimit: newKeyEnv === "production" ? 1000 : 100,
      requestsToday: 0,
      requestsTotal: 0,
      lastUsed: "Never",
      created: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    setCreatedKey(newKey.key);
    setKeys((prev) => [newKey, ...prev]);
    setShowCreate(false);
    setNewKeyName("");
    setNewKeyPerms(["hotel:read"]);
  };

  const togglePerm = (perm: string) => {
    setNewKeyPerms((prev) => prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]);
  };

  const filtered = keys.filter((k) => {
    const envOk = filterEnv === "all" || k.environment === filterEnv;
    const statusOk = filterStatus === "all" || k.status === filterStatus;
    return envOk && statusOk;
  });

  const maskKey = (key: string) => `${key.slice(0, 20)}${"•".repeat(20)}${key.slice(-4)}`;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Keys",      value: String(keys.length),                                    color: "#22D3EE" },
          { label: "Active",          value: String(keys.filter((k) => k.status === "active").length), color: "#4ADE80" },
          { label: "Requests Today",  value: keys.reduce((a, k) => a + k.requestsToday, 0).toLocaleString(), color: "#FACC15" },
          { label: "Total Requests",  value: keys.reduce((a, k) => a + k.requestsTotal, 0).toLocaleString(), color: "#FB923C" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
            <p className="text-2xl font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-500 text-xs font-['Inter'] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New key created banner */}
      {createdKey && (
        <div className="rounded-xl p-4" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)" }}>
          <div className="flex items-start gap-3">
            <i className="ri-check-double-line text-green-400 text-lg flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-green-400 text-sm font-semibold font-['Inter'] mb-1">API Key Created — Save it now!</p>
              <p className="text-gray-400 text-xs font-['Inter'] mb-2">This key will only be shown once. Copy and store it securely.</p>
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
                <code className="text-green-300 text-xs font-['JetBrains_Mono'] flex-1 break-all">{createdKey}</code>
                <button onClick={() => handleCopy(createdKey, "new")} className="flex-shrink-0 px-3 py-1 rounded text-xs cursor-pointer whitespace-nowrap" style={{ background: "#22D3EE", color: "#060D1A" }}>
                  {copiedKey === "new" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <button onClick={() => setCreatedKey(null)} className="text-gray-600 hover:text-gray-400 cursor-pointer flex-shrink-0">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      )}

      {/* Filters + Create */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {(["all", "production", "sandbox"] as const).map((e) => (
            <button key={e} onClick={() => setFilterEnv(e)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap capitalize"
              style={{ background: filterEnv === e ? "#22D3EE" : "rgba(255,255,255,0.04)", color: filterEnv === e ? "#060D1A" : "#9CA3AF", border: filterEnv === e ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
              {e === "all" ? "All Environments" : e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(["all", "active", "revoked", "expired"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap capitalize"
              style={{ background: filterStatus === s ? (s === "all" ? "#22D3EE" : statusConfig[s]?.bg || "rgba(34,211,238,0.1)") : "rgba(255,255,255,0.04)", color: filterStatus === s ? (s === "all" ? "#060D1A" : statusConfig[s]?.color || "#22D3EE") : "#9CA3AF", border: filterStatus === s ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
              {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#22D3EE", color: "#060D1A" }}>
          <i className="ri-add-line mr-1" />
          Create API Key
        </button>
      </div>

      {/* Create Key Modal */}
      {showCreate && (
        <div className="rounded-xl p-5" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.25)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold text-sm font-['Inter']">
              <i className="ri-key-2-line mr-2 text-cyan-400" />
              Create New API Key
            </p>
            <button onClick={() => setShowCreate(false)} className="text-gray-600 hover:text-gray-400 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Key Name</label>
              <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Production Key — Main Branch"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">Environment</label>
              <div className="flex gap-2">
                {(["sandbox", "production"] as const).map((e) => (
                  <button key={e} onClick={() => setNewKeyEnv(e)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer capitalize whitespace-nowrap"
                    style={{ background: newKeyEnv === e ? envConfig[e].bg : "rgba(255,255,255,0.03)", color: newKeyEnv === e ? envConfig[e].color : "#9CA3AF", border: `1px solid ${newKeyEnv === e ? envConfig[e].color + "40" : "rgba(255,255,255,0.06)"}` }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2 font-['Inter'] uppercase tracking-wider">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {allPerms.map((perm) => (
                <button key={perm} onClick={() => togglePerm(perm)}
                  className="px-2.5 py-1 rounded text-xs font-['JetBrains_Mono'] cursor-pointer transition-all"
                  style={{ background: newKeyPerms.includes(perm) ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)", color: newKeyPerms.includes(perm) ? "#22D3EE" : "#6B7280", border: `1px solid ${newKeyPerms.includes(perm) ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                  {newKeyPerms.includes(perm) && <i className="ri-check-line mr-1 text-xs" />}
                  {perm}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#22D3EE", color: "#060D1A" }}>
              Generate Key
            </button>
            <button onClick={() => setShowCreate(false)} className="px-5 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="space-y-3">
        {filtered.map((key) => {
          const sc = statusConfig[key.status];
          const ec = envConfig[key.environment];
          const isRevealed = revealedKey === key.id;
          const usagePct = Math.min((key.requestsToday / key.rateLimit) * 100, 100);
          return (
            <div key={key.id} className="rounded-xl p-5" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${key.status === "active" ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.06)"}`, opacity: key.status !== "active" ? 0.7 : 1 }}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-white font-semibold text-sm font-['Inter']">{key.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: sc.bg, color: sc.color }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: sc.dot }} />
                      {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] capitalize" style={{ background: ec.bg, color: ec.color }}>
                      {key.environment}
                    </span>
                  </div>

                  {/* Key display */}
                  <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <code className="text-cyan-300 text-xs font-['JetBrains_Mono'] flex-1 truncate">
                      {isRevealed ? key.key : maskKey(key.key)}
                    </code>
                    <button onClick={() => setRevealedKey(isRevealed ? null : key.id)}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-white/5 transition-colors"
                      style={{ color: "#9CA3AF" }}>
                      <i className={`text-sm ${isRevealed ? "ri-eye-off-line" : "ri-eye-line"}`} />
                    </button>
                    <button onClick={() => handleCopy(key.key, key.id)}
                      className="flex-shrink-0 px-2.5 py-1 rounded text-xs cursor-pointer whitespace-nowrap transition-all"
                      style={{ background: copiedKey === key.id ? "rgba(74,222,128,0.2)" : "rgba(34,211,238,0.1)", color: copiedKey === key.id ? "#4ADE80" : "#22D3EE" }}>
                      {copiedKey === key.id ? <><i className="ri-check-line mr-1" />Copied</> : <><i className="ri-file-copy-line mr-1" />Copy</>}
                    </button>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {[
                      { label: "Entity", value: key.entity },
                      { label: "Last Used", value: key.lastUsed },
                      { label: "Created", value: key.created },
                      { label: "Expires", value: key.expiresAt },
                    ].map((m) => (
                      <div key={m.label}>
                        <p className="text-gray-600 text-xs font-['Inter']">{m.label}</p>
                        <p className="text-gray-300 text-xs font-['JetBrains_Mono']">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Permissions */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {key.permissions.map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded text-xs font-['JetBrains_Mono']" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.15)" }}>
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Usage bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-['Inter']">Today&apos;s Usage</span>
                      <span className="font-['JetBrains_Mono']" style={{ color: usagePct > 80 ? "#F87171" : usagePct > 60 ? "#FACC15" : "#4ADE80" }}>
                        {key.requestsToday.toLocaleString()} / {key.rateLimit.toLocaleString()} req/min
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${usagePct}%`, background: usagePct > 80 ? "#F87171" : usagePct > 60 ? "#FACC15" : "#22D3EE" }} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {key.status === "active" && (
                    <button onClick={() => handleRevoke(key.id)}
                      className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                      style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                      <i className="ri-forbid-line mr-1" />Revoke
                    </button>
                  )}
                  <button className="px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <i className="ri-bar-chart-2-line mr-1" />Usage
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApiKeyManager;
