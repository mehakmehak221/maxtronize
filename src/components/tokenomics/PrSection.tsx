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
  dark?: boolean;
  light?: boolean;
};

export default function PrSection({
  id,
  label,
  title,
  subtitle,
  children,
  center,
  dark,
  light,
}: Props) {
  const tone = light ? 'pr-sec-light' : dark ? 'pr-sec-dark' : 'pr-sec';

  return (
    <section id={id} className={`pr-section ${tone}`}>
      <div className="page-container">
        <header className={`pr-sec-head${center ? ' pr-sec-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="pr-label">{label}</span>
          </Reveal>
          <Reveal variant="blur" delay={70}>
            <h2 className="pr-h2">{title}</h2>
          </Reveal>
          {subtitle && (
            <Reveal variant="blur" delay={140}>
              <p className="pr-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
