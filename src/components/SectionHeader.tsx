'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  number?: string;
  className?: string;
  light?: boolean;
};

export default function SectionHeader({ icon: Icon, eyebrow, title, subtitle, align = 'left', number, className = '', light = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const centered = align === 'center';

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
      <div className={`flex items-start gap-3 sm:gap-4 ${centered ? 'justify-center' : ''}`}>
        {number && (
          <span
            className={`font-display shrink-0 text-3xl font-black sm:text-5xl transition-all duration-700 ${light ? 'section-number-light' : 'section-number'}`}
            style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(12px)' }}
          >
            {number}
          </span>
        )}
        <div
          className={centered ? 'flex flex-col items-center' : 'min-w-0'}
          style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(16px)', transition: 'all .6s cubic-bezier(.22,1,.36,1)' }}
        >
          <div className={`eyebrow mb-3 ${light ? 'eyebrow-light' : ''}`}>
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h2 className={`font-display text-[clamp(1.85rem,3.5vw,2.75rem)] font-black leading-[1.1] tracking-tight ${light ? 'text-white' : 'text-[#1e0a3c]'}`}>
            {title}
          </h2>
        </div>
      </div>
      {subtitle && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${light ? 'text-white/70' : 'text-[#6b5b8a]'} ${centered ? 'mx-auto max-w-2xl' : ''}`}
          style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(12px)', transition: 'all .6s .1s cubic-bezier(.22,1,.36,1)' }}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`section-line mt-8 h-1 rounded-full ${light ? 'bg-white/30' : 'bg-gradient-to-r from-[#6b28c9] to-[#a855f7]'} ${centered ? 'mx-auto' : ''}`}
        style={{ width: vis ? '4rem' : '0', transition: 'width .8s .15s cubic-bezier(.22,1,.36,1)' }}
      />
    </div>
  );
}
