'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Search,
  CheckCircle2,
  ChevronDown,
  Printer,
  HelpCircle,
  ArrowLeft,
  Sliders,
  DollarSign,
  Activity,
  Layers,
  ArrowRight,
  Bell,
  Scale,
} from 'lucide-react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';

export default function OrderBookDetailPage() {
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [timeframe, setTimeframe] = useState<'1h' | '4h' | '1d'>('1h');
  const [priceInput, setPriceInput] = useState('1.241');
  const [amountInput, setAmountInput] = useState('');
  const [activeBookTab, setActiveBookTab] = useState<'detailed' | 'grouped'>('detailed');

  // Math calculations
  const qty = parseFloat(amountInput) || 0;
  const price = parseFloat(priceInput) || 0;
  const total = qty * price;
  const fee = total * 0.001; // 0.1%

  // Handle quick percentage selection
  const handlePercentClick = (pct: number) => {
    // Mock Max Balance: 25000 POT-NYC tokens or equivalent USDC
    if (tradeTab === 'buy') {
      const maxBuyQty = 25000;
      setAmountInput((maxBuyQty * pct).toFixed(0));
    } else {
      const maxSellQty = 15000;
      setAmountInput((maxSellQty * pct).toFixed(0));
    }
  };

  return (
    <InvestorLayout pageTitle="Secondary Market - Order Book">
      <div className="mx-auto w-full max-w-7xl space-y-6 animate-in fade-in duration-500 pb-20">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <span>Platform</span>
              <span>&gt;</span>
              <span>Secondary Market</span>
              <span>&gt;</span>
              <span>POT-NYC</span>
              <span>&gt;</span>
              <span className="text-[#7C3AED]">Order Book</span>
            </div>
            
            <div className="flex items-center gap-3 pt-1">
              <div className="h-10 w-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-black text-sm">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-foreground leading-tight">Prime Office Tower NYC</h1>
                <p className="text-[10px] text-text-muted font-bold block uppercase mt-0.5">Asset ID: POT-NYC-ORD-2024</p>
              </div>
            </div>
          </div>

          {/* Quick Header Market Stats */}
          <div className="flex items-center gap-6 text-xs font-bold">
            <div className="border-r border-card-border pr-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Current Price</span>
              <span className="text-sm font-black text-foreground mt-1 block">$1.24 <span className="text-[10px] text-text-muted">USDC</span></span>
            </div>
            <div className="border-r border-card-border pr-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">24H Change</span>
              <span className="text-sm font-black text-emerald-500 mt-1 block flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +2.45%
              </span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">24H Volume</span>
              <span className="text-sm font-black text-foreground mt-1 block">2.4M <span className="text-[10px] text-text-muted">USDC</span></span>
            </div>
          </div>
        </div>

        {/* Market Depth Visualization Card */}
        <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Market Depth Visualization</h4>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-slate-50 dark:bg-slate-900/30 p-1 border border-card-border">
                {['1h', '4h', '1d'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf as any)}
                    className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                      timeframe === tf
                        ? 'bg-[#7C3AED] text-white'
                        : 'text-text-muted hover:text-foreground'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="h-7 w-7 rounded-xl border border-card-border bg-card flex items-center justify-center font-bold text-sm text-text-muted hover:text-foreground shadow-sm">+</button>
                <button type="button" className="h-7 w-7 rounded-xl border border-card-border bg-card flex items-center justify-center font-bold text-sm text-text-muted hover:text-foreground shadow-sm">-</button>
              </div>
            </div>
          </div>

          {/* Depth Chart Rendering */}
          <div className="h-56 w-full relative mt-8">
            <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Bids Path (Green Area) */}
              <path d="M 50 160 L 150 160 L 250 150 L 320 130 L 450 60 L 450 200 L 50 200 Z" fill="url(#bidGrad)" />
              <path d="M 50 160 L 150 160 L 250 150 L 320 130 L 450 60 L 450 200" stroke="#10B981" strokeWidth="2.5" fill="none" />
              
              {/* Asks Path (Red Area) */}
              <path d="M 550 200 L 550 60 L 650 110 L 750 140 L 850 155 L 950 160 L 950 200 Z" fill="url(#askGrad)" />
              <path d="M 550 60 L 650 110 L 750 140 L 850 155 L 950 160" stroke="#EF4444" strokeWidth="2.5" fill="none" />

              {/* Mid Line (Purple dotted) */}
              <line x1="380" y1="20" x2="380" y2="200" stroke="#7C3AED" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
            
            {/* Mid Labels */}
            <div className="absolute top-2 left-[38.5%] text-[9px] font-black text-[#7C3AED] uppercase tracking-wider bg-card px-1.5 py-0.5 rounded shadow-sm">
              Mid $1.24
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[9px] font-black text-text-muted uppercase mt-4 px-4">
              <span>$1.18</span>
              <span>$1.20</span>
              <span>$1.22</span>
              <span className="text-[#7C3AED] font-black">$1.24</span>
              <span>$1.26</span>
              <span>$1.28</span>
              <span>$1.30</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Order Book + Right Side Stats & Panel */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Left Column (8 cols): Order Book Table & Recent Trades */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Order Book Depth Table Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-card-border pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">Order Book</span>
                  <div className="flex rounded-xl bg-slate-50 dark:bg-slate-900/30 p-1 border border-card-border">
                    {['Detailed', 'Grouped'].map((bk) => (
                      <button
                        key={bk}
                        type="button"
                        onClick={() => setActiveBookTab(bk.toLowerCase() as any)}
                        className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeBookTab === bk.toLowerCase()
                            ? 'bg-[#7C3AED] text-white shadow-sm'
                            : 'text-text-muted hover:text-foreground'
                        }`}
                      >
                        {bk}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-card-border bg-card px-3 py-1.5 text-[10px] font-bold text-text-muted">
                  <span>Agg 0.01</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </div>

              {/* Order Book Grid (Bids vs Asks) */}
              <div className="grid grid-cols-2 gap-0 relative">
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-card-border" />
                
                {/* Green Buy Side */}
                <div className="pr-4">
                  <table className="w-full text-left text-xs font-bold">
                    <thead>
                      <tr className="text-[9px] font-black uppercase tracking-wider text-text-muted pb-3">
                        <th>Total (USDC)</th>
                        <th>Size (Tokens)</th>
                        <th className="text-right">Price (USDC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { total: '45,200.00', size: '36,451', price: '1.239', pct: 25 },
                        { total: '128,400.50', size: '103,548', price: '1.238', pct: 45 },
                        { total: '312,900.20', size: '252,338', price: '1.235', pct: 65 },
                        { total: '402,110.00', size: '324,282', price: '1.234', pct: 75 },
                        { total: '552,000.00', size: '448,780', price: '1.230', pct: 85 },
                        { total: '782,000.00', size: '635,772', price: '1.228', pct: 90 },
                        { total: '912,400.00', size: '741,788', price: '1.225', pct: 95 },
                      ].map((bid, idx) => (
                        <tr key={idx} className="relative hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-2.5 text-text-muted relative z-10">{bid.total}</td>
                          <td className="py-2.5 text-foreground relative z-10">{bid.size}</td>
                          <td className="py-2.5 text-right text-emerald-500 relative z-10 font-black">
                            {bid.price}
                            <div className="absolute inset-y-0.5 right-0 bg-emerald-500/10 transition-all pointer-events-none rounded" style={{ width: `${bid.pct}%` }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Red Sell Side */}
                <div className="pl-4">
                  <table className="w-full text-left text-xs font-bold">
                    <thead>
                      <tr className="text-[9px] font-black uppercase tracking-wider text-text-muted pb-3">
                        <th className="text-left text-rose-500">Price (USDC)</th>
                        <th>Size (Tokens)</th>
                        <th className="text-right">Total (USDC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { price: '1.241', size: '12,450', total: '15,450.45', pct: 15 },
                        { price: '1.242', size: '34,120', total: '42,377.04', pct: 30 },
                        { price: '1.245', size: '88,200', total: '109,809.00', pct: 45 },
                        { price: '1.248', size: '152,000', total: '189,696.00', pct: 60 },
                        { price: '1.250', size: '412,550', total: '515,687.50', pct: 80 },
                        { price: '1.255', size: '612,400', total: '768,562.00', pct: 90 },
                      ].map((ask, idx) => (
                        <tr key={idx} className="relative hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-2.5 text-rose-500 font-black relative z-10">
                            {ask.price}
                            <div className="absolute inset-y-0.5 left-0 bg-rose-500/10 transition-all pointer-events-none rounded" style={{ width: `${ask.pct}%` }} />
                          </td>
                          <td className="py-2.5 text-foreground relative z-10">{ask.size}</td>
                          <td className="py-2.5 text-right text-text-muted relative z-10">{ask.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Recent Trades Table Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-card-border pb-4 mb-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Recent Trades</h4>
                <button type="button" className="text-xs font-bold text-[#7C3AED] hover:underline uppercase">
                  View History
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-card-border text-[9px] font-black uppercase tracking-widest text-text-muted pb-2">
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Price (USDC)</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Wallet ID</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold text-text-muted">
                    {[
                      { time: '14:24:02', price: '1.240', qty: '5,400', total: '6,696.00', buy: true, wallet: '0x42...d83a' },
                      { time: '14:23:45', price: '1.239', qty: '12,100', total: '14,991.90', buy: false, wallet: '0x9f...21ce' },
                      { time: '14:22:12', price: '1.239', qty: '1,200', total: '1,486.80', buy: true, wallet: '0xb3...fa91' },
                    ].map((tr, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="py-4 font-normal text-text-muted">{tr.time}</td>
                        <td className="py-4 text-foreground font-black">${tr.price}</td>
                        <td className="py-4 text-foreground">{tr.qty}</td>
                        <td className="py-4 text-text-muted">{tr.total}</td>
                        <td className="py-4">
                          <span className={`inline-flex rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                            tr.buy
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                          }`}>
                            {tr.buy ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                        <td className="py-4 font-mono font-normal">{tr.wallet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Market Insights & Order Placement Panel */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Market Insights Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">Market Insights</h4>
              
              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Bid-Ask Spread</span>
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-black">0.002 (0.16%)</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Market Makers</span>
                  <span className="text-foreground text-sm font-black">14 Active</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>Depth @ 1%</span>
                  <span className="text-foreground text-sm font-black">1.2M USDC</span>
                </div>
              </div>

              {/* Yield Analysis Section */}
              <div className="pt-6 border-t border-card-border">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-3">Yield Analysis</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-500">6.24%</span>
                  <span className="text-[10px] font-bold text-text-muted">Expected APY</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed mt-2.5">
                  Currently 12% above 30-day moving average yield for Mid-Town Manhattan Class A assets.
                </p>
              </div>
            </div>

            {/* Quick Order Panel Card */}
            <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
              
              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 rounded-2xl bg-slate-50 dark:bg-slate-900/30 p-1.5 border border-card-border">
                <button
                  type="button"
                  onClick={() => setTradeTab('buy')}
                  className={`rounded-xl py-3 text-xs font-black tracking-widest uppercase transition-all ${
                    tradeTab === 'buy'
                      ? 'bg-emerald-500 text-white shadow-md'
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

              {/* Limit / Market Sub Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/10 p-1 rounded-2xl border border-card-border">
                <button
                  type="button"
                  onClick={() => setOrderType('limit')}
                  className={`rounded-xl py-2 text-center text-xs font-bold transition-all ${
                    orderType === 'limit'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-text-muted hover:text-foreground'
                  }`}
                >
                  Limit
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`rounded-xl py-2 text-center text-xs font-bold transition-all ${
                    orderType === 'market'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-text-muted hover:text-foreground'
                  }`}
                >
                  Market
                </button>
              </div>

              {/* Price input */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Price (USDC)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    disabled={orderType === 'market'}
                    className="w-full rounded-2xl border border-card-border bg-card-bg pl-4 pr-16 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#7C3AED] hover:underline uppercase">
                    MAX
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                  Amount (Tokens)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full rounded-2xl border border-card-border bg-card-bg pl-4 pr-16 py-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted uppercase">
                    POT
                  </span>
                </div>
              </div>

              {/* Percentage triggers */}
              <div className="grid grid-cols-4 gap-2">
                {[0.25, 0.50, 0.75, 1.00].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentClick(pct)}
                    className="rounded-xl border border-card-border bg-card py-2 text-center text-[10px] font-bold text-text-muted hover:border-text-muted transition-all"
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>

              {/* Bottom totals */}
              <div className="space-y-3 pt-4 border-t border-card-border text-xs font-bold text-text-muted">
                <div className="flex justify-between items-center">
                  <span>Total</span>
                  <span className="text-foreground text-sm font-black">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fee (0.1%)</span>
                  <span className="text-foreground">${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/investor/secondary-market/settlement"
                className={`w-full rounded-2xl py-4 text-xs font-black tracking-widest uppercase text-white shadow-md transition-all text-center block ${
                  tradeTab === 'buy'
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10'
                }`}
              >
                Place {tradeTab === 'buy' ? 'Buy' : 'Sell'} Order
              </Link>

            </div>

          </div>

        </div>

      </div>
    </InvestorLayout>
  );
}
