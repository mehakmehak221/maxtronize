'use client';

import React, { useState } from 'react';
import InvestorLayout from '@/components/InvestorLayout';

export default function InvestorHelpPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const topics = [
    { title: 'Getting Started', sub: '12 articles · Setup & onboarding guides', icon: '⚡', iconBg: 'bg-primary/10 text-primary' },
    { title: 'Compliance & KYC', sub: '8 articles · Regulatory requirements', icon: '🛡️', iconBg: 'bg-blue-50 text-blue-500' },
    { title: 'Jurisdictions', sub: '5 articles · Global legal frameworks', icon: '🌐', iconBg: 'bg-purple-50 text-purple-500' },
    { title: 'Tokenization Setup', sub: '9 articles · Technical configuration', icon: '⚙️', iconBg: 'bg-ui-muted-deep text-ui-body' },
    { title: 'Investor Management', sub: '7 articles · Cap table & KYC tools', icon: '👥', iconBg: 'bg-green-50 text-green-500' },
    { title: 'Documents & Legal', sub: '14 articles · Legal document templates', icon: '📄', iconBg: 'bg-amber-50 text-amber-600' },
  ];

  const faqs = [
    {
      tag: 'PLATFORM', tagColor: 'bg-primary/10 text-primary',
      q: 'What types of real-world assets can be tokenized on Maxtronize?',
      a: 'Maxtronize supports a wide range of asset classes including commercial and residential real estate, private equity funds, infrastructure projects, commodities, art & collectibles, and more. Each asset undergoes a compliance review before listing to ensure it meets the jurisdictional requirements.',
    },
    {
      tag: 'COMPLIANCE', tagColor: 'bg-blue-50 text-blue-500',
      q: 'How does investor KYC and accreditation verification work?',
      a: 'Investors go through a multi-step KYC process including identity verification, accreditation checks, and AML screening. The process is powered by our compliance partners and typically takes 24–48 hours.',
    },
    {
      tag: 'TECHNICAL', tagColor: 'bg-ui-muted-deep text-ui-body',
      q: 'Which blockchain networks are supported for token issuance?',
      a: 'We support Ethereum (ERC-20), Polygon, and select Layer-2 networks. The blockchain is selected during the tokenization setup process based on your jurisdictional and performance requirements.',
    },
    {
      tag: 'COMPLIANCE', tagColor: 'bg-blue-50 text-blue-500',
      q: 'What regulatory frameworks does the platform comply with?',
      a: 'Maxtronize is compliant with SEC Regulation D (506b/c), EU MiCA, MAS (Singapore), and FINMA (Switzerland). Our legal team continuously monitors regulatory changes across all supported jurisdictions.',
    },
    {
      tag: 'YIELD', tagColor: 'bg-green-50 text-green-600',
      q: 'How are yield distributions handled on-chain?',
      a: 'Yield distributions are automated via smart contracts. When income is received from the underlying asset, it is converted to stablecoins or native tokens and distributed proportionally to all token holders on the scheduled distribution date.',
    },
    {
      tag: 'PRICING', tagColor: 'bg-amber-50 text-amber-600',
      q: 'What fees does Maxtronize charge for tokenization?',
      a: 'Our fee structure includes a one-time tokenization setup fee, an annual platform fee, and a small transaction fee on secondary market trades. Contact our sales team for a customized quote based on asset size.',
    },
    {
      tag: 'TOKENS', tagColor: 'bg-purple-50 text-purple-500',
      q: 'Can investors trade their tokens on secondary markets?',
      a: 'Yes. Once an asset is in the secondary market phase, token holders can trade peer-to-peer through our integrated secondary market. All trades are settled on-chain with automated escrow protection and compliance checks.',
    },
  ];

  const contacts = [
    { title: 'Live Chat', sub: 'Response within 5 minutes', icon: '💬', badge: 'Online', badgeColor: 'bg-green-100 text-green-600' },
    { title: 'Email Support', sub: 'support@maxtronize.com', icon: '✉️', badge: '24–48h', badgeColor: 'bg-ui-muted-deep text-ui-muted-text' },
    { title: 'Schedule a Call', sub: 'Book with your account manager', icon: '📞', badge: '', badgeColor: '' },
    { title: 'Documentation', sub: 'Full developer & legal docs', icon: '📚', badge: '', badgeColor: '' },
  ];

  const tickets = [
    { title: 'Investor onboarding delay — KYC verification', id: 'TK-3041', updated: 'Updated 2 hours ago', priority: 'HIGH', priorityColor: 'bg-rose-100 text-rose-600', icon: '⏳', iconBg: 'bg-amber-50 text-amber-500' },
    { title: 'Token distribution schedule query', id: 'TK-3039', updated: 'Updated 1 day ago', priority: 'MEDIUM', priorityColor: 'bg-amber-100 text-amber-600', icon: '⚡', iconBg: 'bg-purple-50 text-purple-500' },
    { title: 'SEC Reg D filing documentation needed', id: 'TK-3036', updated: 'Updated 3 days ago', priority: 'LOW', priorityColor: 'bg-ui-muted-deep text-ui-muted-text', icon: '✅', iconBg: 'bg-green-50 text-green-500' },
  ];

  const filteredFaqs = search ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) : faqs;

  return (
    <InvestorLayout pageTitle="Help Center">
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Help Center</h1>
          <p className="text-sm text-ui-faint mt-1 font-medium">Guides, FAQs, and dedicated support for your tokenization journey.</p>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-[#1A1A2E] rounded-[24px] md:rounded-[32px] p-8 md:p-14 text-center shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/25 rounded-full blur-[120px]" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-center gap-2 text-white/60">
              <span>✨</span>
              <span className="text-[11px] font-bold uppercase tracking-widest">Maxtronize Support</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">How can we help you?</h2>
            <p className="text-white/50 text-[13px] font-medium">Search our knowledge base or browse categories below.</p>

            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search FAQs, guides, and documentation..."
                className="w-full pl-11 pr-6 py-4 bg-ui-card/10 border border-background/15 rounded-2xl text-[13px] font-medium text-white placeholder:text-white/30 outline-none focus:ring-4 focus:ring-white/10 backdrop-blur-sm transition-all"
              />
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              {[['📄', '8 articles'], ['❓', '7 FAQ topics'], ['💬', 'Live support']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-white/40 text-[11px] font-medium">
                  <span className="text-base">{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Browse by Topic */}
        <div>
          <h2 className="text-[13px] font-bold text-ui-body mb-4">Browse by Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t, i) => (
              <button key={i} className="bg-ui-card border border-ui-border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all text-left group flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${t.iconBg}`}>{t.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors">{t.title}</p>
                  <p className="text-[10px] text-ui-faint font-medium mt-0.5">{t.sub}</p>
                </div>
                <svg className="w-4 h-4 text-ui-placeholder group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-[13px] font-bold text-ui-body mb-4">Frequently Asked Questions</h2>
          <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden divide-y divide-ui-divider">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="group">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-3 px-5 md:px-8 py-4 md:py-5 text-left hover:bg-ui-muted-surface transition-colors"
                >
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shrink-0 ${faq.tagColor}`}>{faq.tag}</span>
                  <p className="flex-1 text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors">{faq.q}</p>
                  <svg
                    className={`w-4 h-4 text-ui-faint shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 md:px-8 pb-5 ml-0 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="pl-0 md:pl-16 border-l-2 border-primary/20 pl-4">
                      <p className="text-[13px] text-ui-muted-text font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="px-8 py-10 text-center">
                <p className="text-[13px] text-ui-faint font-medium">No FAQs match your search. Try different keywords.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support + Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Contact */}
          <div>
            <h2 className="text-[13px] font-bold text-ui-body mb-4">Contact Support</h2>
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div key={i} className="bg-ui-card border border-ui-border rounded-[20px] p-4 md:p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-ui-muted-deep flex items-center justify-center text-xl shrink-0 group-hover:bg-primary/5 transition-colors">{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-ui-strong group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-[11px] text-ui-faint font-medium truncate">{c.sub}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.badge && <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.badgeColor}`}>{c.badge}</span>}
                    <svg className="w-4 h-4 text-ui-placeholder group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Support Tickets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-bold text-ui-body">My Support Tickets</h2>
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:gap-2.5 transition-all">
                Recent support requests
                <span className="px-2 py-0.5 bg-primary text-white rounded text-[9px] font-bold">New Ticket</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="bg-ui-card border border-ui-border rounded-[20px] md:rounded-[28px] shadow-sm overflow-hidden">
              <div className="divide-y divide-ui-divider">
                {tickets.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 md:px-6 py-4 hover:bg-ui-muted-deep/40 transition-colors group cursor-pointer">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${t.iconBg}`}>{t.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-ui-strong group-hover:text-primary transition-colors truncate">{t.title}</p>
                      <p className="text-[10px] text-ui-faint font-medium">{t.id} · {t.updated}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${t.priorityColor}`}>{t.priority}</span>
                      <svg className="w-3.5 h-3.5 text-ui-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Account Manager */}
              <div className="p-4 md:p-5 border-t border-ui-divider bg-primary/3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">SC</div>
                  <div>
                    <p className="text-[12px] font-bold text-primary">Sarah Chen · Dedicated Account Manager</p>
                    <p className="text-[10px] text-ui-faint font-medium">Available Mon–Fri, 9AM–6PM CET · Priority response</p>
                  </div>
                </div>
                <button className="self-start sm:self-auto px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all shrink-0">
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </InvestorLayout>
  );
}
