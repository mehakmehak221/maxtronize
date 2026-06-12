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
};

export default function MtSection({ id, label, title, subtitle, children, center }: Props) {
  return (
    <section id={id} className="mt-sec">
      <div className="page-container">
        <header className={`mt-head${center ? ' mt-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="mt-label">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={60}>
            <h2 className="mt-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={120}>
              <p className="mt-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
