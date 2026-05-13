'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function YieldPage() {
  const stats = [
    { label: 'Total Distributed', value: '$6.98M', sub: 'All time platform total', icon: '💰', color: 'bg-primary text-white shadow-xl shadow-primary/20' },
    { label: 'YTD Distributions', value: '$600K', sub: '+34.2% vs prior year', icon: '📈', color: 'bg-ui-card text-ui-strong border border-ui-border' },
    { label: 'Portfolio Avg APY', value: '7.9%', sub: 'Weighted by NAV', icon: '📊', color: 'bg-ui-card text-ui-strong border border-ui-border' },
    { label: 'Next Distribution', value: 'Nov 01', sub: 'Riviera Residences · $2.1K', icon: '📅', color: 'bg-ui-card text-ui-strong border border-ui-border' },
  ];

  const apyByAsset = [
    { name: 'HPPE', val: '12.3%', color: 'bg-[#10B981]' },
    { name: 'PONYC', val: '9.1%', color: 'bg-primary' },
    { name: 'LHDE', val: '8.6%', color: 'bg-indigo-500' },
    { name: 'SFATX', val: '7.4%', color: 'bg-indigo-300' },
    { name: 'RVRE', val: '5.8%', color: 'bg-indigo-200' },
    { name: 'AALP', val: '4.2%', color: 'bg-indigo-100' },
  ];

  const upcomingPayouts = [
    { name: 'Riviera Residences', type: 'Rent Yield', date: 'Nov 01', amount: '$2,100', color: 'bg-amber-50 border-amber-100 text-amber-900', iconColor: 'text-amber-500' },
    { name: 'Prime Office Tower', type: 'Q4 Distribution', date: 'Dec 31', amount: '$312,400', color: 'bg-ui-muted-deep border-ui-border text-ui-strong', iconColor: 'text-ui-faint' },
    { name: 'Solar Farm Alpha', type: 'Q4 Distribution', date: 'Dec 15', amount: '$78,200', color: 'bg-ui-muted-deep border-ui-border text-ui-strong', iconColor: 'text-ui-faint' },
    { name: 'Harbor Ports PE', type: 'Q4 Distribution', date: 'Jan 01', amount: '$892,000', color: 'bg-ui-muted-deep border-ui-border text-ui-strong', iconColor: 'text-ui-faint' },
  ];

  const breakdown = [
    { name: 'Harbor Ports PE', tag: 'HPPE', apy: '12.3%', total: '$3.42M', freq: 'Quarterly', last: 'Oct 01, 2026', next: 'Jan 01, 2027', status: 'Above Target', statusColor: 'text-green-500 bg-green-50 border-green-100' },
    { name: 'Prime Office Tower', tag: 'PONYC', apy: '9.1%', total: '$1.24M', freq: 'Quarterly', last: 'Sep 30, 2026', next: 'Dec 31, 2026', status: 'Above Target', statusColor: 'text-green-500 bg-green-50 border-green-100' },
    { name: 'Logistics Hub DE', tag: 'LHDE', apy: '8.6%', total: '$2.08M', freq: 'Quarterly', last: 'Sep 30, 2026', next: 'Dec 31, 2026', status: 'On Track', statusColor: 'text-blue-500 bg-blue-50 border-blue-100' },
    { name: 'Solar Farm Alpha', tag: 'SFATX', apy: '7.4%', total: '$186K', freq: 'Quarterly', last: 'Sep 15, 2026', next: 'Dec 15, 2026', status: 'On Track', statusColor: 'text-blue-500 bg-blue-50 border-blue-100' },
    { name: 'Riviera Residences', tag: 'RVRE', apy: '5.8%', total: '$12K', freq: 'Monthly', last: 'Aug 01, 2026', next: 'Nov 01, 2026', status: 'On Track', statusColor: 'text-blue-500 bg-blue-50 border-blue-100' },
    { name: 'Alpine Art Collection', tag: 'AALP', apy: '4.2%', total: '$42K', freq: 'Semi-Annual', last: 'Jun 30, 2026', next: 'Dec 31, 2026', status: 'Below Target', statusColor: 'text-amber-500 bg-amber-50 border-amber-100' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Yield</h1>
          <p className="text-sm text-ui-faint font-medium">Track distributions, APY performance, and upcoming payout schedules.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className={`p-8 rounded-[32px] shadow-sm flex flex-col justify-between h-44 ${s.color}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${s.color.includes('bg-primary') ? 'bg-ui-card/20' : 'bg-ui-muted-deep text-ui-strong'}`}>{s.icon}</div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.color.includes('bg-primary') ? 'text-white/60' : 'text-ui-faint'}`}>{s.label}</p>
                <h3 className="text-3xl font-bold tracking-tight">{s.value}</h3>
                <p className={`text-[10px] font-medium mt-1 ${s.color.includes('bg-primary') ? 'text-white/60' : 'text-ui-faint'}`}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* APY by Asset */}
          <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-8">
            <div>
              <h3 className="text-[13px] font-bold text-ui-strong mb-1">APY by Asset</h3>
              <p className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">Annualized yield performance</p>
            </div>
            <div className="space-y-6">
              {apyByAsset.map((asset, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${asset.color}`}></div>
                      <span className="text-[11px] font-bold text-ui-strong">{asset.name}</span>
                    </div>
                    <span className={`text-[11px] font-bold ${asset.color.replace('bg-', 'text-')}`}>{asset.val}</span>
                  </div>
                  <div className="w-full h-1.5 bg-ui-muted-deep rounded-full overflow-hidden">
                    <div className={`h-full ${asset.color}`} style={{ width: asset.val }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution Schedule Chart */}
          <div className="md:col-span-2 bg-ui-card border border-ui-border rounded-[24px] md:rounded-[40px] p-6 md:p-10 shadow-sm relative flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-[13px] font-bold text-ui-strong mb-1">Distribution Schedule</h3>
                <p className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">Monthly distributions vs. projected (USD Thousands)</p>
              </div>
              <div className="flex gap-1 p-1 bg-ui-muted-deep rounded-lg">
                <button className="px-3 py-1 bg-ui-card text-[10px] font-bold text-ui-strong rounded-md shadow-sm">Bar</button>
                <button className="px-3 py-1 text-[10px] font-bold text-ui-faint">Area</button>
              </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-8">
              {[40, 45, 55, 30, 45, 50, 55, 60, 65, 70, 75, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative h-40 flex items-end justify-center">
                    <div className="w-4 bg-primary/10 rounded-t-sm absolute inset-0 mb-[-10px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div 
                      className="motion-bar-grow w-4 bg-primary rounded-t-sm transition-all duration-700 relative"
                      style={{ height: `${h}%`, animationDelay: `${i * 45}ms` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         ${h}K
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                <span key={m} className="text-[10px] font-bold text-ui-placeholder uppercase tracking-widest">{m}</span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-12 mt-12 pt-8 border-t border-ui-divider">
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Distributed YTD</p>
                <h4 className="text-xl font-bold text-ui-strong">$600K</h4>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">EOY Projection</p>
                <h4 className="text-xl font-bold text-ui-strong">$1.04M</h4>
              </div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Achievement Rate</p>
                <h4 className="text-xl font-bold text-green-500">57.7%</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-lg">📅</div>
             <div>
               <h3 className="text-[13px] font-bold text-ui-strong mb-0.5">Upcoming Payouts</h3>
               <p className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">Scheduled distributions</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingPayouts.map((p, i) => (
              <div key={i} className={`p-8 rounded-[32px] border ${p.color} relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}>
                {i === 0 && <div className="absolute top-4 right-4 text-amber-500">🕒</div>}
                <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{p.date}</span>
                    <h4 className="text-sm font-bold truncate">{p.name}</h4>
                    <p className="text-[10px] font-medium opacity-60">{p.type}</p>
                  </div>
                  <p className="text-2xl font-bold">{p.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Yield Breakdown */}
        <div className="bg-ui-card border border-ui-border rounded-[40px] shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-ui-divider flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-ui-strong mb-1">Asset Yield Breakdown</h3>
              <p className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">Individual APY performance and distribution schedules</p>
            </div>
            <button className="px-5 py-2.5 bg-ui-card border border-ui-border rounded-xl text-[11px] font-bold text-ui-muted-text flex items-center gap-2 hover:bg-ui-muted-deep transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto -mx-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-ui-muted-surface border-b border-ui-border">
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Asset</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">APY</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Total Distributed</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Frequency</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Last Payout</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Next Payout</th>
                  <th className="px-10 py-5 text-[9px] font-bold text-ui-faint uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {breakdown.map((row, i) => (
                  <tr key={i} className="hover:bg-ui-muted-surface transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${apyByAsset.find(a => a.name === row.tag)?.color || 'bg-gray-200'}`}></div>
                        <div>
                          <p className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors">{row.name}</p>
                          <p className="text-[10px] font-medium text-ui-faint uppercase tracking-widest">{row.tag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[13px] font-bold text-green-500">{row.apy}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[13px] font-bold text-ui-strong">{row.total}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-ui-muted-deep text-ui-muted-text rounded-lg text-[10px] font-bold border border-ui-border">
                        {row.freq}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[11px] font-medium text-ui-faint">{row.last}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[11px] font-bold text-ui-strong">{row.next}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 w-fit ${row.statusColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${row.statusColor.split(' ')[0].replace('text-', 'bg-')}`}></div>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
