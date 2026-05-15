'use client';

import { Check } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import InvestorLayout from '@/components/InvestorLayout';
import { BuildingIcon, FeaturedStarOutlineIcon, InvestorHub } from '@/app/VectorImages';

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.659 9.32799C13.6518 8.3552 14.6579 7.18919 14.6579 5.66338C14.6579 4.69147 14.2718 3.75936 13.5845 3.07212C12.8973 2.38487 11.9652 1.99878 10.9933 1.99878C9.82059 1.99878 8.99439 2.33193 7.99495 3.33136C6.99551 2.33193 6.16931 1.99878 4.99664 1.99878C4.02472 1.99878 3.09262 2.38487 2.40537 3.07212C1.71812 3.75936 1.33203 4.69147 1.33203 5.66338C1.33203 7.19585 2.33147 8.36186 3.33091 9.32799L7.99495 13.992L12.659 9.32799Z" stroke="#45556C" stroke-width="1.33258" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H9M17 7v8" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('');

  const featured = [
    {
      id: 'ponyc',
      name: 'Prime Manhattan Office',
      type: 'Commercial Property',
      location: 'New York, NY',
      apy: '8.2%',
      minInv: '$25K',
      raised: 4.1,
      target: 5.0,
      pct: 82,
      investors: 164,
      daysLeft: 12,
      tags: ['KYC Required', 'Accredited Only'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop',
      emoji: <InvestorHub className="h-4 w-4" />,
      iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
    },
    {
      id: 'sfatx',
      name: 'Texas Renewable Energy',
      type: 'Renewable Energy',
      location: 'Austin, TX',
      apy: '13.2%',
      minInv: '$10K',
      raised: 1.9,
      target: 2.5,
      pct: 75,
      investors: 187,
      daysLeft: 8,
      tags: ['ESG Certified'],
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80&auto=format&fit=crop',
      emoji: <BuildingIcon className="h-4 w-4" />,
    },
    {
      id: 'nvdc',
      name: 'Northern Virginia Data Co.',
      type: 'Infrastructure',
      location: 'Ashburn, VA',
      apy: '10.5%',
      minInv: '$50K',
      raised: 6.8,
      target: 8.0,
      pct: 85,
      investors: 136,
      daysLeft: 5,
      tags: ['High Demand', 'Tech Sector'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop',
      emoji: <InvestorHub className="h-4 w-4" />,
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300',
    },
  ];

  const allOpps = [
    { id: 'hppe', name: 'Harbor Ports PE Fund', type: 'Private Equity', location: 'Singapore', apy: '15.5%', minInv: '$100K', pct: 68, icon: '🌐', iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300' },
    { id: 'cmrf', name: 'Copper Mining Royalty Fund', type: 'Commodities', location: 'Chile', apy: '11.8%', minInv: '$15K', pct: 55, icon: '⛏️', iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300' },
    { id: 'rivr', name: 'Riviera Residences', type: 'Real Estate', location: 'Monaco', apy: '7.4%', minInv: '$250K', pct: 40, icon: '🏖️', iconBg: 'bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-300' },
    { id: 'logde', name: 'Logistics Hub DE', type: 'Infrastructure', location: 'Frankfurt, DE', apy: '9.1%', minInv: '$20K', pct: 91, icon: '🏭', iconBg: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
    { id: 'alp', name: 'Alpine Art Collection', type: 'Art & Collectibles', location: 'Zurich, CH', apy: '6.8%', minInv: '$50K', pct: 30, icon: '🎨', iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' },
  ];

  return (
    <InvestorLayout pageTitle="Primary Marketplace">
      <div className="mx-auto w-full max-w-7xl space-y-5 animate-in fade-in duration-700 sm:space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ui-strong md:text-3xl lg:text-4xl">
              Primary Marketplace
            </h1>
            <p className="mt-1 text-sm font-medium text-ui-faint md:text-[15px]">
              Discover new investment opportunities across multiple asset classes
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-[12px] font-bold text-ui-muted-text">
              Available opportunities: <span className="text-ui-strong">8</span>
            </span>
          </div>
        </div>

        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-faint"
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
            placeholder="Search by name, type, or location..."
            className="w-full rounded-2xl border border-ui-border bg-ui-card py-3.5 pl-11 pr-6 text-sm font-medium shadow-sm outline-none transition-all focus:ring-4 focus:ring-primary/5 md:py-4 md:text-[15px]"
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="w-full shrink-0 lg:w-[240px] lg:max-w-[35%] xl:w-64 2xl:w-72">
            <div className="space-y-4 rounded-[20px] border border-ui-border bg-ui-card p-5 shadow-sm lg:sticky lg:top-20 lg:space-y-5 lg:rounded-[24px] lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ui-strong">Filters</h3>
                <button type="button" className="text-xs font-bold text-primary hover:underline">
                  Clear all
                </button>
              </div>
              {[
                { title: 'Asset Type', items: ['Real Estate', 'Private Credit', 'Commodities', 'Energy', 'Infrastructure'] },
                { title: 'Risk Level', items: ['Conservative', 'Moderate', 'Aggressive'] },
                {
                  title: 'Minimum Investment',
                  items: ['Up to $10,000', '$10,000 – $25,000', '$25,000 – $50,000', 'Above $50,000'],
                },
              ].map(section => (
                <div key={section.title} className="space-y-2.5 border-t border-ui-divider pt-4 md:space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint md:text-[11px]">
                    {section.title}
                  </p>
                  {section.items.map(item => (
                    <label key={item} className="group flex min-h-[40px] cursor-pointer items-center gap-3 md:min-h-[44px]">
                      <input
                        type="checkbox"
                        className="sr-only"
                        defaultChecked={
                          section.title === 'Asset Type'
                            ? ['Real Estate', 'Private Credit', 'Commodities'].includes(item)
                            : section.title === 'Risk Level'
                              ? ['Conservative', 'Moderate'].includes(item)
                              : false
                        }
                      />
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ui-border bg-ui-card transition-colors group-has-[:checked]:border-primary group-has-[:checked]:bg-primary group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-primary/30 md:h-5 md:w-5">
                        <Check
                          className="h-3 w-3 text-white opacity-0 transition-opacity group-has-[:checked]:opacity-100 md:h-3.5 md:w-3.5"
                          strokeWidth={3}
                          aria-hidden
                        />
                      </span>
                      <span className="text-[13px] font-medium leading-snug text-ui-body md:text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              ))}

              <div className="-mx-1 mt-2 space-y-4 rounded-2xl bg-primary p-5 text-white">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <FeaturedStarOutlineIcon className="h-4 w-4 shrink-0 text-white" />
                  Marketplace Stats
                </p>
                {[
                  ['Total Raised (30d)', '$14.2M'],
                  ['New Listings', '12'],
                  ['Avg. APY', '9.8%'],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-white/70">{l}</span>
                    <span className="text-[11px] font-bold tabular-nums">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-10">
            <section>
              <h2 className="mb-5 flex items-center gap-2.5 text-lg font-bold text-ui-strong md:text-xl">
                <FeaturedStarOutlineIcon className="h-5 w-5 shrink-0 text-[#FE9A00] md:h-6 md:w-6" aria-hidden />
                Featured Opportunities
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 2xl:grid-cols-3">
                {featured.map(opp => (
                  <article
                    key={opp.id}
                    className="card-lift group flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-ui-border bg-ui-card shadow-sm md:rounded-[24px]"
                  >
                    <div className="relative h-40 shrink-0 overflow-hidden sm:h-44 md:h-40 lg:h-44 xl:h-48">
                      <Image
                        src={opp.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" aria-hidden />

                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-[#FE9A00] px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
                        <InvestorHub className="h-3.5 w-3.5 shrink-0 text-white" />
                        Featured
                      </div>

                      <button
                        type="button"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-md transition-colors hover:text-rose-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-rose-400"
                        aria-label="Save listing"
                      >
                        <HeartOutlineIcon className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-5.5rem)] items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold text-ui-strong shadow-sm backdrop-blur-sm dark:bg-zinc-900/95 dark:text-zinc-100">
                        <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                        <span className="truncate">{opp.location}</span>
                      </div>

                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                        <CheckIcon className="h-3 w-3 stroke-[2.5]" />
                        Verified
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <div className="mb-3 flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${opp.iconBg}`}
                        >
                          {opp.emoji}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold leading-snug text-ui-strong md:text-[15px]">{opp.name}</h3>
                          <p className="text-xs text-ui-faint">{opp.type}</p>
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {opp.tags.map(t => (
                          <span
                            key={t}
                            className="rounded-md border border-ui-border bg-ui-card px-2 py-0.5 text-[10px] font-bold text-ui-muted-text"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">APY</p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{opp.apy}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">Min. Investment</p>
                          <p className="text-lg font-bold text-ui-strong">{opp.minInv}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="mb-1.5 flex justify-between gap-2 text-[10px]">
                          <span className="truncate text-ui-faint">
                            ${opp.raised}M raised of ${opp.target}M
                          </span>
                          <span className="shrink-0 font-bold text-primary">{opp.pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${opp.pct}%` }} />
                        </div>
                      </div>

                      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-ui-faint md:gap-4">
                          <span className="flex items-center gap-1.5">
                            <UsersIcon className="h-4 w-4 text-ui-placeholder" />
                            {opp.investors}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <ClockIcon className="h-4 w-4 text-ui-placeholder" />
                            {opp.daysLeft} days
                          </span>
                        </div>
                        <Link
                          href="/investor/asset-detail"
                          className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 sm:w-auto md:py-2"
                        >
                          Invest
                          <ArrowUpRightIcon className="h-3.5 w-3.5 text-white" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-ui-strong md:text-xl">All Opportunities</h2>
                <span className="text-[11px] font-medium text-ui-faint">{allOpps.length} listings</span>
              </div>
              <div className="space-y-3">
                {allOpps.map(opp => (
                  <div
                    key={opp.id}
                    className="group flex flex-col gap-4 rounded-[20px] border border-ui-border bg-ui-card p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${opp.iconBg}`}
                    >
                      {opp.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">
                            {opp.name}
                          </h3>
                          <p className="text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                            {opp.type} · {opp.location}
                          </p>
                        </div>
                        <div className="grid shrink-0 grid-cols-3 gap-6">
                          {[
                            ['APY', opp.apy, 'text-emerald-600 dark:text-emerald-400'],
                            ['Min. Inv.', opp.minInv, 'text-ui-strong'],
                            ['Filled', `${opp.pct}%`, 'text-ui-strong'],
                          ].map(([l, v, c]) => (
                            <div key={String(l)} className="text-center sm:text-right">
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ui-faint">{l}</p>
                              <p className={`text-sm font-bold ${c}`}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${opp.pct}%` }} />
                      </div>
                    </div>
                    <Link
                      href="/investor/asset-detail"
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-primary/20 sm:self-center"
                    >
                      Invest
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
