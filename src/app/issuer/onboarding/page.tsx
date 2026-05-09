'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/OnboardingLayout';

type AssetType = 'real-estate' | 'private-credit' | 'data-centers' | 'commodities';

type DirectorEntry = {
  id: string;
  fullName: string;
  title: string;
  dateOfBirth: string;
  ssnLast4: string;
};

type UboEntry = {
  id: string;
  fullName: string;
  ownershipPercent: string;
};

function newRowId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function IconCard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function IconMonitor({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IconDiamond({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l8 8-8 8-8-8 8-8z" />
    </svg>
  );
}

/** Application Summary row — mint badge + forest stroke icons */
function ApplicationSummaryIconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-700 shadow-sm">
      {children}
    </div>
  );
}

function IconShieldOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

function IconCubeOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12"
      />
    </svg>
  );
}

function IconDocumentOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function IconTrendingUpOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function IconCpuChipOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function IconLockClosedOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

const ONBOARDING_VECTOR_SPRITE = '/icons/onboarding-vector-sprite.svg';

const ONBOARDING_VECTOR_SYMBOL_IDS = [
  'onboarding-vector-1',
  'onboarding-vector-2',
  'onboarding-vector-3',
  'onboarding-vector-4',
] as const;

function OnboardingVectorSpriteIcons({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="flex items-center gap-2">
        {ONBOARDING_VECTOR_SYMBOL_IDS.map((id) => (
          <svg key={id} width={24} height={24} className="shrink-0 overflow-visible">
            <use href={`${ONBOARDING_VECTOR_SPRITE}#${id}`} />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('real-estate');
  const [selectedReg, setSelectedReg] = useState('reg-d-506c');
  const [selectedTokenStandard, setSelectedTokenStandard] = useState('erc-1400');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [selectedCustodian, setSelectedCustodian] = useState('anchorage');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isSubmitted) return;
    const redirectMs = 5200;
    const id = window.setTimeout(() => {
      router.push('/issuer/dashboard');
    }, redirectMs);
    return () => window.clearTimeout(id);
  }, [isSubmitted, router]);

  const [directors, setDirectors] = useState<DirectorEntry[]>(() => [
    {
      id: newRowId(),
      fullName: 'Marcus Vance',
      title: 'Managing Partner',
      dateOfBirth: '1979-03-14',
      ssnLast4: '1842',
    },
    {
      id: newRowId(),
      fullName: 'Priya Nair',
      title: 'General Partner',
      dateOfBirth: '1983-07-22',
      ssnLast4: '3901',
    },
  ]);

  const [ubos, setUbos] = useState<UboEntry[]>(() => [
    { id: newRowId(), fullName: 'Marcus Vance', ownershipPercent: '60' },
    { id: newRowId(), fullName: 'Priya Nair', ownershipPercent: '40' },
  ]);

  const uboOwnershipTotal = ubos.reduce((sum, row) => sum + (parseFloat(row.ownershipPercent) || 0), 0);

  const assetTypes: {
    id: AssetType;
    name: string;
    icon: React.ReactNode;
    sub: string;
  }[] = [
    { id: 'real-estate', name: 'Real Estate', icon: <IconBuilding className="w-6 h-6" />, sub: 'Commercial, residential, industrial' },
    { id: 'private-credit', name: 'Private Credit', icon: <IconCard className="w-6 h-6" />, sub: 'Loans, bonds, structured credit' },
    { id: 'data-centers', name: 'Data Centers', icon: <IconMonitor className="w-6 h-6" />, sub: 'Colocation, hyperscale, edge' },
    { id: 'commodities', name: 'Commodities', icon: <IconDiamond className="w-6 h-6" />, sub: 'Gold, silver, oil, agricultural' },
  ];

  const assetDetailsTitle: Record<AssetType, string> = {
    'real-estate': 'Real Estate',
    'private-credit': 'Private Credit',
    'data-centers': 'Data Center',
    'commodities': 'Commodity',
  };

  const renderStep1 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 1 of 8 — Entity Setup</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Entity Setup</h1>
        <p className="text-ui-muted-text text-sm">Provide your entity details for Know Your Business (KYB) verification.</p>
        <OnboardingVectorSpriteIcons className="mt-5" />
      </header>

      <div className="bg-alert-info-bg border border-alert-info-border rounded-3xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-alert-info-title">Know Your Business (KYB) Verification</h4>
          <p className="text-xs text-alert-info-body leading-relaxed">
            We verify your entity against FinCEN, EDGAR, and state corporate registries. This typically takes 1–2 business days. All data is encrypted at rest.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-sm font-bold text-ui-strong">Entity Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <FormField label="Legal Company Name" placeholder="Crescent Capital Partners LLC" required fullWidth hint="Must match your state registration exactly" />
            <FormField label="Entity Type" placeholder="Select Type" isSelect />
            <FormField label="Employer Identification Number (EIN)" placeholder="82-4519302" hint="Format: XX-XXXXXXX" />
            <FormField label="Registered Business Address" placeholder="1234 Financial District Blvd, Suite 800, New York, NY 10004" fullWidth />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <div>
            <h3 className="text-sm font-bold text-ui-strong mb-2">Directors & Ultimate Beneficial Owners (UBOs)</h3>
            <p className="text-xs text-ui-faint">List all directors and individuals owning 25%+ of the entity. Required for FinCEN compliance.</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <label className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Directors</label>
                  <p className="text-[10px] text-ui-faint mt-1 max-w-xl">
                    Full legal name, role, date of birth, and last four digits of SSN for each director or officer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDirectors((rows) => [
                      ...rows,
                      { id: newRowId(), fullName: '', title: '', dateOfBirth: '', ssnLast4: '' },
                    ])
                  }
                  className="shrink-0 px-4 py-2.5 rounded-xl border border-ui-border bg-ui-card text-xs font-bold text-primary hover:border-primary/40 hover:bg-ui-accent-tint transition-all"
                >
                  Add director
                </button>
              </div>
              <div className="space-y-4">
                {directors.map((d, index) => (
                  <div
                    key={d.id}
                    className="p-5 sm:p-6 bg-ui-highlight-box border border-ui-border rounded-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">
                        Director {index + 1}
                      </span>
                      {directors.length > 1 ? (
                        <button
                          type="button"
                          aria-label={`Remove director ${index + 1}`}
                          onClick={() => setDirectors((rows) => rows.filter((row) => row.id !== d.id))}
                          className="text-[11px] font-bold text-ui-muted-text hover:text-ui-danger-text transition-colors"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <label className="space-y-2 block">
                        <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Full legal name</span>
                        <input
                          type="text"
                          autoComplete="name"
                          value={d.fullName}
                          onChange={(e) =>
                            setDirectors((rows) =>
                              rows.map((row) => (row.id === d.id ? { ...row, fullName: e.target.value } : row))
                            )
                          }
                          placeholder="Jane Doe"
                          className="w-full px-4 py-3 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder font-medium"
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Title / role</span>
                        <input
                          type="text"
                          value={d.title}
                          onChange={(e) =>
                            setDirectors((rows) =>
                              rows.map((row) => (row.id === d.id ? { ...row, title: e.target.value } : row))
                            )
                          }
                          placeholder="Managing Director"
                          className="w-full px-4 py-3 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder font-medium"
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Date of birth</span>
                        <input
                          type="date"
                          value={d.dateOfBirth}
                          onChange={(e) =>
                            setDirectors((rows) =>
                              rows.map((row) => (row.id === d.id ? { ...row, dateOfBirth: e.target.value } : row))
                            )
                          }
                          className="w-full px-4 py-3 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground font-medium [color-scheme:light] dark:[color-scheme:dark]"
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">SSN (last 4)</span>
                        <input
                          type="password"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={4}
                          value={d.ssnLast4}
                          onChange={(e) => {
                            const next = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setDirectors((rows) =>
                              rows.map((row) => (row.id === d.id ? { ...row, ssnLast4: next } : row))
                            );
                          }}
                          placeholder="••••"
                          className="w-full px-4 py-3 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder font-medium tracking-widest"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <label className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">
                    Ultimate Beneficial Owners (25%+ Ownership)
                  </label>
                  <p className="text-[10px] text-ui-faint mt-1 max-w-xl">
                    List each person who owns or controls 25% or more. Percentages should reflect total beneficial ownership.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setUbos((rows) => [...rows, { id: newRowId(), fullName: '', ownershipPercent: '' }])
                  }
                  className="shrink-0 px-4 py-2.5 rounded-xl border border-ui-border bg-ui-card text-xs font-bold text-primary hover:border-primary/40 hover:bg-ui-accent-tint transition-all"
                >
                  Add beneficial owner
                </button>
              </div>
              <div className="space-y-4">
                {ubos.map((u, index) => (
                  <div
                    key={u.id}
                    className="p-5 sm:p-6 bg-ui-highlight-box border border-ui-border rounded-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">
                        Beneficial owner {index + 1}
                      </span>
                      {ubos.length > 1 ? (
                        <button
                          type="button"
                          aria-label={`Remove beneficial owner ${index + 1}`}
                          onClick={() => setUbos((rows) => rows.filter((row) => row.id !== u.id))}
                          className="text-[11px] font-bold text-ui-muted-text hover:text-ui-danger-text transition-colors"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:max-w-2xl">
                      <label className="space-y-2 block">
                        <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Full legal name</span>
                        <input
                          type="text"
                          autoComplete="name"
                          value={u.fullName}
                          onChange={(e) =>
                            setUbos((rows) =>
                              rows.map((row) => (row.id === u.id ? { ...row, fullName: e.target.value } : row))
                            )
                          }
                          placeholder="Jane Doe"
                          className="w-full px-4 py-3 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder font-medium"
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Ownership %</span>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={u.ownershipPercent}
                            onChange={(e) =>
                              setUbos((rows) =>
                                rows.map((row) =>
                                  row.id === u.id ? { ...row, ownershipPercent: e.target.value } : row
                                )
                              )
                            }
                            placeholder="0"
                            className="w-full px-4 py-3 pr-10 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder font-medium"
                          />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-ui-faint">
                            %
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <p
                className={`text-[10px] font-medium ${
                  uboOwnershipTotal > 100
                    ? 'text-ui-danger-text'
                    : uboOwnershipTotal > 0 && Math.abs(uboOwnershipTotal - 100) > 0.01
                      ? 'text-ui-muted-text'
                      : 'text-ui-faint'
                }`}
              >
                Total reported ownership:{' '}
                <span className="font-bold tabular-nums">{uboOwnershipTotal.toFixed(2)}%</span>
                {uboOwnershipTotal > 100
                  ? ' — totals above 100%; adjust percentages.'
                  : uboOwnershipTotal > 0 && Math.abs(uboOwnershipTotal - 100) > 0.01
                    ? ' — verify that figures match your cap table.'
                    : null}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <h3 className="text-sm font-bold text-ui-strong">Supporting Documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadField label="Certificate of Formation / Incorporation" sub="State-issued, within 12 months" />
          <FileUploadField label="Operating Agreement" sub="Signed by all members" />
          <FileUploadField label="EIN Confirmation Letter" sub="IRS CP 575 or 147C" />
          <FileUploadField label="Government-Issued ID" sub="For each UBO listed above" />
        </div>
      </section>

      <div className="flex items-center justify-end pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(2)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 2 of 8 — Accreditation</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Accreditation</h1>
        <p className="text-ui-muted-text text-sm">Configure your offering type and investor accreditation requirements.</p>
      </header>

      <div className="bg-alert-warn-bg border border-alert-warn-border rounded-3xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-warn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-alert-warn-title">Important: Regulation Selection</h4>
          <p className="text-xs text-alert-warn-body leading-relaxed">
            This selection determines your <span className="font-bold">investor eligibility</span>, <span className="font-bold">marketing restrictions</span>, and ongoing compliance obligations. Consult with legal counsel before proceeding.{' '}
            <span className="font-bold text-amber-800">Maxtronize compliance team can provide guidance.</span>
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <div>
          <h3 className="text-sm font-bold text-ui-strong mb-1">Select Offering Regulation</h3>
          <p className="text-xs text-ui-faint">Choose the exemption under which you will conduct this offering.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'reg-d-506b', name: 'Reg D - Rule 506(b)', tag: 'Most Common', sub: 'Up to 35 non-accredited + unlimited accredited investors. No SEC registration. No general solicitation.', checks: ['No SEC filing required', 'Up to 35 non-accredited investors'], crosses: ['No advertising', 'Pre-existing relationships required'] },
            { id: 'reg-d-506c', name: 'Reg D - Rule 506(c)', tag: 'Recommended', sub: 'Unlimited accredited investors only. General solicitation permitted. Must verify accreditation for each investor.', checks: ['General solicitation allowed', 'Unlimited raise size'], crosses: ['Accredited investors only', 'Must verify each investor'] },
            { id: 'reg-s', name: 'Regulation S', tag: 'International', sub: 'Offshore offerings to non-US persons. Complements Reg D for global capital raises. No US investor participation.', checks: ['Global investor access', 'No SEC registration'], crosses: ['US persons excluded', 'Complex compliance'] },
            { id: 'reg-a', name: 'Regulation A+', tag: 'Public-Light', sub: 'Mini-IPO structure. Up to $75M per year. Non-accredited investors permitted. Requires SEC qualification.', checks: ['Non-accredited investors OK', 'Up to $75M raise'], crosses: ['SEC qualification required', 'Higher compliance cost'] }
          ].map((reg) => {
            const isSel = selectedReg === reg.id;
            const is506cBlue = isSel && reg.id === 'reg-d-506c';
            return (
            <div
              key={reg.id}
              onClick={() => setSelectedReg(reg.id)}
              className={`p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-6 relative group ${
                is506cBlue
                  ? 'border-sky-500 bg-sky-50'
                  : isSel
                    ? 'border-primary bg-ui-accent-tint'
                    : 'border-ui-border bg-ui-card hover:border-ui-border-strong'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${is506cBlue ? 'text-sky-800' : isSel ? 'text-primary' : 'text-ui-strong'}`}>{reg.name}</h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                  is506cBlue
                    ? 'bg-sky-100 text-sky-800 border-sky-200'
                    : isSel
                      ? 'bg-ui-accent-tint text-primary border-primary/20'
                      : 'bg-ui-muted-deep text-ui-faint border-ui-border'
                }`}>{reg.tag}</span>
              </div>
              <p className="text-[11px] text-ui-muted-text leading-relaxed">{reg.sub}</p>
              <div className="space-y-2 pt-2 border-t border-ui-divider">
                {reg.checks.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-ui-success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-[10px] font-medium text-ui-body">{c}</span>
                  </div>
                ))}
                {reg.crosses.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="text-[10px] font-medium text-ui-muted-text">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </section>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <h3 className="text-sm font-bold text-ui-strong">Investor Eligibility</h3>
        <div className="flex items-center justify-between p-6 bg-ui-muted-surface rounded-2xl border border-ui-border">
          <div>
            <p className="text-[13px] font-bold text-ui-strong mb-1">Accredited Investors Only</p>
            <p className="text-[10px] text-ui-faint">Restrict this offering to SEC-accredited investors (net worth $1M+ or income $200K+/year).</p>
          </div>
          <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner shadow-primary/20 transition-all">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-ui-faint uppercase tracking-widest flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_256_1316)">
<path d="M11.6556 7.57612C11.6556 10.49 9.61586 11.947 7.19149 12.792C7.06454 12.835 6.92664 12.833 6.80103 12.7862C4.37084 11.947 2.33112 10.49 2.33112 7.57612V3.49666C2.33112 3.3421 2.39252 3.19387 2.50181 3.08457C2.6111 2.97528 2.75933 2.91388 2.91389 2.91388C4.07945 2.91388 5.5364 2.21455 6.55044 1.32872C6.6739 1.22324 6.83096 1.16528 6.99335 1.16528C7.15574 1.16528 7.3128 1.22324 7.43626 1.32872C8.45612 2.22038 9.90724 2.91388 11.0728 2.91388C11.2274 2.91388 11.3756 2.97528 11.4849 3.08457C11.5942 3.19387 11.6556 3.3421 11.6556 3.49666V7.57612Z" stroke="#00BC7D" stroke-width="1.16556" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_256_1316">
<rect width="13.9867" height="13.9867" fill="white"/>
</clipPath>
</defs>
</svg>

            Accreditation Verification Method
          </label>
          <FormField label="" placeholder="Select Method" isSelect />
        </div>

        <div className="bg-ui-purple-banner-bg border border-ui-purple-banner-border rounded-2xl p-6 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>
          <p className="text-[11px] text-primary/80 font-medium leading-relaxed">
            Maxtronize integrates with <span className="font-bold">Parallel Markets</span> for automated accreditation checks. Investors will complete verification before committing capital.
          </p>
        </div>
      </section>

      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(1)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(3)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 3 of 8 — Asset Details</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Asset Details</h1>
        <p className="text-ui-muted-text text-sm">Submit asset details. Fields adjust dynamically based on your asset type.</p>
      </header>

      {/* Asset Type Selection */}
      <section className="bg-ui-card border border-ui-border rounded-3xl p-8 shadow-sm">
        <h3 className="text-sm font-bold text-ui-strong mb-1">Asset Type</h3>
        <p className="text-xs text-ui-faint mb-8">Select the category of asset you are tokenizing. Form fields will adjust accordingly.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {assetTypes.map((type) => (
            <button
              type="button"
              key={type.id}
              onClick={() => setSelectedAssetType(type.id as AssetType)}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 group select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/45 min-w-0 ${
                selectedAssetType === type.id 
                  ? 'border-primary bg-ui-accent-tint' 
                  : 'border-ui-border bg-ui-card hover:border-ui-border-strong'
              }`}
            >
              <div
                className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl shadow-sm overflow-hidden transition-transform duration-200 motion-safe:group-hover:scale-[1.06] motion-safe:group-focus-visible:scale-100 ${
                  selectedAssetType === type.id ? 'bg-ui-card' : 'bg-ui-muted-deep'
                }`}
              >
                {type.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold mb-1 ${selectedAssetType === type.id ? 'text-primary' : 'text-ui-strong'}`}>{type.name}</p>
                <p className="text-[10px] text-ui-faint leading-relaxed">{type.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Form */}
      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <div className="border-b border-ui-divider pb-6 mb-2">
          <h3 className="text-lg font-bold text-ui-strong">{assetDetailsTitle[selectedAssetType]} Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
          {selectedAssetType === 'commodities' && (
            <>
              <FormField label="Asset Name" placeholder="Gold Bullion Reserve Series I" required />
              <FormField label="Commodity Type" placeholder="Select Type" isSelect />
              <FormField label="Storage Location" placeholder="London, UK (LBMA Vault)" />
              <FormField label="Total Value (USD)" placeholder="50,000,000" />
              <FormField label="Purity / Grade" placeholder="99.99% Fine Gold" />
              <FormField label="Vault Provider" placeholder="Brinks / Loomis International" />
              <FileUploadField label="Vault Storage Certificate" sub="Upload PDF" />
              <FileUploadField label="Independent Assay Report" sub="Upload PDF" />
            </>
          )}

          {selectedAssetType === 'data-centers' && (
            <>
              <FormField label="Facility Name" placeholder="Ashburn DC Campus Alpha" required />
              <FormField label="Total Capacity (MW)" placeholder="48" />
              <FormField label="Location" placeholder="Ashburn, VA, USA" />
              <FormField label="Appraised Value (USD)" placeholder="250,000,000" />
              <FormField label="Annual NOI (USD)" placeholder="18,500,000" />
              <FormField label="Tier Level" placeholder="Select Tier" isSelect />
              <FileUploadField label="Facility Appraisal Report" sub="Upload PDF" />
              <FileUploadField label="Colocation Agreements" sub="Upload PDF" />
            </>
          )}

          {selectedAssetType === 'private-credit' && (
            <>
              <FormField label="Loan / Bond Name" placeholder="Senior Secured Term Loan A" required />
              <FormField label="Principal Amount (USD)" placeholder="25,000,000" required />
              <FormField label="Credit Type" placeholder="Select Type" isSelect />
              <FormField label="Interest Rate (%)" placeholder="SOFR + 450bps" />
              <FormField label="Maturity Date" placeholder="Select Date" />
              <FormField label="Credit Rating" placeholder="BB+ / Ba1" />
              <FileUploadField label="Credit Agreement" sub="Upload PDF" />
              <FileUploadField label="Borrower Financial Statements" sub="Last 3 years" />
            </>
          )}

          {selectedAssetType === 'real-estate' && (
            <>
              <FormField label="Property Address" placeholder="2847 Peachtree Rd NE, Atlanta, GA 30305" fullWidth />
              <FormField label="Appraised Valuation (USD)" placeholder="12,500,000" hint="Must be from a licensed MAI appraiser." />
              <FormField label="Annual Rental Income (USD)" placeholder="890,000" />
              <FormField label="Property Type" placeholder="Select Type" isSelect />
              <FormField label="Cap Rate (%)" placeholder="6.8" />
              <FormField label="Occupancy Rate (%)" placeholder="94.2" />
              <FormField label="Year Built / Renovated" placeholder="2018 / 2023" />
              <div className="md:col-span-2 space-y-4 pt-2">
                <p className="text-[10px] font-bold text-ui-faint uppercase tracking-[0.2em]">Required Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileUploadField label="MAI Appraisal Report" sub="Upload PDF" />
                  <FileUploadField label="Rent Roll (last 12 months)" sub="Upload PDF" />
                  <FileUploadField label="Title Report" sub="Upload PDF" />
                  <FileUploadField label="Environmental Assessment (Phase I)" sub="Upload PDF" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(2)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(4)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 4 of 8 — Legal Structure</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Legal Structure</h1>
        <p className="text-ui-muted-text text-sm">Set up the Special Purpose Vehicle (SPV) structure for this asset.</p>
      </header>

      {/* Info Box */}
      <div className="bg-alert-info-bg border border-alert-info-border rounded-3xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl bg-alert-info-icon-wrap-bg border border-alert-info-icon-wrap-border flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-alert-info-title">Special Purpose Vehicle (SPV) Structure</h4>
          <p className="text-xs text-alert-info-body leading-relaxed">
            Each asset is held in a dedicated Delaware LLC SPV to isolate liability and enable clean tokenized ownership transfer. Maxtronize provides registered agent services.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-sm font-bold text-ui-strong">SPV Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField label="SPV Entity Name" placeholder="Crescent Peachtree Tower Holdings LLC" required fullWidth hint="Will be registered as a Delaware LLC. Format: [Asset Name] Holdings LLC" />
            <FormField label="SPV Jurisdiction" placeholder="Delaware, USA" isSelect />
            <FormField label="Issuer Retained Ownership (%)" placeholder="100" hint="Remaining % is available for investor token allocation" />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <div>
            <h3 className="text-sm font-bold text-ui-strong mb-2">Token-Holder Rights Mapping</h3>
            <p className="text-xs text-ui-faint">Define what rights token holders receive. These are encoded in the subscription agreement and operating agreement.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Pro-Rata Cash Distributions', sub: 'Holders receive proportional income distributions', checked: true },
              { title: 'Voting Rights', sub: 'Major asset decisions require token-holder vote', checked: false },
              { title: 'Liquidation Preference', sub: 'Priority return of capital on asset sale', checked: false },
              { title: 'Information Rights', sub: 'Quarterly financials and annual audit reports', checked: false }
            ].map((right, i) => (
              <div key={i} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex gap-4 ${right.checked ? 'border-primary bg-ui-accent-tint' : 'border-ui-divider bg-ui-muted-surface hover:border-ui-border'}`}>
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${right.checked ? 'border-primary bg-primary' : 'border-ui-border-strong bg-ui-card'}`}>
                  {right.checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div>
                  <p className={`text-[13px] font-bold mb-1 ${right.checked ? 'text-primary' : 'text-ui-strong'}`}>{right.title}</p>
                  <p className="text-[10px] text-ui-faint leading-relaxed">{right.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-alert-warn-bg border border-alert-warn-border rounded-3xl p-6 flex gap-4 items-start">
          <svg className="w-5 h-5 text-alert-warn-icon shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-[11px] text-alert-warn-body leading-relaxed">
            Maxtronize legal templates are reviewed by <span className="font-bold">Cooley LLP</span> and <span className="font-bold">K&L Gates</span>. Custom rights structures require additional legal review ($2,500 flat fee).
          </p>
        </div>
      </section>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <h3 className="text-sm font-bold text-ui-strong">Required Legal Documents</h3>
        <div className="space-y-4">
          {[
            { name: 'Private Placement Memorandum (PPM)', status: 'Template Available', color: 'text-ui-success-icon bg-ui-success-bg' },
            { name: 'Subscription Agreement', status: 'Template Available', color: 'text-ui-success-icon bg-ui-success-bg' },
            { name: 'Operating Agreement (SPV)', status: 'Auto-Generated', color: 'text-primary bg-ui-accent-tint' },
            { name: 'Transfer Restriction Agreement', status: 'Template Available', color: 'text-ui-success-icon bg-ui-success-bg' }
          ].map((doc, i) => (
            <div key={i} className="p-5 rounded-2xl border border-ui-border flex items-center justify-between hover:border-ui-border-strong transition-colors group">
              <div className="space-y-1">
                <p className="text-sm font-bold text-ui-strong">{doc.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.color}`}>{doc.status}</span>
              </div>
              <button className="w-10 h-10 rounded-xl border border-ui-border flex items-center justify-center text-ui-faint hover:text-primary hover:border-primary hover:bg-ui-accent-tint transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(3)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(5)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 5 of 8 — Offering Setup</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Offering Setup</h1>
        <p className="text-ui-muted-text text-sm">Configure capital raise parameters, timeline, and transfer restrictions.</p>
      </header>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-sm font-bold text-ui-strong">Offering Configuration</h3>
          <p className="text-xs text-ui-faint -mt-6">Define the capital raise parameters for this offering.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField label="Target Raise Amount (USD)" placeholder="5,000,000" required />
            <FormField label="Minimum Investment (USD)" placeholder="25,000" required />
            <FormField label="Maximum Investors" placeholder="250" />
            <FormField label="Offering Currency" placeholder="Select Currency" isSelect />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-sm font-bold text-ui-strong">Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField label="Offering Open Date" placeholder="Select Date" />
            <FormField label="Offering Close Date" placeholder="Select Date" />
            <FormField label="First Yield Distribution" placeholder="Select Date" />
            <FormField label="Distribution Frequency" placeholder="Select Frequency" isSelect />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-sm font-bold text-ui-strong">Transfer Restrictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField label="Lock-up Period" placeholder="Select Period" isSelect />
            <FormField label="Secondary Market" placeholder="Select Market" isSelect />
          </div>
          <div className="bg-alert-info-bg border border-alert-info-border rounded-2xl p-6 flex gap-4 items-start">
            <svg className="w-4 h-4 text-alert-info-icon shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-[10px] text-alert-info-body leading-relaxed">
              Rule 144 requires a 6–month holding period before resale for most private placements. Maxtronize enforces transfer restrictions at the smart contract level.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(4)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(6)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 6 of 8 — Tokenization</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Tokenization</h1>
        <p className="text-ui-muted-text text-sm">Configure the on-chain token parameters and blockchain network.</p>
      </header>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-sm font-bold text-ui-strong">Token Configuration</h3>
          <p className="text-xs text-ui-faint -mt-6">Define the on-chain token parameters for this asset.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField label="Token Name" placeholder="Crescent Peachtree Tower Token" required />
            <FormField label="Token Symbol" placeholder="CPTT" required />
            <FormField label="Total Supply" placeholder="1,000,000" />
            <FormField label="Token Price (USD)" placeholder="5.00" required />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <div>
            <h3 className="text-sm font-bold text-ui-strong mb-1">Token Standard</h3>
            <p className="text-xs text-ui-faint">Choose the smart contract standard that governs your token.</p>
          </div>
          <div className="space-y-4">
            {[
              { id: 'erc-1400', name: 'ERC-1400', tag: 'Recommended', sub: 'Security token standard with built-in compliance hooks. Best for regulated real-world assets.' },
              { id: 'erc-3643', name: 'ERC-3643 (T-REX)', sub: 'MiCA-aligned compliance-first standard with on-chain KYC registry and transfer rules.' },
              { id: 'erc-20', name: 'ERC-20', sub: 'Fungible token standard offering maximum secondary market liquidity.' }
            ].map((std) => (
              <div 
                key={std.id}
                onClick={() => setSelectedTokenStandard(std.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex gap-5 ${selectedTokenStandard === std.id ? 'border-primary bg-ui-accent-tint' : 'border-ui-divider bg-ui-muted-surface hover:border-ui-border'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedTokenStandard === std.id ? 'border-primary bg-primary' : 'border-ui-border-strong bg-ui-card'}`}>
                  {selectedTokenStandard === std.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className={`text-[13px] font-bold ${selectedTokenStandard === std.id ? 'text-primary' : 'text-ui-strong'}`}>{std.name}</p>
                    {std.tag && <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-full uppercase border border-primary/10">{std.tag}</span>}
                  </div>
                  <p className="text-[10px] text-ui-faint leading-relaxed">{std.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-sm font-bold text-ui-strong">Blockchain Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'ethereum', name: 'Ethereum Mainnet', icon: '💎', sub: 'Maximum security & institutional liquidity' },
              { id: 'polygon', name: 'Polygon', icon: '🟣', sub: 'Low gas fees, fast finality' },
              { id: 'avalanche', name: 'Avalanche', icon: '🔺', sub: 'Institutional-grade subnet' }
            ].map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${selectedNetwork === net.id ? 'border-primary bg-ui-accent-tint' : 'border-ui-border bg-ui-card hover:border-ui-border-strong'}`}
              >
                <div className="text-2xl">{net.icon}</div>
                <div>
                  <p className={`text-[11px] font-bold mb-1 ${selectedNetwork === net.id ? 'text-primary' : 'text-ui-strong'}`}>{net.name}</p>
                  <p className="text-[9px] text-ui-faint leading-tight">{net.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(5)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(7)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 7 of 8 — Custody</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Custody</h1>
        <p className="text-ui-muted-text text-sm">Select a qualified custodian for your tokenized asset.</p>
      </header>

      <div className="bg-alert-info-bg border border-alert-info-border rounded-3xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl bg-alert-info-icon-wrap-bg border border-alert-info-icon-wrap-border flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-alert-info-title">Qualified Digital Asset Custodian</h4>
          <p className="text-xs text-alert-info-body leading-relaxed">
            All tokenized assets must be held by a qualified custodian under applicable regulations. Maxtronize has pre-negotiated institutional rates with our partner custodians.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <div>
          <h3 className="text-sm font-bold text-ui-strong mb-1">Select Custodian</h3>
          <p className="text-xs text-ui-faint">Your tokenized asset private keys will be managed by the selected custodian.</p>
        </div>
        <div className="space-y-4">
          {[
            { id: 'anchorage', name: 'Anchorage Digital', tag: 'Rating A+', sub: 'OCC-chartered crypto bank. Institutional cold storage with $11B+ in assets under custody.', badges: ['OCC Chartered', 'SOC 2 Type II', 'FDIC Member'] },
            { id: 'bitgo', name: 'BitGo', tag: 'Rating A', sub: 'Multi-signature institutional custody. $250M insurance coverage per wallet from Lloyd\'s of London.', badges: ['$250M Insurance', 'Multi-Sig', 'ISO 27001'] },
            { id: 'fireblocks', name: 'Fireblocks', tag: 'Rating A', sub: 'MPC-based custody technology with sub-second transaction settlement and full audit trail.', badges: ['MPC Technology', 'Real-Time Settlement', 'SOC 2 Type II'] }
          ].map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelectedCustodian(c.id)}
              className={`p-8 rounded-3xl border-2 transition-all cursor-pointer flex gap-6 ${selectedCustodian === c.id ? 'border-primary bg-ui-accent-tint' : 'border-ui-divider bg-ui-muted-surface hover:border-ui-border'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedCustodian === c.id ? 'border-primary bg-primary' : 'border-ui-border-strong bg-ui-card'}`}>
                {selectedCustodian === c.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[15px] font-bold ${selectedCustodian === c.id ? 'text-primary' : 'text-ui-strong'}`}>{c.name}</p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${selectedCustodian === c.id ? 'bg-ui-success-badge-bg text-ui-success-badge-text' : 'bg-ui-muted-deep text-ui-faint'}`}>{c.tag}</span>
                </div>
                <p className="text-[11px] text-ui-muted-text leading-relaxed mb-4">{c.sub}</p>
                <div className="flex flex-wrap gap-2">
                  {c.badges.map((b, i) => (
                    <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-ui-muted-deep text-ui-faint rounded-md border border-ui-border">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-ui-divider space-y-8">
          <h3 className="text-sm font-bold text-ui-strong">Wallet Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FormField label="Cold Storage Ratio" placeholder="Select Ratio" isSelect />
            <FormField label="Multi-Sig Configuration" placeholder="Select Config" isSelect />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(6)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(8)}
          className="btn-gradient-primary px-10 py-4 text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Continue
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 8 of 8 — Review & Submit</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Review & Submit</h1>
        <p className="text-ui-muted-text text-sm">Review all submitted information before final submission.</p>
      </header>

      <div className="bg-ui-purple-banner-bg border border-ui-purple-banner-border rounded-3xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl bg-ui-purple-banner-icon-bg border border-ui-purple-banner-border flex items-center justify-center shrink-0 animate-pulse">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-primary">Final Review — Almost There</h4>
          <p className="text-xs text-primary/70 leading-relaxed">
            Please review all information before submitting. Once submitted, your application will be reviewed by our compliance team within 2 business days.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <h3 className="text-sm font-bold text-ui-strong">Application Summary</h3>
        <div className="space-y-3">
          {(
            [
              {
                name: 'Entity Setup',
                sub: 'Crescent Capital Partners LLC · Delaware LLC · EIN 82-4519302',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconBuilding className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
              {
                name: 'Accreditation',
                sub: 'Reg D Rule 506(c) · Accredited investors only · Third-party verification',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconShieldOutline className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
              {
                name: 'Asset Details',
                sub: 'Real Estate · 2847 Peachtree Rd NE, Atlanta, GA · $12.5M valuation',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconCubeOutline className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
              {
                name: 'Legal Structure',
                sub: 'Delaware SPV · Pro-Rata Distributions · Information Rights encoded',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconDocumentOutline className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
              {
                name: 'Offering Setup',
                sub: '$5M target · $25K minimum · 12-month lock-up · Monthly distributions',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconTrendingUpOutline className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
              {
                name: 'Tokenization',
                sub: 'CPTT · ERC-1400 · Ethereum Mainnet · 1,000,000 supply @ $5.00',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconCpuChipOutline className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
              {
                name: 'Custody',
                sub: 'Anchorage Digital · 95% Cold / 5% Hot · 2-of-3 Multi-sig',
                badge: (
                  <ApplicationSummaryIconBadge>
                    <IconLockClosedOutline className="w-5 h-5" />
                  </ApplicationSummaryIconBadge>
                ),
              },
            ] as const
          ).map((item, i) => (
            <div
              key={item.name}
              className="p-6 bg-ui-card rounded-2xl border border-ui-border flex items-center gap-5 hover:bg-ui-muted-surface transition-colors group"
            >
              {item.badge}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ui-strong mb-0.5">{item.name}</p>
                <p className="text-[10px] text-ui-faint font-medium leading-relaxed">{item.sub}</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(i + 1)}
                className="text-[10px] font-bold text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <h3 className="text-sm font-bold text-ui-strong">Terms & Certification</h3>
        <div className="space-y-4">
          {[
            'I certify that all information provided is accurate and complete to the best of my knowledge.',
            'I understand that providing false information may result in rejection and potential legal liability.',
            'I agree to the Maxtronize Terms of Service, Privacy Policy, and Issuer Agreement.',
            'I consent to background checks and verification of all submitted documentation.'
          ].map((term, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-5 h-5 rounded-md border-2 border-primary bg-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-[11px] font-medium text-ui-body group-hover:text-ui-strong transition-colors">{term}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between pt-6 border-t border-ui-border">
        <button 
          onClick={() => setCurrentStep(7)}
          className="px-8 py-4 bg-ui-card border border-ui-border-strong rounded-2xl text-sm font-bold text-ui-muted-text hover:bg-ui-muted-deep transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button 
          onClick={() => setIsSubmitted(true)}
          className="px-10 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center gap-3 group"
        >
          Submit Application
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050508] p-6">
      {/* Deep purple / black radial hero */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(124,58,237,0.45)_0%,rgba(26,0,51,0.35)_35%,transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_100%,rgba(91,33,182,0.25)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-mesh auth-hero-mesh opacity-80" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.07]" aria-hidden />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center animate-in fade-in zoom-in duration-1000 space-y-10">
        <div className="relative inline-flex">
          <div className="absolute inset-0 scale-150 rounded-full bg-[var(--brand-cyan)]/25 blur-3xl" aria-hidden />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--brand-cyan)] shadow-[0_0_48px_-8px_rgba(0,212,168,0.65)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner">
              <svg
                className="h-8 w-8 text-[var(--brand-cyan-dark)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Application Submitted</h1>
          <p className="mx-auto max-w-md text-base font-medium text-zinc-400">
            Your issuance application is under compliance review.
          </p>
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md">
          {[
            { label: 'KYB Verification', time: '1–2 business days', status: 'active' as const },
            { label: 'Compliance Review', time: '2–3 business days', status: 'pending' as const },
            { label: 'Smart Contract Deployment', time: 'Upon approval', status: 'pending' as const },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${
                i < arr.length - 1 ? 'border-b border-white/[0.08]' : ''
              }`}
            >
              <div className="flex min-w-0 items-center gap-3 text-left">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    item.status === 'active' ? 'bg-[var(--brand-cyan)] shadow-[0_0_10px_rgba(0,212,168,0.8)]' : 'bg-white/25'
                  }`}
                />
                <span
                  className={`truncate text-sm font-semibold ${
                    item.status === 'active' ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {item.time}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-xs space-y-4 pt-2">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">
            Redirecting to your dashboard...
          </p>
          <div className="mx-auto h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="animate-progress h-full origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--brand-indigo)] to-[var(--brand-cyan)]" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/issuer/dashboard')}
          className="text-sm font-bold text-white/55 transition-colors hover:text-white"
        >
          Skip to Dashboard →
        </button>
      </div>
    </div>
  );

  if (isSubmitted) return renderSuccess();

  return (
    <OnboardingLayout currentStep={currentStep} showSaved={currentStep === 2}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
        {currentStep === 7 && renderStep7()}
        {currentStep === 8 && renderStep8()}
    </OnboardingLayout>
  );
}

function FormField({ label, placeholder, required, fullWidth, isSelect, hint }: { label: string, placeholder: string, required?: boolean, fullWidth?: boolean, isSelect?: boolean, hint?: string }) {
  return (
    <div className={`space-y-3 ${fullWidth ? 'md:col-span-2' : ''}`}>
      {label ? (
        <label className="text-[10px] font-bold text-ui-faint uppercase tracking-widest flex items-center gap-1">
          {label}
          {required && <span className="text-ui-danger-text font-bold">*</span>}
        </label>
      ) : null}
      {hint ? <p className={`text-[10px] text-ui-faint leading-relaxed ${label ? '' : '-mt-1'}`}>{hint}</p> : null}
      <div className="relative">
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full px-6 py-4 bg-ui-input border border-ui-border rounded-2xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder font-medium"
        />
        {isSelect && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function FileUploadField({ label, sub }: { label: string, sub: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">{label}</label>
      <div className="p-6 border-2 border-dashed border-ui-border rounded-3xl bg-ui-muted-surface flex flex-col items-center justify-center gap-2 hover:bg-ui-muted-deep hover:border-ui-border-strong transition-all cursor-pointer group">
        <p className="text-[10px] font-bold text-ui-faint uppercase tracking-wide group-hover:text-ui-muted-text transition-colors">{sub}</p>
        <p className="text-[11px] font-bold text-primary group-hover:underline">Click to upload PDF / JPG</p>
      </div>
    </div>
  );
}
