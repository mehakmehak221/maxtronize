'use client';

import Web3Ambient from './Web3Ambient';
import SiteFooter from './SiteFooter';
import AllocationSection from './tokenomics/AllocationSection';
import ClosingSection from './tokenomics/ClosingSection';
import ComplianceSection from './tokenomics/ComplianceSection';
import FirewallSection from './tokenomics/FirewallSection';
import GovernanceSection from './tokenomics/GovernanceSection';
import ShieldFrameworkSection from './tokenomics/ShieldFrameworkSection';
import TokenomicsHero from './tokenomics/TokenomicsHero';
import TokenUtilitySection from './tokenomics/TokenUtilitySection';
import ValueCreationSection from './tokenomics/ValueCreationSection';
import WhatMaxtronDoesSection from './tokenomics/WhatMaxtronDoesSection';

export default function PageContent() {
  return (
    <>
      <Web3Ambient />
      <div className="te-page">
        <TokenomicsHero />
        <ShieldFrameworkSection />
        <FirewallSection />
        <WhatMaxtronDoesSection />
        <GovernanceSection />
        <TokenUtilitySection />
        <AllocationSection />
        <ValueCreationSection />
        <ComplianceSection />
        <ClosingSection />
        <SiteFooter />
      </div>
    </>
  );
}
