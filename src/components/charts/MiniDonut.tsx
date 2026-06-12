'use client';

import { useEffect, useRef, useState } from 'react';

type Slice = { percent: number; color: string };

type Props = {
  slices: Slice[];
  size?: number;
};

export default function MiniDonut({ slices, size = 88 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [vis, setVis] = useState(false);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.28;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let cursor = 0;
  const segs = slices.map((s, i) => {
    const sweep = (s.percent / 100) * 360 - 1;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end + 1;
    const large = end - start > 180 ? 1 : 0;
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const px = (r: number, d: number) => ({ x: cx + r * Math.cos(toRad(d)), y: cy + r * Math.sin(toRad(d)) });
    const oS = px(outerR, end);
    const oE = px(outerR, start);
    const iS = px(innerR, start);
    const iE = px(innerR, end);
    const d = `M ${oS.x} ${oS.y} A ${outerR} ${outerR} 0 ${large} 0 ${oE.x} ${oE.y} L ${iS.x} ${iS.y} A ${innerR} ${innerR} 0 ${large} 1 ${iE.x} ${iE.y} Z`;
    return { d, color: s.color, i };
  });

  return (
    <svg ref={ref} viewBox={`0 0 ${size} ${size}`} className="te-mini-donut" aria-hidden>
      <g style={{ transform: vis ? 'scale(1)' : 'scale(0.6)', transformOrigin: 'center', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
        {segs.map((s) => (
          <path key={s.i} d={s.d} fill={s.color} opacity={0.9} />
        ))}
        <circle cx={cx} cy={cy} r={innerR - 1} fill="rgba(8,5,16,0.95)" />
      </g>
    </svg>
  );
}
