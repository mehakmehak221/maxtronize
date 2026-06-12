'use client';

import { useEffect, useRef, useState } from 'react';

type Item = { label?: string; name?: string; percent: number; color: string };

type Props = {
  items: Item[];
  compact?: boolean;
};

export default function AllocationBarChart({ items, compact }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`te-bar-chart${compact ? ' te-bar-chart-compact' : ''}`}>
      {items.map((item, i) => {
        const label = item.label ?? item.name ?? '';
        return (
        <div key={label} className="te-bar-row">
          <div className="te-bar-meta">
            <span className="te-bar-label">{label}</span>
            <span className="te-bar-pct" style={{ color: item.color }}>{item.percent}%</span>
          </div>
          <div className="te-bar-track">
            <div
              className="te-bar-fill"
              style={{
                width: vis ? `${item.percent}%` : '0%',
                background: `linear-gradient(90deg, ${item.color}, ${item.color}99)`,
                transitionDelay: `${i * 50}ms`,
              }}
            />
          </div>
        </div>
      );})}
    </div>
  );
}
