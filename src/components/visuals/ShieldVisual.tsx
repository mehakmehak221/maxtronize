'use client';

import type { CSSProperties } from 'react';
import { Building2, Lock, Shield } from 'lucide-react';

const orbitIcons = [
  { Icon: Building2, delay: '0s', r: 88 },
  { Icon: Lock, delay: '-2s', r: 105 },
  { Icon: Shield, delay: '-4s', r: 72 },
];

export default function ShieldVisual() {
  return (
    <div className="te-shield-visual" aria-hidden>
      <div className="te-shield-glow" />
      <div className="te-shield-ring te-shield-ring-1" />
      <div className="te-shield-ring te-shield-ring-2" />
      <div className="te-shield-core">
        <Shield className="h-14 w-14 text-white" />
      </div>
      {orbitIcons.map(({ Icon, delay, r }, i) => (
        <div
          key={i}
          className="te-shield-orbit-item"
          style={{ animationDelay: delay, '--orbit-r': `${r}px` } as CSSProperties}
        >
          <div className="te-shield-orbit-icon">
            <Icon className="h-4 w-4 text-[#c084fc]" />
          </div>
        </div>
      ))}
    </div>
  );
}
