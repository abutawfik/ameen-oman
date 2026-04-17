// YAML serializer for the scoring rules editor.
// Mirrors the Tech Spec §7.3 rules.yaml contract. Kept dependency-free so the
// Config tab can render a live-updating textarea without pulling in Monaco or
// a YAML lib.

import { DEFAULT_SUB_SCORE_WEIGHTS, type RiskRule } from "@/mocks/osintData";
import type { DiffOp } from "./diffLines";

export const buildRulesYaml = (rules: RiskRule[]): string => {
  const header = [
    `# rules.yaml · ${rules.length} rules · v1.2.0 · loaded at ${new Date().toISOString()}`,
    `# Each rule declares category, predicate, contribution, and required sources.`,
    `# Hot-reload via POST /rules/reload (admin auth).`,
    ``,
  ].join("\n");
  const body = rules.map((r) => {
    const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === r.category)!;
    // Light heuristic to pick a predicate shape from the human-readable threshold.
    const predicate = /fuzzy/i.test(r.threshold)
      ? `    type: fuzzy_match\n    against: opensanctions_entities\n    threshold: 0.92`
      : /graph|hops/i.test(r.threshold)
        ? `    type: graph_distance\n    against: sponsor_entity_graph\n    max_hops: 2\n    decay: 0.5`
        : /outbreak/i.test(r.threshold)
          ? `    type: outbreak_active\n    source: who_don\n    window_days: 14`
          : /advisory/i.test(r.threshold)
            ? `    type: threshold\n    signal: advisory_level\n    min: 3`
            : /anomaly|z-score|iforest|Z-score/i.test(r.threshold)
              ? `    type: threshold\n    signal: routing_iforest_score\n    min: 0.75`
              : `    type: threshold\n    signal: ${r.category}_signal\n    note: "see spec §7.3"`;
    const sources = meta.primarySources.map((s) => `"${s}"`).join(", ");
    return [
      `- id: ${r.id}`,
      `  version: ${r.version}`,
      `  category: ${r.category}`,
      `  description: ${JSON.stringify(r.description)}`,
      `  required_sources: [${sources}]`,
      `  predicate:`,
      predicate,
      `  threshold_literal: ${JSON.stringify(r.threshold)}`,
      `  contribution: ${r.contribution.toFixed(2)}`,
      `  enabled: ${r.enabled ? "true" : "false"}`,
      `  fires_last_24h: ${r.firesLast24h}`,
      `  audit_level: ${r.contribution >= 0.8 ? "high" : r.contribution >= 0.5 ? "medium" : "low"}`,
      ``,
    ].join("\n");
  }).join("\n");
  return `${header}${body}`;
};

// Count how many rule blocks (anchored by `- id: …` lines) the diff touches.
// Cheap and good enough for the "X rules modified" header.
export const countRulesModified = (ops: DiffOp[]): number => {
  const rulesTouched = new Set<string>();
  let currentOldRule: string | null = null;
  let currentNewRule: string | null = null;
  for (const op of ops) {
    const idMatch = op.text.match(/^\s*-\s*id:\s*(\S+)/);
    if (idMatch) {
      if (op.kind !== "add") currentOldRule = idMatch[1];
      if (op.kind !== "remove") currentNewRule = idMatch[1];
    }
    if (op.kind === "add" || op.kind === "remove") {
      if (currentNewRule) rulesTouched.add(currentNewRule);
      if (currentOldRule) rulesTouched.add(currentOldRule);
    }
  }
  return rulesTouched.size;
};
