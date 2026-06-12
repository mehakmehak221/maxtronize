'use client';

import { useState } from 'react';
import { Building2, Coins, Shield, Users, Wallet } from 'lucide-react';
import PremiumPieChart, { type PieItem } from '../PremiumPieChart';

const icons = [Shield, Users, Wallet, Coins, Building2];

type Props = {
  items: PieItem[];
  centerValue?: string;
  centerSub?: string;
};

export default function DonutSatellite({ items, centerValue = '1B', centerSub = 'MAXTRON' }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const satellites = items.slice(0, 5);
  let angle = 0;
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const orbitR = 198;

  const nodes = satellites.map((item, i) => {
    const sweep = (item.percent / 100) * 360;
    const mid = angle + sweep / 2;
    angle += sweep;
    const rad = ((mid - 90) * Math.PI) / 180;
    return {
      item,
      i,
      x: cx + Math.cos(rad) * orbitR,
      y: cy + Math.sin(rad) * orbitR,
      ix: cx + Math.cos(rad) * 168,
      iy: cy + Math.sin(rad) * 168,
      Icon: icons[i % icons.length],
    };
  });

  return (
    <div className="te-donut-satellite">
      <svg className="te-satellite-lines" viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {nodes.map(({ i, x, y, ix, iy }) => (
          <line key={i} x1={ix} y1={iy} x2={x} y2={y} stroke="rgba(192,132,252,0.35)" strokeWidth="0.75" />
        ))}
      </svg>
      <PremiumPieChart
        items={items}
        activeIndex={active}
        onActive={setActive}
        size={size}
        centerValue={centerValue}
        centerSub={centerSub}
        className="te-donut-main"
      />
      {nodes.map(({ item, i, x, y, Icon }) => (
        <div
          key={item.name}
          className={`te-sat-icon te-sat-float${active === i ? ' te-sat-icon-on' : ''}`}
          style={{ left: `${(x / size) * 100}%`, top: `${(y / size) * 100}%` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
        </div>
      ))}
    </div>
  );
}
