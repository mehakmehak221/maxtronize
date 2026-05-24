'use client';

import { useState, type ReactElement } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ComingSoonModal } from '@/components/issuer/ComingSoonModal';

export default function AIIntelligencePage(): ReactElement {
  const [showComingSoon, setShowComingSoon] = useState(true);
  const capabilities = [
    {
      title: 'AI Valuation Engine',
      desc: 'Real-time fair market value estimation using comps, rental income trends, growth rates, and vacancy data.',
      icon: '🎯',
      tags: ['Fair Value', 'Confidence Score', 'Trend Analysis'],
      color: 'bg-purple-500',
    },
    {
      title: 'AI Risk Scoring Engine',
      desc: 'Dynamic multi-factor risk scoring across liquidity, legal, market, geographic, and regulatory dimensions.',
      icon: '🛡️',
      tags: ['Risk Score', 'Factor Analysis', 'Real-Time'],
      color: 'bg-orange-500',
    },
    {
      title: 'AI Yield Forecasting',
      desc: 'Forecasts expected future returns, including rental yield, dividends, capital appreciation, and downside scenarios.',
      icon: '📈',
      tags: ['3-Year Forecast', 'Scenario Models', 'Downside Risk'],
      color: 'bg-green-500',
    },
    {
      title: 'AI Fraud & Anomaly Detection',
      desc: 'Detects fake valuations, duplicate documents, wash trading, wallet collusion, and suspicious subscriptions.',
      icon: '👁️',
      tags: ['Wash Trading', 'Anomaly Alerts', 'Doc Fingerprinting'],
      color: 'bg-rose-500',
    },
    {
      title: 'AI Investor Recommendation',
      desc: 'Matches investors with suitable tokenized assets based on risk appetite, ticket size, geography, and yield expectations.',
      icon: '⭐',
      tags: ['AI Matching', 'Portfolio Fit', 'Yield Alignment'],
      color: 'bg-blue-500',
    },
    {
      title: 'AI Market Sentiment Engine',
      desc: 'Tracks real-time market sentiment from news, social signals, macro indicators, and sector performance trends.',
      icon: '🌐',
      tags: ['News Analysis', 'Sector Signals', 'Macro Trends'],
      color: 'bg-indigo-500',
    },
    {
      title: 'AI NAV & Repricing Engine',
      desc: 'Recalculates token values using updated asset valuations, generated revenue, market demand, and available liquidity.',
      icon: '🔄',
      tags: ['Token Pricing', 'Secondary Market', 'Fair Value'],
      color: 'bg-cyan-500',
    },
    {
      title: 'AI Smart Compliance Monitoring',
      desc: 'Continuously monitors ownership concentration, suspicious transfers, sanction exposure, and jurisdiction breaches.',
      icon: '⚖️',
      tags: ['OFAC Screening', 'Concentration Risk', 'Real-Time'],
      color: 'bg-violet-500',
    },
  ];

  const stats = [
    { label: 'Assets Analyzed', value: '2,400+', icon: '🏢' },
    { label: 'Valuations per Day', value: '14,200', icon: '🎯' },
    { label: 'Detection Rate', value: '99.4%', icon: '🛡️' },
    { label: 'Valuation +/-5%', value: '94.7%', icon: '📊' },
  ];

  return (
    <DashboardLayout>
      <ComingSoonModal
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
      <div className="space-y-12 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A2E] p-8 text-white shadow-2xl md:rounded-[48px] md:p-16">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/4 translate-y-1/2 rounded-full bg-purple-500/10 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-16 lg:flex-row">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-background/10 bg-ui-card/5 px-4 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">AI Asset Intelligence | Coming Soon</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Institutional AI for <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-primary via-purple-400 to-primary/80 bg-clip-text text-transparent">Real-World Assets</span>
              </h1>
              <div className="inline-flex items-center gap-2">
                <span className="text-[11px] font-semibold text-white/35 uppercase tracking-widest">Powered by</span>
                <span className="text-[13px] font-extrabold tracking-tight bg-linear-to-r from-[#a78bfa] via-[#818cf8] to-[#6366f1] bg-clip-text text-transparent">Cortex</span>

              </div>
              <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Machine learning, predictive models, and real-time analytics power better pricing, smarter investments, and institutional-grade compliance monitoring.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {['8 AI Modules', 'Real-Time Processing', 'Issuer & Investor Tools', 'Fraud Detection', 'Smart Compliance'].map((tag, i) => (
                  <span key={i} className="px-5 py-2.5 bg-ui-card/5 border border-background/10 rounded-xl text-[12px] font-bold text-white/90 hover:bg-ui-card/10 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              {stats.map((stat, i) => (
                <div key={i} className="p-5 md:p-8 bg-ui-card/5 border border-background/10 rounded-[24px] md:rounded-[32px] backdrop-blur-xl hover:bg-ui-card/10 transition-all group">
                  <div className="text-2xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{stat.icon}</div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl">✨</div>
            <div>
              <h2 className="text-xl font-bold text-ui-strong">8 Core AI Capabilities</h2>
              <p className="text-sm text-ui-faint font-medium">Powering the next generation of digital finance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <div key={i} className="group bg-ui-card border border-ui-border rounded-[24px] md:rounded-[32px] p-6 md:p-10 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all"></div>

                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-black/5 group-hover:scale-110 transition-transform ${cap.color} text-white`}>
                    {cap.icon}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowComingSoon(true)}
                    className="w-10 h-10 rounded-full border border-ui-border flex items-center justify-center text-ui-faint hover:text-primary hover:border-primary/20 transition-all"
                    aria-label={`${cap.title} - coming soon`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-ui-strong">{cap.title}</h3>
                    <div className={`w-1.5 h-1.5 rounded-full ${cap.color}`}></div>
                  </div>
                  <p className="text-[13px] text-ui-muted-text font-medium leading-relaxed">
                    {cap.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-ui-divider">
                  {cap.tags.map((tag, j) => (
                    <span key={j} className="px-4 py-1.5 bg-ui-muted-deep rounded-lg text-[10px] font-bold text-ui-faint group-hover:bg-ui-muted-deep group-hover:text-ui-body transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
