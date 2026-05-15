import {
  Brain,
  Briefcase,
  CircleHelp,
  FileText,
  LayoutGrid,
  TrendingUp,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';

type IconProps = { className?: string };

const NAV_STROKE = 1.75;

/** Keeps explicit size whenever callers pass color-only classes (e.g. text-primary). */
function strokeProps(props: IconProps) {
  const extra = props.className?.trim();
  return {
    className: extra ? `h-5 w-5 shrink-0 ${extra}` : 'h-5 w-5 shrink-0',
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  };
}

function NavLucideIcon({ Icon, className }: { Icon: LucideIcon; className?: string }) {
  const cn = className?.trim() ? `h-5 w-5 shrink-0 ${className.trim()}` : 'h-5 w-5 shrink-0';
  return <Icon className={cn} strokeWidth={NAV_STROKE} aria-hidden />;
}

export function IconNavDashboard(p: IconProps) {
  return <NavLucideIcon Icon={LayoutGrid} className={p.className} />;
}

/** Issuer Hub — same 2×2 grid as Dashboard per design */
export function IconNavBuilding(p: IconProps) {
  return <NavLucideIcon Icon={LayoutGrid} className={p.className} />;
}

export function IconNavSparkles(p: IconProps) {
  return <NavLucideIcon Icon={Brain} className={p.className} />;
}

export function IconNavShield(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function IconNavBriefcase(p: IconProps) {
  return <NavLucideIcon Icon={Briefcase} className={p.className} />;
}

export function IconNavUsers(p: IconProps) {
  return <NavLucideIcon Icon={User} className={p.className} />;
}

export function IconNavTrendingUp(p: IconProps) {
  return <NavLucideIcon Icon={TrendingUp} className={p.className} />;
}

export function IconNavWallet(p: IconProps) {
  return <NavLucideIcon Icon={Wallet} className={p.className} />;
}

export function IconNavDocument(p: IconProps) {
  return <NavLucideIcon Icon={FileText} className={p.className} />;
}

export function IconNavHelp(p: IconProps) {
  return <NavLucideIcon Icon={CircleHelp} className={p.className} />;
}

/** Stat / dashboard accents */
export function IconBolt(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

export function IconChartBar(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

/** Hero / pulse-style activity line (outline) */
export function IconPulseActivity(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 14h2.5l2-7 2.5 10 2.5-6.5L16 11h4"
      />
    </svg>
  );
}

export function IconClock(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.75V12l4 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

/** Issuer dashboard stat tiles — 20×20 art (stroke uses currentColor) */
function statTileProps(p: IconProps) {
  const extra = p.className?.trim();
  return {
    className: extra ? `shrink-0 ${extra}` : 'h-5 w-5 shrink-0',
    viewBox: '0 0 20 20' as const,
    fill: 'none' as const,
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  };
}

const SW = 1.666;

export function IssuerStatIconWallet(p: IconProps) {
  const x = statTileProps(p);
  return (
    <svg {...x}>
      <path
        d="M15.8268 5.83097V3.33201C15.8268 3.11109 15.7391 2.89922 15.5828 2.743C15.4266 2.58678 15.2148 2.49902 14.9938 2.49902H4.165C3.72315 2.49902 3.29941 2.67455 2.98698 2.98698C2.67455 3.29941 2.49902 3.72315 2.49902 4.165C2.49902 4.60684 2.67455 5.03059 2.98698 5.34302C3.29941 5.65545 3.72315 5.83097 4.165 5.83097H16.6598C16.8807 5.83097 17.0926 5.91873 17.2488 6.07495C17.405 6.23117 17.4928 6.44304 17.4928 6.66396V9.99591M17.4928 9.99591H14.9938C14.552 9.99591 14.1282 10.1714 13.8158 10.4839C13.5034 10.7963 13.3279 11.22 13.3279 11.6619C13.3279 12.1037 13.5034 12.5275 13.8158 12.8399C14.1282 13.1523 14.552 13.3279 14.9938 13.3279H17.4928C17.7137 13.3279 17.9256 13.2401 18.0818 13.0839C18.238 12.9277 18.3258 12.7158 18.3258 12.4949V10.8289C18.3258 10.608 18.238 10.3961 18.0818 10.2399C17.9256 10.0837 17.7137 9.99591 17.4928 9.99591Z"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.49902 4.16504V15.8269C2.49902 16.2687 2.67455 16.6925 2.98698 17.0049C3.29941 17.3173 3.72315 17.4928 4.165 17.4928H16.6598C16.8807 17.4928 17.0926 17.4051 17.2488 17.2489C17.405 17.0926 17.4928 16.8808 17.4928 16.6599V13.3279"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IssuerStatIconBars(p: IconProps) {
  const x = statTileProps(p);
  return (
    <svg {...x}>
      <path
        d="M2.49896 2.49902V15.8268C2.49896 16.2687 2.67448 16.6924 2.98692 17.0048C3.29935 17.3173 3.72309 17.4928 4.16494 17.4928H17.4927"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9938 14.161V7.49707"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8289 14.1609V4.16504"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66388 14.1606V11.6616"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IssuerStatIconUsers(p: IconProps) {
  const x = statTileProps(p);
  return (
    <svg {...x}>
      <path
        d="M13.3278 17.4926V15.8266C13.3278 14.9429 12.9767 14.0954 12.3519 13.4705C11.727 12.8457 10.8795 12.4946 9.99583 12.4946H4.9979C4.11422 12.4946 3.26672 12.8457 2.64186 13.4705C2.017 14.0954 1.66595 14.9429 1.66595 15.8266V17.4926"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.49687 9.16292C9.33705 9.16292 10.8288 7.67116 10.8288 5.83097C10.8288 3.99079 9.33705 2.49902 7.49687 2.49902C5.65668 2.49902 4.16492 3.99079 4.16492 5.83097C4.16492 7.67116 5.65668 9.16292 7.49687 9.16292Z"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3257 17.4927V15.8267C18.3252 15.0884 18.0795 14.3713 17.6272 13.7878C17.1749 13.2043 16.5416 12.7876 15.8268 12.603"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3278 2.60742C14.0445 2.79093 14.6798 3.20776 15.1334 3.79219C15.5871 4.37662 15.8333 5.09541 15.8333 5.83525C15.8333 6.57508 15.5871 7.29388 15.1334 7.87831C14.6798 8.46274 14.0445 8.87957 13.3278 9.06307"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IssuerStatIconTrend(p: IconProps) {
  const x = statTileProps(p);
  return (
    <svg {...x}>
      <path
        d="M18.3257 5.83105L11.2453 12.9114L7.0804 8.74651L1.66599 14.1609"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3278 5.83105H18.3257V10.829"
        stroke="currentColor"
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type IssuerNavIconId =
  | 'dashboard'
  | 'hub'
  | 'ai'
  | 'portfolio'
  | 'investors'
  | 'yield'
  | 'wallet'
  | 'documents'
  | 'help';

export function IssuerNavIcon({ id, className }: { id: IssuerNavIconId; className?: string }) {
  switch (id) {
    case 'dashboard':
    case 'hub':
      return <NavLucideIcon Icon={LayoutGrid} className={className} />;
    case 'ai':
      return <NavLucideIcon Icon={Brain} className={className} />;
    case 'portfolio':
      return <NavLucideIcon Icon={Briefcase} className={className} />;
    case 'investors':
      return <NavLucideIcon Icon={User} className={className} />;
    case 'yield':
      return <NavLucideIcon Icon={TrendingUp} className={className} />;
    case 'wallet':
      return <NavLucideIcon Icon={Wallet} className={className} />;
    case 'documents':
      return <NavLucideIcon Icon={FileText} className={className} />;
    case 'help':
      return <NavLucideIcon Icon={CircleHelp} className={className} />;
    default:
      return <NavLucideIcon Icon={LayoutGrid} className={className} />;
  }
}
