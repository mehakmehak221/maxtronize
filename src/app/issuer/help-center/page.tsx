'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Hexagon,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const iconStroke = 1.75;

type FaqCategory =
  | 'PLATFORM'
  | 'COMPLIANCE'
  | 'TECHNICAL'
  | 'YIELD'
  | 'PRICING'
  | 'TOKENS';

const FAQ_CATEGORY_STYLES: Record<FaqCategory, string> = {
  PLATFORM: 'border-app-status-purple-border bg-app-status-purple-bg text-app-status-purple-fg',
  COMPLIANCE: 'border-violet-100 bg-violet-50/80 text-violet-600',
  TECHNICAL: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-300',
  YIELD: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg',
  PRICING: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300',
  TOKENS: 'border-app-status-warn-border bg-app-status-warn-bg text-app-status-warn-fg',
};

const TOPICS: {
  title: string;
  desc: string;
  Icon: LucideIcon;
  iconClass: string;
}[] = [
  {
    title: 'Getting Started',
    desc: '12 articles · Setup & onboarding guides',
    Icon: Zap,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
  {
    title: 'Compliance & KYC',
    desc: '8 articles · Regulatory requirements',
    Icon: ShieldCheck,
    iconClass: 'bg-sky-100 text-sky-600',
  },
  {
    title: 'Jurisdictions',
    desc: '15 articles · Global legal frameworks',
    Icon: Globe,
    iconClass: 'bg-sky-100 text-sky-600',
  },
  {
    title: 'Tokenization Setup',
    desc: '10 articles · Technical configuration',
    Icon: Hexagon,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
  },
  {
    title: 'Investor Management',
    desc: '7 articles · Cap table & KYC flows',
    Icon: TrendingUp,
    iconClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Documents & Legal',
    desc: '9 articles · Legal document templates',
    Icon: FileText,
    iconClass: 'bg-amber-100 text-amber-600',
  },
];

const FAQS: { cat: FaqCategory; q: string; a: string }[] = [
  {
    cat: 'PLATFORM',
    q: 'What types of real-world assets can be tokenized on Maxtronize?',
    a: 'Maxtronize supports a wide range of asset classes including commercial and residential real estate, private equity funds, infrastructure projects, commodities, art & collectibles, and more. Each asset undergoes a compliance review before listing to ensure it meets the jurisdictional requirements.',
  },
  {
    cat: 'COMPLIANCE',
    q: 'How does investor KYC and accreditation verification work?',
    a: 'Investors undergo a rigorous KYC/AML process and accreditation verification tailored to their jurisdiction, with document upload, identity checks, and ongoing monitoring integrated into the issuer dashboard.',
  },
  {
    cat: 'TECHNICAL',
    q: 'Which blockchain networks are supported for token issuance?',
    a: 'Ethereum, Polygon, and Algorand are currently supported for institutional issuance, with multi-chain bridging available for cross-network distribution.',
  },
  {
    cat: 'COMPLIANCE',
    q: 'What regulatory frameworks does the platform comply with?',
    a: 'We comply with Reg D, Reg S, MiCA, and MAS frameworks among others, with jurisdiction-specific disclosure packs available for each offering.',
  },
  {
    cat: 'YIELD',
    q: 'How are yield distributions handled on-chain?',
    a: 'Distributions are automated via smart contracts and paid out in stablecoins or fiat, with full audit trails visible in the Yield dashboard.',
  },
  {
    cat: 'PRICING',
    q: 'What fees does Maxtronize charge for tokenization?',
    a: 'Our fees are structured based on asset value and offering complexity, including setup, compliance, and ongoing platform fees disclosed upfront in your term sheet.',
  },
  {
    cat: 'TOKENS',
    q: 'Can investors trade their tokens on secondary markets?',
    a: 'Yes, tokens can be listed on Maxtronize-approved secondary trading venues subject to transfer restrictions and regulatory lock-up periods.',
  },
];

const CONTACT_OPTIONS: {
  label: string;
  sub: string;
  Icon: LucideIcon;
  iconClass: string;
  badge?: { text: string; className: string };
}[] = [
  {
    label: 'Live Chat',
    sub: 'Response within 5 minutes',
    Icon: MessageSquare,
    iconClass: 'bg-violet-100 text-[#7C3AED]',
    badge: { text: 'Online', className: 'border-app-status-success-border bg-app-status-success-bg text-app-status-success-fg' },
  },
  {
    label: 'Email Support',
    sub: 'support@maxtronize.com',
    Icon: Mail,
    iconClass: 'bg-sky-100 text-sky-600',
    badge: { text: '24-48h', className: 'border-ui-border bg-ui-muted-deep text-ui-muted-text' },
  },
  {
    label: 'Schedule a Call',
    sub: 'Book with your account manager',
    Icon: Phone,
    iconClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    label: 'Documentation',
    sub: 'Full developer & legal docs',
    Icon: BookOpen,
    iconClass: 'bg-amber-100 text-amber-600',
  },
];

const TICKETS: {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  status: 'open' | 'resolved';
}[] = [
  {
    id: 'TKT-2041',
    title: 'Investor onboarding delay — KYC verification',
    priority: 'HIGH',
    time: 'Updated 2 hours ago',
    status: 'open',
  },
  {
    id: 'TKT-2038',
    title: 'Token distribution schedule query',
    priority: 'MEDIUM',
    time: 'Updated 1 day ago',
    status: 'resolved',
  },
  {
    id: 'TKT-2035',
    title: 'SEC Reg D filing documentation needed',
    priority: 'LOW',
    time: 'Updated 3 days ago',
    status: 'resolved',
  },
];

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300',
  MEDIUM: 'border-app-status-warn-border bg-app-status-warn-bg text-app-status-warn-fg',
  LOW: 'border-ui-border bg-ui-muted-deep text-ui-muted-text',
};

export default function HelpCenterPage() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = FAQS.filter((faq) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q) || faq.cat.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout>
      <div className="animate-page-enter mx-auto w-full max-w-7xl min-w-0 space-y-6 sm:space-y-8 xl:space-y-12">
        <div className="animate-slide-up space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong sm:text-3xl xl:text-4xl">Help Center</h1>
          <p className="text-sm font-medium text-ui-muted-text">
            Guides, FAQs, and dedicated support for your tokenization journey.
          </p>
        </div>

        {/* Hero search */}
        <div className="animate-slide-up delay-100 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E0A3C] via-[#2D1260] to-[#0F172A] p-5 text-center sm:rounded-3xl sm:p-8 md:px-10 md:py-12 xl:rounded-[32px] xl:px-12 xl:py-14">
         
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#9810FA]/30 blur-[100px]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <p className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-300">
              <Sparkles className="h-4 w-4" strokeWidth={iconStroke} />
              Maxtronize Support
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl xl:text-5xl">How can we help you?</h2>
            <p className="text-base font-medium text-violet-200/80 md:text-lg">
              Search our knowledge base or browse categories below.
            </p>

            <div className="relative pt-2">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40"
                strokeWidth={iconStroke}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs, guides, and documentation..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-14 pr-5 text-[15px] font-medium text-white placeholder:text-white/40 outline-none backdrop-blur-md transition-colors focus:border-violet-400/50 focus:bg-white/15"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-white/70" strokeWidth={iconStroke} />
                61 articles
              </span>
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-white/70" strokeWidth={iconStroke} />
                7 FAQ topics
              </span>
            </div>
          </div>
        </div>

        {/* Browse by topic */}
        <div className="space-y-5">
          <h3 className="px-1 text-[13px] font-bold uppercase tracking-widest text-ui-muted-text">Browse by Topic</h3>
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {TOPICS.map((topic) => {
              const Icon = topic.Icon;
              return (
                <button
                  key={topic.title}
                  type="button"
                  className="group flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-ui-border bg-ui-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-8px_rgba(15,23,42,0.12)] sm:gap-4 sm:rounded-[20px] sm:p-5 xl:p-6"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${topic.iconClass}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={iconStroke} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-bold text-ui-strong">{topic.title}</h4>
                      <p className="mt-0.5 line-clamp-2 text-[12px] font-medium text-ui-faint">{topic.desc}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-[#D1D5DB] transition-colors group-hover:text-[#7C3AED]"
                    strokeWidth={iconStroke}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-5">
          <h3 className="px-1 text-[13px] font-bold uppercase tracking-widest text-ui-muted-text">
            Frequently Asked Questions
          </h3>
          <div className="overflow-hidden rounded-2xl border border-ui-border bg-ui-card shadow-sm sm:rounded-3xl xl:rounded-[24px]">
            {filteredFaqs.length === 0 ? (
              <p className="px-8 py-12 text-center text-[13px] font-medium text-ui-faint">No FAQs match your search.</p>
            ) : (
              filteredFaqs.map((faq, i) => {
                const globalIndex = FAQS.indexOf(faq);
                const isOpen = activeFaq === globalIndex;
                return (
                  <div key={faq.q} className="border-b border-ui-divider last:border-0">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? -1 : globalIndex)}
                      className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-ui-muted sm:gap-4 sm:px-5 sm:py-5 md:px-8 md:py-6"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4 md:items-center md:gap-5">
                        <span
                          className={`inline-flex w-fit shrink-0 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${FAQ_CATEGORY_STYLES[faq.cat]}`}
                        >
                          {faq.cat}
                        </span>
                        <span className="text-[13px] font-bold leading-snug text-ui-strong md:text-[14px]">{faq.q}</span>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-ui-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        strokeWidth={iconStroke}
                      />
                    </button>
                    {isOpen && (
                      <div className="animate-in fade-in px-5 pb-6 duration-200 md:px-8 md:pb-8">
                        <p className="max-w-3xl border-l-2 border-violet-200 pl-4 text-[13px] font-medium leading-relaxed text-ui-body md:ml-[calc(5rem+0.75rem)] md:pl-6">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact + Tickets */}
        <div className="grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-10">
          {/* Contact Support */}
          <div className="space-y-5">
            <h3 className="px-1 text-[13px] font-bold uppercase tracking-widest text-ui-muted-text">Contact Support</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONTACT_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-ui-border bg-ui-card p-4 text-left shadow-sm transition-all hover:shadow-md sm:rounded-[20px] sm:p-5 md:p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${opt.iconClass}`}>
                        <Icon className="h-5 w-5" strokeWidth={iconStroke} />
                      </div>
                      <div className="flex items-center gap-2">
                        {opt.badge && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${opt.badge.className}`}
                          >
                            {opt.badge.text}
                          </span>
                        )}
                        <ExternalLink
                          className="h-4 w-4 text-[#D1D5DB] transition-colors group-hover:text-[#7C3AED]"
                          strokeWidth={iconStroke}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-ui-strong">{opt.label}</h4>
                      <p className="mt-0.5 text-[11px] font-medium text-ui-faint">{opt.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* My Support Tickets */}
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-ui-muted-text">My Support Tickets</h3>
              <button
                type="button"
                className="flex items-center gap-0.5 text-[12px] font-bold text-[#7C3AED] hover:text-[#6D28D9]"
              >
                New Ticket
                <ChevronRight className="h-4 w-4" strokeWidth={iconStroke} />
              </button>
            </div>

            <div className="space-y-3">
              {TICKETS.map((ticket) => (
                <div
                  key={ticket.id}
                  className="cursor-pointer rounded-2xl border border-ui-border bg-ui-muted p-4 transition-all hover:border-ui-border hover:bg-ui-card hover:shadow-sm sm:rounded-[20px] sm:p-5 md:p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          ticket.status === 'open'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {ticket.status === 'open' ? (
                          <Clock className="h-4 w-4" strokeWidth={iconStroke} />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" strokeWidth={iconStroke} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-bold leading-snug text-ui-strong">{ticket.title}</h4>
                        <p className="mt-2 text-[11px] font-medium text-ui-faint">
                          {ticket.id} · {ticket.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Account manager */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9810FA] to-[#4F39F6] p-5 text-white shadow-[0_16px_40px_-12px_rgba(152,16,250,0.45)] sm:rounded-3xl sm:p-6 md:p-8 xl:rounded-[24px]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 text-lg font-bold">
                  SC
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold">Sarah Chen</h4>
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/90">
                      Dedicated Account Manager
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-white/70">
                    Available Mon–Fri 9 AM–6 PM CET · Priority response
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-xl bg-ui-card px-5 py-2.5 text-[11px] font-bold text-[#7C3AED] shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
