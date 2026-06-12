'use client';

import { Ban, Coins, Home, TrendingUp } from 'lucide-react';
import Reveal from '../Reveal';
import { firewallIntro, firewallPrinciples } from '@/lib/tokenomics-data';

const icons = [Coins, Ban, Home, TrendingUp];

export default function FirewallSection() {
  return (
    <section id="firewall" className="te-sec">
      <div className="page-container">
        <div className="te-sec-head-row">
          <h2 className="te-split-title" style={{ margin: 0 }}>The Firewall</h2>
          <a href="#compliance" className="te-btn te-btn-primary">Compliance</a>
        </div>
        <Reveal variant="up">
          <p className="te-body" style={{ marginBottom: '2rem' }}>{firewallIntro}</p>
        </Reveal>
        <div className="te-grid-2">
          {firewallPrinciples.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={p.title} variant="up" delay={i * 70}>
                <div className="te-glass te-principle-card w3-flow-card">
                  <div className="te-principle-icon"><Icon className="h-4 w-4" /></div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
