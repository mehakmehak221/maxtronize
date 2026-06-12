'use client';

import Web3Background from './Web3Background';

type Theme = 'dark' | 'light';

export default function SectionAmbient({ theme = 'light', density = 0.35 }: { theme?: Theme; density?: number }) {
  return <Web3Background density={density} theme={theme} />;
}
