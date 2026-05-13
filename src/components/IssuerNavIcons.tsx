import React from 'react';

type IconProps = { className?: string };

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

export function IconNavDashboard(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H15.75a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

export function IconNavBuilding(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

export function IconNavSparkles(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
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
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m11.25 0v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m6 0h.008v.008H21v-.008zm.75 0h.008v.008h-.008v-.008zm-16.5 0h.008v.008H5.25v-.008zM5.25 8.25h13.5c.497 0 .891.403.891.891v3.409c0 .497-.403.891-.891.891H5.25a.891.891 0 01-.891-.891V9.141c0-.497.403-.891.891-.891zM5.25 5.25h13.5a3 3 0 013 3v.75H2.25V8.25a3 3 0 013-3z" />
    </svg>
  );
}

export function IconNavUsers(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
    </svg>
  );
}

export function IconNavTrendingUp(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

export function IconNavWallet(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3.75h-4.875a2.625 2.625 0 010-5.25H21M3 12V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5V12" />
    </svg>
  );
}

export function IconNavDocument(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125V7.875a3.375 3.375 0 00-3.375-3.375H7.5a3.375 3.375 0 00-3.375 3.375v11.25a3.375 3.375 0 003.375 3.375h12a3.375 3.375 0 003.375-3.375z" />
    </svg>
  );
}

export function IconNavHelp(p: IconProps) {
  const s = strokeProps(p);
  return (
    <svg {...s}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
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
  const p = { className };
  switch (id) {
    case 'dashboard':
      return <IconNavDashboard {...p} />;
    case 'hub':
      return <IconNavBuilding {...p} />;
    case 'ai':
      return <IconNavSparkles {...p} />;
    case 'portfolio':
      return <IconNavBriefcase {...p} />;
    case 'investors':
      return <IconNavUsers {...p} />;
    case 'yield':
      return <IconNavTrendingUp {...p} />;
    case 'wallet':
      return <IconNavWallet {...p} />;
    case 'documents':
      return <IconNavDocument {...p} />;
    case 'help':
      return <IconNavHelp {...p} />;
    default:
      return <IconNavDashboard {...p} />;
  }
}
