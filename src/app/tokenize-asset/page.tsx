'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ForceLightTheme } from '@/components/ForceLightTheme';
import { MaxtronizeLogo } from '@/components/MaxtronizeLogo';
import {
  TokenizeWizardGlobeIcon,
  TokenizeWizardBuildingIcon,
  TokenizeWizardScalesIcon,
  TokenizeWizardGearIcon,
  TokenizeWizardLayersIcon,
  TokenizeWizardShieldCheckIcon,
  TokenizeBurnChipIcon,
  TokenizeFeatureBoltIcon,
} from '@/app/VectorImages';

type Step = {
  id: number;
  name: string;
  desc: string;
  icon: React.ReactNode;
};

const LEGAL_COMPLIANCE_FEATURES = [
  { id: 'accredited' as const, label: 'Accredited Investors Only', desc: 'Restrict to SEC-verified accredited' },
  { id: 'lockup' as const, label: 'Lock-up Period Enforced', desc: '12-month lock-up via smart contract' },
  { id: 'ofac' as const, label: 'OFAC Screening', desc: 'Real-time sanctions list checking' },
] as const;

type LegalComplianceId = (typeof LEGAL_COMPLIANCE_FEATURES)[number]['id'];

const TOKENIZATION_SMART_FEATURES = [
  {
    id: 'transferRestrictions' as const,
    label: 'Transfer Restrictions',
    desc: 'On-chain whitelist enforcement',
    iconKey: 'shield' as const,
  },
  {
    id: 'autoDistributions' as const,
    label: 'Automatic Distributions',
    desc: 'Smart contract yield payouts',
    iconKey: 'bolt' as const,
  },
  {
    id: 'tokenBurn' as const,
    label: 'Token Burn on Redemption',
    desc: 'Reduces supply on exit',
    iconKey: 'chip' as const,
  },
  {
    id: 'investorCap' as const,
    label: 'Investor Cap per Address',
    desc: 'Limit max tokens per wallet',
    iconKey: 'gear' as const,
  },
] as const;

type TokenizationSmartId = (typeof TOKENIZATION_SMART_FEATURES)[number]['id'];

const TOKENIZATION_ICON_MAP = {
  shield: TokenizeWizardShieldCheckIcon,
  bolt: TokenizeFeatureBoltIcon,
  chip: TokenizeBurnChipIcon,
  gear: TokenizeWizardGearIcon,
} as const;

export default function TokenizeAssetPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US');
  const [selectedFramework, setSelectedFramework] = useState('Reg D');
  const [selectedEntity, setSelectedEntity] = useState('DE');
  const [selectedNetwork, setSelectedNetwork] = useState('ETH');
  const [legalComplianceToggles, setLegalComplianceToggles] = useState<Record<LegalComplianceId, boolean>>({
    accredited: true,
    lockup: true,
    ofac: true,
  });
  const [tokenizationSmartToggles, setTokenizationSmartToggles] = useState<Record<TokenizationSmartId, boolean>>({
    transferRestrictions: true,
    autoDistributions: true,
    tokenBurn: false,
    investorCap: false,
  });

  const steps: Step[] = [
    { id: 1, name: 'Jurisdiction', desc: 'Select legal region & framework', icon: <TokenizeWizardGlobeIcon className="shrink-0" /> },
    { id: 2, name: 'Asset Details', desc: 'Define the underlying asset', icon: <TokenizeWizardBuildingIcon className="shrink-0" /> },
    { id: 3, name: 'Legal Structure', desc: 'Configure SPV & compliance', icon: <TokenizeWizardScalesIcon className="shrink-0" /> },
    { id: 4, name: 'Offering Setup', desc: 'Set terms & investor access', icon: <TokenizeWizardGearIcon className="shrink-0" /> },
    { id: 5, name: 'Tokenization', desc: 'Deploy on-chain', icon: <TokenizeWizardLayersIcon className="shrink-0" /> },
    { id: 6, name: 'Review & Submit', desc: 'Final review before launch', icon: <TokenizeWizardShieldCheckIcon className="shrink-0" /> },
  ];

  const jurisdictions = [
    { id: 'US', name: 'United States', sub: 'SEC Reg D / Reg S / Reg A+', flag: '🇺🇸' },
    { id: 'EU', name: 'European Union', sub: 'MiCA Compliant (ESMA)', flag: '🇪🇺' },
    { id: 'SG', name: 'Singapore', sub: 'MAS Capital Markets Services', flag: '🇸🇬' },
    { id: 'CH', name: 'Switzerland', sub: 'FINMA DLT Securities', flag: '🇨🇭' },
    { id: 'AE', name: 'UAE / ADGM', sub: 'Abu Dhabi Global Market', flag: '🇦🇪' },
    { id: 'GB', name: 'United Kingdom', sub: 'FCA Regulated', flag: '🇬🇧' },
  ];

  const frameworks = [
    { id: 'Reg D', name: 'Reg D (506c)', desc: 'Accredited Investors — unlimited raise amount' },
    { id: 'Reg S', name: 'Reg S', desc: 'Non-US investors only — no US offering' },
    { id: 'Reg A+', name: 'Reg A+', desc: 'Retail investors — up to $75M per year' },
  ];

  const entities = [
    { id: 'DE', name: 'SPV — Delaware LLC', desc: 'Most common. Single-purpose vehicle, pass-through taxation, limited liability.' },
    { id: 'KY', name: 'Cayman Islands Ltd.', desc: 'Preferred for international investors. Exempted company structure.' },
    { id: 'LU', name: 'Luxembourg SARL', desc: 'EU-preferred. Regulated AIF structure with AIFMD compliance.' },
    { id: 'SG_VCC', name: 'Singapore VCC', desc: 'Variable Capital Company — designed for investment funds.' },
  ];

  const networks = [
    { id: 'ETH', name: 'Ethereum', standard: 'ERC-1400', desc: 'Highest liquidity & compatibility. $18–80 gas/tx.', icon: '🌐', color: 'bg-indigo-500' },
    { id: 'POLY', name: 'Polygon', standard: 'ERC-1400', desc: 'Low fees, fast finality. Ethereum-compatible.', icon: '⬡', color: 'bg-purple-500' },
    { id: 'ALGO', name: 'Algorand', standard: 'ASA', desc: 'Carbon-negative, instant finality, $0.001/tx.', icon: '🅰️', color: 'bg-ui-strong' },
  ];

  const renderJurisdiction = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-progress-track'
              }`}></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 1 of 6</span>
        </div>
        <h2 className="text-4xl font-bold text-ui-strong tracking-tight">Jurisdiction</h2>
        <p className="text-ui-faint font-medium">Select legal region & framework</p>
      </div>

      <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-12">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-ui-strong">Select primary jurisdiction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jurisdictions.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJurisdiction(j.id)}
                className={`p-6 rounded-[24px] border transition-all flex items-center justify-between group ${
                  selectedJurisdiction === j.id 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5 shadow-md shadow-primary/5' 
                    : 'border-ui-border hover:border-ui-border-strong hover:bg-ui-muted-deep'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <span className="text-2xl">{j.flag}</span>
                  <div>
                    <p className="text-[13px] font-bold text-ui-strong">{j.name}</p>
                    <p className="text-[10px] text-ui-faint font-medium">{j.sub}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedJurisdiction === j.id 
                    ? 'border-primary bg-primary' 
                    : 'border-ui-border-strong group-hover:border-gray-300'
                }`}>
                  {selectedJurisdiction === j.id && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-ui-strong">Regulatory framework</h3>
          <div className="space-y-3">
            {frameworks.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFramework(f.id)}
                className={`w-full p-6 rounded-[24px] border transition-all flex items-center justify-between group ${
                  selectedFramework === f.id 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                    : 'border-ui-border hover:border-ui-border-strong hover:bg-ui-muted-deep'
                }`}
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedFramework === f.id 
                      ? 'border-primary' 
                      : 'border-ui-border-strong group-hover:border-gray-300'
                  }`}>
                    {selectedFramework === f.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in-50"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-ui-strong">{f.name}</p>
                    <p className="text-[10px] text-ui-faint font-medium">{f.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-alert-info-bg rounded-[24px] border border-alert-info-border flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-alert-info-icon-wrap-bg border border-alert-info-icon-wrap-border flex items-center justify-center text-alert-info-icon shadow-sm shrink-0 mt-0.5 text-sm font-bold">i</div>
          <p className="text-[11px] text-alert-info-title/80 leading-relaxed font-medium italic">
            Jurisdiction selection affects investor eligibility, transfer restrictions, and token holder reporting obligations. Our compliance team will review your selection before launch.
          </p>
        </div>
      </div>
    </div>
  );

  const renderAssetDetails = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-2 bg-success' : 'w-2 bg-progress-track'
              }`}></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 2 of 6</span>
        </div>
        <h2 className="text-4xl font-bold text-ui-strong tracking-tight">Asset Details</h2>
        <p className="text-ui-faint font-medium">Define the underlying asset</p>
      </div>

      <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Asset Name *</label>
            <input type="text" placeholder="e.g. Prime Office Tower — New York City" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Asset Class *</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium appearance-none outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all">
                <option>Commercial Real Estate</option>
                <option>Private Equity</option>
                <option>Venture Capital</option>
                <option>Infrastructure</option>
              </select>
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Appraised Valuation (USD) *</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-ui-faint font-bold">$</span>
              <input type="text" placeholder="5,000,000" className="w-full pl-10 pr-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Asset Location</label>
            <input type="text" placeholder="City, State / Country" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Expected Annual Yield (%)</label>
            <input type="text" placeholder="e.g. 8.5" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Asset Description</label>
            <textarea placeholder="Describe the asset, its investment highlights, income potential, and risk factors..." rows={4} className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all resize-none"></textarea>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-ui-divider">
          <h3 className="text-sm font-bold text-ui-strong">Supporting Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Property Appraisal', sub: 'Certified third-party appraisal (PDF)' },
              { label: 'Title / Deed', sub: 'Ownership verification document (PDF)' },
              { label: 'Financial Statements', sub: 'Last 2 years of financials (PDF/XLSX)' },
              { label: 'Pitch Deck', sub: 'Investor presentation (PDF, max 50MB)' }
            ].map((doc, i) => (
              <div key={i} className="p-6 border-2 border-dashed border-ui-border rounded-[24px] hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-ui-muted-deep flex items-center justify-center text-primary group-hover:bg-ui-card group-hover:shadow-sm transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ui-strong">{doc.label}</p>
                  <p className="text-[10px] text-ui-faint font-medium">{doc.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLegalStructure = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-2 bg-success' : 'w-2 bg-progress-track'
              }`}></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 3 of 6</span>
        </div>
        <h2 className="text-4xl font-bold text-ui-strong tracking-tight">Legal Structure</h2>
        <p className="text-ui-faint font-medium">Configure SPV & compliance</p>
      </div>

      <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-10">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-ui-strong">Entity / SPV Structure</h3>
          <div className="space-y-3">
            {entities.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEntity(e.id)}
                className={`w-full p-6 rounded-[24px] border transition-all flex items-center justify-between group ${
                  selectedEntity === e.id 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                    : 'border-ui-border hover:border-ui-border-strong hover:bg-ui-muted-deep'
                }`}
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedEntity === e.id 
                      ? 'border-primary' 
                      : 'border-ui-border-strong group-hover:border-gray-300'
                  }`}>
                    {selectedEntity === e.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in-50"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-ui-strong">{e.name}</p>
                    <p className="text-[10px] text-ui-faint font-medium leading-relaxed max-w-xl">{e.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Operating Agreement</label>
            <div className="p-6 border-2 border-dashed border-ui-border rounded-[24px] hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-ui-muted-deep flex items-center justify-center text-primary group-hover:bg-ui-card shadow-sm transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <p className="text-[11px] font-bold text-ui-muted-text">Upload signed agreement (PDF)</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Formation Jurisdiction</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium appearance-none outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all">
                <option>Delaware, US</option>
                <option>British Virgin Islands</option>
                <option>Cayman Islands</option>
              </select>
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">KYC Provider</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium appearance-none outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all">
                <option>Maxtronize Default (Sumsub)</option>
                <option>Jumio</option>
                <option>Onfido</option>
              </select>
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">AML Screening</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium appearance-none outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all">
                <option>Real-time (Refinitiv)</option>
                <option>Daily Batch</option>
                <option>Manual Review</option>
              </select>
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEGAL_COMPLIANCE_FEATURES.map((feature) => {
            const active = legalComplianceToggles[feature.id];
            return (
              <button
                key={feature.id}
                type="button"
                aria-pressed={active}
                aria-label={`${feature.label}: ${active ? 'on' : 'off'}`}
                onClick={() =>
                  setLegalComplianceToggles((prev) => ({
                    ...prev,
                    [feature.id]: !prev[feature.id],
                  }))
                }
                className="rounded-[24px] border border-ui-border bg-ui-muted-surface p-6 text-left transition-colors hover:border-ui-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white ${
                      active ? 'bg-primary' : 'border border-ui-border-strong bg-ui-card'
                    }`}
                    aria-hidden
                  >
                    {active && (
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${
                      active ? 'bg-primary/20' : 'bg-ui-muted-deep'
                    }`}
                    aria-hidden
                  >
                    <span
                      className={`absolute top-1 h-3 w-3 rounded-full transition-all ${
                        active ? 'right-1 bg-primary' : 'left-1 bg-ui-faint'
                      }`}
                    />
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-[11px] font-bold text-ui-strong">{feature.label}</p>
                  <p className="text-[9px] font-medium leading-relaxed text-ui-faint">{feature.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderOfferingSetup = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-2 bg-success' : 'w-2 bg-progress-track'
              }`}></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 4 of 6</span>
        </div>
        <h2 className="text-4xl font-bold text-ui-strong tracking-tight">Offering Setup</h2>
        <p className="text-ui-faint font-medium">Set terms & investor access</p>
      </div>

      <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Offering Target (USD) *</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-ui-faint font-bold">$</span>
              <input type="text" placeholder="10,000,000" className="w-full pl-10 pr-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Minimum Investment (USD) *</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-ui-faint font-bold">$</span>
              <input type="text" placeholder="25,000" className="w-full pl-10 pr-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Offering Start Date</label>
            <input type="date" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Offering End Date</label>
            <input type="date" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Investor Accreditation</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium appearance-none outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all">
                <option>SEC Accredited Only</option>
                <option>Qualified Purchasers</option>
                <option>Non-Accredited (Reg A+)</option>
              </select>
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Distribution Frequency</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium appearance-none outline-none focus:bg-ui-input-focus focus:border-primary/20 transition-all">
                <option>Quarterly Payouts</option>
                <option>Monthly Payouts</option>
                <option>Annual Payouts</option>
                <option>End of Term</option>
              </select>
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Offering Preview Panel */}
        <div className="p-10 bg-primary/5 rounded-[40px] border border-primary/10 space-y-8">
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Offering Preview</p>
          <div className="grid grid-cols-3 gap-12">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-ui-strong">$10.0M</p>
              <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Target Capital</p>
            </div>
            <div className="space-y-2 px-12 border-x border-primary/10">
              <p className="text-3xl font-bold text-ui-strong">1,000,000</p>
              <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Estimated Tokens</p>
            </div>
            <div className="space-y-2 pl-4">
              <p className="text-3xl font-bold text-ui-strong">$10.00</p>
              <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Token Price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTokenization = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-2 bg-success' : 'w-2 bg-progress-track'
              }`}></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Step 5 of 6</span>
        </div>
        <h2 className="text-4xl font-bold text-ui-strong tracking-tight">Tokenization</h2>
        <p className="text-ui-faint font-medium">Deploy on-chain</p>
      </div>

      <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-10">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-ui-strong">Select blockchain network</h3>
          <div className="space-y-3">
            {networks.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNetwork(n.id)}
                className={`w-full p-6 rounded-[24px] border transition-all flex items-center justify-between group ${
                  selectedNetwork === n.id 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                    : 'border-ui-border hover:border-ui-border-strong hover:bg-ui-muted-deep'
                }`}
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white ${n.color} shadow-lg shadow-black/5 group-hover:scale-105 transition-transform`}>
                    {n.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-bold text-ui-strong">{n.name}</p>
                      <span className="px-2 py-0.5 bg-ui-muted-deep text-ui-muted-text rounded text-[9px] font-bold uppercase tracking-wider">{n.standard}</span>
                    </div>
                    <p className="text-[10px] text-ui-faint font-medium leading-relaxed max-w-xl">{n.desc}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedNetwork === n.id 
                    ? 'border-primary bg-primary' 
                    : 'border-ui-border-strong group-hover:border-gray-300'
                }`}>
                  {selectedNetwork === n.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-ui-card scale-50"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Token Name *</label>
            <input type="text" placeholder="e.g. Prime Office NYC Token" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Token Symbol *</label>
            <input type="text" placeholder="E.G. PONYC" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Total Token Supply</label>
            <input type="text" placeholder="1,000,000" className="w-full px-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-ui-faint uppercase tracking-widest">Initial Token Price (USD)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-ui-faint font-bold">$</span>
              <input type="text" placeholder="10.00" className="w-full pl-10 pr-6 py-4 bg-ui-muted-deep border border-transparent rounded-2xl text-[13px] font-medium focus:bg-ui-input-focus focus:border-primary/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-ui-divider">
          <h3 className="text-sm font-bold text-ui-strong">Smart Contract Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOKENIZATION_SMART_FEATURES.map((f) => {
              const active = tokenizationSmartToggles[f.id];
              const Icon = TOKENIZATION_ICON_MAP[f.iconKey];
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${f.label}: ${active ? 'on' : 'off'}`}
                  onClick={() =>
                    setTokenizationSmartToggles((prev) => ({
                      ...prev,
                      [f.id]: !prev[f.id],
                    }))
                  }
                  className="flex items-center justify-between gap-4 rounded-[24px] border border-ui-border bg-ui-muted-surface p-6 text-left transition-all hover:border-ui-border-strong hover:bg-ui-card hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                        active ? 'bg-primary/10 text-primary' : 'bg-ui-muted-deep text-[#90A1B9]'
                      }`}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-ui-strong">{f.label}</p>
                      <p className="text-[10px] font-medium text-ui-faint">{f.desc}</p>
                    </div>
                  </div>
                  <span
                    className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${
                      active ? 'bg-primary' : 'bg-ui-muted-deep'
                    }`}
                    aria-hidden
                  >
                    <span
                      className={`absolute top-1 h-3 w-3 rounded-full transition-all ${
                        active ? 'right-1 bg-ui-card' : 'left-1 bg-ui-card'
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/6 bg-[#0B0E14] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,#1A1535_0%,transparent_45%,#0B0E14_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-28 -top-32 h-[300px] w-[300px] rounded-full bg-[#5b21b6]/40 blur-[90px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_100%_-5%,rgba(99,102,241,0.22),transparent_58%)]"
            aria-hidden
          />

          <div className="relative z-10 space-y-8 p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-[#00FFA3] shadow-[0_0_14px_rgba(0,255,163,0.7)]"
                  aria-hidden
                />
                <p className="text-[14px] font-semibold tracking-tight text-white">Ready to Deploy</p>
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10 lg:ml-auto lg:max-w-2xl lg:gap-14">
                {[
                  { label: 'Network', value: 'Ethereum' },
                  { label: 'Supply', value: '1.0M tokens' },
                  { label: 'Est. Gas', value: '~$45' },
                ].map((row) => (
                  <div key={row.label} className="min-w-0">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#90A1B9]">
                      {row.label}
                    </p>
                    <p className="text-[15px] font-bold tracking-tight text-white">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="max-w-3xl text-left text-[11px] font-medium leading-relaxed text-[#90A1B9]">
              Clicking &quot;Complete Setup&quot; will submit this configuration for Maxtronize compliance review. Smart
              contract deployment occurs after approval (~48 hours).
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => {
    const jurisdictionName = jurisdictions.find((j) => j.id === selectedJurisdiction)?.name ?? 'United States';
    const regulatoryFramework =
      selectedFramework === 'Reg D'
        ? 'SEC Regulation D (506c)'
        : selectedFramework === 'Reg S'
          ? 'SEC Regulation S'
          : 'SEC Regulation A+';
    const investorType = legalComplianceToggles.accredited ? 'Accredited Investors Only' : 'Per selected framework';
    const entityName = entities.find((e) => e.id === selectedEntity)?.name ?? 'SPV — Delaware LLC';
    const net = networks.find((n) => n.id === selectedNetwork);
    const blockchainLine = net ? `${net.name} (${net.standard})` : 'Ethereum (ERC-1400)';
    const lockupLine = legalComplianceToggles.lockup
      ? '12 months (smart contract enforced)'
      : 'As configured';
    const amlLine = legalComplianceToggles.ofac
      ? 'Automatic — Maxtronize Engine'
      : 'Standard batch screening';

    const reviewSections = [
      {
        badge: 'Jurisdiction',
        badgeClass: 'bg-[#7c3aed] text-white shadow-sm shadow-violet-500/20',
        rows: [
          { label: 'Jurisdiction', value: jurisdictionName },
          { label: 'Regulatory Framework', value: regulatoryFramework },
          { label: 'Investor Type', value: investorType },
        ],
      },
      {
        badge: 'Asset',
        badgeClass: 'bg-sky-500 text-white shadow-sm shadow-sky-500/25',
        rows: [
          { label: 'Asset Name', value: 'Prime Office Tower — New York City' },
          { label: 'Asset Class', value: 'Commercial Real Estate' },
          { label: 'Appraised Valuation', value: '$42,500,000 USD' },
          { label: 'Location', value: 'New York City, NY' },
          { label: 'Expected Yield', value: '8.5% per annum' },
        ],
      },
      {
        badge: 'Legal Structure',
        badgeClass: 'bg-orange-500 text-white shadow-sm shadow-orange-500/25',
        rows: [
          { label: 'Entity Type', value: entityName },
          { label: 'KYC Provider', value: 'Maxtronize Integrated KYC' },
          { label: 'AML Screening', value: amlLine },
          { label: 'Lock-up Period', value: lockupLine },
        ],
      },
      {
        badge: 'Offering',
        badgeClass: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25',
        rows: [
          { label: 'Target Capital', value: '$10,000,000 USD' },
          { label: 'Min. Investment', value: '$25,000 USD' },
          { label: 'Offering Period', value: '180 days' },
          { label: 'Distribution', value: 'Quarterly' },
        ],
      },
      {
        badge: 'Tokenization',
        badgeClass: 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/25',
        rows: [
          { label: 'Blockchain', value: blockchainLine },
          { label: 'Token Name', value: 'Prime Office NYC Token' },
          { label: 'Token Symbol', value: 'PONYC' },
          { label: 'Total Supply', value: '1,000,000 tokens' },
          { label: 'Initial Price', value: '$10.00 USD per token' },
        ],
      },
    ];

    return (
      <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-2 bg-success' : 'w-2 bg-progress-track'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 6 of 6</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-ui-strong">Review &amp; Submit</h2>
          <p className="font-medium text-ui-faint">Final review before launch</p>
        </div>

        <div className="space-y-10 rounded-[40px] border border-ui-border bg-ui-card p-8 shadow-sm md:p-10">
          <div className="flex gap-4 rounded-2xl border border-violet-200/90 bg-violet-50/90 p-5 md:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-white text-[#7c3aed] shadow-sm">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-[12px] font-medium leading-relaxed text-[#5b21b6]/90 md:text-[13px]">
              Please review all details carefully before submitting. Once submitted, our compliance team will review your
              application within 48 hours. You&apos;ll receive an email confirmation.
            </p>
          </div>

          <div className="space-y-10">
            {reviewSections.map((section, idx) => (
              <div
                key={section.badge}
                className={idx < reviewSections.length - 1 ? 'border-b border-[#eceef2] pb-10' : ''}
              >
                <span
                  className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${section.badgeClass}`}
                >
                  {section.badge}
                </span>
                <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
                  {section.rows.map((row) => (
                    <div key={`${section.badge}-${row.label}`} className="min-w-0 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">{row.label}</p>
                      <p className="text-[13px] font-bold leading-snug text-ui-strong">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-ui-divider pt-8 md:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-700/90">Compliance check</p>
              <p className="text-lg font-bold text-emerald-800">Passed</p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-sky-200 bg-sky-50/95 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                <TokenizeWizardLayersIcon className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-sky-700/90">Document status</p>
              <p className="text-lg font-bold text-sky-800">4 / 4 Uploaded</p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-violet-200 bg-violet-50/95 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-700/90">Est. review time</p>
              <p className="text-lg font-bold text-violet-900">24–48 hours</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ForceLightTheme>
    <div className="flex h-dvh min-h-0 max-h-dvh w-full overflow-hidden bg-background font-sans transition-colors duration-300">
      {/* Wizard sidebar: fixed height with parent; step list scrolls only if it overflows */}
      <aside className="hidden h-full min-h-0 shrink-0 bg-sidebar-bg border-r border-border md:flex md:w-72 md:flex-col lg:w-80 overflow-hidden">
        <div className="flex h-16 shrink-0 items-center border-b border-ui-divider px-5 md:px-6">
          <Link href="/issuer/dashboard" className="block min-w-0 w-full max-w-[240px]">
            <div className="relative h-8 w-full max-w-[240px]">
              <MaxtronizeLogo
                fill
                sizes="240px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="shrink-0 p-8 border-b border-ui-divider">
          <h2 className="text-lg font-bold text-ui-strong mb-1">Tokenization Wizard</h2>
          <p className="text-xs text-ui-faint font-medium">6-step guided asset setup</p>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-8 space-y-6 scrollbar-hide">
          {steps.map((step) => (
            <div key={step.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                  currentStep === step.id 
                    ? 'bg-linear-to-br from-[#9810FA] to-[#4F39F6] text-white shadow-lg shadow-[#9810FA]/25' 
                    : currentStep > step.id 
                    ? 'bg-ui-success-bg-soft text-ui-success-icon border border-ui-success-border' 
                    : 'bg-ui-muted-deep text-[#90A1B9] border border-ui-border'
                }`}>
                  {currentStep > step.id ? '✓' : step.icon}
                </div>
                {step.id !== 6 && (
                  <div className={`w-0.5 flex-1 my-2 rounded-full ${
                    currentStep > step.id ? 'bg-success' : 'bg-ui-muted-deep'
                  }`}></div>
                )}
              </div>
              <div className="pt-1">
                <p className={`text-[13px] font-bold transition-colors ${
                  currentStep === step.id ? 'text-ui-strong' : 'text-ui-faint'
                }`}>{step.name}</p>
                <p className="text-[10px] text-ui-faint font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-8 border-t border-ui-divider bg-ui-muted-surface">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">Progress</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{Math.round(((currentStep - 1) / 6) * 100)}%</p>
            </div>
            <div className="w-full h-1.5 bg-ui-muted-deep rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentStep - 1) / 6) * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-ui-faint font-medium">Step {currentStep} of 6</p>
          </div>

          <div className="mt-10 p-6 bg-primary/5 rounded-[24px] border border-primary/10 relative">
            <p className="text-[11px] font-bold text-ui-strong mb-2">Need compliance help?</p>
            <p className="text-[10px] text-ui-muted-text leading-relaxed mb-4">Our legal team is available 24/7 to guide your setup.</p>
            <button className="text-[10px] font-bold text-primary flex items-center gap-2 group">
              Contact Support 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-header-bg px-4 backdrop-blur-md md:px-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-text-muted font-medium">Platform</span>
              <span className="text-border">›</span>
              <span className="text-foreground font-bold">Tokenize Asset</span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button type="button" onClick={() => router.push('/issuer/dashboard')} className="text-text-muted hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-ui-muted-deep relative overflow-hidden border border-ui-border">
               <MaxtronizeLogo fill sizes="32px" className="object-contain scale-125" alt="Maxtronize Logo" />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-background p-4 md:p-10 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1) {
                    router.push('/issuer/dashboard');
                  } else {
                    setCurrentStep(Math.max(1, currentStep - 1));
                  }
                }}
                className="flex w-fit items-center gap-2 text-[13px] font-bold text-ui-faint transition-colors hover:text-primary"
              >
                <span className="text-lg">←</span>
                {currentStep === 1 ? 'Back to Dashboard' : currentStep === 6 ? 'Back' : 'Previous Step'}
              </button>
              {currentStep < 6 && (
                <button
                  type="button"
                  className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-2 text-[11px] font-bold text-primary"
                >
                  Save Draft
                </button>
              )}
            </div>

            {currentStep === 1 && renderJurisdiction()}
            {currentStep === 2 && renderAssetDetails()}
            {currentStep === 3 && renderLegalStructure()}
            {currentStep === 4 && renderOfferingSetup()}
            {currentStep === 5 && renderTokenization()}
            {currentStep === 6 && !isSubmitted && renderReview()}

            {isSubmitted && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-[32px] flex items-center justify-center text-white text-4xl shadow-2xl shadow-primary/40 mb-10 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-xl opacity-50"></div>
                  <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                <h2 className="text-4xl font-bold text-ui-strong tracking-tight mb-4">Application Submitted!</h2>
                <p className="text-ui-faint font-medium max-w-lg mx-auto mb-12 leading-relaxed">
                  Your tokenization application for <span className="text-ui-strong font-bold">Prime Office Tower NYC</span> has been submitted for compliance review. Our team will process it within 24–48 hours.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
                  {[
                    { label: 'Application ID', val: 'APP-007' },
                    { label: 'Asset Value', val: '$42.5M' },
                    { label: 'Status', val: 'Under Review', color: 'text-primary' }
                  ].map((card, i) => (
                    <div key={i} className="bg-ui-card border border-ui-border rounded-[24px] p-6 shadow-sm">
                      <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-2">{card.label}</p>
                      <p className={`text-xl font-bold ${card.color || 'text-ui-strong'}`}>{card.val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[13px] font-bold text-primary animate-pulse">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Redirecting to Dashboard...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar Footer */}
        {!isSubmitted && (
          <footer className="flex shrink-0 items-center justify-between border-t border-border bg-header-bg px-6 py-6 backdrop-blur-md md:px-16">
            {currentStep === 6 ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="text-[13px] font-semibold text-[#64748b] transition-colors hover:text-ui-strong"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(true);
                    setTimeout(() => {
                      router.push('/issuer/dashboard');
                    }, 4000);
                  }}
                  className="flex items-center gap-2 rounded-[18px] bg-linear-to-r from-[#9810FA] to-[#4F39F6] px-6 py-3.5 text-[13px] font-bold text-white shadow-lg shadow-[#9810FA]/25 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#4F39F6]/30 active:translate-y-px"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Submit for Compliance Review
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="text-[13px] font-bold uppercase tracking-widest text-ui-faint transition-colors hover:text-ui-strong"
                  onClick={() => router.push('/issuer/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep < 6) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      setIsSubmitted(true);
                      setTimeout(() => {
                        router.push('/issuer/dashboard');
                      }, 4000);
                    }
                  }}
                  className="flex items-center gap-2 rounded-[18px] bg-linear-to-r from-[#9810FA] to-[#4F39F6] px-12 py-4 text-[13px] font-bold text-white shadow-lg shadow-[#9810FA]/25 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#4F39F6]/30 active:translate-y-px"
                >
                  Continue
                  <span className="text-lg">→</span>
                </button>
              </>
            )}
          </footer>
        )}
      </main>
    </div>
    </ForceLightTheme>
  );
}
