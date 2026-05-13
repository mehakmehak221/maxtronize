'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';

function MapPinOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

type FilterType = 'All Assets' | 'Commercial RE' | 'Infrastructure' | 'Residential' | 'Private Equity' | 'Art & Col.';

export default function MyPortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Assets');

  const filters: FilterType[] = ['All Assets', 'Commercial RE', 'Infrastructure', 'Residential', 'Private Equity', 'Art & Col.'];

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const navValues = [95, 100, 105, 110, 112, 118, 120];

  const assets = [
    {
      id: 'ponyc', name: 'Prime Office Tower', ticker: 'PONYC', location: 'New York, NY', compliance: 'US · Reg D',
      status: 'Active', statusColor: 'bg-green-400',
      tokenPrice: '$7.83', priceChange: '+4.2%', up: true,
      nav: '$33.2M', apy: '9.1%', investors: '1,204',
      lockup: 'Unlocked', gradient: 'from-slate-700 to-slate-800',
      category: 'Commercial RE' as FilterType,
    },
    {
      id: 'sfatx', name: 'Solar Farm Alpha', ticker: 'SFATX', location: 'Austin, TX', compliance: 'US · Reg D',
      status: 'Raising', statusColor: 'bg-blue-400',
      tokenPrice: '$4.51', priceChange: '+2.1%', up: true,
      nav: '$8.2M', apy: '7.4%', investors: '512',
      lockup: '6 months', gradient: 'from-green-700 to-emerald-800',
      category: 'Commercial RE' as FilterType,
    },
    {
      id: 'rivr', name: 'Riviera Residences', ticker: 'RVRE', location: 'Côte d\'Azur, FR', compliance: 'EU · MiCA',
      status: 'Raising', statusColor: 'bg-blue-400',
      tokenPrice: '$1.22', priceChange: '-0.4%', up: false,
      nav: '$1.2M', apy: '5.8%', investors: '89',
      lockup: '12 months', gradient: 'from-rose-700 to-pink-800',
      category: 'Residential' as FilterType,
    },
    {
      id: 'hppe', name: 'Harbor Ports PE Fund', ticker: 'HPPE', location: 'Singapore, SG', compliance: 'SG · MAS',
      status: 'Active', statusColor: 'bg-green-400',
      tokenPrice: '$48.20', priceChange: '+6.8%', up: true,
      nav: '$54.8M', apy: '15.5%', investors: '267',
      lockup: 'Unlocked', gradient: 'from-blue-700 to-indigo-800',
      category: 'Private Equity' as FilterType,
    },
    {
      id: 'logde', name: 'Logistics Hub DE', ticker: 'LHDE', location: 'Frankfurt, DE', compliance: 'EU · MiCA',
      status: 'Active', statusColor: 'bg-green-400',
      tokenPrice: '$12.60', priceChange: '+1.3%', up: true,
      nav: '$21.8M', apy: '9.3%', investors: '419',
      lockup: 'Unlocked', gradient: 'from-gray-700 to-slate-800',
      category: 'Infrastructure' as FilterType,
    },
    {
      id: 'alp', name: 'Alpine Art Collection', ticker: 'ALPC', location: 'Zurich, CH', compliance: 'CH · FINMA',
      status: 'Raising', statusColor: 'bg-blue-400',
      tokenPrice: '$220.00', priceChange: '+0.8%', up: true,
      nav: '$3.5M', apy: '6.8%', investors: '47',
      lockup: '24 months', gradient: 'from-purple-700 to-violet-800',
      category: 'Art & Col.' as FilterType,
    },
  ];

  const filtered = activeFilter === 'All Assets' ? assets : assets.filter(a => a.category === activeFilter);

  return (
    <InvestorLayout pageTitle="My Portfolio">
      <div className="space-y-6 animate-in fade-in duration-700">

      
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Portfolio</h1>
          <p className="text-sm text-ui-faint mt-1 font-medium">All tokenized assets under management, live on-chain.</p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
         
          <div className="bg-[#1A1A2E] rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -translate-y-1/4 translate-x-1/4" />
            <div className="relative z-10">
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-3">Total NAV</p>
              <p className="text-4xl md:text-5xl font-bold mb-2">$120.2M</p>
              <p className="text-[11px] text-white/50 font-medium mb-4">6 assets on-chain</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[11px] font-bold border border-green-500/20">↗ +18.4% YTD</span>
            </div>
          </div>

         
          <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-5 md:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[13px] font-bold text-ui-strong">NAV History</h3>
                <p className="text-[10px] text-ui-faint font-medium">USD Millions · 7-month trend</p>
              </div>
              <span className="text-[11px] font-bold text-green-500">+18.4% YTD</span>
            </div>
            <div className="relative h-28">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-ui-placeholder font-medium">
                {['$M', '$70', '$50'].map(l => <span key={l}>{l}</span>)}
              </div>
              <div className="absolute left-6 right-0 top-0 bottom-0 motion-chart">
                <svg className="w-full h-full text-primary" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <path d="M0,75 Q200,70 400,58 T700,42 T1000,22" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M0,75 Q200,70 400,58 T700,42 T1000,22 L1000,100 L0,100 Z" fill="currentColor" fillOpacity="0.06" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between mt-2 pl-6">
              {months.map(m => <span key={m} className="text-[9px] font-bold text-ui-placeholder">{m}</span>)}
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[24px] p-5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-xl shrink-0"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3294 17.4952V15.829C13.3294 14.9452 12.9783 14.0976 12.3533 13.4726C11.7284 12.8477 10.8808 12.4966 9.99697 12.4966H4.9984C4.1146 12.4966 3.26699 12.8477 2.64205 13.4726C2.01711 14.0976 1.66602 14.9452 1.66602 15.829V17.4952" stroke="#9810FA" stroke-width="1.66619" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.4984 9.16428C9.33882 9.16428 10.8308 7.67232 10.8308 5.8319C10.8308 3.99147 9.33882 2.49951 7.4984 2.49951C5.65797 2.49951 4.16602 3.99147 4.16602 5.8319C4.16602 7.67232 5.65797 9.16428 7.4984 9.16428Z" stroke="#9810FA" stroke-width="1.66619" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3274 17.4953V15.8291C18.3269 15.0907 18.0811 14.3735 17.6287 13.7899C17.1764 13.2064 16.543 12.7896 15.8281 12.605" stroke="#9810FA" stroke-width="1.66619" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3301 2.60742C14.0469 2.79095 14.6822 3.20783 15.1359 3.79234C15.5896 4.37685 15.8359 5.09574 15.8359 5.83567C15.8359 6.5756 15.5896 7.29449 15.1359 7.87899C14.6822 8.4635 14.0469 8.88038 13.3301 9.06391" stroke="#9810FA" stroke-width="1.66619" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">Total Investors</p>
                <p className="text-2xl font-bold text-ui-strong">3,004</p>
                <p className="text-[10px] text-ui-faint">Across all assets</p>
              </div>
            </div>
            <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[24px] p-5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-xl shrink-0"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3279 5.83154L11.2466 12.9129L7.08114 8.74738L1.66602 14.1625" stroke="#9810FA" stroke-width="1.66619" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3301 5.83154H18.3287V10.8301" stroke="#9810FA" stroke-width="1.66619" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
              <div>
                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">Avg. Token Yield</p>
                <p className="text-2xl font-bold text-primary">7.9%</p>
                <p className="text-[10px] text-ui-faint">Annualized APY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap shrink-0 ${activeFilter === f ? 'bg-gray-900 text-white shadow' : 'bg-ui-card border border-ui-border text-ui-muted-text hover:border-ui-border-strong'}`}>
              {f === 'All Assets' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" /></svg>}
              {f}
            </button>
          ))}
        </div>

        {/* Asset cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((asset, i) => (
            <div key={i} className="bg-ui-card border border-ui-border rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              {/* Image hero */}
              <div className={`relative h-40 bg-gradient-to-br ${asset.gradient}`}>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full border border-background/10">
                  <div className={`w-1.5 h-1.5 rounded-full ${asset.statusColor} animate-pulse`} />
                  <span className="text-[10px] font-bold text-white">{asset.status}</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full border border-background/10">
                  <span className="text-[10px] font-bold text-white">{asset.ticker}</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-base drop-shadow-lg">{asset.name}</p>
                  <p className="flex items-center gap-1 text-[10px] font-medium text-white/60">
                    <MapPinOutlineIcon className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                    {asset.location} · {asset.compliance}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Token Price</p>
                    <p className="text-xl font-bold text-ui-strong">{asset.tokenPrice}</p>
                  </div>
                  <p className={`text-sm font-bold flex items-center gap-1 ${asset.up ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.up ? '↗' : '↙'} {asset.priceChange}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 pb-4 border-b border-ui-divider">
                  {[['NAV', asset.nav], ['APY', asset.apy], ['Investors', asset.investors]].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[8px] font-bold text-ui-faint uppercase tracking-widest mb-0.5">{l}</p>
                      <p className="text-[13px] font-bold text-ui-strong">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-[11px] font-bold text-ui-faint">{asset.lockup}</span>
                  </div>
                  <Link href="/asset-detail" className="flex items-center gap-1.5 text-[12px] font-bold text-primary hover:gap-2.5 transition-all">
                    View Details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </InvestorLayout>
  );
}
