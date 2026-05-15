'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  Box,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Cpu,
  FileText,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ForceLightTheme } from '@/components/ForceLightTheme';
import { MaxtronizeLogo } from '@/components/MaxtronizeLogo';

const iconStroke = 1.75;

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  /** Shown on accreditation step in mocks (e.g. “✓ Saved”). */
  showSaved?: boolean;
}

const STEP_ITEMS: { id: number; name: string; sub: string; Icon: LucideIcon }[] = [
  { id: 1, name: 'Entity Setup', sub: 'KYB', Icon: Building2 },
  { id: 2, name: 'Accreditation', sub: 'Reg readiness', Icon: ShieldCheck },
  { id: 3, name: 'Asset Details', sub: 'Dynamic form', Icon: Box },
  { id: 4, name: 'Legal Structure', sub: 'SPV setup', Icon: FileText },
  { id: 5, name: 'Offering Setup', sub: 'Raise config', Icon: BarChart3 },
  { id: 6, name: 'Tokenization', sub: 'Token config', Icon: Cpu },
  { id: 7, name: 'Custody', sub: 'Custodian', Icon: Lock },
  { id: 8, name: 'Review & Submit', sub: 'Final review', Icon: ClipboardCheck },
];

const TOTAL_STEPS = STEP_ITEMS.length;

export default function OnboardingLayout({
  children,
  currentStep,
  showSaved = false,
}: OnboardingLayoutProps) {
  const progressPct = (currentStep / TOTAL_STEPS) * 100;

  return (
    <ForceLightTheme>
    <div className="min-h-screen bg-ui-page flex flex-col font-sans">
      <header className="sticky top-0 z-50 shrink-0 bg-card border-b border-ui-border">
        <div className="h-16 flex items-center justify-between px-6 md:px-8 gap-4">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="relative h-7 w-28 md:h-8 md:w-32 shrink-0">
              <MaxtronizeLogo
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-contain object-left"
              />
            </div>
            <div className="hidden md:block h-5 w-px bg-ui-border shrink-0" />
            <span className="hidden md:block text-sm font-medium text-ui-muted-text truncate">
              Asset Issuance Onboarding
            </span>
          </div>

          <div className="flex items-center gap-5 md:gap-8 shrink-0">
            {showSaved && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-emerald-600">
                <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                Saved
              </span>
            )}
            <Link
              href="/issuer/dashboard"
              className="text-xs md:text-sm font-semibold text-[#6B7280] hover:text-[#7C3AED] flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline">Skip to Dashboard</span>
              <span className="sm:hidden">Skip</span>
              <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
            </Link>
          </div>
        </div>

        <div className="h-px w-full bg-[#7C3AED]" aria-hidden />

        <div className="relative h-1 w-full bg-[#eceef2] overflow-hidden">
          <div
            className="h-full rounded-none bg-linear-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] shadow-[0_0_12px_rgba(124,58,237,0.35)] transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label="Onboarding progress"
          />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="sticky top-[70px] hidden h-[calc(100vh-70px)] w-72 shrink-0 flex-col self-start border-r border-ui-border bg-ui-sidebar py-8 pl-7 pr-5 xl:flex xl:w-80">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9CA3AF]">
              Onboarding Steps
            </h3>
            <nav className="motion-onboarding-nav space-y-1.5 pb-4">
              {STEP_ITEMS.map((step) => {
                const done = step.id < currentStep;
                const active = step.id === currentStep;
                const locked = step.id > currentStep;
                const StepIcon = step.Icon;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all ${
                      active ? 'bg-[#F5F3FF] shadow-[inset_0_0_0_1px_#DDD6FE]' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                        done
                          ? 'border border-[#BBF7D0] bg-[#ECFDF5] text-emerald-600'
                          : active
                            ? 'bg-[#7C3AED] text-white shadow-[0_4px_12px_-2px_rgba(124,58,237,0.45)]'
                            : 'border border-[#E5E7EB] bg-[#FAFAFA] text-[#D1D5DB]'
                      }`}
                    >
                      {done ? (
                        <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
                      ) : locked ? (
                        <Lock className="h-[17px] w-[17px]" strokeWidth={1.75} />
                      ) : (
                        <StepIcon className="h-[18px] w-[18px]" strokeWidth={iconStroke} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[13px] font-bold leading-snug ${
                          active
                            ? 'text-[#6D28D9]'
                            : done
                              ? 'text-[#111827]'
                              : 'text-[#D1D5DB]'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p
                        className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                          active ? 'text-[#6B7280]' : done ? 'text-[#6B7280]' : 'text-[#E5E7EB]'
                        }`}
                      >
                        {step.sub}
                      </p>
                    </div>
                    {active && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-[#7C3AED] shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden
                      />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="shrink-0 mt-6 pt-6 border-t border-ui-divider">
          <div className="bg-ui-help-bg rounded-2xl p-6 relative group border border-ui-help-border">
            <div className="relative z-10">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl border border-ui-border bg-ui-card shadow-sm">
                <CircleHelp className="h-4 w-4 text-primary" strokeWidth={iconStroke} />
              </div>
              <h4 className="text-sm font-bold text-ui-strong mb-2">Need help?</h4>
              <p className="text-[11px] text-ui-muted-text leading-relaxed mb-4">
                Our compliance team is available Mon–Fri 9am–6pm ET to guide you.
              </p>
              <button
                type="button"
                className="text-[11px] font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Talk to Compliance
                <ChevronRight className="h-3 w-3" strokeWidth={iconStroke} />
              </button>
            </div>
            <div className="pointer-events-none absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-ui-card/40 blur-2xl rounded-full" aria-hidden />
          </div>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full min-w-0">
          <div className="motion-onboarding-step max-w-4xl mx-auto md:px-0">{children}</div>
        </main>
      </div>
    </div>
    </ForceLightTheme>
  );
}
