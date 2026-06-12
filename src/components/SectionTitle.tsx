'use client';

import type { ReactNode } from 'react';
import Reveal from './Reveal';
import TextReveal from './TextReveal';

type Props = {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  number?: string;
  light?: boolean;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionTitle({
  kicker,
  title,
  subtitle,
  number,
  light = false,
  align = 'center',
  className = '',
}: Props) {
  const left = align === 'left';
  return (
    <header className={`tok-section-header${left ? ' tok-section-header-left' : ''} ${className}`}>
      {number && (
        <Reveal variant="up" delay={0}>
          <span className={`tok-section-num${light ? ' tok-section-num-light' : ''}`}>{number}</span>
        </Reveal>
      )}

      <TextReveal
        text={kicker}
        as="span"
        className={`tok-kicker${light ? ' tok-kicker-light' : ''}`}
        delay={number ? 60 : 0}
        stagger={24}
      />

      <Reveal variant="blur" delay={number ? 120 : 80}>
        <h2 className={`tok-section-title${light ? ' tok-section-title-light' : ''}`}>{title}</h2>
      </Reveal>

      {subtitle && (
        <Reveal variant="blur" delay={number ? 200 : 140}>
          <p className={`tok-section-sub${light ? ' tok-section-sub-light' : ''}`}>{subtitle}</p>
        </Reveal>
      )}
    </header>
  );
}
