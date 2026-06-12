'use client';

import { Coins, BarChart2, ShieldCheck, Vote, Layers, Zap, Tag, Flame } from 'lucide-react';
import Reveal from '../Reveal';
import { tokenUtilityList, utilityIntro, utilityTagline, whatMaxtronDoes } from '@/lib/tokenomics-data';

const UTILITY_ICONS = [Coins, ShieldCheck, BarChart2, Vote, Layers, Zap, Tag, Flame, ShieldCheck];

const POSITIONS = [
  { top: '10%', left: '15%' },
  { top: '0%', left: '50%' },
  { top: '10%', left: '85%' },
  { top: '40%', left: '3%' },
  { top: '40%', left: '97%' },
  { top: '70%', left: '15%' },
  { top: '80%', left: '50%' },
  { top: '70%', left: '85%' },
  { top: '50%', left: '50%' },
];

export default function TokenUtilitySection() {
  return (
    <section id="utility" className="te-sec te-sec-alt">
      <div className="page-container">
        <div style={{ display: 'grid', gap: '3rem', alignItems: 'center' }} className="te-framework-split">
          {/* Left — floating icon hub */}
          <Reveal variant="scale">
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px', height: '320px', margin: '0 auto' }}>
              {/* Glow center */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px', height: '80px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(87,51,157,0.7), transparent 70%)',
                filter: 'blur(16px)',
              }} />
              {/* Orbit rings */}
              <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: '1px solid rgba(192,132,252,0.25)', boxShadow: '0 0 20px rgba(192,132,252,0.1) inset', animation: 'w3-spin 24s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '30%', borderRadius: '50%', border: '1px dashed rgba(192,132,252,0.35)', boxShadow: '0 0 15px rgba(192,132,252,0.1)', animation: 'w3-spin-rev 18s linear infinite' }} />
              {/* Center logo */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '3.5rem', height: '3.5rem',
                borderRadius: '0.85rem',
                background: 'linear-gradient(135deg, #57339D, #391F6B)',
                boxShadow: '0 0 32px rgba(87,51,157,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                <Coins className="h-5 w-5 text-white" />
              </div>
              {/* Floating icons */}
              {tokenUtilityList.slice(0, 8).map((item, i) => {
                const Icon = UTILITY_ICONS[i];
                const pos = POSITIONS[i];
                return (
                  <div
                    key={item}
                    title={item}
                    style={{
                      position: 'absolute',
                      top: pos.top,
                      left: pos.left,
                      transform: 'translate(-50%, -50%)',
                      width: '2.35rem', height: '2.35rem',
                      borderRadius: '0.55rem',
                      border: '1px solid rgba(192,132,252,0.25)',
                      background: 'rgba(8,5,16,0.85)',
                      boxShadow: '0 0 14px rgba(87,51,157,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: `w3-float ${4 + (i % 3)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                      zIndex: 1,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5 text-[#c084fc]" />
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Right — content */}
          <div>
            <Reveal variant="right">
              <span className="te-label">A Comprehensive Guide to Token Utility</span>
              <h2 className="te-split-title">
                {utilityIntro}
              </h2>
              <p className="te-body" style={{ marginBottom: '1.5rem' }}>{utilityTagline}</p>
            </Reveal>

            <Reveal variant="right" delay={80}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {tokenUtilityList.map((item) => (
                  <span key={item} className="te-tag" style={{ cursor: 'default' }}>{item}</span>
                ))}
              </div>
            </Reveal>

            <Reveal variant="right" delay={150}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {whatMaxtronDoes.slice(0, 2).map((b) => (
                  <div key={b.id} className="te-glass" style={{ padding: '1.1rem', borderRadius: '0.85rem' }}>
                    <h4 style={{ fontFamily: 'var(--te-display)', fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: '0 0 0.3rem' }}>{b.title}</h4>
                    <p style={{ fontSize: '0.74rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{b.intro}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="right" delay={200}>
              <div style={{ marginTop: '1.25rem' }}>
                <a href="#supply" className="te-btn te-btn-primary">Supply &amp; Distribution</a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
