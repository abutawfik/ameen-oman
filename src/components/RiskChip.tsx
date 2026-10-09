import { getRiskToken } from '@/lib/riskColors';

interface Props {
  level: string;
  isAr?: boolean;
  /** 'pill' (default) = rounded badge | 'square' = small square icon | 'dot' = dot + text */
  variant?: 'pill' | 'square' | 'dot';
  size?: 'xs' | 'sm';
}

const MONO = "'JetBrains Mono', monospace";

export default function RiskChip({ level, isAr = false, variant = 'pill', size = 'xs' }: Props) {
  const t = getRiskToken(level);
  const label = isAr ? t.labelAr : t.labelEn.toUpperCase();

  if (variant === 'dot') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
        <span style={{ fontSize: size === 'xs' ? 10 : 11, color: t.color, fontFamily: MONO, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </span>
    );
  }

  if (variant === 'square') {
    const sz = size === 'xs' ? 24 : 28;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: sz, height: sz, borderRadius: 4,
        background: t.bg, border: `1px solid ${t.border}`,
        fontSize: size === 'xs' ? 8 : 10, fontFamily: MONO, fontWeight: 700,
        color: t.color, textTransform: 'uppercase', flexShrink: 0,
      }}>
        {(isAr ? t.labelAr : t.labelEn).slice(0, 3).toUpperCase()}
      </span>
    );
  }

  // pill (default)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10,
      padding: size === 'xs' ? '1px 7px' : '2px 9px',
      fontSize: size === 'xs' ? 10 : 11, fontFamily: MONO, fontWeight: 700,
      color: t.color, textTransform: 'uppercase', letterSpacing: '0.04em',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label}
    </span>
  );
}
