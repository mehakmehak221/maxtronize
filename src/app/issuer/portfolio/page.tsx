'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Image from 'next/image';

export default function PortfolioPage() {
  const assets = [
    {
      id: 'PONYC',
      name: 'Prime Office Tower',
      location: 'New York, NY · US - Reg D',
      price: '$7.83',
      change: '+4.2%',
      nav: '$33.2M',
      apy: '9.1%',
      investors: '1,204',
      status: 'Active',
      statusColor: 'bg-green-500',
      lockup: 'Unlocked',
      image: '🏢',
    },
    {
      id: 'SFATX',
      name: 'Solar Farm Alpha',
      location: 'Austin, TX · US - Reg D',
      price: '$4.51',
      change: '+2.1%',
      nav: '$8.2M',
      apy: '7.4%',
      investors: '512',
      status: 'Raising',
      statusColor: 'bg-blue-500',
      lockup: '6 months',
      image: '⚡',
    },
    {
      id: 'RVRE',
      name: 'Riviera Residences',
      location: 'Côte d’Azur, FR · EU - MiCA',
      price: '$1.22',
      change: '-0.4%',
      nav: '$1.2M',
      apy: '5.8%',
      investors: '89',
      status: 'Raising',
      statusColor: 'bg-blue-500',
      lockup: '12 months',
      image: '🏠',
    },
    {
      id: 'LHDE',
      name: 'Logistics Hub DE',
      location: 'Frankfurt, DE · EU - MiCA',
      price: '$10.00',
      change: '0%',
      nav: '$31.0M',
      apy: '8.6%',
      investors: '798',
      status: 'Locked',
      statusColor: 'bg-gray-400',
      lockup: 'Locked',
      image: '📦',
    },
    {
      id: 'HPPE',
      name: 'Harbor Ports PE',
      location: 'Singapore · SG - MAS',
      price: '$6.00',
      change: '+6.8%',
      nav: '$45.0M',
      apy: '12.3%',
      investors: '340',
      status: 'Active',
      statusColor: 'bg-green-500',
      lockup: 'Unlocked',
      image: '⚓',
    },
    {
      id: 'AALP',
      name: 'Alpine Art Collection',
      location: 'Geneva, CH · CH - FINMA',
      price: '$2.97',
      change: '+1.5%',
      nav: '$1.6M',
      apy: '4.2%',
      investors: '61',
      status: 'Raising',
      statusColor: 'bg-blue-500',
      lockup: '6 months',
      image: '🎨',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Portfolio</h1>
          <p className="text-sm text-ui-faint font-medium">All tokenized assets under management, live on-chain.</p>
        </div>

        {/* Dashboard Summary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-primary-deep to-primary rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-mesh opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Total NAV</p>
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight">$120.2M</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-400 text-sm font-bold">↗ +18.4% YTD</span>
                    <span className="text-white/40 text-xs font-medium">6 assets on-chain</span>
                  </div>
                </div>
                <div className="flex gap-12">
                   <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Investors</p>
                    <p className="text-2xl font-bold">3,004</p>
                  </div>
                   <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Avg. Yield</p>
                    <p className="text-2xl font-bold">7.9%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 max-w-md h-40 relative">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">NAV History (7M)</p>
                <div className="absolute inset-0 flex items-end justify-between px-2 pt-10">
                  {[40, 45, 60, 55, 75, 85, 95].map((h, i) => (
                    <div key={i} className="w-8 bg-ui-card/10 rounded-t-lg relative group">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-ui-card/40 rounded-t-lg transition-all duration-1000 group-hover:bg-ui-card"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">👥</div>
              <div>
                <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-1">Total Investors</p>
                <h4 className="text-2xl font-bold text-ui-strong">3,004</h4>
                <p className="text-[10px] text-ui-faint font-medium">Across all assets</p>
              </div>
            </div>
            <div className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-2xl">📈</div>
              <div>
                <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-1">Avg. Token Yield</p>
                <h4 className="text-2xl font-bold text-ui-strong">7.9%</h4>
                <p className="text-[10px] text-ui-faint font-medium">Annualized APY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-ui-muted-deep/50 rounded-2xl overflow-x-auto scrollbar-hide">
            {['All Assets', 'Commercial RE', 'Infrastructure', 'Residential', 'Private Equity', 'Art & Col.'].map((tab, i) => (
              <button 
                key={i}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  i === 0 ? 'bg-ui-card text-ui-strong shadow-sm' : 'text-ui-faint hover:text-ui-body'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-ui-faint hover:text-ui-strong transition-colors text-[13px] font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((asset, i) => (
            <div key={i} className="group bg-ui-card border border-ui-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              {/* Asset Image Placeholder */}
              <div className="h-56 bg-ui-muted-deep relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700">
                  {asset.image}
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-ui-card/90 backdrop-blur-md rounded-full text-[10px] font-bold text-ui-strong shadow-sm flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${asset.statusColor}`}></div>
                    {asset.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white shadow-sm">
                    {asset.id}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-ui-strong mb-1 group-hover:text-primary transition-colors">{asset.name}</h4>
                  <p className="text-[11px] text-ui-faint font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {asset.location}
                  </p>
                </div>

                <div className="py-6 border-y border-ui-divider flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-1">Token Price</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-ui-strong">{asset.price}</span>
                      <span className={`text-[10px] font-bold ${asset.change.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>{asset.change}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">NAV</p>
                    <p className="text-[13px] font-bold text-ui-strong">{asset.nav}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">APY</p>
                    <p className="text-[13px] font-bold text-green-500">{asset.apy}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">Investors</p>
                    <p className="text-[13px] font-bold text-ui-strong">{asset.investors}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-ui-faint">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                     {asset.lockup}
                  </div>
                  <button className="px-6 py-2.5 bg-ui-muted-deep text-ui-strong rounded-xl text-[11px] font-bold hover:bg-primary hover:text-white transition-all border border-ui-border group-hover:border-transparent">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
