'use client';

import { useId, useState } from 'react';
import type { Allocation } from '@/lib/tokenomics-data';

type Props = {
  items: Allocation[];
  activeIndex: number | null;
  onActive: (i: number | null) => void;
};

export default function ConcentricSupplyChart({ items, activeIndex, onActive }: Props) {
  const uid = useId().replace(/:/g, '');
  const [hovered, setHovered] = useState<number | null>(null);
  const active = activeIndex ?? hovered;
  const sorted = [...items].sort((a, b) => b.percent - a.percent);
  const cx = 200;
  const cy = 200;
  const maxR = 165;
  const minR = 42;
  const step = (maxR - minR) / sorted.length;

  return (
    <div className="pr-concentric">
      <svg viewBox="0 0 400 400" className="pr-concentric-svg" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#391F6B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={maxR + 12} fill={`url(#${uid}-glow)`} className="pr-concentric-glow" />
        {sorted.map((item, i) => {
          const r = maxR - i * step;
          const origIdx = items.findIndex((x) => x.name === item.name);
          const isOn = active === origIdx;
          return (
            <g key={item.name}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={item.color}
                fillOpacity={isOn ? 0.95 : 0.72}
                stroke={isOn ? '#fff' : 'rgba(255,255,255,0.12)'}
                strokeWidth={isOn ? 2 : 0.5}
                className="pr-ring"
                style={{ transition: 'fill-opacity 0.35s ease, stroke-width 0.35s ease' }}
                onMouseEnter={() => { setHovered(origIdx); onActive(origIdx); }}
                onMouseLeave={() => { setHovered(null); onActive(null); }}
                onClick={() => onActive(activeIndex === origIdx ? null : origIdx)}
              />
              {r > 55 && (
                <text
                  x={cx}
                  y={cy - r + 14}
                  textAnchor="middle"
                  className="pr-ring-label"
                  fill={isOn ? '#fff' : 'rgba(255,255,255,0.75)'}
                  fontSize="11"
                  fontWeight="700"
                >
                  {item.percent}%
                </text>
              )}
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={minR - 8} fill="#0a0612" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700" fontFamily="var(--font-space-grotesk)">1B</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="600" letterSpacing="0.12em">MAXTRON</text>
      </svg>
    </div>
  );
}
