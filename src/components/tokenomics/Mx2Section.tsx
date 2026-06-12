'use client';

import type { ReactNode } from 'react';
import Reveal from '../Reveal';

type Props = {
  id?: string;
  label: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  center?: boolean;
  light?: boolean;
};

export default function Mx2Section({ id, label, title, subtitle, children, center, light }: Props) {
  return (
    <section id={id} className={`mx2-sec ${light ? 'mx2-light' : 'mx2-dark'}`}>
      <div className="page-container">
        <header className={`mx2-head${center ? ' mx2-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="mx2-label">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={60}>
            <h2 className="mx2-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={120}>
              <p className="mx2-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
