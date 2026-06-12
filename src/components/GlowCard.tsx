'use client';

import type { ReactNode } from 'react';
import { useGlowPointer } from '@/hooks/useGlowPointer';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'button';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  type?: 'button';
};

export default function GlowCard({
  children,
  className = '',
  as = 'div',
  onClick,
  onMouseEnter,
  onMouseLeave,
  type,
}: Props) {
  const onGlowMove = useGlowPointer();
  const cls = `w3-card tk-glass ${className}`.trim();
  const fx = (
    <>
      <span className="w3-card-glow" aria-hidden />
      <span className="w3-card-border" aria-hidden />
      <span className="w3-card-content">{children}</span>
    </>
  );

  if (as === 'button') {
    return (
      <button
        type={type ?? 'button'}
        className={cls}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onGlowMove}
      >
        {fx}
      </button>
    );
  }

  return (
    <div
      className={cls}
      onMouseMove={onGlowMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {fx}
    </div>
  );
}
