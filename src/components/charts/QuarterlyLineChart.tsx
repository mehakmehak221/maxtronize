'use client';

import { useEffect, useRef, useState } from 'react';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const values = [28, 42, 38, 55];

export default function QuarterlyLineChart() {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);
  const w = 280;
  const h = 100;
  const pad = { t: 8, r: 8, b: 22, l: 8 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const max = 60;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pts = values.map((v, i) => ({
    x: pad.l + (i / (values.length - 1)) * cw,
    y: pad.t + ch - (v / max) * ch,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const len = 400;

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
      {quarters.map((q, i) => (
        <text key={q} x={pad.l + (i / 3) * cw} y={h - 4} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8">{q}</text>
      ))}
      <path
        d={line}
        fill="none"
        stroke="#c084fc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={vis ? 0 : len}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={vis ? 3 : 0} fill="#9b6fd4" style={{ transition: 'r 0.3s' }} />
      ))}
    </svg>
  );
}
