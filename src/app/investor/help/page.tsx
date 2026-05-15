'use client';

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
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
import InvestorLayout from '@/components/InvestorLayout';

const iconStroke = 1.75;

type FaqCategory =
  | 'PLATFORM'
  | 'COMPLIANCE'
  | 'TECHNICAL'
  | 'YIELD'
  | 'PRICING'
  | 'TOKENS';

const FAQ_CATEGORY_STYLES: Record<FaqCategory, string> = {
  PLATFORM: 'border-primary/20 bg-primary/10 text-primary',
  COMPLIANCE: 'border-fuchsia-200/80 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/25 dark:bg-fuchsia-500/10 dark:text-fuchsia-400',
  TECHNICAL: 'border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-400',
  YIELD: 'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
  PRICING: 'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400',
  TOKENS: 'border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-400',
};

const TOPICS: { title: string; desc: string; Icon: LucideIcon; iconClass: string }[] = [
  {
    title: 'Getting Started',
    desc: '12 articles · Setup & onboarding guides',
    Icon: Zap,
    iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  },
  {
    title: 'Compliance & KYC',
    desc: '8 articles · Regulatory requirements',
    Icon: ShieldCheck,
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  },
  {
    title: 'Jurisdictions',
    desc: '5 articles · Global legal frameworks',
    Icon: Globe,
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  },
  {
    title: 'Tokenization Setup',
    desc: '9 articles · Technical configuration',
    Icon: Hexagon,
    iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  },
  {
    title: 'Investor Management',
    desc: '7 articles · Cap table & KYC tools',
    Icon: TrendingUp,
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  {
    title: 'Documents & Legal',
    desc: '14 articles · Legal document templates',
    Icon: FileText,
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
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
    a: 'Investors go through a multi-step KYC process including identity verification, accreditation checks, and AML screening. The process is powered by our compliance partners and typically takes 24–48 hours.',
  },
  {
    cat: 'TECHNICAL',
    q: 'Which blockchain networks are supported for token issuance?',
    a: 'We support Ethereum (ERC-20), Polygon, and select Layer-2 networks. The blockchain is selected during the tokenization setup process based on your jurisdictional and performance requirements.',
  },
  {
    cat: 'COMPLIANCE',
    q: 'What regulatory frameworks does the platform comply with?',
    a: 'Maxtronize is compliant with SEC Regulation D (506b/c), EU MiCA, MAS (Singapore), and FINMA (Switzerland). Our legal team continuously monitors regulatory changes across all supported jurisdictions.',
  },
  {
    cat: 'YIELD',
    q: 'How are yield distributions handled on-chain?',
    a: 'Yield distributions are automated via smart contracts. When income is received from the underlying asset, it is converted to stablecoins or native tokens and distributed proportionally to all token holders on the scheduled distribution date.',
  },
  {
    cat: 'PRICING',
    q: 'What fees does Maxtronize charge for tokenization?',
    a: 'Our fee structure includes a one-time tokenization setup fee, an annual platform fee, and a small transaction fee on secondary market trades. Contact our sales team for a customized quote based on asset size.',
  },
  {
    cat: 'TOKENS',
    q: 'Can investors trade their tokens on secondary markets?',
    a: 'Yes. Once an asset is in the secondary market phase, token holders can trade peer-to-peer through our integrated secondary market. All trades are settled on-chain with automated escrow protection and compliance checks.',
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
    iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    badge: {
      text: 'Online',
      className: 'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
  },
  {
    label: 'Email Support',
    sub: 'support@maxtronize.com',
    Icon: Mail,
    iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
    badge: {
      text: '24–48h',
      className: 'border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-400',
    },
  },
  {
    label: 'Schedule a Call',
    sub: 'Book with your account manager',
    Icon: Phone,
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  {
    label: 'Documentation',
    sub: 'Full developer & legal docs',
    Icon: BookOpen,
    iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  },
];

const TICKETS: {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  circleClass: string;
}[] = [
  {
    id: 'TK-3041',
    title: 'Investor onboarding delay — KYC verification',
    priority: 'HIGH',
    time: 'Updated 2 hours ago',
    circleClass: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  },
  {
    id: 'TK-3039',
    title: 'Token distribution schedule query',
    priority: 'MEDIUM',
    time: 'Updated 1 day ago',
    circleClass: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  },
  {
    id: 'TK-3036',
    title: 'SEC Reg D filing documentation needed',
    priority: 'LOW',
    time: 'Updated 3 days ago',
    circleClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  },
];

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: 'border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400',
  MEDIUM: 'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400',
  LOW: 'border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-400',
};

export default function InvestorHelpPage() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = FAQS.filter((faq) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q) || faq.cat.toLowerCase().includes(q);
  });

  return (
    <InvestorLayout pageTitle="Help Center">
      <div className="mx-auto w-full max-w-7xl space-y-8 md:space-y-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Help Center</h1>
          <p className="mt-1 text-sm font-medium text-ui-muted-text">
            Guides, FAQs, and dedicated support for your tokenization journey.
          </p>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2e1064] via-[#4c1d95] to-[#1d4ed8] p-8 text-center shadow-2xl ring-1 ring-white/10 md:rounded-[32px] md:p-14">
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-400/20 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-sky-400/20 blur-[90px]" aria-hidden />
          <div className="relative z-10 mx-auto max-w-3xl space-y-5">
            <p className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-200">
              <Sparkles className="h-4 w-4" strokeWidth={iconStroke} />
              Maxtronize Support
            </p>
            <h2 className="text-2xl font-bold text-white md:text-4xl">How can we help you?</h2>
            <p className="text-[13px] font-medium text-white/70 md:text-base">
              Search our knowledge base or browse categories below.
            </p>

            <div className="relative mx-auto max-w-2xl pt-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                strokeWidth={iconStroke}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search FAQs, guides, and documentation..."
                className="w-full rounded-2xl border border-white/15 bg-black/25 py-4 pl-11 pr-5 text-[13px] font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-white/30 focus:ring-4 focus:ring-white/10"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-3 text-[11px] font-bold uppercase tracking-widest text-white/55">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-white/70" strokeWidth={iconStroke} />
                61 articles
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-white/70" strokeWidth={iconStroke} />
                7 FAQ topics
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-white/70" strokeWidth={iconStroke} />
                Live support
              </span>
            </div>
          </div>
        </div>

        {/* Browse by Topic */}
        <section>
          <h2 className="mb-5 text-lg font-bold text-ui-strong">Browse by Topic</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => (
              <button
                key={topic.title}
                type="button"
                className="group flex items-center gap-4 rounded-[20px] border border-ui-border bg-ui-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-ui-border-strong hover:shadow-md md:rounded-[24px]"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${topic.iconClass}`}>
                  <topic.Icon className="h-5 w-5" strokeWidth={iconStroke} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                    {topic.title}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-ui-faint">{topic.desc}</p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-ui-placeholder transition-colors group-hover:text-primary"
                  strokeWidth={iconStroke}
                />
              </button>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="mb-5 text-lg font-bold text-ui-strong">Frequently Asked Questions</h2>
          <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[28px] dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
            {filteredFaqs.length === 0 ? (
              <p className="px-8 py-12 text-center text-[13px] font-medium text-ui-faint">
                No FAQs match your search. Try different keywords.
              </p>
            ) : (
              filteredFaqs.map((faq) => {
                const globalIndex = FAQS.indexOf(faq);
                const isOpen = activeFaq === globalIndex;
                return (
                  <div key={faq.q} className="border-b border-ui-divider last:border-0">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? -1 : globalIndex)}
                      className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-ui-muted-deep/50 md:gap-4 md:px-8 md:py-5"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded-md border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${FAQ_CATEGORY_STYLES[faq.cat]}`}
                      >
                        {faq.cat}
                      </span>
                      <p className="min-w-0 flex-1 text-[13px] font-bold leading-snug text-ui-strong">{faq.q}</p>
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-ui-faint transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        strokeWidth={iconStroke}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-ui-divider/80 px-5 pb-5 md:px-8 md:pb-6">
                        <p className="border-l-2 border-primary/30 pl-4 pt-4 text-[13px] font-medium leading-relaxed text-ui-muted-text md:pl-6">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Contact + Tickets */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-5 text-lg font-bold text-ui-strong">Contact Support</h2>
            <div className="space-y-3">
              {CONTACT_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className="group flex w-full items-center gap-4 rounded-[20px] border border-ui-border bg-ui-card p-4 text-left shadow-sm transition-all hover:border-ui-border-strong hover:shadow-md md:p-5"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${opt.iconClass}`}>
                    <opt.Icon className="h-5 w-5" strokeWidth={iconStroke} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                      {opt.label}
                    </p>
                    <p className="truncate text-[11px] font-medium text-ui-faint">{opt.sub}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {opt.badge ? (
                      <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${opt.badge.className}`}>
                        {opt.badge.text}
                      </span>
                    ) : null}
                    <ExternalLink
                      className="h-4 w-4 text-ui-placeholder transition-colors group-hover:text-primary"
                      strokeWidth={iconStroke}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-ui-strong">My Support Tickets</h2>
                <p className="mt-0.5 text-[12px] font-medium text-ui-faint">Recent support requests</p>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1 self-start text-[12px] font-bold text-primary transition-colors hover:text-primary/80"
              >
                New Ticket
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={iconStroke} />
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[28px] dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]">
              <div className="divide-y divide-ui-divider">
                {TICKETS.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    className="group flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-ui-muted-deep/50 md:px-6"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ticket.circleClass}`}
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={iconStroke} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                        {ticket.title}
                      </p>
                      <p className="text-[10px] font-medium text-ui-faint">
                        {ticket.id} · {ticket.time}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-[8px] font-bold uppercase ${PRIORITY_STYLES[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-ui-placeholder" strokeWidth={iconStroke} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-violet-100 bg-violet-50/80 p-4 dark:border-violet-900/40 dark:bg-violet-950/30 md:flex-row md:items-center md:justify-between md:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    SC
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-ui-strong">Sarah Chen · Dedicated Account Manager</p>
                    <p className="text-[10px] font-medium text-ui-faint">
                      Available Mon–Fri, 9AM–6PM CET · Priority response
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="self-start rounded-xl border-2 border-primary bg-ui-card px-4 py-2.5 text-[11px] font-bold text-primary shadow-sm transition-colors hover:bg-primary/5 md:self-center"
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </InvestorLayout>
  );
}
