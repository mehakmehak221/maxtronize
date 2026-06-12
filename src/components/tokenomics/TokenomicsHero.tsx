'use client';

import { ArrowRight, BarChart3, ShieldCheck, Target } from 'lucide-react';
import QuarterlyLineChart from '../charts/QuarterlyLineChart';
import Reveal from '../Reveal';
import TokenomicsScene from '../TokenomicsScene';
import { allocations, heroContent, heroMetrics } from '@/lib/tokenomics-data';

export default function TokenomicsHero() {
  return (
    <section id="overview" className="te-hero" style={{ textAlign: 'left' }}>
      <div className="te-hero-halo" aria-hidden />

      <div className="page-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pb-8 pt-4">
          <div>
            <Reveal eager variant="blur">
              <p className="te-kicker">{heroContent.kicker}</p>
            </Reveal>
            <Reveal eager variant="blur" delay={80}>
              <h1 className="te-h1" style={{ margin: '0 0 1rem 0', maxWidth: 'none', textAlign: 'left' }}>
                A <span className="te-gradient-text">Shield</span>, Not A{' '}
                <span className="te-gradient-text">Security</span>
              </h1>
            </Reveal>
            <Reveal eager variant="up" delay={160}>
              <p className="te-lead" style={{ margin: '0', maxWidth: 'none' }}>{heroContent.lead}</p>
              <p className="te-lead" style={{ marginTop: '0.65rem', margin: '0.65rem 0 0 0', maxWidth: 'none' }}>{heroContent.body}</p>
              <p className="te-note" style={{ marginTop: '0.75rem', margin: '0.75rem 0 0 0', maxWidth: 'none' }}>{heroContent.footnote}</p>
            </Reveal>
            <Reveal eager variant="up" delay={240}>
              <div className="te-hero-btns" style={{ justifyContent: 'flex-start', marginTop: '2rem' }}>
                <a href="#framework" className="te-btn te-btn-primary">
                  Shield Framework <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#supply" className="te-btn te-btn-outline">Supply & Distribution</a>
              </div>
            </Reveal>
          </div>
          
          <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] w-full hidden md:block">
            <Reveal eager variant="scale" delay={300} className="w-full h-full">
              <div className="absolute inset-0">
                <TokenomicsScene />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="te-hero-arc" aria-hidden />

        <Reveal eager variant="up" delay={300}>
          <div className="te-hero-cards">
            <div className="te-glass te-feature-card w3-metric-enter">
              <div className="te-feature-icon"><Target className="h-4 w-4" /></div>
              <h3>{allocations[0].name}</h3>
              <p>{allocations[0].percent}% · {allocations[0].amount}</p>
            </div>
            <div className="te-glass te-feature-card w3-metric-enter">
              <div className="te-feature-icon"><ShieldCheck className="h-4 w-4" /></div>
              <h3>{heroMetrics[1].label}</h3>
              <p>{heroMetrics[1].value}</p>
            </div>
            <div className="te-glass te-stat-card-chart w3-metric-enter">
              <div className="te-chart-card-head">
                <h4>{heroMetrics[3].label}</h4>
                <BarChart3 className="h-4 w-4 text-[#c084fc]" />
              </div>
              <p>{heroMetrics[3].value}</p>
              <div className="te-chart-slot">
                <QuarterlyLineChart />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal eager variant="up" delay={380}>
          <div className="te-metrics-strip">
            {heroMetrics.map((m) => (
              <div key={m.label} className="te-glass te-metric-pill w3-metric-enter">
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
