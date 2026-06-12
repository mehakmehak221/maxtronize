'use client';

import type { ReactNode } from 'react';
import Reveal from '../Reveal';

type Tone = 'dark' | 'light' | 'stack';

type Props = {
  id?: string;
  label: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  center?: boolean;
  tone?: Tone;
};

export default function HlSection({
  id,
  label,
  title,
  subtitle,
  children,
  center,
  tone = 'dark',
}: Props) {
  const toneClass = tone === 'light' ? 'hl-section-light' : tone === 'stack' ? 'hl-section-stack' : 'hl-section-dark';

  return (
    <section id={id} className={`hl-section ${toneClass}`}>
      <div className="page-container">
        <header className={`hl-section-head${center ? ' hl-section-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="hl-label">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={60}>
            <h2 className="hl-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={120}>
              <p className="hl-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
