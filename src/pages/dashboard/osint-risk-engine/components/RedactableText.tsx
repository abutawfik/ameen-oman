// Redactable text — Wave 3 · D5. If viewer clearance is below the field's
// classification, renders █████████ in a monospace redacted style with a
// tooltip explaining what's required. Everything else falls through as text.

import { useClearance, REDACTED_GLYPH } from "@/brand/clearance";
import { CLASSIFICATION_META, type Classification } from "@/mocks/osintData";

const RedactableText = ({
  fieldClass, value, className, style,
}: {
  fieldClass: Classification;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { canView, clearance } = useClearance();
  const visible = canView(fieldClass);
  if (visible) {
    return <span className={className} style={style}>{value}</span>;
  }
  const needed = CLASSIFICATION_META[fieldClass].label;
  return (
    <span
      className={className}
      style={{ ...style, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", color: "#6B7280" }}
      title={`Redacted · ${needed} clearance required (viewer: ${CLASSIFICATION_META[clearance].label})`}
    >
      {REDACTED_GLYPH}
    </span>
  );
};

export default RedactableText;
