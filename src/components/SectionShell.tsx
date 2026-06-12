'use client';

import type { ReactNode } from 'react';
import Starfield from './Starfield';

type Theme = 'void' | 'light' | 'mesh' | 'gradient' | 'cream';

type Props = {
  id?: string;
  theme: Theme;
  children: ReactNode;
  className?: string;
  stars?: boolean;
};

const quietThemes: Theme[] = ['light', 'mesh', 'cream'];

export default function SectionShell({ id, theme, children, className = '', stars = false }: Props) {
  const quiet = quietThemes.includes(theme);

  return (
    <section id={id} className={`tok-section tok-section-${theme} ${className}`}>
      {stars && <Starfield density={80} />}
      {theme === 'mesh' && <div className="tok-section-mesh-bg" aria-hidden />}
      {theme === 'gradient' && <div className="tok-section-glow" aria-hidden />}
      {!quiet && <div className="tok-section-noise" aria-hidden />}
      <div className="page-container tok-section-body">{children}</div>
    </section>
  );
}
