'use client';

import { useEffect, useRef, useState } from 'react';

type Point = { label: string; value: number };

type Props = {
  data: Point[];
  width?: number;
  height?: number;
  activeIndex?: number | null;
};

export default function AnimatedAreaChart({ data, width = 900, height = 112, activeIndex = null }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pad = { t: 12, r: 24, b: 22, l: 24 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.value));
  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * cw,
    y: pad.t + ch - (d.value / max) * ch,
    label: d.label,
    index: i,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1].x} ${pad.t + ch} L ${pts[0].x} ${pad.t + ch} Z`;
  const pathLen = 1200;
  const gradId = 'te-area-grad-v2';

  return (
    <div className="te-area-wrap te-value-chart-wrap">
      <div className="te-value-chart-glow" aria-hidden />
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className="te-area-svg" aria-hidden style={{ position: 'relative', zIndex: 2 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#57339D" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#391F6B" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={pad.l}
            y1={pad.t + ch * (1 - pct)}
            x2={width - pad.r}
            y2={pad.t + ch * (1 - pct)}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        <path d={area} fill={`url(#${gradId})`} opacity={vis ? 1 : 0} style={{ transition: 'opacity 0.9s' }} />
        <path
          d={line}
          fill="none"
          stroke="#c084fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={vis ? 0 : pathLen}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }}
        />
        {pts.map((p) => {
          const active = activeIndex === p.index;
          return (
            <g key={p.label}>
              {active && (
                <circle cx={p.x} cy={p.y} r={14} fill="rgba(192,132,252,0.15)">
                  <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0.7;0.35" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={vis ? (active ? 5 : 4) : 0}
                fill={active ? '#e9d5ff' : '#c084fc'}
                style={{ transition: 'r 0.35s, fill 0.35s' }}
              />
              <text
                x={p.x}
                y={height - 4}
                textAnchor={p.index === 0 ? 'start' : p.index === data.length - 1 ? 'end' : 'middle'}
                fill={active ? '#e9d5ff' : 'rgba(255,255,255,0.55)'}
                fontSize="10"
                fontWeight={active ? '700' : '500'}
                style={{ transition: 'fill 0.35s' }}
              >
                {String(p.index + 1).padStart(2, '0')}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
