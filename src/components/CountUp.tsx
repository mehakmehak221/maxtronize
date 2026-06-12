'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  className?: string;
  duration?: number;
};

function parseValue(raw: string) {
  const m = raw.match(/^([\d,.]+)(.*)$/);
  if (!m) return null;
  const num = parseFloat(m[1].replace(/,/g, ''));
  if (Number.isNaN(num)) return null;
  return { num, suffix: m[2], decimals: (m[1].split('.')[1] ?? '').length };
}

export default function CountUp({ value, className = '', duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const parsed = parseValue(value);

  useEffect(() => {
    if (!parsed) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let started = false;
    let frame = 0;
    const start = performance.now();

    const run = (now: number) => {
      if (!started) started = true;
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      const current = parsed.num * eased;
      const formatted = parsed.decimals > 0
        ? current.toFixed(parsed.decimals)
        : Math.round(current).toString();
      setDisplay(`${formatted}${parsed.suffix}`);
      if (t < 1) frame = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          frame = requestAnimationFrame(run);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [value, duration, parsed]);

  return <span ref={ref} className={className}>{display}</span>;
}
