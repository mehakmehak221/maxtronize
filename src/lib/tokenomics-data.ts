import { PIE_COLORS } from './theme';

export const TOTAL_SUPPLY = 1_000_000_000;

export const heroContent = {
  kicker: 'MAXTRON — The Shield Token',
  headline: 'A Shield, Not A Security',
  lead: 'MAXTRON is the utility and compliance token powering the next generation of real-world asset (RWA) tokenization.',
  body: 'Designed as the foundation of The Shield Framework, MAXTRON enables secure property onboarding, investor verification, compliance enforcement, access management, governance participation and ecosystem growth.',
  footnote: 'Unlike traditional crypto tokens, MAXTRON is not designed to provide dividends, revenue sharing or rental income. Instead, it functions as the operational layer that secures trust across the platform.',
};

export const heroMetrics = [
  { label: 'Total Supply', value: '1,000,000,000 MAXTRON' },
  { label: 'Token Type', value: 'Utility & Compliance Token' },
  { label: 'Blockchain', value: 'EVM Compatible Network' },
  { label: 'Burn Mechanism', value: 'Usage-Based Burn' },
  { label: 'Revenue Share', value: 'None' },
  { label: 'Rental Income', value: 'Exclusively Reserved for Property Token Holders' },
];

export const shieldFramework = {
  title: 'The Shield Framework',
  lead: 'Real estate tokenization requires more than blockchain infrastructure.',
  emphasis: 'It requires trust.',
  body: 'The Shield Framework is designed to protect investors, property sponsors and ecosystem participants through compliance, verification and accountability. MAXTRON serves as the operational token that secures and powers this framework.',
};

export const firewallIntro = 'The corrected MAXTRON model is built on four fundamental principles.';

export const firewallPrinciples = [
  {
    title: 'No Revenue Share',
    body: 'MAXTRON holders do not receive platform fee revenue. Platform revenues remain with the operating business and are not distributed to token holders.',
    metric: '01',
  },
  {
    title: 'No Revenue-Funded Buybacks',
    body: 'The platform does not use revenue to purchase tokens from the market. Any reduction in supply occurs only through actual platform usage.',
    metric: '02',
  },
  {
    title: 'Rental Income Firewall',
    body: 'Rental income generated from tokenized properties belongs exclusively to Property Token holders. MAXTRON holders have no claim to rental income, property cash flows or real estate ownership rights.',
    metric: '03',
  },
  {
    title: 'Earned, Not Sold',
    body: 'The ecosystem prioritizes rewarding productive platform participation rather than speculative token accumulation. Users earn value through platform activity, contribution and engagement.',
    metric: '04',
  },
];

export const functionsIntro = 'MAXTRON has two primary functions within the ecosystem.';

export const whatMaxtronDoes = [
  {
    id: 'bond',
    title: 'Issuer Compliance Bond',
    intro: 'Property sponsors must post MAXTRON as a compliance bond when listing tokenized real estate on the platform.',
    listIntro: 'The bond serves as collateral supporting:',
    body: 'If a property is found to contain fraudulent information, forged documentation or undisclosed encumbrances, the compliance bond may be partially slashed. A portion may be used to compensate affected participants while the remainder is permanently removed from circulation. This mechanism transforms MAXTRON into a trust and accountability layer for real estate tokenization.',
    points: ['Property verification', 'Ownership validation', 'KYC compliance', 'Valuation integrity', 'Title verification', 'Regulatory compliance'],
  },
  {
    id: 'access',
    title: 'Access & Diligence Credits',
    intro: 'Investors use MAXTRON to access premium platform services.',
    listIntro: 'These include:',
    body: 'A portion of MAXTRON spent on these services is permanently burned. As platform usage increases, token consumption increases.',
    points: ['Property due diligence reports', 'Valuation reports', 'Deal flow access', 'Investment analytics', 'Market intelligence', 'Verification services'],
  },
  {
    id: 'rewards',
    title: 'Listing Rewards',
    intro: 'The ecosystem rewards participants who contribute high-quality properties to the platform.',
    listIntro: null,
    body: 'Property sponsors, strategic partners and ecosystem contributors may earn MAXTRON for introducing verified and investable real estate opportunities. This approach aligns incentives with platform growth and asset quality. Rewards are earned through contribution rather than passive token holding.',
    points: [] as string[],
  },
];

export const governanceContent = {
  title: 'Governance',
  body: 'MAXTRON enables governance participation across the platform.',
  scopeIntro: 'Governance is focused on operational and ecosystem parameters, including:',
  isolation: 'Governance does not control property-level rental distributions. Property economics remain isolated within individual Property Tokens. Voting influence may be determined through lock-weighted governance mechanisms that encourage long-term participation.',
  scope: [
    'Verification standards',
    'Compliance requirements',
    'Listing criteria',
    'Bond requirements',
    'Platform fee structures',
    'Ecosystem growth initiatives',
  ],
};

export const utilityIntro = 'MAXTRON serves multiple ecosystem functions:';

export const tokenUtilityList = [
  'Compliance Bonding',
  'Property Verification',
  'Due Diligence Access',
  'Analytics Access',
  'Governance Participation',
  'Listing Rewards',
  'Platform Fee Discounts',
  'Burn-On-Use Mechanics',
  'Ecosystem Participation',
];

export const utilityTagline = 'The token is designed to be used rather than simply held.';

export type Allocation = {
  name: string;
  percent: number;
  amount: string;
  color: string;
};

export const allocations: Allocation[] = [
  { name: 'Ecosystem & Listing Rewards', percent: 30, amount: '300,000,000', color: PIE_COLORS[0] },
  { name: 'Team & Core Contributors', percent: 18, amount: '180,000,000', color: PIE_COLORS[1] },
  { name: 'Liquidity & Market Making', percent: 12, amount: '120,000,000', color: PIE_COLORS[2] },
  { name: 'Treasury', percent: 13, amount: '130,000,000', color: PIE_COLORS[3] },
  { name: 'Compliance & Insurance Reserve', percent: 5, amount: '50,000,000', color: PIE_COLORS[4] },
  { name: 'Seed Allocation', percent: 4, amount: '40,000,000', color: PIE_COLORS[5] },
  { name: 'Private Allocation', percent: 8, amount: '80,000,000', color: PIE_COLORS[6] },
  { name: 'Public & Community Distribution', percent: 7, amount: '70,000,000', color: PIE_COLORS[7] },
  { name: 'Advisors', percent: 3, amount: '30,000,000', color: PIE_COLORS[8] },
];

export const supplyDistribution = {
  title: 'Supply & Distribution',
  total: 'Total Supply: 1,000,000,000 MAXTRON',
  note: 'The distribution model prioritizes ecosystem participants, platform growth and long-term sustainability.',
};

export const valueCreationIntro = 'MAXTRON is designed around utility demand rather than revenue distribution.';

export const valueCreation = [
  {
    title: 'Demand to Bond',
    body: 'Every property sponsor must acquire and lock MAXTRON to list assets on the platform. As more properties enter the ecosystem, demand for MAXTRON increases.',
  },
  {
    title: 'Demand to Spend',
    body: 'Investors consume MAXTRON to access reports, analytics, due diligence and premium platform services. As platform activity grows, token consumption increases.',
  },
  {
    title: 'Burn Through Usage',
    body: 'A portion of MAXTRON used within the platform is permanently removed from circulation. Supply reduction occurs through genuine utility rather than financial engineering.',
  },
  {
    title: 'Fixed Supply',
    body: 'The total supply is permanently capped at 1,000,000,000 MAXTRON. No additional tokens may be minted.',
  },
];

export const complianceContent = {
  title: 'Compliance & Legal Position',
  body: 'MAXTRON is designed as a utility and compliance token.',
  exclusionsIntro: 'It is not intended to represent:',
  footer: 'Property Tokens and MAXTRON serve separate purposes within the ecosystem and operate under distinct frameworks.',
};

export const legalExclusions = [
  'Equity ownership',
  'Property ownership',
  'Rental income rights',
  'Revenue-sharing rights',
  'Dividends',
  'Financial securities',
];

export const closingContent = {
  title: 'The Future of Secure Real Estate Tokenization',
  lines: [
    'MAXTRON transforms trust into infrastructure.',
    'By combining compliance bonding, verification systems, access-based utility and transparent governance, MAXTRON creates a foundation for secure and scalable real-world asset tokenization.',
  ],
  pillars: [
    'A utility token with a purpose.',
    'A compliance layer with accountability.',
    'A shield for the future of tokenized real estate.',
  ],
  signoff: 'MAXTRON — The Shield Token',
};
