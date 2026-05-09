'use client';

import React, { useLayoutEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

type Theme = 'light' | 'dark';

/**
 * Forces global theme to light while mounted (auth, onboarding, tokenize wizard).
 * Restores the previous theme on unmount so the rest of the app can stay dark.
 */
export function ForceLightTheme({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previous = (html.getAttribute('data-theme') as Theme) || 'light';
    setTheme('light');
    return () => {
      setTheme(previous);
    };
  }, [setTheme]);

  return <>{children}</>;
}
