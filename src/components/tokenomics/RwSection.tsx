'use client';

import type { ReactNode } from 'react';
import Reveal from '../Reveal';

type Tone = 'dark' | 'stack' | 'light';

type Props = {
  id?: string;
  label: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  center?: boolean;
  tone?: Tone;
};

export default function RwSection({
  id,
  label,
  title,
  subtitle,
  children,
  center,
  tone = 'dark',
}: Props) {
  const cls = tone === 'light' ? 'rw-sec-light' : tone === 'stack' ? 'rw-sec-stack' : 'rw-sec-dark';

  return (
    <section id={id} className={`rw-section ${cls}`}>
      <div className="page-container">
        <header className={`rw-sec-head${center ? ' rw-sec-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="rw-tag">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={70}>
            <h2 className="rw-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={140}>
              <p className="rw-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
