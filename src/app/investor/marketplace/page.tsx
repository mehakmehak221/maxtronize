'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';

export default function MarketplacePage() {
  const [search, setSearch] = useState('');

  const featured = [
    { id: 'ponyc', name: 'Prime Manhattan Office Tower', type: 'Commercial Property', location: 'New York, NY', apy: '8.2%', minInv: '$25K', raised: 4.1, target: 5.0, pct: 82, investors: 164, daysLeft: 12, tags: ['KYC Required', 'Accredited Only'], gradient: 'from-slate-700 to-slate-900', emoji: '🏢', iconBg: 'bg-purple-100 text-purple-600' },
    { id: 'sfatx', name: 'Texas Renewable Energy', type: 'Renewable Energy', location: 'Austin, TX', apy: '13.2%', minInv: '$10K', raised: 1.9, target: 2.5, pct: 75, investors: 187, daysLeft: 8, tags: ['ESG Certified'], gradient: 'from-green-700 to-emerald-900', emoji: '⚡', iconBg: 'bg-yellow-100 text-yellow-600' },
    { id: 'nvdc', name: 'Northern Virginia Data Co.', type: 'Infrastructure', location: 'Ashburn, VA', apy: '10.5%', minInv: '$50K', raised: 6.8, target: 8.0, pct: 85, investors: 136, daysLeft: 5, tags: ['High Demand', 'Tech Sector'], gradient: 'from-blue-700 to-indigo-900', emoji: '🖥️', iconBg: 'bg-blue-100 text-blue-600' },
  ];

  const allOpps = [
    { id: 'hppe', name: 'Harbor Ports PE Fund', type: 'Private Equity', location: 'Singapore', apy: '15.5%', minInv: '$100K', pct: 68, icon: '🌐', iconBg: 'bg-blue-100 text-blue-600' },
    { id: 'cmrf', name: 'Copper Mining Royalty Fund', type: 'Commodities', location: 'Chile', apy: '11.8%', minInv: '$15K', pct: 55, icon: '⛏️', iconBg: 'bg-orange-100 text-orange-600' },
    { id: 'rivr', name: 'Riviera Residences', type: 'Real Estate', location: 'Monaco', apy: '7.4%', minInv: '$250K', pct: 40, icon: '🏖️', iconBg: 'bg-pink-100 text-pink-600' },
    { id: 'logde', name: 'Logistics Hub DE', type: 'Infrastructure', location: 'Frankfurt, DE', apy: '9.1%', minInv: '$20K', pct: 91, icon: '🏭', iconBg: 'bg-ui-muted-deep text-ui-body' },
    { id: 'alp', name: 'Alpine Art Collection', type: 'Art & Collectibles', location: 'Zurich, CH', apy: '6.8%', minInv: '$50K', pct: 30, icon: '🎨', iconBg: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <InvestorLayout pageTitle="Primary Marketplace">
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Primary Marketplace</h1>
            <p className="text-sm text-ui-faint mt-1 font-medium">Discover new investment opportunities across multiple asset classes</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[12px] font-bold text-ui-muted-text">Available opportunities: <span className="text-ui-strong">8</span></span>
          </div>
        </div>

        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by name, type, or location..." className="w-full pl-11 pr-6 py-3.5 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/5 shadow-sm transition-all" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <aside className="w-full lg:w-60 shrink-0 space-y-0">
            <div className="bg-ui-card border border-ui-border rounded-[24px] p-6 shadow-sm space-y-5 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-ui-strong uppercase tracking-widest">Filters</h3>
                <button className="text-[11px] font-bold text-primary">Clear all</button>
              </div>
              {[
                { title: 'Asset Type', items: ['Real Estate', 'Private Credit', 'Commodities', 'Energy', 'Infrastructure'] },
                { title: 'Risk Level', items: ['Conservative', 'Moderate', 'Aggressive'] },
                { title: 'Minimum Investment', items: ['Up to $10,000', '$10,000 – $25,000', '$25,000 – $50,000', 'Above $50,000'] },
              ].map(section => (
                <div key={section.title} className="pt-4 border-t border-ui-divider space-y-2.5">
                  <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">{section.title}</p>
                  {section.items.map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border-2 border-ui-border-strong group-hover:border-primary/50 transition-colors shrink-0" />
                      <span className="text-[13px] text-ui-body font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              ))}
              <div className="mt-2 pt-4 border-t border-ui-divider bg-primary rounded-2xl p-5 text-white space-y-3 -mx-1">
                <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><span>⭐</span> Marketplace Stats</p>
                {[['Total Raised (30d)', '$14.2M'], ['New Listings', '12'], ['Avg. APY', '9.8%']].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-white/60 text-[11px]">{l}</span>
                    <span className="text-white text-[11px] font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-8 min-w-0">
            <div>
              <h2 className="text-[13px] font-bold text-ui-strong mb-4 flex items-center gap-2"><span>⭐</span> Featured Opportunities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {featured.map((opp, i) => (
                  <div key={i} className="bg-ui-card border border-ui-border rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                    <div className={`relative h-36 bg-gradient-to-br ${opp.gradient} flex items-end`}>
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-white rounded-lg text-[9px] font-bold">⭐ Featured</span>
                      <button className="absolute top-3 right-3 w-6 h-6 rounded-full bg-ui-card/20 flex items-center justify-center text-white text-xs">♡</button>
                      <span className="absolute bottom-3 left-3 text-[9px] text-white/80 font-medium">📍 {opp.location}</span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-green-400 text-white rounded-full text-[9px] font-bold">✓ Verified</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${opp.iconBg}`}>{opp.emoji}</div>
                        <div><h3 className="text-[12px] font-bold text-ui-strong leading-tight">{opp.name}</h3><p className="text-[10px] text-ui-faint">{opp.type}</p></div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {opp.tags.map(t => <span key={t} className="px-2 py-0.5 bg-ui-muted-deep text-ui-muted-text rounded text-[9px] font-bold">{t}</span>)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div><p className="text-[8px] font-bold text-ui-faint uppercase tracking-widest">APY</p><p className="text-sm font-bold text-primary">{opp.apy}</p></div>
                        <div><p className="text-[8px] font-bold text-ui-faint uppercase tracking-widest">Min. Investment</p><p className="text-sm font-bold text-ui-strong">{opp.minInv}</p></div>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between mb-1"><span className="text-[10px] text-ui-faint">${opp.raised}M raised of ${opp.target}M</span><span className="text-[10px] font-bold text-primary">{opp.pct}%</span></div>
                        <div className="w-full h-1.5 bg-ui-muted-deep rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${opp.pct}%` }} /></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] text-ui-faint"><span>👥 {opp.investors}</span><span>🕐 {opp.daysLeft}d</span></div>
                        <Link href="/investor/asset-detail" className="px-3 py-1.5 bg-primary text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/20">Invest ↗</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold text-ui-strong">All Opportunities</h2>
                <span className="text-[11px] text-ui-faint">{allOpps.length} listings</span>
              </div>
              <div className="space-y-3">
                {allOpps.map((opp, i) => (
                  <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] p-4 md:p-5 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${opp.iconBg}`}>{opp.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div><h3 className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors">{opp.name}</h3><p className="text-[10px] text-ui-faint uppercase tracking-widest">{opp.type} · {opp.location}</p></div>
                        <div className="grid grid-cols-3 gap-6 shrink-0">
                          {[['APY', opp.apy, 'text-primary'], ['Min. Inv.', opp.minInv, 'text-ui-strong'], ['Filled', `${opp.pct}%`, 'text-ui-strong']].map(([l, v, c]) => (
                            <div key={l} className="text-center"><p className="text-[8px] font-bold text-ui-faint uppercase tracking-widest">{l}</p><p className={`text-sm font-bold ${c}`}>{v}</p></div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 w-full h-1.5 bg-ui-muted-deep rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${opp.pct}%` }} /></div>
                    </div>
                    <Link href="/investor/asset-detail" className="px-4 py-2 bg-primary text-white rounded-xl text-[12px] font-bold shadow-lg shadow-primary/20 shrink-0">Invest ↗</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
