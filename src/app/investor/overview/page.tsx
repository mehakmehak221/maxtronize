'use client';

import React from 'react';
import InvestorLayout from '@/components/InvestorLayout';

export default function InvestorOverviewPage() {
  const platformStats = [
    { label: 'Total Raised', val: '$14.82M', trend: '+12.5%', sub: 'vs $13.17M last quarter', up: true },
    { label: 'Assets Tokenized', val: '$42.5M', trend: '+8.2%', sub: '6 assets · 4 jurisdictions', up: true },
    { label: 'Active Investors', val: '2,403', trend: '+15.3%', sub: '89% KYC verified', up: true },
    { label: 'Platform Yield', val: '8.4%', trend: '-0.2%', sub: 'Weighted avg. APY', up: false },
  ];

  const allocation = [
    { label: 'Commercial RE', val: '54%', color: 'bg-primary' },
    { label: 'Private Equity', val: '22%', color: 'bg-purple-500' },
    { label: 'Infrastructure', val: '14%', color: 'bg-purple-400' },
    { label: 'Residential', val: '7%', color: 'bg-purple-300' },
    { label: 'Art & Col.', val: '3%', color: 'bg-purple-200' },
  ];

  const activity = [
    { name: 'Prime Office Tower NYC', id: 'TX-901', type: 'Capital Raise', region: 'US', amount: '+$1.20M', time: 'Today, 10:42 AM', color: 'bg-green-50 text-green-500' },
    { name: 'Solar Farm Alpha TX', id: 'TX-902', type: 'Capital Raise', region: 'US', amount: '+$850K', time: 'Yesterday, 2:30 PM', color: 'bg-amber-50 text-amber-500' },
    { name: 'Harbor Ports PE Fund', id: 'TX-903', type: 'Distribution', region: 'SG', amount: '+$3.40M', time: 'Oct 5, 9:10 AM', color: 'bg-green-50 text-green-500' },
    { name: 'Logistics Hub DE', id: 'TX-904', type: 'Yield Payout', region: 'EU', amount: '+$280K', time: 'Oct 1, 6:00 AM', color: 'bg-green-50 text-green-500' },
    { name: 'Riviera Residences', id: 'TX-906', type: 'Monthly Yield', region: 'EU', amount: '+$2.1K', time: 'Sep 30, 8:00 AM', color: 'bg-green-50 text-green-500' },
  ];

  const upcoming = [
    { date: 'Oct 28', label: 'Q3 Yield Distribution', sub: 'Prime Office Tower', color: 'text-purple-500 bg-purple-50', dot: 'bg-purple-500' },
    { date: 'Nov 2', label: 'KYC Review Deadline', sub: 'Riviera Residences', color: 'text-amber-500 bg-amber-50', dot: 'bg-amber-500' },
    { date: 'Nov 15', label: 'Token Lock-up Expiry', sub: 'Harbor Ports PE Fund', color: 'text-blue-500 bg-blue-50', dot: 'bg-blue-500' },
    { date: 'Nov 20', label: 'New Investor Onboarding', sub: 'BlackRock RE Partners', color: 'text-green-500 bg-green-50', dot: 'bg-green-500' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const barHeights = [22, 30, 38, 50, 62, 70, 80, 88, 92];

  return (
    <InvestorLayout pageTitle="Investor Overview">
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#1A1A2E] rounded-[24px] md:rounded-[32px] p-6 md:p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-mesh opacity-60" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Good afternoon, Marcus · May 1, 2026</p>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">$248,650</h1>
                <p className="text-white/50 text-sm mt-2 font-medium">Total portfolio value across all investments</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[11px] font-bold border border-green-500/20 flex items-center gap-1.5">
                  ↗ +9.45% Annual Return
                </span>
                <span className="px-3 py-1.5 bg-ui-card/5 text-white/50 rounded-full text-[11px] font-medium border border-background/5">
                  7 investments · 4 asset classes
                </span>
              </div>
              <div className="flex items-center gap-6 pt-2 border-t border-background/10">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Active Tokens:</p>
                <div className="flex flex-wrap gap-2">
                  {['PONYC +4.2%', 'HPPE +6.8%', 'SFATX +2.1%'].map((token, i) => (
                    <div key={i} className="px-3 py-1 bg-ui-card/5 rounded-lg border border-background/10 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold">{token}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right mini-stats */}
            <div className="flex flex-row lg:flex-col gap-3 lg:w-48 shrink-0">
              {[
                { label: 'Monthly Income', val: '$14.2K' },
                { label: 'Active Positions', val: '7' },
                { label: 'Avg Yield', val: '10.8%' },
              ].map((s, i) => (
                <div key={i} className="flex-1 lg:flex-none bg-ui-card/5 border border-background/10 rounded-2xl p-4 text-center backdrop-blur-xl">
                  <p className="text-lg md:text-2xl font-bold">{s.val}</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {platformStats.map((stat, i) => (
            <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-4 md:p-7 shadow-sm space-y-3 md:space-y-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-xl ${
                  i === 0 ? 'bg-primary/10 text-primary' : i === 1 ? 'bg-blue-50 text-blue-500' : i === 2 ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  {['💰', '🏢', '👥', '📈'][i]}
                </div>
                <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.up ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                  ↗ {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl md:text-3xl font-bold text-ui-strong">{stat.val}</p>
                <p className="text-[10px] text-ui-faint mt-1 font-medium hidden sm:block">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Capital Chart */}
          <div className="lg:col-span-2 bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-base font-bold text-ui-strong mb-1">Capital Raised</h3>
                <p className="text-xs text-ui-faint">Cumulative vs. target · USD Millions</p>
              </div>
              <div className="flex gap-5">
                {[['Actual', 'bg-primary'], ['Target', 'border border-dashed border-gray-300']].map(([label, cls]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-6 h-1 rounded-full ${cls}`} />
                    <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="relative h-48 md:h-56">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-ui-placeholder font-medium">
                {['$16M', '$12M', '$8M', '$4M', '$0M'].map(l => <span key={l}>{l}</span>)}
              </div>
              <div className="absolute left-8 right-0 top-0 bottom-0">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {barHeights.map((h, i) => (
                    <div key={i} className="w-3 md:w-6 bg-primary/5 border-t-2 border-primary/15" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/8 to-transparent pointer-events-none" />
                <svg className="absolute inset-0 w-full h-full text-primary" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <path d="M0,85 Q250,75 500,55 T1000,12" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M0,85 Q250,75 500,55 T1000,12 L1000,100 L0,100 Z" fill="currentColor" fillOpacity="0.06" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between mt-4 pl-8 overflow-x-auto pb-1">
              {months.map(m => (
                <span key={m} className="text-[9px] font-bold text-ui-placeholder uppercase tracking-widest">{m}</span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-ui-divider">
              {[
                { label: 'Current Month', val: '$14.82M' },
                { label: 'Target Gap', val: '$0.18M' },
                { label: 'Completion', val: '98.8%', color: 'text-green-500' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[9px] font-bold text-ui-placeholder uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color || 'text-ui-strong'}`}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation */}
          <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-ui-strong mb-1">Allocation</h3>
            <p className="text-xs text-ui-faint mb-8">By asset class</p>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="116" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="192" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#A78BFA" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="227" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#C4B5FD" strokeWidth="14" strokeDasharray="251.2" strokeDashoffset="245" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-ui-strong">100%</p>
                  <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">Total</p>
                </div>
              </div>
              <div className="w-full space-y-3">
                {allocation.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-medium text-ui-muted-text">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-ui-strong">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activity + Upcoming */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Activity */}
          <div className="lg:col-span-2 bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-ui-strong">Recent Activity</h3>
                <p className="text-xs text-ui-faint mt-0.5">Capital flows & distributions</p>
              </div>
              <button className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                View all <span>›</span>
              </button>
            </div>
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-5 p-3 md:p-4 hover:bg-ui-muted-deep rounded-2xl transition-colors group cursor-pointer">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${item.color}`}>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] md:text-[13px] font-bold text-ui-strong truncate">{item.name}</p>
                    <p className="text-[10px] text-ui-faint font-medium uppercase tracking-wide">{item.id} · {item.type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] md:text-[13px] font-bold text-green-500">{item.amount}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden sm:inline-block px-1.5 py-0.5 bg-ui-muted-deep text-ui-faint text-[8px] font-bold rounded uppercase">{item.region}</span>
                      <p className="text-[10px] text-ui-placeholder font-medium">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-ui-strong">Upcoming</h3>
                <p className="text-xs text-ui-faint mt-0.5">Deadlines & events</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-primary">📅</div>
            </div>
            <div className="flex-1 space-y-3">
              {upcoming.map((event, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 md:p-4 rounded-2xl border border-ui-divider hover:border-ui-border transition-all cursor-pointer`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 ${event.color}`}>
                    <p className="text-[8px] font-bold uppercase">{event.date.split(' ')[0]}</p>
                    <p className="text-xs md:text-sm font-bold">{event.date.split(' ')[1]}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] md:text-[13px] font-bold text-ui-strong truncate">{event.label}</p>
                    <p className="text-[10px] text-ui-faint font-medium truncate">{event.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 mt-6 bg-ui-muted-deep text-ui-faint rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-ui-muted-deep transition-all flex items-center justify-center gap-2">
              Full Calendar <span>›</span>
            </button>
          </div>
        </section>

      </div>
    </InvestorLayout>
  );
}
