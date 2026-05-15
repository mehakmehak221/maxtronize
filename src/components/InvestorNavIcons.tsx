import {
  Activity,
  Briefcase,
  CircleHelp,
  FileText,
  LayoutGrid,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

const NAV_STROKE = 1.75;

function NavLucideIcon({ Icon, className }: { Icon: LucideIcon; className?: string }) {
  const cn = className?.trim() ? `h-[18px] w-[18px] shrink-0 ${className.trim()}` : 'h-[18px] w-[18px] shrink-0';
  return <Icon className={cn} strokeWidth={NAV_STROKE} aria-hidden />;
}

export type InvestorNavIconId =
  | 'overview'
  | 'hub'
  | 'marketplace'
  | 'secondary-market'
  | 'portfolio'
  | 'wallet'
  | 'documents'
  | 'help';

export function InvestorNavIcon({ id, className }: { id: InvestorNavIconId; className?: string }) {
  switch (id) {
    case 'overview':
      return <NavLucideIcon Icon={LayoutGrid} className={className} />;
    case 'hub':
    case 'portfolio':
      return <NavLucideIcon Icon={Briefcase} className={className} />;
    case 'marketplace':
      return <NavLucideIcon Icon={Activity} className={className} />;
    case 'secondary-market':
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
