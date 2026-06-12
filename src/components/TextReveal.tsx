'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  eager?: boolean;
  as?: ElementType;
  stagger?: number;
};

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  eager = false,
  as: Tag = 'span',
  stagger = 45,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(eager);

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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  const words = text.split(' ').filter(Boolean);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span
            className={`text-reveal-word${vis ? ' text-reveal-word-visible' : ''}`}
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
