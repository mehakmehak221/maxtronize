'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';

export default function MarketplaceDetailPage() {
  const [activeOrder, setActiveOrder] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [amount, setAmount] = useState('');
  const [chartPeriod, setChartPeriod] = useState('1D');

  const priceHistory = [1180, 1195, 1205, 1218, 1230, 1225, 1240, 1238, 1245, 1250, 1242, 1240];
  const volumeHistory = [2.1, 1.8, 2.4, 3.1, 2.8, 3.5, 2.9, 4.1, 3.3, 2.7, 3.0, 2.8];
  const times = ['00:00','04:00','08:00','12:00','16:00','20:00','24:00'];
  const chartPeriods = ['1H', '4H', '1D', '1W', '1M'];

  const total = amount ? (parseFloat(amount) * 1240).toFixed(2) : '0';

  return (
    <InvestorLayout pageTitle="Maxtronize">
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Back nav */}
        <Link href="/investor/secondary-market" className="flex items-center gap-2 text-[13px] font-bold text-ui-muted-text hover:text-ui-body transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Market
        </Link>

        {/* Asset header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">🏢</div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-ui-strong">Prime Office Tower NYC</h1>
                <span className="px-2.5 py-1 bg-ui-muted-deep text-ui-body rounded-lg text-[11px] font-bold">PONYC</span>
              </div>
              <p className="text-[12px] text-ui-faint mt-0.5 flex items-center gap-3">
                <span>↗ 24h Volume: $284.5K</span>
                <span>·</span>
                <span>Market Cap: $62.0M</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-faint hover:text-primary transition-colors">♡</button>
            <button className="w-9 h-9 rounded-xl border border-ui-border flex items-center justify-center text-ui-faint hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
            <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[12px] font-bold hover:bg-primary/15 transition-colors flex items-center gap-1.5">
              👁 Asset Details
            </button>
          </div>
        </div>

        {/* Price stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { label: 'Current Price', val: '$1240', sub: '↗ 5.1%', subColor: 'text-green-500' },
            { label: '24h High', val: '$1255', sub: '', subColor: '' },
            { label: '24h Low', val: '$1220', sub: '', subColor: '' },
            { label: 'Circulating Supply', val: '50,000', sub: '', subColor: '' },
            { label: 'Total Supply', val: '100,000', sub: '', subColor: '' },
          ].map((s, i) => (
            <div key={i} className="bg-ui-card border border-ui-border rounded-2xl p-4 shadow-sm">
              <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-base md:text-xl font-bold text-ui-strong">{s.val}</p>
              {s.sub && <p className={`text-[10px] font-bold ${s.subColor}`}>{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Chart + Order Panel */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart area */}
          <div className="flex-1 space-y-4">
            <div className="bg-ui-card border border-ui-border rounded-[24px] p-5 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-base font-bold text-ui-strong">Price Chart (24h)</h3>
                <div className="flex gap-1">
                  {chartPeriods.map(p => (
                    <button key={p} onClick={() => setChartPeriod(p)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${chartPeriod === p ? 'bg-primary text-white' : 'text-ui-faint hover:bg-ui-muted-deep'}`}>{p}</button>
                  ))}
                </div>
              </div>

              {/* SVG chart */}
              <div className="relative h-48 md:h-64">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-ui-placeholder font-medium pr-2">
                  {['$1400','$1050','$700','$350','$0'].map(l => <span key={l}>{l}</span>)}
                </div>
                <div className="absolute left-10 right-0 top-0 bottom-0 motion-chart">
                  <svg className="absolute inset-0 w-full h-full text-green-500" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,75 Q100,72 200,65 T400,55 T600,45 T800,40 T1000,35" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M0,75 Q100,72 200,65 T400,55 T600,45 T800,40 T1000,35 L1000,100 L0,100 Z" fill="currentColor" fillOpacity="0.08" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between mt-3 pl-10 overflow-x-auto">
                {times.map(t => <span key={t} className="text-[9px] font-bold text-ui-placeholder uppercase">{t}</span>)}
              </div>
            </div>

            {/* Volume chart */}
            <div className="bg-ui-card border border-ui-border rounded-[24px] p-5 md:p-8 shadow-sm">
              <h3 className="text-base font-bold text-ui-strong mb-6">Volume (24h)</h3>
              <div className="flex h-24 items-end gap-1 motion-chart-bars">
                {volumeHistory.map((v, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t hover:bg-primary/40 transition-colors" style={{ height: `${(v / 4.5) * 100}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Panel */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-ui-card border border-ui-border rounded-[24px] shadow-sm overflow-hidden sticky top-20">
              {/* Buy/Sell toggle */}
              <div className="grid grid-cols-2">
                <button onClick={() => setActiveOrder('buy')} className={`py-4 text-[13px] font-bold transition-all ${activeOrder === 'buy' ? 'bg-green-500 text-white' : 'bg-ui-muted-deep text-ui-faint hover:bg-ui-muted-deep'}`}>Buy PONYC</button>
                <button onClick={() => setActiveOrder('sell')} className={`py-4 text-[13px] font-bold transition-all ${activeOrder === 'sell' ? 'bg-red-500 text-white' : 'bg-ui-muted-deep text-ui-faint hover:bg-ui-muted-deep'}`}>Sell PONYC</button>
              </div>

              <div className="p-5 space-y-4">
                {/* Order type */}
                <div className="grid grid-cols-2 gap-2">
                  {(['limit', 'market'] as const).map(t => (
                    <button key={t} onClick={() => setOrderType(t)} className={`py-2.5 rounded-xl text-[12px] font-bold transition-all ${orderType === t ? 'bg-gray-900 text-white' : 'bg-ui-muted-deep text-ui-muted-text hover:bg-gray-200'}`}>
                      {t === 'limit' ? 'Limit Order' : 'Market Order'}
                    </button>
                  ))}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-2">Price (USD)</label>
                  <div className="flex items-center bg-ui-muted-deep border border-ui-border rounded-xl overflow-hidden">
                    <input defaultValue="1240" className="flex-1 px-4 py-3 bg-transparent text-[14px] font-bold outline-none" />
                    <span className="px-4 text-[11px] font-bold text-ui-faint">USD</span>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-2">Amount (Tokens)</label>
                  <div className="flex items-center bg-ui-muted-deep border border-ui-border rounded-xl overflow-hidden">
                    <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="flex-1 px-4 py-3 bg-transparent text-[14px] font-bold outline-none" />
                    <span className="px-4 text-[11px] font-bold text-ui-faint">PONYC</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['25%', '50%', '75%', '100%'].map(pct => (
                      <button key={pct} className="py-1.5 bg-ui-muted-deep hover:bg-primary/10 hover:text-primary rounded-lg text-[11px] font-bold text-ui-muted-text transition-all">{pct}</button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-3 border-t border-ui-divider">
                  <span className="text-[13px] font-bold text-ui-muted-text">Total</span>
                  <span className="text-xl font-bold text-ui-strong">${total === '0.00' ? '0' : total}</span>
                </div>

                {/* CTA */}
                <button className={`w-full py-4 rounded-2xl text-[14px] font-bold shadow-lg transition-all ${activeOrder === 'buy' ? 'bg-green-500 text-white shadow-green-200 hover:shadow-xl' : 'bg-red-500 text-white shadow-red-200 hover:shadow-xl'}`}>
                  🛒 Place {activeOrder === 'buy' ? 'Buy' : 'Sell'} Order
                </button>

                {/* Wallet */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-ui-faint">Wallet Balance</span>
                  <button className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                    🔗 Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
