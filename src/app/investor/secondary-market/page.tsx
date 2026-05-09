'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';

export default function SecondaryMarketPage() {
  const [search, setSearch] = useState('');

  const stats = [
    { label: '24H Volume', val: '$2.8M', trend: '+12.4%', up: true },
    { label: 'Total Listings', val: '847', trend: '+42', up: true },
    { label: 'Avg. Price Change', val: '+3.2%', trend: '+0.8%', up: true },
    { label: 'Active Traders', val: '1,284', trend: '+156', up: true },
  ];

  const listings = [
    { id: 'ponyc', name: 'Prime Office Tower NYC', ticker: 'PONYC', sector: 'Real Estate', seller: 'Investor #4728', liquidity: 'High Liquidity', liqColor: 'bg-green-50 text-green-600 border-green-100', pricePerToken: '$1,240', change: '+5.1%', up: true, vol24h: '$12,400', lastSale: '$1,235', available: '150 tokens', totalVal: '$186,000', icon: '🏢', iconBg: 'bg-purple-100 text-purple-600' },
    { id: 'sfatx', name: 'Solar Farm Alpha TX', ticker: 'SFATX', sector: 'Energy', seller: 'Investor #2891', liquidity: 'Medium Liquidity', liqColor: 'bg-amber-50 text-amber-600 border-amber-100', pricePerToken: '$285', change: '-5%', up: false, vol24h: '$8,900', lastSale: '$288', available: '320 tokens', totalVal: '$91,200', icon: '⚡', iconBg: 'bg-yellow-100 text-yellow-600' },
    { id: 'hppe', name: 'Harbor Ports PE Fund', ticker: 'HPPE', sector: 'Private Equity', seller: 'Investor #1044', liquidity: 'Low Liquidity', liqColor: 'bg-rose-50 text-rose-600 border-rose-100', pricePerToken: '$4,820', change: '+15.5%', up: true, vol24h: '$24,100', lastSale: '$4,800', available: '28 tokens', totalVal: '$134,960', icon: '🌐', iconBg: 'bg-blue-100 text-blue-600' },
    { id: 'cmrf', name: 'Copper Mining Royalty', ticker: 'CMRF', sector: 'Commodities', seller: 'Investor #3312', liquidity: 'Medium Liquidity', liqColor: 'bg-amber-50 text-amber-600 border-amber-100', pricePerToken: '$960', change: '-4%', up: false, vol24h: '$5,760', lastSale: '$968', available: '75 tokens', totalVal: '$72,000', icon: '⛏️', iconBg: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <InvestorLayout pageTitle="Secondary Market">
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Secondary Market</h1>
            <p className="text-sm text-ui-faint mt-1 font-medium">Trade tokenized assets peer-to-peer with instant settlement</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[12px] font-bold text-green-600">Market Open</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-5 md:p-6 shadow-sm">
              <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-xl md:text-2xl font-bold text-ui-strong mb-1">{s.val}</p>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${s.up ? 'text-green-500' : 'text-red-500'}`}>↗ {s.trend}</span>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by asset name or symbol..." className="w-full pl-11 pr-6 py-3.5 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/5 shadow-sm" />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-bold text-ui-muted-text shadow-sm hover:bg-ui-muted-deep transition-colors shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 md:p-5 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center text-sm shrink-0">ℹ</div>
          <div>
            <h4 className="text-[13px] font-bold text-blue-900 mb-1">About Secondary Market</h4>
            <p className="text-[12px] text-blue-700 font-medium leading-relaxed">The secondary market allows investors to trade tokenized assets peer-to-peer before maturity. Prices are set by sellers and may differ from the original offering price. All trades are settled instantly on-chain with automated escrow protection.</p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {listings.map((listing, i) => (
            <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] p-5 md:p-7 shadow-sm hover:shadow-md transition-all">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${listing.iconBg}`}>{listing.icon}</div>
                  <div>
                    <h3 className="text-[14px] font-bold text-ui-strong">{listing.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-ui-faint font-medium uppercase tracking-widest">{listing.ticker} · {listing.sector}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${listing.liqColor}`}>{listing.liquidity}</span>
                    </div>
                    <p className="text-[10px] text-ui-faint mt-0.5">Seller: {listing.seller}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-1 shrink-0">
                  <p className="text-xl md:text-2xl font-bold text-ui-strong">{listing.pricePerToken}</p>
                  <p className={`text-sm font-bold flex items-center gap-1 ${listing.up ? 'text-green-500' : 'text-red-500'}`}>{listing.up ? '↗' : '↙'} {listing.change}</p>
                </div>
              </div>

              {/* Details row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  {[
                    ['24h Volume', listing.vol24h],
                    ['Last Sale', listing.lastSale],
                    ['Available', listing.available],
                    ['Total Value', listing.totalVal],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-0.5">{l}</p>
                      <p className="text-[13px] font-bold text-ui-strong">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link href="/investor/marketplace-detail" className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-xl text-[12px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    Trade Now
                  </Link>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 border border-ui-border rounded-xl text-[12px] font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    View Chart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InvestorLayout>
  );
}
