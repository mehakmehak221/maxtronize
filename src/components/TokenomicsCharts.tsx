'use client';

import { useEffect, useRef, useState } from 'react';
import { Activity, Flame, LockKeyhole, TrendingUp, Zap } from 'lucide-react';
import PremiumPieChart, { type PieItem } from './PremiumPieChart';
import { CHART_COLORS, PIE_COLORS } from '@/lib/theme';

const monthlyActivity = [
  { label: 'Q1', bond: 14, spend: 9, burn: 5 },
  { label: 'Q2', bond: 22, spend: 15, burn: 8 },
  { label: 'Q3', bond: 31, spend: 24, burn: 12 },
  { label: 'Q4', bond: 42, spend: 33, burn: 17 },
  { label: 'Q5', bond: 55, spend: 44, burn: 23 },
  { label: 'Q6', bond: 68, spend: 56, burn: 30 },
];

const utilityMix: PieItem[] = [
  { name: 'Compliance Bonds', percent: 38, color: PIE_COLORS[0] },
  { name: 'Due Diligence', percent: 24, color: PIE_COLORS[2] },
  { name: 'Listing Rewards', percent: 18, color: PIE_COLORS[4] },
  { name: 'Governance', percent: 12, color: PIE_COLORS[6] },
  { name: 'Other Utility', percent: 8, color: PIE_COLORS[8] },
];

const vesting = [
  { q: 'Q1', ecosystem: 22, team: 5, liquidity: 35, treasury: 20, other: 18 },
  { q: 'Q2', ecosystem: 38, team: 12, liquidity: 55, treasury: 35, other: 28 },
  { q: 'Q3', ecosystem: 52, team: 22, liquidity: 72, treasury: 48, other: 40 },
  { q: 'Q4', ecosystem: 68, team: 35, liquidity: 88, treasury: 62, other: 55 },
  { q: 'Q5', ecosystem: 80, team: 48, liquidity: 96, treasury: 78, other: 70 },
  { q: 'Q6', ecosystem: 92, team: 62, liquidity: 100, treasury: 90, other: 85 },
];

const demandSteps = [
  { label: 'Acquire MAXTRON', sub: 'Sponsors & investors', pct: 100, color: CHART_COLORS.bond },
  { label: 'Lock as Bond', sub: 'Property listings', pct: 72, color: CHART_COLORS.spend },
  { label: 'Spend on Access', sub: 'Reports & diligence', pct: 54, color: CHART_COLORS.ecosystem },
  { label: 'Burn on Use', sub: 'Permanent removal', pct: 28, color: CHART_COLORS.burn },
];

function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target * 10) / 10);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

function Panel({ title, desc, badge, children, className = '' }: {
  title: string;
  desc?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`tok-chart-panel h-full ${className}`}>
      <div className="chart-panel-head">
        <div>
          <h3 className="font-display text-base font-black text-[#391F6B] sm:text-lg">{title}</h3>
          {desc && <p className="mt-0.5 text-xs text-[#9b8ab8]">{desc}</p>}
        </div>
        {badge}
      </div>
      <div className="chart-panel-body">{children}</div>
    </div>
  );
}

function Tag({ children, up }: { children: React.ReactNode; up?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f3ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#391F6B]">
      {up && <TrendingUp className="h-3 w-3" />}
      {children}
    </span>
  );
}

function KpiTile({ label, value, suffix, prefix, icon: Icon, trend, vis, delay, raw }: {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  icon: typeof LockKeyhole;
  trend: 'up' | null;
  vis: boolean;
  delay: number;
  raw?: boolean;
}) {
  const count = useCountUp(value, vis, 1000 + delay);
  const display = raw ? `${count}${suffix}` : `${prefix}${count}${suffix}`;
  return (
    <div
      className="ui-card ui-card-lift ui-stat flex items-center gap-4 group min-w-0"
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(16px)', transition: `all .6s ${delay}ms cubic-bezier(.22,1,.36,1)` }}
    >
      <div className="icon-box icon-box-pulse h-11 w-11 transition group-hover:scale-110 group-hover:text-white">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9b8ab8]">{label}</div>
        <div className="font-display text-xl font-black tabular-nums text-[#391F6B] sm:text-2xl">{vis ? display : '—'}</div>
      </div>
      {trend === 'up' && <TrendingUp className="h-4 w-4 shrink-0 text-[#391F6B] opacity-60" />}
    </div>
  );
}

function KpiStrip() {
  const { ref, vis } = useVisible();
  const items = [
    { label: 'Bond Demand', value: 68, suffix: '%', prefix: '+', icon: LockKeyhole, trend: 'up' as const },
    { label: 'Access Spend', value: 56, suffix: '%', prefix: '+', icon: Activity, trend: 'up' as const },
    { label: 'Burn Rate', value: 30, suffix: 'M+', prefix: '', icon: Flame, trend: 'up' as const, raw: true },
    { label: 'Fixed Supply', value: 1, suffix: 'B', prefix: '', icon: Zap, trend: null, raw: true },
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((k, i) => (
        <KpiTile key={k.label} {...k} vis={vis} delay={i * 80} />
      ))}
    </div>
  );
}

function ActivityChart() {
  const { ref, vis } = useVisible();
  const max = 72;
  return (
    <Panel title="Platform Activity" desc="Bond locks · access spend · burns" badge={<Tag up>Growing</Tag>}>
      <div ref={ref}>
        <div className="mb-4 flex flex-wrap gap-4">
          {[{ l: 'Bond', c: CHART_COLORS.bond }, { l: 'Spend', c: CHART_COLORS.spend }, { l: 'Burn', c: CHART_COLORS.burn }].map((x) => (
            <span key={x.l} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6b7280]">
              <span className="h-2 w-2 rounded-full" style={{ background: x.c }} />{x.l}
            </span>
          ))}
        </div>
        <div className="flex h-52 items-end justify-between gap-1.5 sm:gap-2">
          {monthlyActivity.map((d, i) => (
            <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end justify-center gap-0.5 sm:gap-1">
                {[{ v: d.bond, c: CHART_COLORS.bond }, { v: d.spend, c: CHART_COLORS.spend }, { v: d.burn, c: CHART_COLORS.burn }].map((b, bi) => (
                  <div
                    key={bi}
                    className="bar-animated w-full max-w-[22px] rounded-t-lg group-hover:brightness-110"
                    style={{
                      height: vis ? `${(b.v / max) * 100}%` : '0%',
                      background: `linear-gradient(180deg, ${b.c}, ${b.c}88)`,
                      transition: `height .8s ${i * 80 + bi * 50}ms cubic-bezier(.22,1,.36,1)`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#9b8ab8]">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function UtilityPieChart() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <Panel title="Utility Mix" desc="Token consumption by function" badge={<Tag>Live</Tag>}>
      <div className="flex flex-col items-center py-2">
        <PremiumPieChart
          items={utilityMix}
          activeIndex={active}
          onActive={setActive}
          size={300}
          innerRadius={0.45}
          centerLabel="Utility"
          centerValue="100%"
          centerSub="MIX"
        />
        <div className="pie-legend mt-2">
          {utilityMix.map((u, i) => (
            <button
              key={u.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`pie-legend-item ${active === i ? 'pie-legend-item-active' : ''}`}
            >
              <span className="pie-legend-dot" style={{ background: u.color }} />
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function VestingChart() {
  const { ref, vis } = useVisible();
  const layers = [
    { key: 'ecosystem' as const, label: 'Ecosystem', color: CHART_COLORS.ecosystem },
    { key: 'team' as const, label: 'Team', color: CHART_COLORS.team },
    { key: 'liquidity' as const, label: 'Liquidity', color: CHART_COLORS.liquidity },
    { key: 'treasury' as const, label: 'Treasury', color: CHART_COLORS.treasury },
    { key: 'other' as const, label: 'Other', color: CHART_COLORS.other },
  ];
  const maxTotal = Math.max(...vesting.map((row) => layers.reduce((s, l) => s + row[l.key], 0)));

  return (
    <Panel title="Vesting & Unlock Timeline" desc="Cumulative unlock progress by allocation category" badge={<Tag><LockKeyhole className="h-3 w-3" /> Vesting</Tag>}>
      <div ref={ref}>
        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          {layers.map((l) => (
            <span key={l.key} className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
              <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {vesting.map((row, qi) => {
            const total = layers.reduce((s, l) => s + row[l.key], 0);
            const pct = Math.round((total / maxTotal) * 100);
            return (
              <div key={row.q} className="vesting-row group flex items-center gap-3 sm:gap-4">
                <span className="w-7 shrink-0 text-xs font-bold text-[#9b8ab8]">{row.q}</span>
                <div className="vesting-track relative h-9 flex-1 overflow-hidden rounded-lg bg-[#f5f3ff] sm:h-10">
                  <div
                    className="flex h-full overflow-hidden rounded-lg"
                    style={{
                      width: vis ? `${pct}%` : '0%',
                      transition: `width .9s ${qi * 80}ms cubic-bezier(.22,1,.36,1)`,
                    }}
                  >
                    {layers.map((l, si) => (
                      <div
                        key={l.key}
                        className="h-full transition-opacity duration-300"
                        style={{
                          flex: row[l.key],
                          background: l.color,
                          opacity: vis ? 1 : 0,
                          transitionDelay: `${qi * 80 + si * 30}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className="w-10 shrink-0 text-right font-display text-sm font-black tabular-nums text-[#391F6B]"
                  style={{ opacity: vis ? 1 : 0, transition: `opacity .4s ${qi * 80 + 400}ms ease` }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function DemandChart() {
  const { ref, vis } = useVisible();
  return (
    <Panel title="Demand Flow" desc="From acquisition to usage-based supply reduction">
      <div ref={ref} className="demand-pipeline">
        {demandSteps.map((s, i) => (
          <div
            key={s.label}
            className="demand-pipeline-card blockchain-card"
            style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(10px)', transition: `all .55s ${i * 100}ms cubic-bezier(.22,1,.36,1)` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white card-gradient"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-black leading-tight text-[#391F6B]">{s.label}</div>
                <div className="mt-0.5 text-[11px] text-[#9b8ab8]">{s.sub}</div>
              </div>
            </div>
            <div className="mt-4 font-display text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.pct}%</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: vis ? `${s.pct}%` : '0%',
                  background: s.color,
                  transition: `width .9s ${i * 100 + 200}ms cubic-bezier(.22,1,.36,1)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SupplyGrowthChart() {
  const { ref, vis } = useVisible();
  const points = [
    { q: 'Launch', supply: 100, burn: 0 },
    { q: 'Q1', supply: 100, burn: 5 },
    { q: 'Q2', supply: 100, burn: 13 },
    { q: 'Q3', supply: 100, burn: 25 },
    { q: 'Q4', supply: 100, burn: 42 },
    { q: 'Q5', supply: 100, burn: 65 },
    { q: 'Q6', supply: 100, burn: 88 },
  ];
  const max = 100;
  const w = 100;
  const h = 48;
  const pad = 4;
  const step = (w - pad * 2) / (points.length - 1);
  const supplyPath = points.map((p, i) => {
    const x = pad + i * step;
    const y = h - pad - (p.supply / max) * (h - pad * 2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const burnPath = points.map((p, i) => {
    const x = pad + i * step;
    const y = h - pad - (p.burn / max) * (h - pad * 2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <Panel title="Supply Dynamics" desc="Fixed 1B cap · usage-based burn trajectory" badge={<Tag up>Deflationary</Tag>}>
      <div ref={ref}>
        <div className="mb-4 flex gap-6">
          <span className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
            <span className="h-0.5 w-4 bg-[#391F6B]" /> Total Supply (fixed)
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
            <span className="h-0.5 w-4 bg-[#57339D]" /> Cumulative Burn
          </span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="supply-growth-svg w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="burnArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#57339D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#57339D" stopOpacity="0" />
            </linearGradient>
          </defs>
          {vis && (
            <>
              <path d={`${burnPath} L ${pad + (points.length - 1) * step} ${h - pad} L ${pad} ${h - pad} Z`} fill="url(#burnArea)" style={{ opacity: vis ? 1 : 0, transition: 'opacity 1s ease' }} />
              <path d={supplyPath} fill="none" stroke="#391F6B" strokeWidth="1.2" strokeDasharray={vis ? 'none' : '200'} strokeDashoffset={vis ? 0 : 200} style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
              <path d={burnPath} fill="none" stroke="#57339D" strokeWidth="1.2" style={{ opacity: vis ? 1 : 0, transition: 'opacity 1s .3s ease' }} />
            </>
          )}
        </svg>
        <div className="mt-2 flex justify-between">
          {points.map((p) => (
            <span key={p.q} className="text-[9px] font-bold text-[#9b8ab8]">{p.q}</span>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-5">
      <KpiStrip />
      <SupplyGrowthChart />
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ActivityChart />
        </div>
        <div className="lg:col-span-2">
          <UtilityPieChart />
        </div>
      </div>
      <VestingChart />
      <DemandChart />
    </div>
  );
}
