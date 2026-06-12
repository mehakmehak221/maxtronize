'use client';

import { Ban, Coins, Home, TrendingUp } from 'lucide-react';
import Reveal from '../Reveal';
import ShieldVisual from '../visuals/ShieldVisual';
import { shieldFramework, firewallPrinciples } from '@/lib/tokenomics-data';

const icons = [Coins, Ban, Home, TrendingUp];

export default function ShieldFrameworkSection() {
  return (
    <section id="framework" className="te-sec te-sec-alt">
      <div className="page-container">
        <div className="te-split">
          <Reveal variant="scale">
            <ShieldVisual />
          </Reveal>
          <div style={{ padding: '2rem 0' }}>
            <Reveal variant="left">
              <span className="te-label">{shieldFramework.title}</span>
              <h2 className="te-split-title">
                {shieldFramework.lead} <em>{shieldFramework.emphasis}</em>
              </h2>
            </Reveal>
            <div className="te-grid-2" style={{ marginTop: '2rem' }}>
              {firewallPrinciples.map((p, i) => {
                const Icon = icons[i];
                return (
                  <Reveal key={p.title} variant="up" delay={i * 70}>
                    <div 
                      className="te-glass te-feature-card w3-metric-enter"
                      style={{ 
                        display: 'flex', flexDirection: 'column', gap: '0.5rem', 
                        padding: '1.25rem', borderRadius: '0.85rem', height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(87,51,157,0.3)';
                        e.currentTarget.style.borderColor = 'rgba(192,132,252,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.15)';
                      }}
                    >
                      <div className="te-feature-icon" style={{ marginBottom: '0.2rem' }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 style={{ fontFamily: 'var(--te-display)', fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: 0 }}>{p.title}</h3>
                      <p style={{ fontSize: '0.78rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.52)', margin: 0 }}>{p.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
