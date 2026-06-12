'use client';

import type { CSSProperties } from 'react';
import { Shield } from 'lucide-react';

type Props = {
  labels: string[];
  activeIndex?: number | null;
};

export default function EcosystemHub({ labels, activeIndex = null }: Props) {
  const n = labels.length;
  const radius = 108;

  return (
    <div className="te-eco-hub" aria-hidden>
      <div className="te-eco-hub-glow" />
      <svg className="te-eco-lines" viewBox="0 0 300 300">
        {labels.map((_, i) => {
          const angle = (i / n) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 150 + Math.cos(rad) * radius;
          const y = 150 + Math.sin(rad) * radius;
          const active = activeIndex === i;
          return (
            <line
              key={i}
              x1="150"
              y1="150"
              x2={x}
              y2={y}
              stroke={active ? 'rgba(192,132,252,0.65)' : 'rgba(192,132,252,0.18)'}
              strokeWidth={active ? 2 : 1}
              style={{ transition: 'stroke 0.35s, stroke-width 0.35s' }}
            />
          );
        })}
      </svg>
      <div className="te-eco-ring" />
      <div className="te-eco-center">
        <Shield className="h-8 w-8 text-white" />
      </div>
      {labels.map((label, i) => {
        const angle = (i / n) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 40;
        const y = 50 + Math.sin(rad) * 40;
        const active = activeIndex === i;
        return (
          <div
            key={label}
            className={`te-eco-node${active ? ' te-eco-node-on' : ''}`}
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` } as CSSProperties}
          >
            <span className="te-eco-dot" />
            {active && <span className="te-eco-label">{label}</span>}
          </div>
        );
      })}
    </div>
  );
}
