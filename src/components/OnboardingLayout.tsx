'use client';

import React from 'react';
import Link from 'next/link';
import { ForceLightTheme } from '@/components/ForceLightTheme';
import { MaxtronizeLogo } from '@/components/MaxtronizeLogo';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  /** Shown on accreditation step in mocks (e.g. “✓ Saved”). */
  showSaved?: boolean;
}

const STEP_ITEMS = [
  { id: 1, name: 'Entity Setup', sub: 'KYB' },
  { id: 2, name: 'Accreditation', sub: 'Reg readiness' },
  { id: 3, name: 'Asset Details', sub: 'Dynamic form' },
  { id: 4, name: 'Legal Structure', sub: 'SPV setup' },
  { id: 5, name: 'Offering Setup', sub: 'Raise config' },
  { id: 6, name: 'Tokenization', sub: 'Token config' },
  { id: 7, name: 'Custody', sub: 'Custodian' },
  { id: 8, name: 'Review & Submit', sub: 'Final review' },
] as const;

const TOTAL_STEPS = STEP_ITEMS.length;

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function CubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
      />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function CpuChipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM7 9h10v10H7V9z"
      />
    </svg>
  );
}

function VaultIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function ClipboardCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

function StepLeadingIcon({ stepId, className = 'w-[18px] h-[18px]' }: { stepId: number; className?: string }) {
  switch (stepId) {
    case 1:
      return <BuildingIcon className={className} />;
    case 2:
      return <ShieldIcon className={className} />;
    case 3:
      return <CubeIcon className={className} />;
    case 4:
      return <DocumentIcon className={className} />;
    case 5:
      return <ChartBarIcon className={className} />;
    case 6:
      return <CpuChipIcon className={className} />;
    case 7:
      return <VaultIcon className={className} />;
    case 8:
      return <ClipboardCheckIcon className={className} />;
    default:
      return <DocumentIcon className={className} />;
  }
}

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
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            <Link
              href="/issuer/dashboard"
              className="text-xs md:text-sm font-semibold text-[#6B7280] hover:text-[#7C3AED] flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline">Skip to Dashboard</span>
              <span className="sm:hidden">Skip</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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
        <aside className="hidden lg:flex w-72 xl:w-80 bg-ui-sidebar border-r border-ui-border py-8 pl-8 pr-6 flex-col min-h-0 sticky top-[70px] h-[calc(100vh-70px)] self-start">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2">
            <h3 className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.22em] mb-6">
              Onboarding Steps
            </h3>
            <nav className="space-y-2 pb-4">
              {STEP_ITEMS.map((step) => {
                const done = step.id < currentStep;
                const active = step.id === currentStep;
                const locked = step.id > currentStep;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 -mx-0.5 transition-colors ${
                      active
                        ? 'bg-[#F5F3FF] border border-[#DDD6FE] shadow-sm'
                        : 'border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : active
                            ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-sm'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'
                      }`}
                    >
                      {done ? (
                        <svg
                          className="w-[18px] h-[18px]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : locked ? (
                        <LockIcon className="w-[18px] h-[18px]" />
                      ) : (
                        <StepLeadingIcon stepId={step.id} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold leading-snug ${
                          active
                            ? 'text-[#6D28D9]'
                            : done
                              ? 'text-[#111827]'
                              : 'text-[#9CA3AF]'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p
                        className={`text-[10px] font-medium uppercase tracking-wide mt-0.5 ${
                          active ? 'text-[#7C3AED]/65' : done ? 'text-[#6B7280]' : 'text-[#D1D5DB]'
                        }`}
                      >
                        {step.sub}
                      </p>
                    </div>
                    {active && (
                      <span
                        className="h-2 w-2 rounded-full bg-[#7C3AED] shrink-0"
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
              <div className="w-8 h-8 rounded-xl bg-ui-card flex items-center justify-center shadow-sm mb-4 border border-ui-border">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="pointer-events-none absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-ui-card/40 blur-2xl rounded-full" aria-hidden />
          </div>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full min-w-0">
          <div className="max-w-4xl mx-auto md:px-0">{children}</div>
        </main>
      </div>
    </div>
    </ForceLightTheme>
  );
}
