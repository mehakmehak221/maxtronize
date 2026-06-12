'use client';

import { LineChart, PieChart, Shield, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

const cards = [
  {
    tag: 'ANALYZE',
    title: 'View platform metrics, vesting timelines and utility demand across the MAXTRON ecosystem.',
    cta: 'View Analytics',
    href: '#analytics',
    icon: LineChart,
  },
  {
    tag: 'EXPLORE',
    title: 'Explore the full allocation breakdown, supply distribution and tokenomics model.',
    cta: 'Tokenomics',
    href: '#allocation',
    icon: PieChart,
  },
  {
    tag: 'SHIELD',
    title: 'Understand The Shield Framework — compliance bonding, verification and accountability.',
    cta: 'Framework',
    href: '#framework',
    icon: Shield,
  },
];

export default function ActionCards() {
  return (
    <div className="ui-bento ui-bento-3">
      {cards.map((c, i) => (
        <Reveal key={c.tag} delay={i * 80} variant="scale" className="h-full">
          <a href={c.href} className="ui-card-dark ui-card-lift ui-stat group flex h-full flex-col">
            <span className="ui-chip ui-chip-light mb-4 w-fit">{c.tag}</span>
            <p className="flex-1 text-sm leading-relaxed text-white/75">{c.title}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{c.cta}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-white/20">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
