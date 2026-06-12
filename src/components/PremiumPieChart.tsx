'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type PieItem = {
  name: string;
  percent: number;
  color?: string;
  amount?: string;
  note?: string;
};

type Props = {
  items: PieItem[];
  activeIndex?: number | null;
  onActive?: (i: number | null) => void;
  size?: number;
  innerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
  centerSub?: string;
  animated?: boolean;
  className?: string;
};

function roundCoord(n: number) {
  return Math.round(n * 100) / 100;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: roundCoord(cx + r * Math.cos(rad)), y: roundCoord(cy + r * Math.sin(rad)) };
}

function slicePath(cx: number, cy: number, outerR: number, innerR: number, start: number, end: number) {
  const large = end - start > 180 ? 1 : 0;
  const oS = polar(cx, cy, outerR, end);
  const oE = polar(cx, cy, outerR, start);
  const iS = polar(cx, cy, innerR, start);
  const iE = polar(cx, cy, innerR, end);
  return `M ${oS.x} ${oS.y} A ${outerR} ${outerR} 0 ${large} 0 ${oE.x} ${oE.y} L ${iS.x} ${iS.y} A ${innerR} ${innerR} 0 ${large} 1 ${iE.x} ${iE.y} Z`;
}

function midAngle(start: number, end: number) {
  return (start + end) / 2;
}

function lighten(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - amt);
  const g = Math.max(0, ((n >> 8) & 255) - amt);
  const b = Math.max(0, (n & 255) - amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default function PremiumPieChart({
  items,
  activeIndex = null,
  onActive,
  size = 360,
  innerRadius = 0.38,
  centerLabel = 'Total Supply',
  centerValue = '1B',
  centerSub = 'MAXTRON',
  animated = true,
  className = '',
}: Props) {
  const uid = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(!animated);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = activeIndex ?? hovered;

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [animated]);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = outerR * innerRadius;
  const gap = 2.2;
  let cursor = 0;

  const segments = items.map((item, i) => {
    const sweep = (item.percent / 100) * 360 - gap;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end + gap;
    const color = item.color ?? '#391F6B';
    const mid = midAngle(start, end);
    const explode = active === i ? 14 : 0;
    const ex = Math.cos(((mid - 90) * Math.PI) / 180) * explode;
    const ey = Math.sin(((mid - 90) * Math.PI) / 180) * explode;
    return { ...item, i, start, end, mid, color, ex, ey, path: slicePath(cx, cy, outerR, innerR, start, end) };
  });

  const activeItem = active != null ? items[active] : null;

  return (
    <div ref={ref} className={`premium-pie-wrap ${className}`}>
      <div className="premium-pie-shadow" aria-hidden />
      <svg
        className={`premium-pie-svg ${vis ? 'premium-pie-visible' : ''}`}
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: '100%', maxWidth: size }}
      >
        <defs>
          {segments.map((seg) => (
            <linearGradient key={`g-${seg.i}`} id={`${uid}-g-${seg.i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={lighten(seg.color, 40)} />
              <stop offset="45%" stopColor={seg.color} />
              <stop offset="100%" stopColor={darken(seg.color, 25)} />
            </linearGradient>
          ))}
          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#391F6B" floodOpacity="0.35" />
          </filter>
        </defs>

        <g transform={`translate(${cx}, ${cy})`}>
          <g transform={`translate(${-cx}, ${-cy})`}>
            {segments.map((seg) => (
              <g
                key={seg.name}
                className="premium-pie-slice"
                style={{
                  transform: vis ? `translate(${seg.ex}px, ${seg.ey}px)` : 'translate(0, 0) scale(0.5)',
                  opacity: vis ? (active != null && active !== seg.i ? 0.45 : 1) : 0,
                  transition: `all 0.55s ${seg.i * 70}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
                onMouseEnter={() => { setHovered(seg.i); onActive?.(seg.i); }}
                onMouseLeave={() => { setHovered(null); onActive?.(null); }}
                onClick={() => onActive?.(active === seg.i ? null : seg.i)}
              >
                <path
                  d={seg.path}
                  fill={`url(#${uid}-g-${seg.i})`}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth={active === seg.i ? 2.5 : 1}
                  filter={active === seg.i ? `url(#${uid}-glow)` : `url(#${uid}-shadow)`}
                  className="cursor-pointer"
                />
                {seg.percent >= 6 && vis && (
                  <text
                    x={cx + Math.cos(((seg.mid - 90) * Math.PI) / 180) * (outerR * 0.72 + seg.ex * 0.3)}
                    y={cy + Math.sin(((seg.mid - 90) * Math.PI) / 180) * (outerR * 0.72 + seg.ey * 0.3)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="premium-pie-label"
                    style={{ opacity: active != null && active !== seg.i ? 0.4 : 1 }}
                  >
                    {seg.percent}%
                  </text>
                )}
              </g>
            ))}
          </g>
        </g>

        <circle cx={cx} cy={cy} r={innerR - 2} fill="white" filter={`url(#${uid}-shadow)`} />
        <circle cx={cx} cy={cy} r={innerR - 2} fill="url(#${uid}-hub)" opacity={0} />
        <defs>
          <radialGradient id={`${uid}-hub`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#ede9fe" />
          </radialGradient>
        </defs>
      </svg>

      <div className="premium-pie-center">
        {activeItem ? (
          <>
            <span className="premium-pie-center-pct">{activeItem.percent}%</span>
            <span className="premium-pie-center-title">{activeItem.name}</span>
            {activeItem.amount && <span className="premium-pie-center-sub">{activeItem.amount}</span>}
          </>
        ) : (
          <>
            <span className="premium-pie-center-eyebrow">{centerLabel}</span>
            <span className="premium-pie-center-value">{centerValue}</span>
            <span className="premium-pie-center-brand">{centerSub}</span>
          </>
        )}
      </div>
    </div>
  );
}
