'use client';

import { useEffect, useState } from 'react';
import Reveal from '../Reveal';
import { governanceContent } from '@/lib/tokenomics-data';

const TIMELINE_ENTRIES = [
  { year: 'Phase 1', title: 'Foundation', desc: 'Platform launch, smart contract deployment, and initial compliance infrastructure.' },
  { year: 'Phase 2', title: 'Shield Framework', desc: 'Issuer compliance bond system, property verification, and KYC enforcement rollout.' },
  { year: 'Phase 3', title: 'Governance Live', desc: 'Community governance activation across verification standards, listing criteria and fee structures.' },
  { year: 'Phase 4', title: 'Ecosystem Scale', desc: 'Full ecosystem rewards, burn mechanics activation, and expanded real-world asset tokenization.' },
];

export default function GovernanceSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStep((v) => (v + 1) % TIMELINE_ENTRIES.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="governance" className="te-sec">
      <div className="page-container">
        {/* Section Header */}
        <Reveal variant="up">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="te-label">{governanceContent.title}</span>
            <h2 className="te-h2" style={{ marginTop: '0.4rem' }}>The Beginning of Everything</h2>
            <p className="te-sub" style={{ maxWidth: '38rem', margin: '0.75rem auto 0' }}>
              {governanceContent.body}
            </p>
          </div>
        </Reveal>

        {/* Horizontal Timeline */}
        <Reveal variant="up" delay={80}>
          <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '1rem' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '1.35rem',
              left: '8%',
              right: '8%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(192,132,252,0.05), rgba(192,132,252,0.6), rgba(192,132,252,0.05))',
              backgroundSize: '200% auto',
              animation: 'te-text-shimmer 4s linear infinite',
              zIndex: 0,
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative', zIndex: 1, minWidth: '640px' }}>
              {TIMELINE_ENTRIES.map((entry, i) => (
                <button
                  key={entry.year}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {/* Dot */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '2.75rem',
                      height: '2.75rem',
                      borderRadius: '50%',
                      border: `2px solid ${activeStep === i ? 'rgba(192,132,252,0.8)' : 'rgba(255,255,255,0.15)'}`,
                      background: activeStep === i
                        ? 'linear-gradient(135deg, #57339D, #391F6B)'
                        : 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.4s',
                      boxShadow: activeStep === i ? '0 0 24px rgba(87,51,157,0.6), 0 0 8px rgba(192,132,252,0.4)' : 'none',
                    }}>
                      <span style={{
                        fontFamily: 'var(--te-display)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: activeStep === i ? '#fff' : 'rgba(255,255,255,0.4)',
                        transition: 'color 0.3s',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{
                    padding: '1.15rem',
                    borderRadius: '0.85rem',
                    border: `1px solid ${activeStep === i ? 'rgba(192,132,252,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    background: activeStep === i ? 'rgba(192,132,252,0.06)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.4s',
                    boxShadow: activeStep === i ? '0 8px 32px rgba(87,51,157,0.2)' : 'none',
                  }}>
                    <span style={{
                      display: 'block',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: activeStep === i ? 'rgba(192,132,252,0.9)' : 'rgba(255,255,255,0.3)',
                      marginBottom: '0.35rem',
                      transition: 'color 0.3s',
                    }}>
                      {entry.year}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--te-display)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: activeStep === i ? '#fff' : 'rgba(255,255,255,0.7)',
                      margin: '0 0 0.4rem',
                      transition: 'color 0.3s',
                    }}>
                      {entry.title}
                    </h3>
                    <p style={{
                      fontSize: '0.74rem',
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.45)',
                      margin: 0,
                    }}>
                      {entry.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Governance Scope Pills */}
        <Reveal variant="up" delay={160}>
          <div style={{ marginTop: '3rem', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginRight: '0.5rem' }}>{governanceContent.scopeIntro}</span>
              {governanceContent.scope.map((pt) => (
                <span key={pt} style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '99px',
                  border: '1px solid rgba(192,132,252,0.2)',
                  background: 'rgba(57,31,107,0.25)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(192,132,252,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(192,132,252,0.6)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(192,132,252,0.2)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}>
                  {pt}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.38)', textAlign: 'center', marginTop: '1rem', maxWidth: '44rem', marginLeft: 'auto', marginRight: 'auto' }}>
              {governanceContent.isolation}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
