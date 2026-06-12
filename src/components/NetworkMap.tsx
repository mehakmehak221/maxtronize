'use client';

import { useEffect, useRef, useState } from 'react';

const nodes = [
  { id: 'maxtron', label: 'MAXTRON', x: 50, y: 48, r: 28, core: true },
  { id: 'property', label: 'Property Tokens', x: 22, y: 30, r: 18 },
  { id: 'sponsors', label: 'Sponsors', x: 78, y: 28, r: 16 },
  { id: 'investors', label: 'Investors', x: 82, y: 58, r: 16 },
  { id: 'compliance', label: 'Compliance', x: 18, y: 62, r: 16 },
  { id: 'governance', label: 'Governance', x: 50, y: 78, r: 16 },
  { id: 'treasury', label: 'Treasury', x: 72, y: 72, r: 14 },
];

const links = [
  ['maxtron', 'property'], ['maxtron', 'sponsors'], ['maxtron', 'investors'],
  ['maxtron', 'compliance'], ['maxtron', 'governance'], ['maxtron', 'treasury'],
  ['property', 'compliance'], ['sponsors', 'compliance'], ['investors', 'governance'],
];

export default function NetworkMap() {
  const ref = useRef<HTMLDivElement>(null);
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

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div ref={ref} className="network-map">
      <svg viewBox="0 0 100 100" className="network-map-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(87,51,157,0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#391F6B" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#57339D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#391F6B" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="50" rx="42" ry="38" fill="url(#mapGlow)" />
        {links.map(([a, b], i) => {
          const na = getNode(a);
          const nb = getNode(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="url(#linkGrad)"
              strokeWidth={vis ? 0.35 : 0}
              style={{ transition: `stroke-width 0.8s ${i * 80}ms ease` }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <g key={n.id} style={{ opacity: vis ? 1 : 0, transition: `opacity 0.6s ${i * 100}ms ease` }}>
            <circle
              cx={n.x} cy={n.y} r={n.r / 10}
              fill={n.core ? 'url(#mapGlow)' : 'rgba(237,233,254,0.9)'}
              stroke={n.core ? '#57339D' : '#391F6B'}
              strokeWidth={n.core ? 0.4 : 0.25}
              className={n.core ? 'network-node-core' : 'network-node'}
            />
            <text
              x={n.x}
              y={n.y + n.r / 10 + 3.5}
              textAnchor="middle"
              className="network-map-label"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
