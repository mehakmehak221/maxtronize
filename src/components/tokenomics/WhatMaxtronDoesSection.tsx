'use client';

import { useState } from 'react';
import { CheckCircle2, ShieldAlert, Key, Award } from 'lucide-react';
import AnimatedSparkline from '../charts/AnimatedSparkline';
import Reveal from '../Reveal';
import { functionsIntro, whatMaxtronDoes } from '@/lib/tokenomics-data';

const TAB_ICONS = [ShieldAlert, Key, Award];

const sparkData = [
  [30, 42, 38, 55, 48, 62, 58, 70],
  [50, 45, 52, 40, 48, 35, 30, 25],
  [22, 28, 35, 42, 50, 58, 65, 72],
];

export default function WhatMaxtronDoesSection() {
  const [tab, setTab] = useState(0);
  const block = whatMaxtronDoes[tab];

  return (
    <section id="functions" className="te-sec te-sec-alt">
      <div className="page-container">
        <div className="te-func-layout">
          <div>
            <Reveal variant="left">
              <span className="te-label">What MAXTRON Does</span>
              <h2 className="te-split-title" style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)' }}>
                {functionsIntro}
              </h2>
            </Reveal>
            <div className="te-stat-stack" style={{ marginTop: '1.5rem' }}>
              {whatMaxtronDoes.map((b, i) => {
                const Icon = TAB_ICONS[i];
                return (
                <Reveal key={b.id} variant="left" delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => setTab(i)}
                    className={`te-glass te-stat-box w3-metric-enter${tab === i ? ' te-step-on' : ''}`}
                    style={{ 
                      width: '100%', textAlign: 'left', cursor: 'pointer', 
                      border: tab === i ? '1px solid rgba(192,132,252,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      background: tab === i ? 'rgba(87,51,157,0.15)' : 'rgba(255,255,255,0.02)',
                      boxShadow: tab === i ? '0 8px 32px rgba(87,51,157,0.2)' : 'none',
                      transform: tab === i ? 'translateX(8px)' : 'translateX(0)',
                      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        width: '2.1rem', height: '2.1rem', borderRadius: '0.5rem', 
                        background: tab === i ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${tab === i ? 'rgba(192,132,252,0.3)' : 'rgba(255,255,255,0.05)'}`,
                        boxShadow: tab === i ? '0 0 16px rgba(192,132,252,0.3)' : 'none',
                        transition: 'all 0.3s'
                      }}>
                        <Icon className="h-4 w-4" style={{ color: tab === i ? '#c084fc' : 'rgba(255,255,255,0.5)' }} />
                      </div>
                      <h4 style={{ margin: 0 }}>{b.title}</h4>
                    </div>
                    <p style={{ paddingLeft: '2.85rem' }}>{b.intro}</p>
                  </button>
                </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal variant="right">
            <div className="te-glass te-panel w3-panel-enter" key={tab}>
              <div className="te-chart-slot" style={{ marginBottom: '1rem' }}>
                <AnimatedSparkline points={sparkData[tab]} width={320} height={48} />
              </div>
              {block.listIntro && block.points.length > 0 && (
                <p className="te-body" style={{ marginTop: '0.35rem', marginBottom: '0.5rem' }}>{block.listIntro}</p>
              )}
              {block.points.length > 0 && (
                <div className="te-checks">
                  {block.points.map((pt) => (
                    <div key={pt} className="te-check w3-check-item">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#c084fc]" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="te-body" style={{ marginTop: '1rem' }}>{block.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
