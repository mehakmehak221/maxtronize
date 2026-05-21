'use client';

import { useParams } from 'next/navigation';
import InvestorLayout from '@/components/InvestorLayout';
import { PortfolioAssetDetailView } from '@/components/portfolio/PortfolioAssetDetailView';

export default function InvestorPortfolioAssetDetailPage() {
  const params = useParams();
  const assetId = typeof params.id === 'string' ? params.id : '';

  return (
    <InvestorLayout>
      <PortfolioAssetDetailView
        assetId={assetId}
        backHref="/investor/portfolio"
        backLabel="Back to Portfolio"
        manageHref="/investor/marketplace"
        manageLabel="Browse Marketplace"
      />
    </InvestorLayout>
  );
}
