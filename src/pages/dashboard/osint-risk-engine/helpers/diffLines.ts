// Minimal LCS-based line differ — no deps, O(m·n) space which is fine for
// the ~600-line rules.yaml we diff against. Returns a unified op stream so
// both columns can render identical ordering with interleaved add/remove
// markers. Equal lines are paired; edits surface as remove+add pairs.

export interface DiffOp {
  kind: "equal" | "remove" | "add";
  text: string;
  oldLine?: number; // 1-based original line number when defined
  newLine?: number; // 1-based updated line number when defined
}

export const diffLines = (aText: string, bText: string): DiffOp[] => {
  const a = aText.split("\n");
  const b = bText.split("\n");
  const m = a.length, n = b.length;

  // Build the LCS length table. Rows indexed 0..m, cols 0..n.
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Walk back from (m, n) → (0, 0) to produce ops in reverse.
  const ops: DiffOp[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      ops.push({ kind: "equal", text: a[i - 1], oldLine: i, newLine: j });
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      ops.push({ kind: "remove", text: a[i - 1], oldLine: i });
      i--;
    } else {
      ops.push({ kind: "add", text: b[j - 1], newLine: j });
      j--;
    }
  }
  while (i > 0) { ops.push({ kind: "remove", text: a[i - 1], oldLine: i }); i--; }
  while (j > 0) { ops.push({ kind: "add", text: b[j - 1], newLine: j }); j--; }
  return ops.reverse();
};
