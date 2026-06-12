'use client';

import type { ReactNode } from 'react';
import Reveal from '../Reveal';

type Props = {
  id?: string;
  label: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  center?: boolean;
};

export default function NxSection({ id, label, title, subtitle, children, center }: Props) {
  return (
    <section id={id} className="nx-section">
      <div className="page-container">
        <header className={`nx-section-head${center ? ' nx-section-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="nx-label">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={60}>
            <h2 className="nx-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={120}>
              <p className="nx-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
