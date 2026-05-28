"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: string;
  dot?: boolean;
  className?: string;
}

export default function Badge({ children, variant = "gray", dot = false, className = "", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    green:  "bg-[var(--color-primary-300-alpha-10)]  border-[var(--color-primary-300-alpha-25)]  text-[var(--color-primary-300)]",
    cyan:   "bg-[var(--color-primary-300-alpha-10)]  border-[var(--color-primary-300-alpha-25)]  text-[var(--color-primary-300)]",
    yellow: "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
    red:    "bg-red-500/10    border-red-500/25    text-red-400",
    blue:   "bg-blue-500/10   border-blue-500/25   text-blue-400",
    gray:   "bg-white/5       border-white/10      text-[var(--color-text-secondary)]",
  };
  const dotColors: Record<string, string> = {
    green: "bg-[var(--color-primary-300)]", cyan: "bg-[var(--color-primary-300)]", yellow: "bg-yellow-400",
    red: "bg-red-400", blue: "bg-blue-400", gray: "bg-[var(--color-text-secondary)]",
  };
  return (
    <span
      className={["inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-base font-semibold border", variants[variant] ?? variants.gray, className].filter(Boolean).join(" ")}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] ?? dotColors.gray} animate-pulse`} />}
      {children}
    </span>
  );
}
