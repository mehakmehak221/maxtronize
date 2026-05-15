import React from 'react';

type MotionProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** Staggers direct children with slide-up entrance */
export function MotionStagger({
  children,
  className,
  as: Component = 'div',
}: MotionProps) {
  return (
    <Component className={cn('motion-stagger-children block', className)}>{children}</Component>
  );
}

/** Single block entrance — use for headers, modals, panels */
export function MotionReveal({
  children,
  className,
  as: Component = 'div',
}: MotionProps) {
  return <Component className={cn('animate-slide-up', className)}>{children}</Component>;
}

/** Chart wrapper — enables SVG line draw + bar grow */
export function MotionChart({
  children,
  className,
  as: Component = 'div',
}: MotionProps) {
  return <Component className={cn('motion-chart', className)}>{children}</Component>;
}

/** Bar chart column wrapper */
export function MotionChartBars({
  children,
  className,
  as: Component = 'div',
}: MotionProps) {
  return <Component className={cn('motion-chart-bars flex', className)}>{children}</Component>;
}

/** Dashboard page shell — max width + vertical rhythm */
export function MotionPage({
  children,
  className,
  as: Component = 'div',
}: MotionProps) {
  return (
    <Component className={cn('mx-auto w-full max-w-7xl space-y-8 md:space-y-10', className)}>
      {children}
    </Component>
  );
}
