'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import DonutSatellite from '../charts/DonutSatellite';
import Reveal from '../Reveal';
import { allocations, supplyDistribution } from '@/lib/tokenomics-data';

export default function AllocationSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="supply" className="te-sec">
      <div className="page-container">
        <div className="te-dist">
          <div>
            <Reveal variant="up">
              <span className="te-label">{supplyDistribution.title}</span>
              <h2 className="te-display-title" style={{ marginBottom: '1.5rem' }}>Allocation</h2>
            </Reveal>
            <div className="te-dist-list">
              {allocations.map((a, i) => (
                <Reveal key={a.name} delay={i * 30} variant="up">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => setActive(active === i ? null : i)}
                    className={`te-dist-item te-glass${active === i ? ' te-step-on' : ''}`}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.65rem',
                      border: active === i ? '1px solid rgba(192,132,252,0.35)' : '1px solid rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      background: active === i ? 'rgba(87,51,157,0.15)' : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                      transform: active === i ? 'translateX(6px)' : 'none',
                      boxShadow: active === i ? '0 0 16px rgba(192,132,252,0.15)' : 'none'
                    }}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#c084fc]" />
                    <span>{a.name}</span>
                    <strong style={{ marginLeft: 'auto' }}>— {a.percent}%</strong>
                  </button>
                </Reveal>
              ))}
            </div>
            <Reveal variant="up" delay={100}>
              <p className="te-dist-total">{supplyDistribution.total}</p>
              <p className="te-body" style={{ marginTop: '0.5rem' }}>{supplyDistribution.note}</p>
              <div className="te-dist-btns">
                <a href="#framework" className="te-btn te-btn-primary">Shield Framework</a>
                <a href="#compliance" className="te-btn te-btn-outline">Compliance</a>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale">
            <div className="te-glass w3-pie-ring" style={{ padding: '1.5rem', borderRadius: '1.15rem' }}>
              <DonutSatellite
                items={allocations}
                centerValue="1B"
                centerSub="MAXTRON"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
