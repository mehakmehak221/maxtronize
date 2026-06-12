'use client';

import type { ReactNode } from 'react';
import SectionShell from '../SectionShell';
import SectionTitle from '../SectionTitle';

type Theme = 'void' | 'light' | 'mesh' | 'gradient' | 'cream';

type Props = {
  id?: string;
  theme: Theme;
  number?: string;
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  light?: boolean;
  stars?: boolean;
  children: ReactNode;
  className?: string;
};

export default function TokSection({
  id,
  theme,
  number,
  kicker,
  title,
  subtitle,
  light = false,
  stars = false,
  children,
  className = '',
}: Props) {
  return (
    <SectionShell id={id} theme={theme} stars={stars} className={className}>
      <SectionTitle
        number={number}
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        light={light}
      />
      {children}
    </SectionShell>
  );
}
