'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Globe,
  Filter,
  Search,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CheckCircle2,
  ChevronDown,
  Info,
  Sliders,
  DollarSign,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';

// Mock listings data
const ASSETS_LIST = [
  {
    id: 'POT-NYC',
    name: 'Prime Office Tower NYC',
    ticker: 'POT-NYC',
    sector: 'Real Estate',
    type: 'Real Estate',
    price: 1.24,
    change: 2.45,
    up: true,
    yield: 7.82,
    volume24h: '$1.2M',
    availableTokens: 850000,
    totalTokens: 1000000,
    iconType: 'building',
  },
  {
    id: 'HLF-2024',
    name: 'Harbor Logistics Fund',
    ticker: 'HLF-2024',
    sector: 'Private Credit',
    type: 'Private Credit',
    price: 0.98,
    change: 1.12,
    up: true,
    yield: 8.14,
    volume24h: '$890K',
    availableTokens: 1250000,
    totalTokens: 1500000,
    iconType: 'pe',
  },
  {
    id: 'SFA-2024',
    name: 'Solar Farm Alpha',
    ticker: 'SFA-2024',
    sector: 'Infrastructure',
    type: 'Infrastructure',
    price: 0.72,
    change: -0.85,
    up: false,
    yield: 9.56,
    volume24h: '$560K',
    availableTokens: 2400000,
    totalTokens: 3000000,
    iconType: 'energy',
  },
];

export default function SecondaryMarketPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  
  // Trading panel states
  const [selectedAsset, setSelectedAsset] = useState(ASSETS_LIST[0]);
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tokenQuantity, setTokenQuantity] = useState('10000');
  const [limitPrice, setLimitPrice] = useState('1.24');

  // Filter listings based on category & search
  const filteredListings = useMemo(() => {
    return ASSETS_LIST.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || asset.ticker.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All Assets' || asset.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Trading panel calculations
  const qty = parseFloat(tokenQuantity.replace(/,/g, '')) || 0;
  const pricePerToken = orderType === 'market' ? selectedAsset.price : parseFloat(limitPrice) || 0;
  const estimatedTotal = qty * pricePerToken;
  const transactionFee = estimatedTotal * 0.001; // 0.10%

  // Update selected asset and prepopulate limit price
  const handleSelectAsset = (asset: typeof ASSETS_LIST[0], action: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeTab(action);
    setLimitPrice(String(asset.price));
  };

  return (
    <InvestorLayout pageTitle="Secondary Market">
      <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <span>Platform</span>
              <span>&gt;</span>
              <span className="text-[#7C3AED]">Secondary Market</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground mt-2">Secondary Market</h1>
            <p className="text-base text-text-muted mt-1">
              Trade tokenized real-world assets with verified investors.
            </p>
          </div>

          {/* Portfolio Trading Value */}
          <div className="flex items-center gap-4 rounded-3xl border border-card-border bg-card px-6 py-4 shadow-sm">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Portfolio Trading Value</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-foreground">$1.8M</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +12.4%
                </span>
              </div>
            </div>
            {/* Sparkline visualization */}
            <div className="w-16 h-8 text-emerald-500 dark:text-emerald-400">
              <svg className="w-full h-full" viewBox="0 0 100 40" fill="none">
                <path d="M0 35 Q 20 25, 40 30 T 80 10 T 100 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M0 35 Q 20 25, 40 30 T 80 10 T 100 5 L 100 40 L 0 40 Z" fill="currentColor" fillOpacity="0.06" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4 KPI Stats Cards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Total Trading Volume (24H)',
              value: '$48.2M',
              trend: '+15.6%',
              up: true,
              icon: Activity,
            },
            {
              label: 'Assets Available',
              value: '124',
              sub: 'Across 6 asset classes',
              icon: Layers,
            },
            {
              label: 'Active Traders',
              value: '2,148',
              trend: '+8.2%',
              up: true,
              icon: Zap,
            },
            {
              label: 'Market Cap (Listed Assets)',
              value: '$312.7M',
              trend: '+11.3%',
              up: true,
              icon: DollarSign,
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[115px] relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                    {kpi.label}
                  </span>
                  <span className="text-3xl font-black text-foreground mt-2 block">
                    {kpi.value}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center">
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs mt-3 flex items-center gap-1 font-bold text-text-muted">
                {kpi.trend ? (
                  <span className={kpi.up ? 'text-emerald-500' : 'text-rose-500'}>{kpi.trend}</span>
                ) : (
                  <span>{kpi.sub}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid: Listings + Trading Panel */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Left Column (8 cols): Available Listings, Insights, Holdings, Order Book */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Available Listings Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-5 mb-6">
                {/* Category Selector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {['All Assets', 'Real Estate', 'Private Credit', 'Infrastructure', 'Funds'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-[#7C3AED] text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900/30 text-text-muted hover:text-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="rounded-2xl border border-card-border bg-card-bg pl-9 pr-4 py-2.5 text-xs font-bold text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-44"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-card-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Asset</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Type</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Price / Token</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">24H Change</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Yield (P.A.)</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Volume (24H)</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted">Available</th>
                      <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-text-muted text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border">
                    {filteredListings.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
                              <Building2 className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-foreground block">{asset.name}</span>
                              <span className="text-[10px] text-text-muted font-bold block uppercase mt-0.5">
                                {asset.ticker} · 2024
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-lg px-2.5 py-1 text-[9px] font-black tracking-wider uppercase ${
                            asset.type === 'Real Estate'
                              ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                              : asset.type === 'Private Credit'
                                ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400'
                                : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {asset.type}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-black text-foreground">${asset.price.toFixed(2)} <span className="text-[10px] text-text-muted font-bold">USDC</span></td>
                        <td className={`py-4 text-xs font-black ${asset.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {asset.up ? '+' : ''}{asset.change}%
                        </td>
                        <td className="py-4 text-xs font-bold text-foreground">{asset.yield}%</td>
                        <td className="py-4 text-xs font-bold text-foreground">{asset.volume24h}</td>
                        <td className="py-4 text-xs font-bold text-foreground">{asset.availableTokens.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectAsset(asset, 'buy')}
                              className="rounded-xl border border-card-border bg-card px-3 py-1.5 text-[10px] font-bold text-text-muted hover:text-foreground transition-all"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectAsset(asset, 'buy')}
                              className="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-3 py-1.5 text-[10px] font-bold text-white transition-all"
                            >
                              Buy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectAsset(asset, 'sell')}
                              className="rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3 py-1.5 text-[10px] font-bold text-rose-500 transition-all"
                            >
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center pt-6 mt-4 border-t border-card-border">
                <button type="button" className="text-xs font-black tracking-widest text-[#7C3AED] uppercase hover:underline inline-flex items-center gap-1">
                  <span>View All Assets</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Row: Insights & Holdings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Market Insights Card */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                <h4 className="text-sm font-extrabold text-foreground mb-6">Market Insights</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'TOP GAINER', val: '+3.24%', sub: 'RIV-2024', color: 'text-emerald-500' },
                    { label: 'MOST TRADED', val: '$12.4M', sub: 'POT-NYC', color: 'text-foreground font-extrabold' },
                    { label: 'HIGHEST YIELD', val: '9.56%', sub: 'SFA-2024', color: 'text-purple-600 dark:text-purple-400 font-extrabold' },
                    { label: 'TRENDING', val: 'Asset', sub: 'HLF-2024', color: 'text-cyan-500' },
                  ].map((insight, idx) => (
                    <div key={idx} className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/30 p-4">
                      <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block">
                        {insight.label}
                      </span>
                      <span className={`text-lg font-black block mt-1.5 ${insight.color}`}>
                        {insight.val}
                      </span>
                      <span className="text-[10px] text-text-muted font-bold block mt-0.5">{insight.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Holdings Card */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-extrabold text-foreground">My Holdings</h4>
                  <button type="button" className="text-xs font-bold text-[#7C3AED] hover:underline uppercase tracking-wider">
                    View Portfolio
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-card-border text-[9px] font-black uppercase tracking-widest text-text-muted">
                        <th className="pb-2">Asset</th>
                        <th className="pb-2">Tokens</th>
                        <th className="pb-2 text-right">Value</th>
                        <th className="pb-2 text-right">P&L (24H)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border text-xs">
                      {[
                        { name: 'Prime Office Tower', ticker: 'POT-NYC', qty: '25,000', val: '$31,000.00', pnl: '+$775.00 (+2.56%)', up: true },
                        { name: 'Harbor Logistics Fund', ticker: 'HLF-2024', qty: '15,000', val: '$14,700.00', pnl: '+$165.00 (+1.14%)', up: true },
                      ].map((hold, idx) => (
                        <tr key={idx}>
                          <td className="py-3">
                            <span className="font-bold text-foreground block leading-tight">{hold.name}</span>
                            <span className="text-[9px] text-text-muted font-black tracking-widest uppercase mt-0.5">{hold.ticker}</span>
                          </td>
                          <td className="py-3 font-bold text-foreground">{hold.qty}</td>
                          <td className="py-3 font-bold text-foreground text-right">{hold.val}</td>
                          <td className={`py-3 font-bold text-right ${hold.up ? 'text-emerald-500' : 'text-rose-500'}`}>{hold.pnl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Row: Recent Trades & Order Book */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recent Trades Card */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-extrabold text-foreground">Recent Trades</h4>
                  <button type="button" className="text-xs font-bold text-text-muted hover:text-foreground">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-card-border text-[9px] font-black uppercase tracking-widest text-text-muted">
                        <th className="pb-2">Price</th>
                        <th className="pb-2">Qty</th>
                        <th className="pb-2">Time</th>
                        <th className="pb-2">Buyer</th>
                        <th className="pb-2">Seller</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-bold text-text-muted">
                      {[
                        { price: '1.25', qty: '5,000', time: '10:42:18 AM', b: '0x8a7f...3d2e', s: '0x1bc4...7f3a', up: true },
                        { price: '1.24', qty: '12,000', time: '10:41:05 AM', b: '0x7e12...11aa', s: '0x3c6d...7b2e', up: true },
                        { price: '1.26', qty: '8,000', time: '10:40:22 AM', b: '0x92d2...8cf1', s: '0xfa3b...2d91', up: false },
                        { price: '1.24', qty: '15,000', time: '10:39:47 AM', b: '0x41f1...ab71', s: '0x9e77...11c2', up: true },
                      ].map((tr, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className={`py-2.5 ${tr.up ? 'text-emerald-500' : 'text-rose-500'}`}>{tr.price}</td>
                          <td className="py-2.5 text-foreground">{tr.qty}</td>
                          <td className="py-2.5 font-normal text-[10px]">{tr.time}</td>
                          <td className="py-2.5 font-mono font-normal text-[10px]">{tr.b}</td>
                          <td className="py-2.5 font-mono font-normal text-[10px]">{tr.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Book Card */}
              <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-extrabold text-foreground">Order Book - {selectedAsset.ticker}</h4>
                    <select className="rounded-xl border border-card-border bg-card-bg px-2 py-1 text-[10px] font-bold text-text-muted focus:outline-none">
                      <option>0.01 USDC</option>
                      <option>0.05 USDC</option>
                      <option>0.10 USDC</option>
                    </select>
                  </div>

                  {/* Depth Columns */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Buy Orders (Green Side) */}
                    <div>
                      <div className="flex justify-between text-[8px] font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-2">
                        <span>Bid Price</span>
                        <span>Size</span>
                      </div>
                      <div className="space-y-1.5 text-xs font-bold">
                        {[
                          { price: '1.28', size: '50,000', pct: 65 },
                          { price: '1.27', size: '75,000', pct: 85 },
                          { price: '1.26', size: '60,000', pct: 75 },
                        ].map((bid, bidx) => (
                          <div key={bidx} className="relative py-1 px-2 flex justify-between rounded overflow-hidden">
                            <div className="absolute inset-y-0 right-0 bg-emerald-500/10 transition-all pointer-events-none" style={{ width: `${bid.pct}%` }} />
                            <span className="text-emerald-500 z-10">{bid.price}</span>
                            <span className="text-foreground z-10">{bid.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sell Orders (Red Side) */}
                    <div>
                      <div className="flex justify-between text-[8px] font-black tracking-wider text-rose-500 uppercase mb-2">
                        <span>Ask Price</span>
                        <span>Size</span>
                      </div>
                      <div className="space-y-1.5 text-xs font-bold">
                        {[
                          { price: '1.30', size: '40,000', pct: 55 },
                          { price: '1.31', size: '60,000', pct: 75 },
                          { price: '1.32', size: '70,000', pct: 85 },
                        ].map((ask, aix) => (
                          <div key={aix} className="relative py-1 px-2 flex justify-between rounded overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-rose-500/10 transition-all pointer-events-none" style={{ width: `${ask.pct}%` }} />
                            <span className="text-rose-500 z-10">{ask.price}</span>
                            <span className="text-foreground z-10">{ask.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Spread & Link */}
                <div className="pt-6 mt-6 border-t border-card-border">
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Spread</span>
                    <span className="text-2xl font-black text-foreground mt-1">$0.02</span>
                    <span className="text-[10px] font-bold text-text-muted">(1.63%)</span>
                  </div>
                  <Link
                    href={`/investor/secondary-market/order-book?id=${selectedAsset.id}`}
                    className="text-xs font-black tracking-widest text-[#7C3AED] hover:underline uppercase mt-4 w-full flex items-center justify-center gap-1.5"
                  >
                    <span>View Full Order Book</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Buy/Sell Trading Panel */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Trading Widget Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
              
              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 rounded-2xl bg-slate-50 dark:bg-slate-900/30 p-1.5 border border-card-border">
                <button
                  type="button"
                  onClick={() => setTradeTab('buy')}
                  className={`rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all ${
                    tradeTab === 'buy'
                      ? 'bg-[#7C3AED] text-white shadow-md'
                      : 'text-text-muted hover:text-foreground'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTradeTab('sell')}
                  className={`rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all ${
                    tradeTab === 'sell'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-text-muted hover:text-foreground'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Asset Block */}
              <div className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground">{selectedAsset.name}</h4>
                    <span className="text-[10px] text-text-muted font-bold uppercase mt-0.5 block">{selectedAsset.ticker}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-foreground">${selectedAsset.price.toFixed(2)}</span>
                  <span className="text-[9px] text-text-muted font-bold block">USDC</span>
                </div>
              </div>

              {/* Order Type Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`rounded-2xl border px-4 py-3 text-xs font-bold transition-all text-center ${
                    orderType === 'market'
                      ? 'border-[#7C3AED] bg-purple-50/10 dark:bg-purple-950/10 text-[#7C3AED]'
                      : 'border-card-border bg-card text-text-muted hover:border-text-muted'
                  }`}
                >
                  Market Order
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('limit')}
                  className={`rounded-2xl border px-4 py-3 text-xs font-bold transition-all text-center ${
                    orderType === 'limit'
                      ? 'border-[#7C3AED] bg-purple-50/10 dark:bg-purple-950/10 text-[#7C3AED]'
                      : 'border-card-border bg-card text-text-muted hover:border-text-muted'
                  }`}
                >
                  Limit Order
                </button>
              </div>

              {/* Token Quantity Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                    Token Quantity
                  </label>
                  <span className="text-[9px] font-bold text-text-muted">
                    Available: 25,000 POT-NYC
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={tokenQuantity}
                    onChange={(e) => setTokenQuantity(e.target.value)}
                    className="w-full rounded-2xl border border-card-border bg-card-bg pl-4 pr-16 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-text-muted">
                    {selectedAsset.ticker}
                  </span>
                </div>
              </div>

              {/* Price Per Token Input */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Price Per Token (USDC)
                </label>
                {orderType === 'market' ? (
                  <div className="w-full rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/30 px-4 py-3 text-sm font-bold text-text-muted flex justify-between items-center select-none">
                    <span>Market Price</span>
                    <span>~${selectedAsset.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                )}
              </div>

              {/* Math Summary */}
              <div className="space-y-2.5 pt-4 border-t border-card-border text-xs font-bold">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Estimated Total</span>
                  <span className="text-foreground text-sm font-black">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Transaction Fee</span>
                  <span className="text-foreground">${transactionFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC (0.10%)</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Settlement Method</span>
                  <div className="flex items-center gap-1.5 rounded-xl border border-card-border bg-card px-3 py-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-[10px] font-bold text-foreground">
                    <Wallet className="h-3.5 w-3.5 text-[#7C3AED]" />
                    <span>USDC Wallet</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </div>
              </div>

              {/* Preview Button */}
              <button
                type="button"
                className={`w-full rounded-2xl py-4 text-xs font-black tracking-widest uppercase text-white shadow-md transition-all ${
                  tradeTab === 'buy'
                    ? 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-purple-500/10'
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10'
                }`}
              >
                Preview Now
              </button>

              {/* Compliance Status */}
              <div className="space-y-3 pt-6 border-t border-card-border">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">
                  Compliance Status
                </span>
                <div className="space-y-2">
                  {[
                    { label: 'KYC Verified', tag: 'Verified' },
                    { label: 'AML Cleared', tag: 'Cleared' },
                    { label: 'Whitelist Approved', tag: 'Approved' },
                    { label: 'Eligible For Trading', tag: 'Eligible' },
                  ].map((comp, cidx) => (
                    <div key={cidx} className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-text-muted">{comp.label}</span>
                      </div>
                      <span className="text-emerald-500">{comp.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </InvestorLayout>
  );
}
