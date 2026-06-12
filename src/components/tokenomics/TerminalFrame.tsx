'use client';

import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function TerminalFrame({ title, children }: Props) {
  return (
    <div className="hl-terminal">
      <div className="hl-terminal-bar">
        <span className="hl-terminal-dot hl-terminal-dot-r" />
        <span className="hl-terminal-dot hl-terminal-dot-y" />
        <span className="hl-terminal-dot hl-terminal-dot-g" />
        <span className="hl-terminal-title">{title}</span>
      </div>
      {children}
    </div>
  );
}
