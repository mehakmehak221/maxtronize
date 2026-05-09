'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function CompliancePage() {
  const requirements = [
    { name: 'SEC Reg D Filing', status: 'Compliant', date: 'Oct 12, 2049', type: 'Regulatory' },
    { name: 'KYC/AML Policy', status: 'Compliant', date: 'Aug 05, 2049', type: 'Internal' },
    { name: 'Smart Contract Audit', status: 'In Review', date: 'Oct 24, 2049', type: 'Technical' },
    { name: 'OFAC Sanctions List', status: 'Compliant', date: 'Real-time', type: 'Global' },
    { name: 'Privacy Policy (GDPR)', status: 'Compliant', date: 'Jan 20, 2049', type: 'Legal' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Compliance</h1>
            <p className="text-ui-faint font-medium">Real-time regulatory monitoring and filing status.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-bold flex items-center gap-2 border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                Systems Operational
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: 'Overall Status', val: '94%', sub: 'Health Score', icon: '🛡️', color: 'text-primary bg-primary/5' },
             { label: 'Active Filings', val: '12', sub: 'Last 30 days', icon: '📄', color: 'text-blue-500 bg-blue-50' },
             { label: 'Risk Alerts', val: '0', sub: 'No active threats', icon: '⚠️', color: 'text-green-500 bg-green-50' }
           ].map((stat, i) => (
             <div key={i} className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${stat.color}`}>{stat.icon}</div>
                <div>
                   <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-3xl font-bold text-ui-strong mb-2">{stat.val}</p>
                   <p className="text-xs text-ui-faint font-medium">{stat.sub}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-ui-card border border-ui-border rounded-[24px] md:rounded-[40px] shadow-sm overflow-hidden">
           <div className="p-10 border-b border-ui-divider flex items-center justify-between">
              <h3 className="text-lg font-bold text-ui-strong">Compliance Ledger</h3>
              <button className="text-[11px] font-bold text-primary uppercase tracking-widest">Download Report</button>
           </div>
           <div className="overflow-x-auto"><table className="w-full text-left">
              <thead className="bg-ui-muted-surface border-b border-ui-divider">
                 <tr>
                    {['Requirement', 'Type', 'Last Sync', 'Status'].map(h => (
                      <th key={h} className="px-10 py-5 text-[10px] font-bold text-ui-faint uppercase tracking-widest">{h}</th>
                    ))}
                 </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                 {requirements.map((r, i) => (
                   <tr key={i} className="hover:bg-ui-muted-surface transition-colors">
                      <td className="px-10 py-6 text-[13px] font-bold text-ui-strong">{r.name}</td>
                      <td className="px-10 py-6">
                         <span className="px-3 py-1 bg-ui-muted-deep text-ui-muted-text rounded-full text-[9px] font-bold uppercase tracking-wider">{r.type}</span>
                      </td>
                      <td className="px-10 py-6 text-[11px] text-ui-faint font-medium">{r.date}</td>
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'Compliant' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            <span className={`text-[11px] font-bold ${r.status === 'Compliant' ? 'text-green-600' : 'text-orange-600'}`}>{r.status}</span>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table></div>
        </div>

        <div className="p-6 md:p-10 bg-[#1A1A2E] rounded-[24px] md:rounded-[40px] text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-mesh opacity-20"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                 <h3 className="text-xl md:text-2xl font-bold tracking-tight">Need regulatory legal advice?</h3>
                 <p className="text-white/50 text-sm max-w-lg">Maxtronize partners with top-tier legal firms across 12 jurisdictions to ensure your tokenized assets remain fully compliant.</p>
              </div>
              <button className="px-10 py-4 bg-primary text-white rounded-[18px] text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all shrink-0">
                 Speak with a Compliance Specialist
              </button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
