'use client';

import React, { useState, type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import {
  AnalyticsTargetIcon,
  Document,
  FeaturedStarOutlineIcon,
  Help,
  OverviewKpiInvestors,
  PendingIcon,
  ReturnIcon,
  SecondaryMarket,
  SuccessIcon,
  WalletPolygonIcon,
  WalletTransferIcon,
} from '@/app/VectorImages';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

export default function InvestorHelpPage() {
  const [search, setSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-0');

  const topics: {
    title: string;
    sub: string;
    Icon: NavSvg;
    iconRing: string;
  }[] = [
    { title: 'Getting Started', sub: '12 articles · Setup & onboarding guides', Icon: ReturnIcon, iconRing: 'bg-primary/10 text-primary' },
    {
      title: 'Compliance & KYC',
      sub: '8 articles · Regulatory requirements',
      Icon: AnalyticsTargetIcon,
      iconRing: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      title: 'Jurisdictions',
      sub: '5 articles · Global legal frameworks',
      Icon: WalletPolygonIcon,
      iconRing: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
    },
    {
      title: 'Tokenization Setup',
      sub: '9 articles · Technical configuration',
      Icon: SecondaryMarket,
      iconRing: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    },
    {
      title: 'Investor Management',
      sub: '7 articles · Cap table & KYC tools',
      Icon: OverviewKpiInvestors,
      iconRing: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      title: 'Documents & Legal',
      sub: '14 articles · Legal document templates',
      Icon: Document,
      iconRing: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
  ];

  const faqs: {
    id: string;
    tag: string;
    tagClass: string;
    q: string;
    a: string;
  }[] = [
    {
      id: 'faq-0',
      tag: 'PLATFORM',
      tagClass: 'bg-primary/10 text-primary border border-primary/15',
      q: 'What types of real-world assets can be tokenized on Maxtronize?',
      a: 'Maxtronize supports a wide range of asset classes including commercial and residential real estate, private equity funds, infrastructure projects, commodities, art & collectibles, and more. Each asset undergoes a compliance review before listing to ensure it meets the jurisdictional requirements.',
    },
    {
      id: 'faq-1',
      tag: 'COMPLIANCE',
      tagClass: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 dark:bg-fuchsia-950/35 dark:text-fuchsia-300 dark:border-fuchsia-900/50',
      q: 'How does investor KYC and accreditation verification work?',
      a: 'Investors go through a multi-step KYC process including identity verification, accreditation checks, and AML screening. The process is powered by our compliance partners and typically takes 24–48 hours.',
    },
    {
      id: 'faq-2',
      tag: 'TECHNICAL',
      tagClass: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      q: 'Which blockchain networks are supported for token issuance?',
      a: 'We support Ethereum (ERC-20), Polygon, and select Layer-2 networks. The blockchain is selected during the tokenization setup process based on your jurisdictional and performance requirements.',
    },
    {
      id: 'faq-3',
      tag: 'COMPLIANCE',
      tagClass: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 dark:bg-fuchsia-950/35 dark:text-fuchsia-300 dark:border-fuchsia-900/50',
      q: 'What regulatory frameworks does the platform comply with?',
      a: 'Maxtronize is compliant with SEC Regulation D (506b/c), EU MiCA, MAS (Singapore), and FINMA (Switzerland). Our legal team continuously monitors regulatory changes across all supported jurisdictions.',
    },
    {
      id: 'faq-4',
      tag: 'YIELD',
      tagClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/35 dark:text-emerald-300 dark:border-emerald-900/50',
      q: 'How are yield distributions handled on-chain?',
      a: 'Yield distributions are automated via smart contracts. When income is received from the underlying asset, it is converted to stablecoins or native tokens and distributed proportionally to all token holders on the scheduled distribution date.',
    },
    {
      id: 'faq-5',
      tag: 'PRICING',
      tagClass: 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/35 dark:text-amber-300 dark:border-amber-900/50',
      q: 'What fees does Maxtronize charge for tokenization?',
      a: 'Our fee structure includes a one-time tokenization setup fee, an annual platform fee, and a small transaction fee on secondary market trades. Contact our sales team for a customized quote based on asset size.',
    },
    {
      id: 'faq-6',
      tag: 'TOKENS',
      tagClass: 'bg-violet-50 text-violet-700 border border-violet-100 dark:bg-violet-950/35 dark:text-violet-300 dark:border-violet-900/50',
      q: 'Can investors trade their tokens on secondary markets?',
      a: 'Yes. Once an asset is in the secondary market phase, token holders can trade peer-to-peer through our integrated secondary market. All trades are settled on-chain with automated escrow protection and compliance checks.',
    },
  ];

  const contacts: {
    title: string;
    sub: string;
    Icon: NavSvg | React.FC<{ className?: string }>;
    iconRing: string;
    badge?: string;
    badgeClass?: string;
  }[] = [
    {
      title: 'Live Chat',
      sub: 'Response within 5 minutes',
      Icon: ChatBubbleIcon,
      iconRing: 'bg-ui-muted-deep text-primary',
      badge: 'Online',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      title: 'Email Support',
      sub: 'support@maxtronize.com',
      Icon: MailIcon,
      iconRing: 'bg-ui-muted-deep text-ui-body',
      badge: '24–48h',
      badgeClass: 'bg-ui-muted-deep text-ui-muted-text border border-ui-border',
    },
    {
      title: 'Schedule a Call',
      sub: 'Book with your account manager',
      Icon: PhoneIcon,
      iconRing: 'bg-ui-muted-deep text-ui-body',
    },
    {
      title: 'Documentation',
      sub: 'Full developer & legal docs',
      Icon: BookOpenIcon,
      iconRing: 'bg-ui-muted-deep text-ui-body',
    },
  ];

  const tickets: {
    id: string;
    title: string;
    ticketId: string;
    updated: string;
    priority: string;
    priorityClass: string;
    rowIcon: 'pending' | 'progress' | 'resolved';
  }[] = [
    {
      id: 't1',
      title: 'Investor onboarding delay — KYC verification',
      ticketId: 'TK-3041',
      updated: 'Updated 2 hours ago',
      priority: 'HIGH',
      priorityClass: 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-300',
      rowIcon: 'pending',
    },
    {
      id: 't2',
      title: 'Token distribution schedule query',
      ticketId: 'TK-3039',
      updated: 'Updated 1 day ago',
      priority: 'MEDIUM',
      priorityClass: 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-300',
      rowIcon: 'progress',
    },
    {
      id: 't3',
      title: 'SEC Reg D filing documentation needed',
      ticketId: 'TK-3036',
      updated: 'Updated 3 days ago',
      priority: 'LOW',
      priorityClass: 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-300',
      rowIcon: 'resolved',
    },
  ];

  const filteredFaqs = search
    ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  function TicketRowIcon({ kind }: { kind: 'pending' | 'progress' | 'resolved' }) {
    const wrap = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl';
    if (kind === 'pending') {
      return (
        <div className={`${wrap} bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400`}>
          <PendingIcon className="h-4 w-4" />
        </div>
      );
    }
    if (kind === 'progress') {
      return (
        <div className={`${wrap} bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400`}>
          <WalletTransferIcon className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className={`${wrap} bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400`}>
        <SuccessIcon className="h-4 w-4" />
      </div>
    );
  }

  return (
    <InvestorLayout pageTitle="Help Center">
      <div className="space-y-8 animate-in fade-in duration-700 md:space-y-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-4xl">Help Center</h1>
          <p className="mt-1 text-sm font-medium text-ui-faint">
            Guides, FAQs, and dedicated support for your tokenization journey.
          </p>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#2e1064] via-[#4c1d95] to-[#1d4ed8] p-8 text-center shadow-2xl ring-1 ring-white/10 md:rounded-[32px] md:p-14">
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-400/20 blur-[100px]" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-sky-400/20 blur-[90px]" />
          <div className="relative z-10 mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-center gap-2 text-white/80">
              <FeaturedStarOutlineIcon className="h-4 w-4 shrink-0 text-white" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Maxtronize Support</span>
            </div>
            <h2 className="text-2xl font-bold text-white md:text-4xl">How can we help you?</h2>
            <p className="text-[13px] font-medium text-white/70">
              Search our knowledge base or browse categories below.
            </p>

            <div className="relative mx-auto max-w-2xl pt-1">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="search"
                placeholder="Search FAQs, guides, and documentation..."
                className="w-full rounded-2xl border border-white/15 bg-black/25 py-4 pl-11 pr-5 text-[13px] font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-white/30 focus:ring-4 focus:ring-white/10"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-3 text-[11px] font-medium text-white/70">
              <span className="inline-flex items-center gap-2">
                <Document className="h-4 w-4 shrink-0 text-white/90" />
                61 articles
              </span>
              <span className="inline-flex items-center gap-2">
                <Help className="h-4 w-4 shrink-0 text-white/90" />
                7 FAQ topics
              </span>
              <span className="inline-flex items-center gap-2">
                <ChatBubbleIcon className="h-4 w-4 shrink-0 text-white/90" />
                Live support
              </span>
            </div>
          </div>
        </div>

        {/* Browse by Topic */}
        <section>
          <h2 className="mb-5 text-lg font-bold text-ui-strong">Browse by Topic</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <button
                key={i}
                type="button"
                className="group flex items-center gap-4 rounded-[20px] border border-ui-border bg-ui-card p-5 text-left shadow-sm transition-all hover:border-ui-border-strong hover:shadow-md md:rounded-[24px]"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t.iconRing}`}>
                  <t.Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">{t.title}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-ui-faint">{t.sub}</p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-ui-placeholder transition-colors group-hover:text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="mb-5 text-lg font-bold text-ui-strong">Frequently Asked Questions</h2>
          <div className="divide-y divide-ui-divider overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[28px]">
            {filteredFaqs.map(faq => {
              const open = openFaqId === faq.id;
              return (
                <div key={faq.id} className="group">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(open ? null : faq.id)}
                    className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-ui-muted-surface md:gap-4 md:px-8 md:py-5"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${faq.tagClass}`}
                    >
                      {faq.tag}
                    </span>
                    <p className="min-w-0 flex-1 text-[13px] font-bold leading-snug text-ui-strong transition-colors group-hover:text-primary">
                      {faq.q}
                    </p>
                    <svg
                      className={`mt-1 h-4 w-4 shrink-0 text-ui-faint transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {open && (
                    <div className="animate-in fade-in slide-in-from-top-1 border-t border-ui-divider/80 px-5 pb-5 duration-200 md:px-8">
                      <p className="border-l-2 border-primary/30 pl-4 pt-4 text-[13px] font-medium leading-relaxed text-ui-muted-text md:pl-6">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredFaqs.length === 0 && (
              <div className="px-8 py-12 text-center">
                <p className="text-[13px] font-medium text-ui-faint">No FAQs match your search. Try different keywords.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact + Tickets */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-5 text-lg font-bold text-ui-strong">Contact Support</h2>
            <div className="space-y-3">
              {contacts.map((c, i) => {
                const Icon = c.Icon;
                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    className="group flex cursor-pointer items-center gap-4 rounded-[20px] border border-ui-border bg-ui-card p-4 shadow-sm transition-all hover:border-ui-border-strong hover:shadow-md md:p-5"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.iconRing}`}>
                      <Icon className="h-5 w-5 text-current" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">{c.title}</p>
                      <p className="truncate text-[11px] font-medium text-ui-faint">{c.sub}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {c.badge ? (
                        <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${c.badgeClass}`}>{c.badge}</span>
                      ) : null}
                      <svg
                        className="h-4 w-4 text-ui-placeholder transition-colors group-hover:text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
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
                className="inline-flex shrink-0 items-center gap-1.5 self-start text-[12px] font-bold text-primary transition-colors hover:gap-2"
              >
                New Ticket
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-ui-border bg-ui-card shadow-sm md:rounded-[28px]">
              <div className="divide-y divide-ui-divider">
                {tickets.map(t => (
                  <div
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    className="group flex cursor-pointer items-center gap-3 px-4 py-4 transition-colors hover:bg-ui-muted-deep/50 md:px-6"
                  >
                    <TicketRowIcon kind={t.rowIcon} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-ui-strong transition-colors group-hover:text-primary">{t.title}</p>
                      <p className="text-[10px] font-medium text-ui-faint">
                        {t.ticketId} · {t.updated}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[8px] font-bold uppercase ${t.priorityClass}`}>{t.priority}</span>
                      <svg className="h-3.5 w-3.5 text-ui-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-violet-100 bg-violet-50/80 p-4 dark:border-violet-900/40 dark:bg-violet-950/30 md:flex-row md:items-center md:justify-between md:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    SC
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-ui-strong">Sarah Chen · Dedicated Account Manager</p>
                    <p className="text-[10px] font-medium text-ui-faint">Available Mon–Fri, 9AM–6PM CET · Priority response</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="self-start rounded-xl border-2 border-primary bg-ui-card px-4 py-2.5 text-[11px] font-bold text-primary shadow-sm transition-colors hover:bg-primary/5 dark:bg-ui-elevated dark:hover:bg-primary/10 md:self-center"
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
