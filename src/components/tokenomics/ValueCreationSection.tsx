'use client';

import { useEffect, useState } from 'react';
import AnimatedAreaChart from '../charts/AnimatedAreaChart';
import Reveal from '../Reveal';
import { valueCreation, valueCreationIntro } from '@/lib/tokenomics-data';

const areaData = valueCreation.map((item, i) => ({
  label: item.title,
  value: [55, 72, 48, 100][i],
}));

export default function ValueCreationSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % valueCreation.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section id="value" className="te-sec te-sec-alt">
      <div className="page-container">
        <div
          className="te-value-layout"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left — numbered cards */}
          <div>
            <Reveal variant="left">
              <span className="te-label">Top Reasons To Hold MAXTRON</span>
              <h2 className="te-split-title" style={{ marginBottom: '0.5rem' }}>
                {valueCreationIntro}
              </h2>
            </Reveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              {valueCreation.map((item, i) => (
                <Reveal key={item.title} variant="left" delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem 1.15rem',
                      borderRadius: '0.85rem',
                      border: `1px solid ${active === i ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      background: active === i ? 'rgba(192,132,252,0.07)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.3s',
                      boxShadow: active === i ? '0 0 28px rgba(87,51,157,0.25)' : 'none',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      fontFamily: 'var(--te-display)',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      lineHeight: 1,
                      color: active === i ? 'rgba(192,132,252,0.7)' : 'rgba(255,255,255,0.12)',
                      minWidth: '2.25rem',
                      transition: 'color 0.3s',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--te-display)', fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '0 0 0.3rem' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.76rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.body}</p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right — chart panel */}
          <Reveal variant="right">
            <div className="te-glass" style={{ padding: '1.5rem', borderRadius: '1.15rem', height: '100%' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(192,132,252,0.8)' }}>
                  Value Metrics
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                  <p style={{ fontFamily: 'var(--te-display)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {valueCreation[active]?.title}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(192,132,252,0.8)', fontWeight: 600, background: 'rgba(192,132,252,0.1)', padding: '0.25rem 0.65rem', borderRadius: '99px', border: '1px solid rgba(192,132,252,0.2)' }}>
                    {(['High', 'Active', 'Growing', 'Capped'] as const)[active]}
                  </span>
                </div>
              </div>

              <AnimatedAreaChart data={areaData} activeIndex={active} height={160} />

              {/* Metric stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '1.25rem' }}>
                {[
                  { label: 'Demand to Bond', value: 'Per Property' },
                  { label: 'Demand to Spend', value: 'Usage-Based' },
                  { label: 'Burn Rate', value: 'On Utilization' },
                  { label: 'Total Supply', value: '1,000,000,000' },
                ].map((stat) => (
                  <div key={stat.label} style={{ padding: '0.75rem', borderRadius: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.2rem' }}>{stat.label}</p>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0 }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
