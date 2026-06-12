'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, DollarSign, Calendar } from 'lucide-react';

interface AllocationItem {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  textColor: string;
  description: string;
}

interface ProceedItem {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

interface EmissionPhase {
  phase: string;
  months: string;
  amount: number;
  description: string;
  color: string;
}

export default function InteractiveCharts() {
  const [hoveredAlloc, setHoveredAlloc] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'allocation' | 'proceeds' | 'emissions'>('allocation');

  const allocations: AllocationItem[] = useMemo(() => [
    {
      name: 'Ecosystem & Staking Rewards',
      percentage: 30,
      amount: 300000000,
      color: '#5b3af2', // Royal Purple
      textColor: 'text-[#5b3af2]',
      description: 'Distributed over 48 months to support listing, rewards, and staking emissions.'
    },
    {
      name: 'Team & Advisors',
      percentage: 18,
      amount: 180000000,
      color: '#6366f1', // Indigo
      textColor: 'text-[#6366f1]',
      description: 'Subject to a 12-month lockup period followed by 36 months linear vesting.'
    },
    {
      name: 'Treasury & DAO',
      percentage: 15,
      amount: 150000000,
      color: '#818cf8', // Indigo Light
      textColor: 'text-indigo-400',
      description: 'Governance-controlled reserve supporting liquidity, protocols, and developer support.'
    },
    {
      name: 'Private Sale',
      percentage: 10,
      amount: 100000000,
      color: '#a78bfa', // Lavender Purple
      textColor: 'text-purple-400',
      description: 'Institutional capital raise. 6-month cliff followed by 24-month linear release.'
    },
    {
      name: 'Public Sale',
      percentage: 10,
      amount: 100000000,
      color: '#c7d2fe', // Soft Blue-Purple
      textColor: 'text-indigo-300',
      description: 'Community token distribution. 15% unlocked at TGE, followed by 12-month linear release.'
    },
    {
      name: 'Liquidity',
      percentage: 7,
      amount: 70000000,
      color: '#10b981', // Emerald Green
      textColor: 'text-emerald-600',
      description: '50% unlocked at TGE, remaining over 12 months for exchange market-making support.'
    },
    {
      name: 'Seed Sale',
      percentage: 5,
      amount: 50000000,
      color: '#a5b4fc', // Sky Lavender
      textColor: 'text-indigo-500',
      description: 'Initial funding round. 12-month cliff followed by 36-month linear release.'
    },
    {
      name: 'Foundation & Partners',
      percentage: 5,
      amount: 50000000,
      color: '#3b82f6', // Info Blue
      textColor: 'text-blue-500',
      description: 'Strategic allocation reserved for partnership lockups and governance participation.'
    }
  ], []);

  const proceeds: ProceedItem[] = useMemo(() => [
    { name: 'Engineering & Contracts', percentage: 35, amount: 4550000, color: 'bg-primary' },
    { name: 'Legal & Compliance', percentage: 15, amount: 1950000, color: 'bg-[#6366f1]' },
    { name: 'Marketing & BD', percentage: 15, amount: 1950000, color: 'bg-emerald-500' },
    { name: 'Operations', percentage: 15, amount: 1950000, color: 'bg-indigo-400' },
    { name: 'Liquidity Support', percentage: 10, amount: 1300000, color: 'bg-purple-300' },
    { name: 'Partnerships', percentage: 5, amount: 650000, color: 'bg-blue-400' },
    { name: 'Reserve Fund', percentage: 5, amount: 650000, color: 'bg-slate-400' }
  ], []);

  const emissionPhases: EmissionPhase[] = useMemo(() => [
    { phase: 'Phase 1', months: 'Month 1–6', amount: 45000000, description: 'Early Participation & Launch Growth rewards.', color: 'border-primary text-primary bg-primary/5' },
    { phase: 'Phase 2', months: 'Month 7–12', amount: 45000000, description: 'Community Expansion & Adoption incentives.', color: 'border-[#6366f1] text-[#6366f1] bg-indigo-50/50' },
    { phase: 'Phase 3', months: 'Month 13–24', amount: 75000000, description: 'Ecosystem Scaling and onboarding activities.', color: 'border-emerald-500 text-emerald-600 bg-emerald-50/30' },
    { phase: 'Phase 4', months: 'Month 25–36', amount: 75000000, description: 'Platform Maturity stabilization rewards.', color: 'border-purple-400 text-purple-600 bg-purple-50/30' },
    { phase: 'Phase 5', months: 'Month 37–48', amount: 60000000, description: 'Long-Term Sustainability emissions.', color: 'border-blue-400 text-blue-600 bg-blue-50/30' }
  ], []);

  // Compute SVG Donut segments
  const donutSegments = useMemo(() => {
    let accumulatedPercent = 0;
    return donutSegmentsHelper(allocations);

    function donutSegmentsHelper(items: AllocationItem[]) {
      return items.map((alloc) => {
        const startPercent = accumulatedPercent;
        accumulatedPercent += alloc.percentage;
        const endPercent = accumulatedPercent;

        // Angle bounds
        const startAngle = (startPercent / 100) * 360 - 90;
        const endAngle = (endPercent / 100) * 360 - 90;

        const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
          const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
          return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
          };
        };

        const x = 150;
        const y = 150;
        const r = 90;

        const start = polarToCartesian(x, y, r, endAngle);
        const end = polarToCartesian(x, y, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        const pathData = [
          'M', start.x, start.y,
          'A', r, r, 0, largeArcFlag, 0, end.x, end.y
        ].join(' ');

        return {
          pathData,
          ...alloc
        };
      });
    }
  }, [allocations]);

  const activeAlloc = hoveredAlloc !== null ? allocations[hoveredAlloc] : null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-md relative">
      
      {/* Navigation Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Interactive Allocation & Vesting Charts
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Visual model detailing total distribution, TGE unlocks, and emission targets.
          </p>
        </div>
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTab('allocation')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
              activeTab === 'allocation'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Token Allocation
          </button>
          <button
            onClick={() => setActiveTab('proceeds')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
              activeTab === 'proceeds'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Use of Proceeds
          </button>
          <button
            onClick={() => setActiveTab('emissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
              activeTab === 'emissions'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Emission Schedule
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="min-h-[350px]">
        {activeTab === 'allocation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Donut Chart */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              <div className="w-[300px] h-[300px] relative">
                <svg width="100%" height="100%" viewBox="0 0 300 300">
                  {donutSegments.map((segment, idx) => (
                    <path
                      key={segment.name}
                      d={segment.pathData}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={hoveredAlloc === idx ? 24 : 16}
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        filter: hoveredAlloc === idx ? `drop-shadow(0 4px 8px ${segment.color}40)` : 'none'
                      }}
                      onMouseEnter={() => setHoveredAlloc(idx)}
                      onMouseLeave={() => setHoveredAlloc(null)}
                    />
                  ))}
                </svg>

                {/* Donut Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {activeAlloc ? activeAlloc.name : 'Total Supply'}
                  </span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-1">
                    {activeAlloc ? `${activeAlloc.percentage}%` : '1B'}
                  </span>
                  <span className="text-xs text-primary font-bold tracking-wide uppercase mt-0.5">
                    {activeAlloc ? `${(activeAlloc.amount / 1000000).toFixed(0)}M MAXTRON` : 'MAXTRON'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 text-center font-medium">
                Hover over categories to inspect specific allocation percentages and lockups.
              </p>
            </div>

            {/* Legends List */}
            <div className="lg:col-span-6 space-y-2.5">
              {allocations.map((alloc, idx) => (
                <div
                  key={alloc.name}
                  onMouseEnter={() => setHoveredAlloc(idx)}
                  onMouseLeave={() => setHoveredAlloc(null)}
                  className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col ${
                    hoveredAlloc === idx
                      ? 'bg-slate-50 border-primary/20 shadow-sm'
                      : 'bg-white border-slate-100 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: alloc.color }} />
                      <span className="text-xs font-bold text-slate-700">{alloc.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{alloc.percentage}%</span>
                  </div>
                  {hoveredAlloc === idx && (
                    <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 animate-fadeIn font-medium">
                      {alloc.description}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {activeTab === 'proceeds' && (
          <div className="space-y-8 max-w-4xl mx-auto py-4">
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total Raised Capital Target</div>
                  <div className="text-xl font-extrabold text-slate-800 mt-0.5">$13,000,000 USD</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-semibold">Rounds structure</span>
                <div className="text-xs font-bold text-slate-700 mt-1">3 Funding Rounds</div>
              </div>
            </div>

            {/* Stacked Allocation Bar */}
            <div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">Capital Proceeds Stack</div>
              <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
                {proceeds.map((item) => (
                  <div
                    key={item.name}
                    className={`h-full transition-all duration-300 hover:opacity-85 cursor-pointer relative group ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    {/* Hover tooltips */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-20 whitespace-nowrap text-center text-xs">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[10px] text-purple-200 mt-0.5">{item.percentage}% — ${item.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {proceeds.map((item) => (
                <div key={item.name} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3.5 h-3.5 rounded ${item.color}`} />
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-extrabold text-slate-800">${item.amount.toLocaleString()}</span>
                    <span className="text-xs font-bold text-primary">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'emissions' && (
          <div className="space-y-6 max-w-4xl mx-auto py-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-200 p-4 rounded-xl gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Ecosystem Emission Pool</div>
                  <div className="text-xl font-extrabold text-slate-800 mt-0.5">300,000,000 MAXTRON</div>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Emission duration</span>
                <div className="text-xs font-bold text-slate-700 mt-1">48 Months phased release</div>
              </div>
            </div>

            {/* Vertical timeline */}
            <div className="space-y-4 relative before:absolute before:top-4 before:bottom-4 before:left-6 before:w-0.5 before:bg-slate-200">
              {emissionPhases.map((phase) => (
                <div key={phase.phase} className="flex gap-6 relative">
                  
                  {/* Phase bubble */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shrink-0 z-10 shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-slate-400">{phase.phase.split(' ')[0]}</span>
                    <span className="text-xs font-extrabold text-slate-700">{phase.phase.split(' ')[1]}</span>
                  </div>

                  {/* Details Box */}
                  <div className="flex-1 bg-white border border-slate-200/80 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-primary">{phase.months}</div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">{phase.description}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Emission Volume</div>
                      <div className="text-sm font-extrabold text-slate-800">{phase.amount.toLocaleString()} MAXTRON</div>
                      <div className="text-[10px] text-slate-400 font-medium">{(phase.amount / 300000000 * 100).toFixed(0)}% of Emitted Pool</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
