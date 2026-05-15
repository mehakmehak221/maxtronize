'use client';

import { ArrowUpRight } from 'lucide-react';
import React from 'react';

const iconStroke = 1.75;

export type HeroIcon = React.ComponentType<{ className?: string; strokeWidth?: number }>;

export type HeroBadge = {
  type: 'positive' | 'neutral';
  text: string;
};

export type HeroPillar = {
  label: string;
  value: string;
  Icon: HeroIcon;
};

export type HeroToken = {
  sym: string;
  ch: string;
  Icon?: HeroIcon;
  /** When set, renders a colored dot instead of an icon. */
  dotClass?: string;
};

export type OverviewHeroProps = {
  greeting: string;
  date: string;
  value: string;
  subtitle: string;
  badges: HeroBadge[];
  pillars: HeroPillar[];
  tokens: HeroToken[];
  /** Issuer dashboard uses a deeper indigo gradient. */
  variant?: 'default' | 'issuer';
};

const sectionGradients = {
  default: 'from-[#2e1065] via-[#4c1d95] to-[#5b21b6]',
  issuer: 'from-[#312e81] via-[#4c1d95] to-[#581c87]',
} as const;

export function OverviewHero({
  greeting,
  date,
  value,
  subtitle,
  badges,
  pillars,
  tokens,
  variant = 'default',
}: OverviewHeroProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${sectionGradients[variant]} p-5 text-white shadow-[0_28px_64px_-24px_rgba(49,46,129,0.55)] ring-1 ring-white/10 sm:rounded-[24px] sm:p-6 md:p-8 lg:rounded-[32px] lg:p-11`}
    >
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.06]" aria-hidden />
      <div
        className="pointer-events-none absolute -right-12 top-0 h-64 w-64 rounded-full bg-violet-400/25 blur-[100px] sm:-right-16 sm:h-80 sm:w-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-indigo-400/20 blur-[90px] sm:h-56 sm:w-56"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-stretch xl:gap-10">
        <div className="min-w-0 flex-1 space-y-4 sm:space-y-5 md:space-y-6">
          <p className="text-[9px] font-bold uppercase leading-relaxed tracking-[0.16em] text-white/45 sm:text-[10px] sm:tracking-[0.2em] md:text-[11px]">
            <span className="block sm:inline">{greeting}</span>
            <span className="mx-1.5 hidden text-white/30 sm:inline" aria-hidden>
              ·
            </span>
            <span className="block text-white/40 sm:inline sm:text-white/45">{date}</span>
          </p>

          <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
            <h1 className="text-[2rem] font-bold leading-[1.05] tracking-tight tabular-nums sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
              {value}
            </h1>
            <p className="max-w-lg text-[13px] font-medium leading-relaxed text-white/55 sm:text-sm md:text-[15px]">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2.5 md:gap-3">
            {badges.map((badge) =>
              badge.type === 'positive' ? (
                <div
                  key={badge.text}
                  className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-emerald-400/35 bg-[#3b1a6e]/60 px-3 py-1.5 backdrop-blur-md sm:px-3.5 sm:py-2 md:px-4"
                >
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-emerald-300 sm:h-4 sm:w-4" strokeWidth={iconStroke} />
                  <span className="text-[10px] font-bold text-emerald-200 sm:text-[11px] md:text-sm">{badge.text}</span>
                </div>
              ) : (
                <div
                  key={badge.text}
                  className="inline-flex w-fit max-w-full items-center rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md sm:px-3.5 sm:py-2 md:px-4"
                >
                  <span className="text-[10px] font-medium text-white/50 sm:text-[11px] md:text-sm">{badge.text}</span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="w-full min-w-0 xl:w-[min(100%,20.5rem)] xl:max-w-[20.5rem] xl:shrink-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {pillars.map((stat) => (
              <div
                key={stat.label}
                className="flex min-h-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/14 bg-white/[0.07] px-1.5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:min-h-[124px] sm:gap-2 sm:rounded-[20px] sm:px-2 sm:py-5 md:min-h-[140px] md:rounded-[22px] xl:min-h-[156px] xl:py-6"
              >
                <stat.Icon className="h-5 w-5 shrink-0 text-white/70 sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={iconStroke} />
                <p className="text-center text-base font-bold leading-none tabular-nums sm:text-lg md:text-xl xl:text-2xl">
                  {stat.value}
                </p>
                <p className="px-0.5 text-center text-[6px] font-bold uppercase leading-tight tracking-[0.1em] text-white/40 sm:text-[7px] sm:tracking-[0.12em] md:text-[8px] lg:text-[9px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:mt-7 sm:gap-4 sm:pt-7 md:mt-8 md:flex-row md:items-center md:gap-6 md:pt-8 lg:gap-8">
        <p className="shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] text-white/38 sm:text-[10px]">
          Active Tokens
        </p>
        <div className="-mx-0.5 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-visible md:gap-2.5">
          {tokens.map((t) => (
            <div
              key={t.sym}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-1.5 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-black/35 sm:py-2 md:px-3.5"
            >
              {t.dotClass ? (
                <span className={`h-2 w-2 shrink-0 rounded-full ${t.dotClass} ring-2 ring-white/20`} aria-hidden />
              ) : t.Icon ? (
                <t.Icon className="h-3.5 w-3.5 shrink-0 text-white/75" strokeWidth={iconStroke} />
              ) : null}
              <span className="whitespace-nowrap text-[10px] font-bold tracking-wide text-white/95 md:text-[11px]">
                {t.sym} <span className="font-semibold text-emerald-200/95">{t.ch}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
