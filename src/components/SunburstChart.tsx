'use client';

import { useId, useState } from 'react';
import { Shield } from 'lucide-react';
import type { Allocation } from '@/lib/tokenomics-data';

type Props = {
  items: Allocation[];
  activeIndex: number | null;
  onActive: (i: number | null) => void;
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r0: number, r1: number, start: number, end: number) {
  const large = end - start > 180 ? 1 : 0;
  const oS = polar(cx, cy, r1, end);
  const oE = polar(cx, cy, r1, start);
  const iS = polar(cx, cy, r0, start);
  const iE = polar(cx, cy, r0, end);
  return `M ${oS.x} ${oS.y} A ${r1} ${r1} 0 ${large} 0 ${oE.x} ${oE.y} L ${iS.x} ${iS.y} A ${r0} ${r0} 0 ${large} 1 ${iE.x} ${iE.y} Z`;
}

function midAngle(start: number, end: number) {
  return (start + end) / 2;
}

export default function SunburstChart({ items, activeIndex, onActive }: Props) {
  const uid = useId().replace(/:/g, '');
  const [hovered, setHovered] = useState<number | null>(null);
  const active = activeIndex ?? hovered;
  const cx = 220;
  const cy = 220;
  const innerR = 52;
  const outerR = 175;
  let angle = 0;
  const segments = items.map((item, i) => {
    const sweep = (item.percent / 100) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { item, i, start, end };
  });

  return (
    <div className="tc-sunburst">
      <svg viewBox="0 0 440 440" className="tc-sunburst-svg" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-g`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9b6fd4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#391F6B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={outerR + 8} fill={`url(#${uid}-g)`} />
        {segments.map(({ item, i, start, end }) => {
          const isOn = active === i;
          const mid = midAngle(start, end);
          const labelR = outerR + 28;
          const lp = polar(cx, cy, labelR, mid);
          const edge = polar(cx, cy, outerR + 4, mid);
          return (
            <g key={item.name}>
              <path
                d={arcPath(cx, cy, innerR, outerR, start + 0.5, end - 0.5)}
                fill={item.color}
                fillOpacity={isOn ? 1 : 0.82}
                stroke={isOn ? '#c4b5fd' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isOn ? 1.5 : 0.5}
                className="tc-sun-seg"
                onMouseEnter={() => { setHovered(i); onActive(i); }}
                onMouseLeave={() => { setHovered(null); onActive(null); }}
                onClick={() => onActive(activeIndex === i ? null : i)}
              />
              {item.percent >= 4 && (
                <>
                  <line x1={edge.x} y1={edge.y} x2={lp.x} y2={lp.y} stroke="rgba(192,132,252,0.35)" strokeWidth="0.75" />
                  <text
                    x={lp.x + (lp.x > cx ? 6 : -6)}
                    y={lp.y}
                    textAnchor={lp.x > cx ? 'start' : 'end'}
                    dominantBaseline="middle"
                    fill={isOn ? '#fff' : 'rgba(255,255,255,0.55)'}
                    fontSize="9"
                    fontWeight="600"
                  >
                    {item.percent}%
                  </text>
                </>
              )}
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={innerR - 4} fill="#0a0614" stroke="rgba(192,132,252,0.3)" strokeWidth="1" />
      </svg>
      <div className="tc-sunburst-center">
        <Shield className="h-7 w-7 text-[#c4b5fd]" />
        <span className="tc-sunburst-val">1B</span>
        <span className="tc-sunburst-sub">MAXTRON</span>
      </div>
    </div>
  );
}
