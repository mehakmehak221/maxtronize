'use client';

import React from 'react';

export type KpiIcon = React.ComponentType<{ className?: string }>;

export type KpiCard = {
  label: string;
  val: string;
  trend: string;
  sub: string;
  up: boolean;
  Icon: KpiIcon;
  well: string;
};

type OverviewKpiGridProps = {
  cards: KpiCard[];
};

export function OverviewKpiGrid({ cards }: OverviewKpiGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 2xl:grid-cols-4">
      {cards.map((stat) => (
        <article
          key={stat.label}
          className="card-lift flex flex-col rounded-[22px] border border-ui-border bg-ui-card p-6 shadow-[0_4px_28px_-12px_rgba(15,23,42,0.08)] md:rounded-3xl md:p-7 dark:shadow-[0_4px_28px_-12px_rgba(0,0,0,0.35)]"
        >
          <div className="mb-5 flex items-start justify-between gap-3 md:mb-6">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl md:h-12 md:w-12 ${stat.well}`}
            >
              <stat.Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" />
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none ${
                stat.up ? 'bg-ui-success-bg-soft text-ui-success-text' : 'bg-ui-danger-soft text-ui-danger-text'
              }`}
            >
              {stat.trend}
            </span>
          </div>

          <div className="flex flex-1 flex-col">
            <p className="min-h-[2.125rem] text-[11px] font-bold uppercase leading-[1.35] tracking-[0.13em] text-ui-faint md:min-h-[2.375rem] md:text-xs md:tracking-[0.14em]">
              {stat.label}
            </p>

            <p className="mt-2 text-[1.75rem] font-bold leading-none tracking-tight tabular-nums text-ui-strong md:mt-2.5 md:text-[1.875rem] lg:text-[2rem]">
              {stat.val}
            </p>

            <p className="mt-2 min-h-[2.375rem] text-[13px] font-medium leading-[1.45] text-ui-muted-text md:mt-2.5 md:min-h-[2.5rem]">
              {stat.sub}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
