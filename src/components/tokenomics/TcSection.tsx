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
  alt?: boolean;
};

export default function TcSection({ id, label, title, subtitle, children, center, alt }: Props) {
  return (
    <section id={id} className={`tc-sec${alt ? ' tc-sec-alt' : ''}`}>
      <div className="page-container">
        <header className={`tc-head${center ? ' tc-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="tc-label">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={60}>
            <h2 className="tc-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={120}>
              <p className="tc-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
