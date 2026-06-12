'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  eager?: boolean;
  variant?: 'up' | 'scale' | 'left' | 'right' | 'blur';
};

export default function Reveal({
  children,
  delay = 0,
  className = '',
  eager = false,
  variant = 'blur',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(eager);
  const isContents = className.includes('contents');

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  if (isContents) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`reveal-anim reveal-${variant}${vis ? ' reveal-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
