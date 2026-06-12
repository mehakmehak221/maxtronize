'use client';

import { useEffect, useRef, useState } from 'react';
import { Coins, Flame, Globe, Shield, Ban, Building2 } from 'lucide-react';
import ShieldScene from './ShieldScene';
import Reveal from './Reveal';
import SectionShell from './SectionShell';
import SectionTitle from './SectionTitle';

const metrics = [
  { label: 'Total Supply', value: '1,000,000,000', sub: 'MAXTRON', icon: Coins, highlight: true },
  { label: 'Circulating', value: 'TGE Launch', sub: 'At network launch', icon: Globe },
  { label: 'Token Type', value: 'Utility & Compliance', sub: 'Shield Token', icon: Shield },
  { label: 'Inflation', value: 'None', sub: 'Fixed cap forever', icon: Ban },
  { label: 'Deflation', value: 'Usage-Based Burn', sub: 'On platform use', icon: Flame },
  { label: 'Rental Income', value: 'Property Tokens', sub: 'Not MAXTRON holders', icon: Building2 },
];

function useCountUp(active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const target = 1000000000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active]);
  return val;
}

export default function CoreSupplyPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const count = useCountUp(vis);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <SectionShell id="supply" theme="void" stars>
      <div ref={ref}>
        <SectionTitle
          kicker="Core Supply Data"
          title={<>Fixed supply. <span className="italic text-[#c084fc]">Utility-driven</span> economics.</>}
          light
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <div className="ui-card-dark overflow-hidden p-1">
              <div className="relative h-[clamp(280px,40vw,420px)]">
                <div className="lido-visual-glow" />
                <div className="lido-visual-scene">
                  <ShieldScene />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={60} variant="right">
              <div className="ui-card-dark ui-stat">
                <p className="ui-stat-label ui-stat-label-light">Total / Max Supply</p>
                <p className="ui-stat-value ui-stat-value-light mt-2 tabular-nums">
                  {vis ? count.toLocaleString('en-US') : '0'}
                </p>
                <p className="mt-1 text-lg font-bold text-[#c084fc]">MAXTRON</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                  No additional tokens may be minted. Supply reduction occurs only through genuine platform usage — not financial engineering.
                </p>
              </div>
            </Reveal>

            <div className="ui-bento ui-bento-2">
              {metrics.slice(1).map((m, i) => (
                <Reveal key={m.label} delay={100 + i * 50} variant="scale" className="h-full">
                  <div className="ui-card-dark ui-card-lift ui-stat h-full">
                    <div className="ui-principle-icon mb-3">
                      <m.icon className="h-4 w-4" />
                    </div>
                    <p className="ui-stat-label ui-stat-label-light">{m.label}</p>
                    <p className="font-display mt-1 text-lg font-bold text-white">{m.value}</p>
                    <p className="mt-0.5 text-[11px] text-[#c084fc]/80">{m.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
