'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ForceLightTheme } from '@/components/ForceLightTheme';
import { MaxtronizeLogo } from '@/components/MaxtronizeLogo';

type Step = {
  id: number;
  name: string;
  desc: string;
  icon: React.ReactNode;
};

export default function TokenizeAssetPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US');
  const [selectedFramework, setSelectedFramework] = useState('Reg D');
  const [selectedEntity, setSelectedEntity] = useState('DE');
  const [selectedNetwork, setSelectedNetwork] = useState('ETH');

  const steps: Step[] = [
    { id: 1, name: 'Jurisdiction', desc: 'Select legal region & framework', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 2, name: 'Asset Details', desc: 'Define the underlying asset', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { id: 3, name: 'Legal Structure', desc: 'Configure SPV & compliance', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg> },
    { id: 4, name: 'Offering Setup', desc: 'Set terms & investor access', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 5, name: 'Tokenization', desc: 'Deploy on-chain', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { id: 6, name: 'Review & Submit', desc: 'Final review before launch', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
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
          {[
            { label: 'Accredited Investors Only', desc: 'Restrict to SEC-verified accredited', active: true },
            { label: 'Lock-up Period Enforced', desc: '12-month lock-up via smart contract', active: true },
            { label: 'OFAC Screening', desc: 'Real-time sanctions list checking', active: true }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-ui-muted-surface border border-ui-border rounded-[24px] space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${feature.active ? 'bg-primary' : 'bg-progress-track'}`}>
                  {feature.active && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-ui-strong">{feature.label}</p>
                <p className="text-[9px] text-ui-faint font-medium leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
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
             {[
               { label: 'Transfer Restrictions', desc: 'On-chain whitelist enforcement', icon: '🛡️' },
               { label: 'Automatic Distributions', desc: 'Smart contract yield payouts', icon: '⚡' },
               { label: 'Token Burn on Redemption', desc: 'Reduces supply on exit', icon: '🔥' },
               { label: 'Investor Cap per Address', desc: 'Limit max tokens per wallet', icon: '⚙️' }
             ].map((f, i) => (
               <div key={i} className="p-6 bg-ui-muted-surface border border-ui-border rounded-[24px] flex items-center justify-between group hover:bg-ui-card hover:shadow-sm transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-ui-card flex items-center justify-center shadow-sm text-sm">{f.icon}</div>
                    <div>
                       <p className="text-[12px] font-bold text-ui-strong">{f.label}</p>
                       <p className="text-[10px] text-ui-faint font-medium">{f.desc}</p>
                    </div>
                 </div>
                 <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-ui-card rounded-full transition-all"></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-[#1A1A2E] rounded-[40px] p-10 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-mesh opacity-20"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="text-[13px] font-bold">Ready to Deploy</p>
              </div>
              <div className="flex flex-wrap gap-10">
                 <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Network</p>
                   <p className="text-sm font-bold">Ethereum</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Supply</p>
                   <p className="text-sm font-bold">1.0M tokens</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Est. Gas</p>
                   <p className="text-sm font-bold">~$45</p>
                 </div>
              </div>
           </div>
           <p className="relative z-10 mt-6 text-[10px] text-white/30 leading-relaxed max-w-2xl">
             Clicking the Complete Setup button will submit this configuration for Maxtronize compliance review. Smart contract deployment occurs after approval (~24-48 hours).
           </p>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-4 text-center py-10">
        <div className="w-20 h-20 bg-ui-success-bg-soft text-ui-success-icon rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">✓</div>
        <h2 className="text-4xl font-bold text-ui-strong tracking-tight">Review & Submit</h2>
        <p className="text-ui-faint font-medium max-w-md mx-auto">Please review your asset configuration before submitting to the Maxtronize compliance protocol.</p>
      </div>

      <div className="bg-ui-card border border-ui-border rounded-[40px] p-10 shadow-sm space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {[
             { title: 'Jurisdiction', value: 'United States (SEC Reg D 506c)', icon: '🌐' },
             { title: 'Asset Details', value: 'Prime Office Tower — NYC ($10.0M)', icon: '🏢' },
             { title: 'Legal Structure', value: 'SPV — Delaware LLC (Sumsub KYC)', icon: '⚖️' },
             { title: 'Offering Terms', value: 'Min. $25k investment, Quarterly yield', icon: '⚙️' },
             { title: 'Blockchain', value: 'Ethereum Mainnet (ERC-1400)', icon: '⛓️' },
             { title: 'Token Symbol', value: 'PONYC (1,000,000 supply)', icon: '✨' }
           ].map((r, i) => (
             <div key={i} className="flex gap-5 items-start p-6 bg-ui-muted-surface rounded-[32px] border border-ui-divider group hover:bg-ui-card hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-ui-card shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{r.icon}</div>
                <div>
                   <p className="text-[10px] font-bold text-ui-faint uppercase tracking-widest mb-1">{r.title}</p>
                   <p className="text-[13px] font-bold text-ui-strong">{r.value}</p>
                </div>
             </div>
           ))}
        </div>
        <div className="p-8 bg-alert-info-bg rounded-[32px] border border-alert-info-border flex gap-5 items-center">
           <div className="w-10 h-10 bg-alert-info-icon-wrap-bg border border-alert-info-icon-wrap-border rounded-full flex items-center justify-center text-alert-info-icon shadow-sm text-lg">⚖️</div>
           <p className="text-[12px] text-alert-info-title font-medium leading-relaxed">
             By submitting, you agree to the Maxtronize Platform Terms of Service and acknowledge that asset issuance is subject to regulatory approval in your selected jurisdiction.
           </p>
        </div>
      </div>
    </div>
  );

  return (
    <ForceLightTheme>
    <div className="flex min-h-[100dvh] items-stretch overflow-hidden bg-background font-sans transition-colors duration-300">
      {/* Wizard Sidebar — stretches with row height (do not cap at 100dvh or gaps appear vs main column) */}
      <aside className="hidden min-h-0 shrink-0 bg-sidebar-bg border-r border-border md:flex md:w-72 md:flex-col lg:w-80 overflow-hidden">
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
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : currentStep > step.id 
                    ? 'bg-ui-success-bg-soft text-ui-success-icon border border-ui-success-border' 
                    : 'bg-ui-muted-deep text-ui-faint border border-ui-border'
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
      <main className="flex-1 flex flex-col relative min-w-0 min-h-0">
        <header className="sticky top-0 z-50 shrink-0 bg-card border-b border-ui-border">
          <div className="h-0.5 w-full bg-primary" aria-hidden />
          <div className="h-16 flex items-center justify-between px-4 md:px-8 lg:px-10 gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
              <span className="shrink-0 font-medium text-text-muted">Platform</span>
              <span className="shrink-0 text-ui-faint">›</span>
              <span className="min-w-0 truncate font-bold text-foreground">Tokenize Asset</span>
            </div>
            <div className="flex items-center gap-5 md:gap-8 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-emerald-600">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
              <Link
                href="/issuer/dashboard"
                className="text-xs md:text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 transition-colors"
              >
                <span className="hidden sm:inline">Skip to Dashboard</span>
                <span className="sm:hidden">Skip</span>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="relative h-1 w-full bg-[#eceef2] overflow-hidden">
            <div
              className="h-full rounded-none bg-linear-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] shadow-[0_0_12px_rgba(124,58,237,0.35)] transition-[width] duration-500 ease-out"
              style={{ width: `${(currentStep / 6) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={6}
              aria-label="Wizard progress"
            />
          </div>
        </header>

        <div className="flex-1 p-4 md:p-10 lg:p-16 overflow-y-auto bg-background">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="text-[13px] font-bold text-ui-faint hover:text-primary transition-colors flex items-center gap-2 w-fit"
              >
                <span className="text-lg">←</span> {currentStep === 1 ? 'Back to Dashboard' : 'Previous Step'}
              </button>
              {currentStep < 6 && (
                <button className="text-[11px] font-bold text-primary px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">Save Draft</button>
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
                <div className="w-24 h-24 bg-linear-to-br from-primary to-purple-600 rounded-[32px] flex items-center justify-center text-white text-4xl shadow-2xl shadow-primary/40 mb-10 relative">
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
          <footer className="px-16 py-8 flex items-center justify-between shrink-0">
            <button 
              className="text-[13px] font-bold text-ui-faint hover:text-ui-strong transition-colors uppercase tracking-widest"
              onClick={() => { window.location.href = '/issuer/dashboard'; }}
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (currentStep < 6) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setIsSubmitted(true);
                  setTimeout(() => {
                    window.location.href = '/issuer/dashboard';
                  }, 4000);
                }
              }}
              className="px-12 py-4 bg-primary text-white rounded-[18px] text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-px transition-all flex items-center gap-2"
            >
              {currentStep === 6 ? 'Complete Setup' : 'Continue'}
              <span className="text-lg">→</span>
            </button>
          </footer>
        )}
      </main>
    </div>
    </ForceLightTheme>
  );
}
