'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function HelpCenterPage() {
  const [activeFaq, setActiveFaq] = useState(0);

  const topics = [
    { title: 'Getting Started', desc: '12 articles · Setup & onboarding guides', icon: '⚡' },
    { title: 'Compliance & KYC', desc: '8 articles · Regulatory requirements', icon: '🛡️' },
    { title: 'Jurisdictions', desc: '15 articles · Global legal frameworks', icon: '🌐' },
    { title: 'Tokenization Setup', desc: '10 articles · Technical configuration', icon: '⚙️' },
    { title: 'Investor Management', desc: '7 articles · Cap table & KYC flows', icon: '👥' },
    { title: 'Documents & Legal', desc: '9 articles · Legal document templates', icon: '📄' },
  ];

  const faqs = [
    { 
      cat: 'PLATFORM', 
      q: 'What types of real-world assets can be tokenized on Maxtronize?', 
      a: 'Maxtronize supports a wide range of asset classes including commercial and residential real estate, private equity funds, infrastructure projects, commodities, art & collectibles, and more. Each asset undergoes a compliance review before listing to ensure it meets the jurisdictional requirements.'
    },
    { cat: 'COMPLIANCE', q: 'How does investor KYC and accreditation verification work?', a: 'Investors undergo a rigorous KYC/AML process and accreditation verification tailored to their jurisdiction.' },
    { cat: 'TECHNICAL', q: 'Which blockchain networks are supported for token issuance?', a: 'Ethereum, Polygon, and Algorand are currently supported for institutional issuance.' },
    { cat: 'COMPLIANCE', q: 'What regulatory frameworks does the platform comply with?', a: 'We comply with Reg D, Reg S, MiCA, and MAS frameworks among others.' },
    { cat: 'YIELD', q: 'How are yield distributions handled on-chain?', a: 'Distributions are automated via smart contracts and paid out in stablecoins or fiat.' },
    { cat: 'PRICING', q: 'What fees does Maxtronize charge for tokenization?', a: 'Our fees are structured based on asset value and offering complexity.' },
    { cat: 'TOKENS', q: 'Can investors trade their tokens on secondary markets?', a: 'Yes, tokens can be listed on Maxtronize-approved secondary trading venues.' },
  ];

  const contactOptions = [
    { label: 'Live Chat', sub: 'Response within 5 minutes', status: 'Online', icon: '💬' },
    { label: 'Email Support', sub: 'support@maxtronize.com', status: '24-48h', icon: '✉️' },
    { label: 'Schedule a Call', sub: 'Book with your account manager', status: null, icon: '📞' },
    { label: 'Documentation', sub: 'Full developer & legal docs', status: null, icon: '📖' },
  ];

  const tickets = [
    { id: 'TKT-2041', title: 'Investor onboarding delay — KYC verification', priority: 'HIGH', priorityColor: 'bg-rose-50 text-rose-600 border-rose-100', time: 'Updated 2 hours ago' },
    { id: 'TKT-2038', title: 'Token distribution schedule query', priority: 'MEDIUM', priorityColor: 'bg-amber-50 text-amber-600 border-amber-100', time: 'Updated 1 day ago' },
    { id: 'TKT-2035', title: 'SEC Reg D filing documentation needed', priority: 'LOW', priorityColor: 'bg-blue-50 text-blue-600 border-blue-100', time: 'Updated 2 days ago' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-ui-strong">Help Center</h1>
          <p className="text-sm text-ui-faint font-medium">Guides, FAQs, and dedicated support for your tokenization journey.</p>
        </div>

        {/* Search Hero */}
        <div className="bg-[#1A1A2E] rounded-[32px] md:rounded-[48px] p-8 md:p-16 text-white text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
           <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
             <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px]">Maxtronize Support</p>
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How can we help you?</h2>
             <p className="text-lg text-white/60 font-medium">Search our knowledge base or browse categories below.</p>
             <div className="relative group mt-10">
               <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Search FAQs, guides, and documentation..." 
                 className="w-full pl-16 pr-8 py-6 bg-ui-card/5 border border-background/10 rounded-[24px] text-lg font-medium outline-none focus:bg-ui-input-focus/10 focus:border-primary/40 transition-all backdrop-blur-xl"
               />
             </div>
             <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[11px] font-bold text-white/40 uppercase tracking-widest pt-4">
                <span className="flex items-center gap-2"><span className="text-white">📄</span> 61 articles</span>
                <span className="flex items-center gap-2"><span className="text-white">💬</span> 7 FAQ topics</span>
                <span className="flex items-center gap-2"><span className="text-white">✨</span> Live support</span>
             </div>
           </div>
        </div>

        {/* Browse Topics */}
        <div className="space-y-8">
           <h3 className="text-sm font-bold text-ui-strong px-2 uppercase tracking-widest">Browse by Topic</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, i) => (
                <div key={i} className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-ui-muted-deep flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">{topic.icon}</div>
                    <div>
                      <h4 className="text-[13px] font-bold text-ui-strong mb-1">{topic.title}</h4>
                      <p className="text-[11px] text-ui-faint font-medium">{topic.desc}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-200 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              ))}
           </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <h3 className="text-sm font-bold text-ui-strong px-2 uppercase tracking-widest">Frequently Asked Questions</h3>
          <div className="bg-ui-card border border-ui-border rounded-[40px] shadow-sm overflow-hidden">
             {faqs.map((faq, i) => (
               <div key={i} className="border-b border-ui-divider last:border-0">
                 <button 
                   onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                   className="w-full px-5 md:px-10 py-6 md:py-8 flex items-center justify-between group"
                 >
                    <div className="flex items-start md:items-center gap-3 md:gap-6 flex-wrap">
                      <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[9px] font-bold border border-primary/10 uppercase tracking-widest">{faq.cat}</span>
                      <span className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors text-left">{faq.q}</span>
                   </div>
                   <svg className={`w-5 h-5 text-ui-placeholder transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                 </button>
                 {activeFaq === i && (
                   <div className="px-10 pb-10 pt-2 animate-in slide-in-from-top-4 duration-300">
                      <p className="text-[13px] text-ui-muted-text font-medium leading-relaxed max-w-4xl border-l-2 border-primary/10 pl-4 md:pl-6 ml-0 md:ml-16">
                       {faq.a}
                     </p>
                   </div>
                 )}
               </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact & Support */}
          <div className="space-y-8">
             <h3 className="text-sm font-bold text-ui-strong px-2 uppercase tracking-widest">Contact Support</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactOptions.map((opt, i) => (
                  <div key={i} className="bg-ui-card border border-ui-border rounded-[32px] p-8 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                       <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">{opt.icon}</div>
                       {opt.status && (
                         <span className={`px-2 py-1 rounded-full text-[9px] font-bold border ${opt.status === 'Online' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-ui-muted-deep text-ui-muted-text border-ui-border'}`}>
                           {opt.status}
                         </span>
                       )}
                       {!opt.status && <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-ui-strong mb-1">{opt.label}</h4>
                      <p className="text-[11px] text-ui-faint font-medium">{opt.sub}</p>
                    </div>
                  </div>
                ))}
             </div>

             <div className="bg-gradient-to-br from-primary-deep to-primary rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-mesh opacity-20"></div>
                <div className="relative z-10 flex items-center gap-8">
                   <div className="w-16 h-16 rounded-full border-2 border-background/20 p-1 shrink-0">
                      <div className="w-full h-full rounded-full bg-ui-card relative overflow-hidden">
                         <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary">SC</span>
                      </div>
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold">Sarah Chen</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-ui-card/10 rounded-full">Dedicated Account Manager</span>
                      </div>
                      <p className="text-[12px] text-white/60 mb-4">Available Mon-Fri 9 AM-6 PM CET · Priority response</p>
                      <button className="px-6 py-2.5 bg-ui-card text-primary rounded-xl text-[11px] font-bold shadow-lg hover:scale-105 transition-transform">Schedule Call</button>
                   </div>
                </div>
             </div>
          </div>

          {/* Tickets */}
          <div className="space-y-8">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-sm font-bold text-ui-strong uppercase tracking-widest">My Support Tickets</h3>
               <button className="text-primary text-[11px] font-bold hover:underline">New Ticket ↗</button>
             </div>
             <div className="bg-ui-card border border-ui-border rounded-[40px] shadow-sm overflow-hidden p-4 space-y-4">
                {tickets.map((t, i) => (
                  <div key={i} className="p-8 bg-ui-muted-surface hover:bg-ui-card hover:shadow-md border border-transparent hover:border-ui-border rounded-[32px] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                          <p className="text-[11px] font-bold text-ui-faint tracking-wider">{t.id}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${t.priorityColor}`}>{t.priority}</span>
                    </div>
                    <h4 className="text-sm font-bold text-ui-strong group-hover:text-primary transition-colors mb-2">{t.title}</h4>
                    <p className="text-[11px] text-ui-faint font-medium">{t.time}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
