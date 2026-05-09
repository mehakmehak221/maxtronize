'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type TabType = 'overview' | 'assets' | 'cap-table' | 'investors' | 'distributions' | 'compliance' | 'analytics' | 'ai-assistant';

export default function IssuerHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'assets', name: 'Assets', icon: '🏢' },
    { id: 'cap-table', name: 'Cap Table', icon: '📋' },
    { id: 'investors', name: 'Investors', icon: '👥' },
    { id: 'distributions', name: 'Distributions', icon: '💰' },
    { id: 'compliance', name: 'Compliance', icon: '🛡️' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'ai-assistant', name: 'AI Assistant', icon: '🤖', tag: 'AI' },
  ];

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#7C3AED] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-mesh opacity-40"></div>
          <div className="relative z-10 space-y-6">
            <div className="w-10 h-10 rounded-2xl bg-ui-card/10 flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Total Capital Raised</p>
              <h3 className="text-4xl font-bold tracking-tight">$14,820,000</h3>
              <p className="text-xs text-white/60 mt-2 font-medium">across 3 active offerings</p>
            </div>
            <div className="pt-4 border-t border-background/10">
              <span className="text-green-300 text-[11px] font-bold flex items-center gap-2">↗ +$1.24M this week</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">🏢</div>
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">↗ +1 this quarter</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Active Assets</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">3</h3>
            <p className="text-xs text-text-muted mt-2 font-medium">2 in funding · 1 fully funded</p>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl">👥</div>
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">↗ +12 this month</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Investors</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">148</h3>
            <p className="text-xs text-text-muted mt-2 font-medium">134 funded · 14 committed</p>
          </div>
        </div>
        
        <div className="bg-[#10B981] rounded-[32px] p-8 text-white shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-ui-card/20 text-white flex items-center justify-center text-xl">📈</div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Blended Yield</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">11.8%</h3>
            <p className="text-xs text-white/70 mt-2 font-medium">weighted avg across portfolio</p>
          </div>
          <div className="pt-4 border-t border-background/20">
            <span className="text-white text-[11px] font-bold flex items-center gap-2">↗ +0.3% vs last quarter</span>
          </div>
        </div>
        
        <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">🕒</div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Action</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Pending KYC</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">7</h3>
            <p className="text-xs text-amber-500 mt-2 font-medium">5 awaiting docs · 2 in review<br/><span className="text-red-500">3 overdue {'>'}5 days</span></p>
          </div>
        </div>
        
        <div className="bg-card border border-card-border rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-primary flex items-center justify-center text-xl">📅</div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Next Distribution</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">$186,400</h3>
            <p className="text-xs text-text-muted mt-2 font-medium">Scheduled May 01, 2026 · 148 investors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-card-border rounded-[40px] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Capital Velocity</h3>
              <p className="text-xs text-text-muted">Raised vs. committed capital — last 12 weeks</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]"></div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Raised</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Committed</span>
              </div>
            </div>
          </div>
          <div className="h-64 relative mt-8">
            <svg className="absolute inset-0 w-full h-full text-[#A855F7]" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,80 Q250,75 500,60 T1000,20" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#A855F7]/10 to-transparent"></div>
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-text-muted font-bold uppercase">
              {['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'].map(w => <span key={w}>{w}</span>)}
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-[40px] p-10 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-1">Recent Activity</h3>
          <p className="text-xs text-text-muted mb-8">Investor actions & compliance events</p>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Eleanor Hayes committed $150,000 to Peachtree Tower', time: '18 min ago', icon: '💰', color: 'bg-primary/10 text-primary' },
              { label: 'Priya Mehta KYC documents submitted for review', time: '2 hr ago', icon: '📄', color: 'bg-blue-500/10 text-blue-500' },
              { label: 'Q1 distribution of $92,000 queued for Summit Credit', time: '5 hr ago', icon: '📊', color: 'bg-green-500/10 text-green-500' },
              { label: 'OFAC screening flagged 1 name — manual review required', time: 'Yesterday', icon: '⚠️', color: 'bg-red-500/10 text-red-500' },
              { label: 'Chen Wei committed $200,000 to Summit Credit', time: 'Yesterday', icon: '💰', color: 'bg-primary/10 text-primary' }
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer hover:bg-surface p-2 -mx-2 rounded-xl transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm shadow-sm ${activity.color}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{activity.label}</p>
                  <p className="text-[10px] text-text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Asset Portfolio</h3>
          <p className="text-xs text-text-muted">4 assets · 3 active offerings</p>
        </div>
        <button className="px-6 py-2 bg-primary hover:bg-[#6D28D9] transition-colors text-white rounded-full text-[13px] font-bold">
          + New Asset
        </button>
      </div>
      <div className="space-y-4">
        {[
          { name: 'Peachtree Tower — Atlanta, GA', status: 'Live', tag: 'PTAT', val: '$12.5M', yield: '9.2%', investors: '62', reg: 'Reg D 506(c)', progress: 84, raised: '$4.20M', target: '$5.0M', color: 'bg-[#A855F7]' },
          { name: 'Summit Industrial Credit Facility', status: 'Live', tag: 'SICF', val: '$8.0M', yield: '11.5%', investors: '54', reg: 'Reg D 506(b)', progress: 85, raised: '$6.80M', target: '$8.0M', color: 'bg-[#818CF8]' },
          { name: 'Apex Data Center — Phoenix, AZ', status: 'Funded', tag: 'ADCP', val: '$22.0M', yield: '13.1%', investors: '32', reg: 'Reg S', progress: 100, raised: '$4.00M', target: '$4.0M', color: 'bg-[#10B981]' },
          { name: 'Crescent Gold Reserve Fund I', status: 'Draft', tag: 'CGRF', val: '$19.8M', yield: '—', investors: '0', reg: 'Pending', progress: 0, raised: '$0.00M', target: '$6.0M', color: 'bg-gray-400' }
        ].map((asset, i) => (
          <div key={i} className="bg-card border border-card-border rounded-3xl p-6 shadow-sm group cursor-pointer transition-colors hover:border-primary/20 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-lg">🏢</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{asset.name}</h4>
                    {asset.status === 'Live' ? (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold rounded-md border border-green-500/20">Live</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-surface text-text-muted text-[10px] font-bold rounded-md">{asset.status}</span>
                    )}
                    <span className="px-1.5 py-0.5 bg-surface border border-border text-text-muted text-[9px] font-bold rounded uppercase tracking-wider">{asset.tag}</span>
                  </div>
                  <p className="text-[11px] text-text-muted font-medium">Valuation: {asset.val} · Yield: <span className="text-foreground font-bold">{asset.yield}</span> · Investors: {asset.investors} · {asset.reg}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-foreground">{asset.progress}%</span>
                <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium text-text-muted w-24">{asset.raised} raised of {asset.target}</span>
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div className={`h-full ${asset.color}`} style={{ width: `${asset.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-green-500/20 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">7</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">KYC Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-amber-500/20 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-amber-500 text-amber-500 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-500">2</p>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-red-500/20 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-red-500 text-red-500 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">1</p>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Action Required</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 mt-8">
        <h3 className="text-lg font-bold text-foreground">Investor Registry</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search investors..." className="pl-9 pr-4 py-2 bg-card border border-card-border rounded-full text-xs outline-none focus:border-primary text-foreground w-64" />
          </div>
          <button className="px-4 py-2 bg-card border border-card-border hover:bg-surface transition-colors rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-card-border">
            <tr>
              {['Investor', 'KYC Status', 'Accreditation', 'Commitment', 'Asset', 'Jurisdiction', 'Source', 'Join Date'].map(h => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { init: 'EH', color: 'bg-purple-100 text-purple-600', name: 'Eleanor Hayes', email: 'e.hayes@thornfund.com', status: 'KYC Approved', acc: 'KYC Approved', val: '$150,000', asset: 'Peachtree Tower', jur: 'New York, US', source: 'Direct', date: '03/12/2026' },
              { init: 'MO', color: 'bg-blue-100 text-blue-600', name: 'Marcus Osei', email: 'm.osei@capitalgroup.com', status: 'KYC Approved', acc: 'KYC Approved', val: '$250,000', asset: 'Peachtree Tower', jur: 'California, US', source: 'Referral', date: '03/05/2026' },
              { init: 'YT', color: 'bg-indigo-100 text-indigo-600', name: 'Yuki Tanaka', email: 'y.tanaka@nomura-private.jp', status: 'KYC Approved', acc: 'KYC Approved', val: '$500,000', asset: 'Summit Credit', jur: 'Japan', source: 'Reg S', date: '02/18/2026' },
              { init: 'PM', color: 'bg-pink-100 text-pink-600', name: 'Priya Mehta', email: 'p.mehta@crescentfamily.com', status: 'KYC Pending', acc: 'KYC Pending', val: '$80,000', asset: 'Peachtree Tower', jur: 'Texas, US', source: 'Direct', date: '04/01/2026' },
              { init: 'RO', color: 'bg-teal-100 text-teal-600', name: 'Raymond Okafor', email: 'r.okafor@oakridge.io', status: 'KYC Approved', acc: 'KYC Approved', val: '$300,000', asset: 'Summit Credit', jur: 'Georgia, US', source: 'Platform', date: '02/28/2026' },
              { init: 'SL', color: 'bg-rose-100 text-rose-600', name: 'Sophia Lindqvist', email: 's.lindqvist@nordicvc.se', status: 'KYC Approved', acc: 'KYC Approved', val: '$400,000', asset: 'Apex Data Ctr', jur: 'Sweden', source: 'Reg S', date: '01/15/2026' }
            ].map((inv, i) => (
              <tr key={i} className="hover:bg-surface transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${inv.color}`}>{inv.init}</div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{inv.name}</p>
                      <p className="text-[10px] text-text-muted">{inv.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${inv.status.includes('Approved') ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-amber-500/20 text-amber-500 bg-amber-500/10'}`}>{inv.status}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${inv.acc.includes('Approved') ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-amber-500/20 text-amber-500 bg-amber-500/10'}`}>{inv.acc}</span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{inv.val}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.asset}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.jur}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{inv.source}</td>
                <td className="px-6 py-4 text-[11px] text-text-muted">{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCapTable = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Cap Table</h3>
          <p className="text-xs text-text-muted">10 investors · $2.41M invested · $119K distributed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search investor..." className="pl-9 pr-4 py-2 bg-card border border-card-border rounded-full text-xs outline-none focus:border-primary text-foreground w-64" />
          </div>
          <button className="px-4 py-2 bg-card border border-card-border hover:bg-surface transition-colors rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface border-b border-card-border">
            <tr>
              {['Investor', 'Asset / Token', 'Tokens', 'Ownership %', 'Invested', 'Distributions', 'Jurisdiction', 'Join Date', 'Status'].map(h => (
                <th key={h} className="px-6 py-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { init: 'YT', color: 'bg-[#1E1B4B] text-indigo-400', name: 'Yuki Tanaka', email: 'y.tanaka@nomura-private.jp', asset: 'Summit Credit', token: 'SICF', tokens: '5,000', own: 6.25, inv: '$500,000', dist: '$28,750', jur: 'Japan (Reg S)', date: '02/18/2026', status: 'Funded' },
              { init: 'SL', color: 'bg-[#4C1D95] text-purple-300', name: 'Sophia Lindqvist', email: 's.lindqvist@nordicvc.se', asset: 'Apex Data Ctr', token: 'ADCP', tokens: '4,000', own: 10.00, inv: '$400,000', dist: '$26,200', jur: 'Sweden (Reg S)', date: '01/15/2026', status: 'Funded' },
              { init: 'AD', color: 'bg-[#312E81] text-indigo-300', name: 'Amara Diallo', email: 'a.diallo@westlakeadv.com', asset: 'Apex Data Ctr', token: 'ADCP', tokens: '3,500', own: 8.75, inv: '$350,000', dist: '$22,925', jur: 'Illinois, US', date: '01/22/2026', status: 'Funded' },
              { init: 'RO', color: 'bg-[#581C87] text-purple-400', name: 'Raymond Okafor', email: 'r.okafor@oakridge.io', asset: 'Summit Credit', token: 'SICF', tokens: '3,000', own: 3.75, inv: '$300,000', dist: '$17,250', jur: 'Georgia, US', date: '02/28/2026', status: 'Funded' },
              { init: 'MO', color: 'bg-[#3B0764] text-purple-500', name: 'Marcus Osei', email: 'm.osei@capitalgroup.com', asset: 'Peachtree Tower', token: 'PTAT', tokens: '2,500', own: 5.00, inv: '$250,000', dist: '$11,500', jur: 'California, US', date: '03/05/2026', status: 'Funded' },
              { init: 'CW', color: 'bg-[#831843] text-pink-500', name: 'Chen Wei', email: 'c.wei@horizonasset.hk', asset: 'Summit Credit', token: 'SICF', tokens: '2,000', own: 2.50, inv: '$200,000', dist: '—', jur: 'Hong Kong (Reg S)', date: '04/10/2026', status: 'Committed' },
              { init: 'EH', color: 'bg-[#2E1065] text-violet-400', name: 'Eleanor Hayes', email: 'e.hayes@thornfund.com', asset: 'Peachtree Tower', token: 'PTAT', tokens: '1,500', own: 3.00, inv: '$150,000', dist: '$6,900', jur: 'New York, US', date: '03/12/2026', status: 'Funded' }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-surface transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${row.color}`}>{row.init}</div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{row.name}</p>
                      <p className="text-[10px] text-text-muted">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[12px] font-medium text-foreground mb-1">{row.asset}</p>
                  <span className="px-1.5 py-0.5 bg-surface border border-card-border text-text-muted text-[9px] font-bold rounded uppercase tracking-wider">{row.token}</span>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.tokens}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${row.own * 4}%` }}></div>
                    </div>
                    <span className="text-[12px] font-bold text-text-muted">{row.own.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{row.inv}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-green-500">{row.dist}</td>
                <td className="px-6 py-4 text-[12px] font-medium text-text-muted">{row.jur}</td>
                <td className="px-6 py-4 text-[11px] text-text-muted">{row.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.status === 'Funded' ? 'border-blue-500/20 text-blue-500 bg-blue-500/10' : 'border-primary/20 text-primary bg-primary/10'}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="p-10 bg-card border border-card-border rounded-[32px] shadow-sm text-center">
      <h3 className="text-lg font-bold text-foreground mb-2">Compliance Engine</h3>
      <p className="text-sm text-text-muted">Real-time OFAC and KYC monitoring active across all assets.</p>
    </div>
  );

  const renderDistributions = () => (
    <div className="p-10 bg-card border border-card-border rounded-[32px] shadow-sm text-center">
      <h3 className="text-lg font-bold text-foreground mb-2">Distributions</h3>
      <p className="text-sm text-text-muted">Yield calculation and payout engine.</p>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-10 bg-card border border-card-border rounded-[32px] shadow-sm text-center">
      <h3 className="text-lg font-bold text-foreground mb-2">Portfolio Analytics</h3>
      <p className="text-sm text-text-muted">Advanced performance metrics and risk analysis.</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <header className="-mx-6 mb-6 flex flex-col gap-3 border-b border-ui-border px-6 py-4 md:-mx-10 md:mb-8 md:flex md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-10 md:py-0 lg:mb-10">
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-row md:items-baseline md:gap-2.5">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">Issuer Dashboard</h1>
            <span className="truncate text-xs font-semibold text-primary">Crescent Capital Partners LLC</span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end md:gap-4">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Updated Apr 23, 2026 · 5:24 AM ET</span>
            </div>
            <div className="relative w-full min-w-0 md:w-auto md:max-w-[16rem]">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search investors, assets..."
                className="h-9 w-full rounded-full border border-card-border bg-card py-1.5 pl-9 pr-4 text-xs text-foreground outline-none focus:border-primary md:w-64"
              />
            </div>
          </div>
        </header>

        <div className="flex border-b border-border overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                activeTab === tab.id 
                  ? 'border-primary text-foreground font-bold' 
                  : 'border-transparent text-text-muted hover:text-foreground font-medium'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[13px]">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'assets' && renderAssets()}
          {activeTab === 'investors' && renderInvestors()}
          {activeTab === 'cap-table' && renderCapTable()}
          {activeTab === 'compliance' && renderCompliance()}
          {activeTab === 'distributions' && renderDistributions()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'ai-assistant' && (
            <div className="p-20 bg-surface rounded-[40px] text-center space-y-6">
              <div className="text-5xl">🤖</div>
              <h3 className="text-xl font-bold text-foreground">Institutional AI Assistant</h3>
              <p className="text-text-muted max-w-sm mx-auto">Analyze portfolio risk, generate compliance reports, and optimize offering structures with Maxtronize AI.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
