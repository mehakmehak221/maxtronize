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
import type { OnboardingApplicationStatusDisplay } from '@/lib/onboarding';

const iconStroke = 1.75;

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  showSaved?: boolean;
  applicationStatus?: OnboardingApplicationStatusDisplay | null;
  onStepClick?: (stepId: number) => void;
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

const STATUS_BANNER_STYLES: Record<
  OnboardingApplicationStatusDisplay['key'],
  string
> = {
  draft: '',
  under_review: 'border-amber-200 bg-amber-50 text-amber-900',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  locked: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  rejected: 'border-rose-200 bg-rose-50 text-rose-900',
};

function stepStatusSub(
  stepId: number,
  defaultSub: string,
  applicationStatus?: OnboardingApplicationStatusDisplay | null,
): string {
  if (!applicationStatus || applicationStatus.key === 'draft' || stepId !== 8) {
    return defaultSub;
  }
  return applicationStatus.label;
}

export default function OnboardingLayout({
  children,
  currentStep,
  showSaved = false,
  applicationStatus = null,
  onStepClick,
}: OnboardingLayoutProps) {
  const progressPct =
    currentStep <= 0 ? 0 : (currentStep / TOTAL_STEPS) * 100;
  const showStatusBanner =
    applicationStatus != null && applicationStatus.key !== 'draft';

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
              <span className="hidden md:block text-base font-medium text-ui-muted-text truncate">
                Asset Issuance Onboarding
              </span>
            </div>

            <div className="flex items-center gap-5 md:gap-8 shrink-0">
              {showSaved && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-base md:text-base font-medium text-emerald-600">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  Saved
                </span>
              )}
              <Link
                href="/issuer/dashboard"
                className="text-base md:text-base font-semibold text-[#6B7280] hover:text-[#7C3AED] flex items-center gap-1.5 transition-colors"
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
          <aside className="sticky top-[70px] hidden max-h-[calc(100vh-70px)] w-72 shrink-0 flex-col self-start border-r border-ui-border bg-ui-sidebar py-8 pl-7 pr-5 xl:flex xl:w-80">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#9CA3AF]">
                Onboarding Steps
              </h3>
              {showStatusBanner ? (
                <div
                  className={`mb-5 rounded-2xl border px-3.5 py-3 ${STATUS_BANNER_STYLES[applicationStatus.key]}`}
                >
                  <div className="flex items-center gap-2">
                    {applicationStatus.key === 'under_review' ? (
                      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" aria-hidden />
                    ) : null}
                    <p className="text-xs font-bold uppercase tracking-[0.12em]">
                      {applicationStatus.label}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed opacity-90">
                    {applicationStatus.key === 'under_review'
                      ? 'Compliance is reviewing your submission.'
                      : applicationStatus.description}
                  </p>
                </div>
              ) : null}
              <nav className="motion-onboarding-nav space-y-1.5 pb-4">
                {STEP_ITEMS.map((step) => {
                  const done = currentStep > 0 && step.id < currentStep;
                  const active = currentStep > 0 && step.id === currentStep;
                  const locked = currentStep <= 0 || step.id > currentStep;
                  const reviewStep =
                    step.id === 8 &&
                    applicationStatus?.key === 'under_review' &&
                    active;
                  const StepIcon = step.Icon;
                  const stepSub = stepStatusSub(step.id, step.sub, applicationStatus);
                  const clickable = onStepClick && !locked;

                  return (
                    <div
                      key={step.id}
                      role={clickable ? 'button' : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onClick={clickable ? () => onStepClick(step.id) : undefined}
                      className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${reviewStep
                        ? 'bg-amber-50 shadow-[inset_0_0_0_1px_#FDE68A]'
                        : active
                          ? 'bg-[#F5F3FF] shadow-[inset_0_0_0_1px_#DDD6FE]'
                          : clickable
                            ? 'hover:bg-ui-muted-surface cursor-pointer'
                            : ''
                        }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${done
                          ? 'border border-[#BBF7D0] bg-[#ECFDF5] text-emerald-600 group-hover:scale-105 group-hover:bg-[#d1fae5] group-hover:border-[#86efac]'
                          : reviewStep
                            ? 'border border-amber-200 bg-amber-100 text-amber-700 group-hover:scale-105'
                            : active
                              ? 'bg-[#7C3AED] text-white shadow-[0_4px_12px_-2px_rgba(124,58,237,0.45)] group-hover:scale-105'
                              : clickable
                                ? 'border border-[#E5E7EB] bg-[#FAFAFA] text-[#D1D5DB] group-hover:scale-105 group-hover:bg-violet-50 group-hover:text-[#7C3AED] group-hover:border-primary/30'
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
                          className={`text-base font-bold leading-snug transition-colors duration-200 ${reviewStep
                            ? 'text-amber-800'
                            : active
                              ? 'text-[#6D28D9]'
                              : done
                                ? 'text-[#111827] group-hover:text-primary'
                                : clickable
                                  ? 'text-[#D1D5DB] group-hover:text-primary'
                                  : 'text-[#D1D5DB]'
                            }`}
                        >
                          {step.name}
                        </p>
                        <p
                          className={`mt-0.5 text-xs font-semibold uppercase tracking-[0.08em] ${reviewStep
                            ? 'text-amber-700'
                            : active
                              ? 'text-[#6B7280]'
                              : done
                                ? 'text-[#6B7280]'
                                : 'text-[#E5E7EB]'
                            }`}
                        >
                          {stepSub}
                        </p>
                      </div>
                      {reviewStep ? (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                          In review
                        </span>
                      ) : active ? (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-[#7C3AED] shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* <div className="shrink-0 mt-6 pt-6 border-t border-ui-divider">
              <div className="bg-ui-help-bg rounded-2xl p-6 relative group border border-ui-help-border">
                <div className="relative z-10">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl border border-ui-border bg-ui-card shadow-sm">
                    <CircleHelp className="h-4 w-4 text-primary" strokeWidth={iconStroke} />
                  </div>
                  <h4 className="text-base font-bold text-ui-strong mb-2">Need help?</h4>
                  <p className="text-xs text-ui-muted-text leading-relaxed mb-4">
                    Our compliance team is available Mon–Fri 9am–6pm ET to guide you.
                  </p>
                  <button
                    type="button"
                    className="text-xs font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Talk to Compliance
                    <ChevronRight className="h-3 w-3" strokeWidth={iconStroke} />
                  </button>
                </div>
                <div className="pointer-events-none absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-ui-card/40 blur-2xl rounded-full" aria-hidden />
              </div>
            </div> */}
          </aside>

          <main className="flex-1 w-full min-w-0 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12">
            <div className="motion-onboarding-step max-w-4xl mx-auto md:px-0">{children}</div>
          </main>
        </div>
      </div>
    </ForceLightTheme>
  );
}
