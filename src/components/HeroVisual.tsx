'use client';

import { useEffect, useRef, useState } from 'react';
import { Coins, Flame, Globe, LockKeyhole, Shield } from 'lucide-react';
import PremiumPieChart from './PremiumPieChart';
import { PIE_COLORS } from '@/lib/theme';

const allocation = [
  { name: 'Ecosystem', percent: 30, color: PIE_COLORS[0] },
  { name: 'Team', percent: 18, color: PIE_COLORS[1] },
  { name: 'Liquidity', percent: 12, color: PIE_COLORS[2] },
  { name: 'Treasury', percent: 13, color: PIE_COLORS[3] },
  { name: 'Compliance', percent: 5, color: PIE_COLORS[4] },
  { name: 'Seed', percent: 4, color: PIE_COLORS[5] },
  { name: 'Private', percent: 8, color: PIE_COLORS[6] },
  { name: 'Public', percent: 7, color: PIE_COLORS[7] },
  { name: 'Advisors', percent: 3, color: PIE_COLORS[8] },
];

const facts = [
  { icon: Shield, title: 'Utility & Compliance', desc: 'Token type' },
  { icon: Globe, title: 'EVM Compatible', desc: 'Blockchain network' },
  { icon: Flame, title: 'Usage-Based Burn', desc: 'Burn mechanism' },
  { icon: LockKeyhole, title: 'No Revenue Share', desc: 'Rental income reserved for Property Tokens' },
];

function useVisible(eager = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(eager);
  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);
  return { ref, vis };
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

export default function HeroVisual() {
  const { ref, vis } = useVisible();
  const count = useCountUp(1000000000, vis);
  const [activePie, setActivePie] = useState<number | null>(null);

  return (
    <div ref={ref} className="relative w-full">
      <div className="token-snapshot relative overflow-hidden rounded-[24px] border border-[#ede9fe] bg-white shadow-[0_24px_80px_rgba(57,31,107,0.18)]">
        <div className="relative border-b border-[#ede9fe] bg-gradient-to-br from-[#f7f4fc] via-white to-[#ede9fe] px-5 py-6 sm:px-6 sm:py-7">
          <div className="mb-4 flex items-center gap-2">
            <div className="icon-box-solid h-9 w-9 animate-glow-pulse rounded-xl">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#391F6B]">MAXTRON — The Shield Token</div>
              <div className="text-xs font-semibold text-[#9b8ab8]">Token overview</div>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-[#9b8ab8]">Total Supply</div>
          <div className="font-display mt-1 text-[clamp(1.5rem,4.5vw,2rem)] font-black leading-none text-[#391F6B] tabular-nums">
            {vis ? count.toLocaleString('en-US') : '0'}
          </div>
          <div className="mt-1 text-sm font-bold text-[#57339D]">MAXTRON</div>
          <div className="mt-2 inline-flex rounded-full bg-[#f5f3ff] px-3 py-1 text-[10px] font-bold text-[#391F6B]">
            Fixed cap · No additional tokens may be minted
          </div>
        </div>

        <div className="relative border-b border-[#ede9fe] px-4 py-6 sm:px-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9b8ab8]">Allocation</span>
            <span className="text-[10px] font-bold text-[#391F6B]">9 pools</span>
          </div>
          <PremiumPieChart
            items={allocation}
            activeIndex={activePie}
            onActive={setActivePie}
            size={260}
            innerRadius={0.44}
            animated={vis}
          />
        </div>

        <div className="relative grid grid-cols-2 gap-px bg-[#ede9fe]">
          {facts.map((f, i) => (
            <div
              key={f.title}
              className="flex gap-3 bg-white p-4 transition hover:bg-[#f5f3ff] sm:p-5"
              style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(8px)', transition: `all .5s ${400 + i * 80}ms cubic-bezier(.22,1,.36,1)` }}
            >
              <div className="icon-box h-10 w-10 shrink-0 rounded-xl">
                <f.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#391F6B] sm:text-sm">{f.title}</div>
                <div className="mt-0.5 text-[10px] leading-snug text-[#6b5b8a] sm:text-[11px]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
