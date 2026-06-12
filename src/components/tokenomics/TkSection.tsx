'use client';

import type { ReactNode } from 'react';
import Reveal from '../Reveal';

type Props = {
  id?: string;
  label: string;
  title?: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  center?: boolean;
  alt?: boolean;
};

export default function TkSection({ id, label, title, subtitle, children, center, alt }: Props) {
  return (
    <section id={id} className={`te-sec${alt ? ' te-sec-alt' : ''}`}>
      <div className="page-container">
        <header className={`te-head${center ? ' te-head-center' : ''}`}>
          <Reveal variant="up">
            <span className="te-label">{label}</span>
          </Reveal>
          {title && (
            <Reveal variant="blur" delay={60}>
              <h2 className="te-h2">{title}</h2>
            </Reveal>
          )}
          {subtitle && (
            <Reveal variant="blur" delay={title ? 120 : 60}>
              <p className="te-sub">{subtitle}</p>
            </Reveal>
          )}
        </header>
        {children ?? null}
      </div>
    </section>
  );
}
