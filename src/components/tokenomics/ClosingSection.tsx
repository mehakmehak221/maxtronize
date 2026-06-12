'use client';

import { useEffect, useRef } from 'react';
import Reveal from '../Reveal';
import { closingContent, heroMetrics } from '@/lib/tokenomics-data';

// Simple sparkline line chart data
const CHART_DATA = [22, 35, 28, 52, 41, 68, 58, 75, 65, 88, 78, 95];

export default function ClosingSection() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animate the path draw
    if (!svgRef.current) return;
    const path = svgRef.current.querySelector('path');
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: 1800,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });
  }, []);

  const W = 480, H = 140;
  const pad = { t: 12, r: 12, b: 20, l: 32 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const max = Math.max(...CHART_DATA);
  const xs = CHART_DATA.map((_, i) => pad.l + (i / (CHART_DATA.length - 1)) * cw);
  const ys = CHART_DATA.map((v) => pad.t + ch - (v / max) * ch);
  const points = CHART_DATA.map((_, i) => `${xs[i]},${ys[i]}`).join(' L ');
  const pathD = `M ${points}`;
  const areaD = `M ${xs[0]},${H - pad.b} L ${points} L ${xs[xs.length - 1]},${H - pad.b} Z`;

  return (
    <section className="te-closing" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
      <div className="te-closing-glow" aria-hidden />
      <div className="page-container" style={{ position: 'relative' }}>
        {/* ── Line chart row ── */}
        <Reveal variant="up">
          <div className="te-glass" style={{ padding: '1.75rem', borderRadius: '1.25rem', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="te-label">Total Token Economy Performance</span>
                <h3 style={{ fontFamily: 'var(--te-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0 0' }}>
                  Our Total Sales Performance for the Period
                </h3>
              </div>
              <a href="#supply" className="te-btn te-btn-primary" style={{ fontSize: '0.75rem' }}>Get A Quote</a>
            </div>

            {/* Chart */}
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block', overflow: 'visible' }}>
              <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line key={t} x1={pad.l} x2={W - pad.r} y1={pad.t + ch * (1 - t)} y2={pad.t + ch * (1 - t)}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              {/* Area fill */}
              <path d={areaD} fill="url(#area-grad)" />
              {/* Line */}
              <path d={pathD} fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {CHART_DATA.map((_, i) => (
                <circle key={i} cx={xs[i]} cy={ys[i]} r="3.5" fill="#c084fc" stroke="rgba(8,5,16,0.9)" strokeWidth="2" />
              ))}
              {/* X-axis labels */}
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                <text key={m} x={xs[i]} y={H - 2} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="var(--te-display)">{m}</text>
              ))}
            </svg>

            {/* Metric pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.65rem', marginTop: '1.25rem' }}>
              {heroMetrics.slice(0, 4).map((m) => (
                <div key={m.label} style={{ padding: '0.75rem', borderRadius: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.2rem' }}>{m.label}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Join / Closing CTA ── */}
        <Reveal variant="blur">
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '180%',
              background: 'radial-gradient(ellipse, rgba(192,132,252,0.15), transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
              pointerEvents: 'none',
              animation: 'te-glow-drift 8s ease-in-out infinite'
            }} />
            <h2 className="te-split-title" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '32rem', margin: '0 auto' }}>
              {closingContent.title}
            </h2>
          </div>
        </Reveal>

        <Reveal variant="up" delay={80}>
          {closingContent.lines.map((line) => (
            <p key={line} className="te-body" style={{ textAlign: 'center', maxWidth: '36rem', margin: '0.75rem auto 0' }}>
              {line}
            </p>
          ))}
        </Reveal>

        <Reveal variant="up" delay={160}>
          <div className="te-pillars">
            {closingContent.pillars.map((p) => (
              <span key={p} className="te-pillar">{p}</span>
            ))}
          </div>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <div className="te-hero-btns" style={{ marginTop: '1.75rem' }}>
            <a href="#framework" className="te-btn te-btn-primary">Shield Framework</a>
            <a href="#supply" className="te-btn te-btn-outline">Supply &amp; Distribution</a>
          </div>
        </Reveal>

        <Reveal variant="blur" delay={280}>
          <p className="te-label" style={{ textAlign: 'center', marginTop: '2rem', display: 'block' }}>
            {closingContent.signoff}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
