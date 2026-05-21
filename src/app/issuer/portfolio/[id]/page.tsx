'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { PortfolioAssetDetailView } from '@/components/portfolio/PortfolioAssetDetailView';

export default function IssuerPortfolioAssetDetailPage() {
  const params = useParams();
  const assetId = typeof params.id === 'string' ? params.id : '';

  return (
    <DashboardLayout>
      <PortfolioAssetDetailView
        assetId={assetId}
        backHref="/issuer/portfolio"
        backLabel="Back to Portfolio"
        manageHref="/issuer/hub"
        manageLabel="Manage in Hub"
      />
    </DashboardLayout>
  );
}
