// Unified classification pill — used across Explain header, Queue rows,
// Sequence Coherence rows, and Sources cards.

import { CLASSIFICATION_META, type Classification } from "@/mocks/osintData";

const ClassificationPill = ({
  classification, isAr, compact = false,
}: { classification: Classification; isAr: boolean; compact?: boolean }) => {
  const meta = CLASSIFICATION_META[classification];
  return (
    <span
      className="rounded-md font-bold tracking-widest font-['JetBrains_Mono'] flex-shrink-0 inline-flex items-center"
      style={{
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.color}44`,
        fontSize: compact ? 9 : 10,
        padding: compact ? "1px 5px" : "2px 7px",
      }}
    >
      {isAr ? meta.labelAr : meta.label}
    </span>
  );
};

export default ClassificationPill;
