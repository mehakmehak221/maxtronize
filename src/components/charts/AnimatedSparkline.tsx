'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  className?: string;
};

export default function AnimatedSparkline({
  points,
  width = 200,
  height = 56,
  color = '#c084fc',
  fill = true,
  className = '',
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const pad = 4;
  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (p - min) / range) * (height - pad * 2);
    return { x, y };
  });
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const area = `${line} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;
  const len = coords.reduce((s, c, i) => {
    if (i === 0) return 0;
    const prev = coords[i - 1];
    return s + Math.hypot(c.x - prev.x, c.y - prev.y);
  }, 0);

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className={`te-sparkline ${className}`} aria-hidden>
      <defs>
        <linearGradient id="te-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <path d={area} fill="url(#te-spark-fill)" opacity={vis ? 1 : 0} style={{ transition: 'opacity 0.8s' }} />
      )}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={vis ? 0 : len}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
}
