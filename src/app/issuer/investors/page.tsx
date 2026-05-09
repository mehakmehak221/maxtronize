'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Image from 'next/image';

const investorsData = [
  { id: 1, name: 'Eleanor Hayes', email: 'eleanor@hayescap.com', type: 'Accredited', status: 'Approved', investment: '$450,000', assets: 3, lastActive: '2 hours ago' },
  { id: 2, name: 'Marcus Osei', email: 'marcus.osei@gmail.com', type: 'Qualified Purchaser', status: 'Approved', investment: '$1,200,000', assets: 5, lastActive: '5 mins ago' },
  { id: 3, name: 'Sarah Jenkins', email: 'sarah@jenkins.co', type: 'Accredited', status: 'Pending', investment: '$150,000', assets: 1, lastActive: '1 day ago' },
  { id: 4, name: 'David Chen', email: 'd.chen@chenfamily.office', type: 'Institutional', status: 'Approved', investment: '$3,500,000', assets: 12, lastActive: '12 mins ago' },
  { id: 5, name: 'Amara Okafor', email: 'amara@okafor.dev', type: 'Accredited', status: 'Action Required', investment: '$50,000', assets: 0, lastActive: '3 days ago' },
];

export default function InvestorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Investors</h1>
            <p className="text-ui-faint font-medium">Manage your institutional and accredited investor base.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-ui-card border border-ui-border rounded-xl text-[13px] font-bold text-ui-strong shadow-sm hover:bg-ui-muted-deep transition-all flex items-center gap-2">
              <span>📥</span> Export List
            </button>
            <button className="px-6 py-3 bg-primary text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2">
              <span>➕</span> Invite Investor
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Total Investors', val: '1,284', trend: '+12%', color: 'text-primary' },
            { label: 'Active Capital', val: '$94.2M', trend: '+$4.1M', color: 'text-green-600' },
            { label: 'Pending KYC', val: '42', trend: '-5', color: 'text-orange-500' },
            { label: 'Avg. Ticket Size', val: '$73.3K', trend: '+8%', color: 'text-purple-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm group hover:border-primary/20 transition-all">
              <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-ui-strong tracking-tight">{stat.val}</h3>
                <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? stat.color : 'text-ui-faint'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-ui-divider flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ui-faint">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name, email, or type..." 
                className="w-full pl-12 pr-6 py-3 bg-ui-muted-deep border border-transparent rounded-xl text-[13px] font-medium outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all text-ui-strong"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-ui-muted-deep border border-transparent rounded-lg text-xs font-bold text-ui-muted-text outline-none">
                <option>All Status</option>
                <option>Approved</option>
                <option>Pending</option>
              </select>
              <select className="px-4 py-2 bg-ui-muted-deep border border-transparent rounded-lg text-xs font-bold text-ui-muted-text outline-none">
                <option>All Types</option>
                <option>Accredited</option>
                <option>Institutional</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto"><table className="w-full text-left min-w-[700px]">
            <thead className="bg-ui-muted-surface border-b border-ui-divider">
              <tr>
                {['Investor', 'Type', 'Status', 'Active Assets', 'Total Investment', 'Last Active', ''].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-divider">
              {investorsData.map((inv) => (
                <tr key={inv.id} className="group hover:bg-ui-muted-surface transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs border border-primary/10">
                        {inv.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-ui-strong">{inv.name}</p>
                        <p className="text-[10px] text-ui-faint font-medium">{inv.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-ui-muted-deep text-ui-body rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        inv.status === 'Approved' ? 'bg-green-500' : inv.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-[11px] font-bold ${
                        inv.status === 'Approved' ? 'text-green-600' : inv.status === 'Pending' ? 'text-orange-600' : 'text-red-600'
                      }`}>{inv.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[13px] font-bold text-ui-strong">{inv.assets} Assets</td>
                  <td className="px-8 py-6 text-[13px] font-bold text-ui-strong">{inv.investment}</td>
                  <td className="px-8 py-6 text-[11px] text-ui-faint font-medium">{inv.lastActive}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-ui-placeholder hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>

          <div className="p-8 border-t border-ui-divider bg-ui-muted-deep/20 flex items-center justify-between">
            <p className="text-[11px] text-ui-faint font-medium">Showing 5 of 1,284 investors</p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-ui-card border border-ui-border rounded-lg text-ui-faint disabled:opacity-50">←</button>
              <button className="w-8 h-8 bg-primary text-white rounded-lg text-[11px] font-bold shadow-sm">1</button>
              <button className="w-8 h-8 bg-ui-card border border-ui-border rounded-lg text-[11px] font-bold text-ui-faint">2</button>
              <button className="w-8 h-8 bg-ui-card border border-ui-border rounded-lg text-[11px] font-bold text-ui-faint">3</button>
              <button className="p-2 bg-ui-card border border-ui-border rounded-lg text-ui-faint">→</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
