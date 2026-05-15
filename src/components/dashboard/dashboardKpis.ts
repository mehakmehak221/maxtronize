import {
  IssuerStatIconBars,
  IssuerStatIconTrend,
  IssuerStatIconUsers,
  IssuerStatIconWallet,
} from '@/components/IssuerNavIcons';
import type { KpiCard } from './OverviewKpiGrid';

export const DASHBOARD_KPI_CARDS: KpiCard[] = [
  {
    label: 'Total Raised',
    val: '$14.82M',
    trend: '↗ +12.5%',
    sub: 'vs $13.17M last quarter',
    up: true,
    Icon: IssuerStatIconWallet,
    well: 'bg-dash-kpi-violet-soft text-dash-kpi-violet-fg ring-1 ring-dash-kpi-violet-ring',
  },
  {
    label: 'Assets Tokenized',
    val: '$42.5M',
    trend: '↗ +8.2%',
    sub: '6 assets · 4 jurisdictions',
    up: true,
    Icon: IssuerStatIconBars,
    well: 'bg-dash-kpi-blue-soft text-dash-kpi-blue-fg ring-1 ring-dash-kpi-blue-ring',
  },
  {
    label: 'Active Investors',
    val: '2,403',
    trend: '↗ +15.3%',
    sub: '89% KYC verified',
    up: true,
    Icon: IssuerStatIconUsers,
    well: 'bg-dash-kpi-green-soft text-dash-kpi-green-fg ring-1 ring-dash-kpi-green-ring',
  },
  {
    label: 'Platform Yield',
    val: '8.4%',
    trend: '↘ -0.2%',
    sub: 'Weighted avg. APY',
    up: false,
    Icon: IssuerStatIconTrend,
    well: 'bg-dash-kpi-orange-soft text-dash-kpi-orange-fg ring-1 ring-dash-kpi-orange-ring',
  },
];
