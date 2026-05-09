'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function WalletPage() {
  const wallets = [
    { name: 'Platform Wallet', network: 'Ethereum', balance: '$184,230', address: '0x7a3f...4a9c', icon: '🌐' },
    { name: 'Custody Wallet', network: 'Ethereum', balance: '2.84 ETH', address: '0x8b1c...3d2a', icon: '🏦' },
    { name: 'Polygon Bridge', network: 'Polygon', balance: '14,820 MATIC', address: '0x3f9d...7b1e', icon: '⬡' },
  ];

  const holdings = [
    { name: 'PONYC', asset: 'Prime Office Tower', value: '$33.3M', change: '+4.2%', color: 'bg-primary' },
    { name: 'HPPE', asset: 'Harbor Ports PE Fund', value: '$27.0M', change: '+6.8%', color: 'bg-blue-500' },
    { name: 'LHDE', asset: 'Logistics Hub DE', value: '$31.0M', change: '0%', color: 'bg-gray-400' },
    { name: 'SFATX', asset: 'Solar Farm Alpha TX', value: '$3.7M', change: '+2.1%', color: 'bg-orange-500' },
  ];

  const transactions = [
    { type: 'Capital Raise Deposit', date: 'Today, 10:42 AM', amount: '+$1,200,000', status: 'Success', icon: '↘', color: 'text-green-500 bg-green-50' },
    { type: 'Q3 Yield Distribution', date: 'Oct 01, 9:15 AM', amount: '+$312,400', status: 'Success', icon: '✨', color: 'text-purple-500 bg-purple-50' },
    { type: 'Capital Raise Deposit', date: 'Sep 29, 2:30 PM', amount: '+$850,000', status: 'Pending', icon: '↘', color: 'text-blue-500 bg-blue-50' },
    { type: 'Monthly Rent Distribution', date: 'Sep 15, 8:00 AM', amount: '+$2,100', status: 'Success', icon: '✨', color: 'text-purple-500 bg-purple-50' },
    { type: 'Compliance Fee', date: 'Sep 10, 11:20 AM', amount: '-$4,500', status: 'Success', icon: '↗', color: 'text-ui-strong bg-ui-muted-deep' },
    { type: 'Q3 Distribution', date: 'Sep 05, 9:00 AM', amount: '+$892,000', status: 'Success', icon: '✨', color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">Wallet</h1>
          <p className="text-sm text-text-muted font-medium">Connected wallets, token holdings, and on-chain transaction history.</p>
        </div>

        {/* Main Wallet Card */}
        <div className="bg-primary-deep rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="space-y-8">
                 <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                     Total Portfolio Value
                   </p>
                   <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">$95.3M</h2>
                   <div className="flex items-center gap-4 text-sm font-medium text-white/60">
                      <p>3 connected wallets</p>
                      <span className="w-1 h-1 rounded-full bg-ui-card/20"></span>
                      <p>4 token positions</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-ui-card/5 border border-background/10 rounded-2xl w-fit">
                    <span className="text-green-400 text-sm font-bold">↗ +$4.2M (4.6%)</span>
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">this month</span>
                 </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                 <button className="w-full py-4 bg-ui-card text-ui-strong rounded-2xl text-[13px] font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    Deposit
                 </button>
                 <button className="w-full py-4 bg-ui-card/5 border border-background/10 text-white rounded-2xl text-[13px] font-bold hover:bg-ui-card/10 transition-all flex items-center justify-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    Withdraw
                 </button>
                 <button className="w-full py-4 bg-ui-card/5 border border-background/10 text-white rounded-2xl text-[13px] font-bold hover:bg-ui-card/10 transition-all flex items-center justify-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    Transfer
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Connected Wallets */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">Connected Wallets</h3>
                 <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-primary transition-colors text-xl">+</button>
              </div>
              <div className="space-y-4">
                 {wallets.map((w, i) => (
                    <div key={i} className="bg-card border border-card-border rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                       <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {w.icon}
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h4 className="text-[13px] font-bold text-foreground">{w.name}</h4>
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                </div>
                                <p className="text-[11px] text-text-muted font-medium">{w.network}</p>
                             </div>
                          </div>
                          <button className="text-text-muted hover:text-primary transition-colors">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </button>
                       </div>
                       <div className="space-y-2">
                          <p className="text-2xl font-bold text-foreground">{w.balance}</p>
                          <div className="flex items-center gap-2">
                             <code className="text-[10px] text-text-muted bg-surface px-2 py-1 rounded-md font-mono">{w.address}</code>
                             <button className="text-text-muted hover:text-primary transition-colors">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
                 <div className="p-8 border-2 border-dashed border-border rounded-[32px] flex items-center justify-center gap-3 text-[11px] font-bold text-green-600 bg-green-500/5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    All wallets secured via Multi-sig
                 </div>
              </div>
           </div>

           {/* Token Holdings */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">Token Holdings</h3>
                 <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-bold uppercase tracking-widest">4 positions</span>
              </div>
              <div className="bg-card border border-card-border rounded-[40px] p-10 shadow-sm space-y-10">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-widest px-2">
                       <span>Portfolio Distribution</span>
                       <span className="text-foreground">$95.0M total</span>
                    </div>
                    <div className="h-4 flex rounded-full overflow-hidden">
                       <div className="bg-primary w-[40%]" title="PONYC"></div>
                       <div className="bg-blue-500 w-[30%]" title="HPPE"></div>
                       <div className="bg-gray-400 w-[25%]" title="LHDE"></div>
                       <div className="bg-orange-500 w-[5%]" title="SFATX"></div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {holdings.map((h, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl ${h.color} flex items-center justify-center text-white font-bold text-[11px] shadow-lg shadow-black/5`}>
                               {h.name.slice(0, 2)}
                            </div>
                            <div>
                               <h4 className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{h.name}</h4>
                               <p className="text-[10px] text-text-muted font-medium">{h.asset}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[13px] font-bold text-foreground">{h.value}</p>
                            <p className={`text-[10px] font-bold ${h.change.startsWith('+') ? 'text-green-500' : 'text-text-muted'}`}>{h.change}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <button className="w-full py-4 border border-border rounded-2xl text-[11px] font-bold text-text-muted hover:bg-surface transition-all">
                    All Holdings ↗
                 </button>
              </div>
           </div>

           {/* Transactions */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">Transactions</h3>
                 <span className="flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Live
                 </span>
              </div>
              <div className="bg-card border border-card-border rounded-[40px] shadow-sm overflow-hidden p-4 space-y-2">
                 {transactions.map((tx, i) => (
                    <div key={i} className="p-6 hover:bg-surface rounded-[32px] transition-all cursor-pointer group flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${tx.color} group-hover:scale-110 transition-transform`}>
                             {tx.icon}
                          </div>
                          <div>
                             <p className="text-[13px] font-bold text-foreground mb-0.5">{tx.type}</p>
                             <p className="text-[11px] text-text-muted font-medium">{tx.date}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-[13px] font-bold ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-foreground'}`}>{tx.amount}</p>
                          {tx.status === 'Pending' && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[9px] font-bold uppercase tracking-wider">Pending</span>
                          )}
                       </div>
                    </div>
                 ))}
                 <div className="pt-4 px-4">
                    <button className="w-full py-4 border border-border rounded-2xl text-[11px] font-bold text-text-muted hover:bg-surface transition-all">
                       Full History ↗
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
