export interface Vendor {
  name: string;
  purpose: string;
}

export interface Epic {
  id: number;
  title: string;
  weeks: string;
  startWeek: number;
  endWeek: number;
  objective: string;
  category: string;
  features: string[];
  vendors: Vendor[];
  webDeliverables: string[];
  mobileDeliverables: string[];
  dependency: string;
}

export const EPICS: Epic[] = [
  {
    id: 1,
    title: "Tokenization Infrastructure",
    weeks: "Weeks 1-4",
    startWeek: 1,
    endWeek: 4,
    objective: "Enable compliant security token issuance and lifecycle management.",
    category: "Smart Contracts",
    features: [
      "Security Token Framework",
      "ERC-1400 Security Tokens",
      "ERC-3643 Permissioned Tokens",
      "Security Token Issuance",
      "Token Ownership Controls",
      "Compliance Rules",
      "Smart Contract Factory (Auto-generate: Token Contracts, Distribution Contracts, Redemption Contracts, Governance Contracts)",
      "Token Lifecycle Management (Mint, Burn, Freeze, Pause, Reissue)"
    ],
    vendors: [
      { name: "OpenZeppelin", purpose: "Security Token Standards" },
      { name: "Thirdweb", purpose: "Deployment Framework" },
      { name: "Tokeny", purpose: "ERC-3643 Infrastructure" }
    ],
    webDeliverables: [
      "Issuer Portal: Tokenization Configuration",
      "Issuer Portal: Token Issuance Dashboard",
      "Admin Portal: Contract Management"
    ],
    mobileDeliverables: [
      "Issuer App: Token Status Monitoring"
    ],
    dependency: "None"
  },
  {
    id: 2,
    title: "Blockchain Infrastructure",
    weeks: "Weeks 2-5",
    startWeek: 2,
    endWeek: 5,
    objective: "Enable multi-chain tokenization and wallet support.",
    category: "Blockchain",
    features: [
      "Multi-Chain Support (Ethereum, Polygon, Base)",
      "Wallet Infrastructure: Custodial (Fireblocks Wallets), Non-Custodial (MetaMask, WalletConnect)",
      "Blockchain Monitoring (Transactions, Smart Contracts, Wallet Activity)"
    ],
    vendors: [
      { name: "Alchemy", purpose: "RPC Infrastructure" },
      { name: "Infura", purpose: "RPC Infrastructure" },
      { name: "QuickNode", purpose: "Backup RPC" },
      { name: "Fireblocks", purpose: "Custodial Wallets" }
    ],
    webDeliverables: [
      "Investor: Wallet Dashboard, Holdings",
      "Issuer: Multi-Wallet Management"
    ],
    mobileDeliverables: [
      "Investor: Wallet Management, Holdings"
    ],
    dependency: "Epic 1"
  },
  {
    id: 3,
    title: "Compliance Infrastructure",
    weeks: "Weeks 3-6",
    startWeek: 3,
    endWeek: 6,
    objective: "Enable regulatory onboarding and investor verification.",
    category: "Compliance",
    features: [
      "Investor Compliance (KYC, AML, Accreditation Verification)",
      "Business Compliance (KYB, UBO Verification)",
      "Jurisdiction Controls (Country Restrictions, Investor Eligibility Rules)"
    ],
    vendors: [
      { name: "Sumsub", purpose: "KYC / KYB" },
      { name: "Persona", purpose: "Alternative KYC" },
      { name: "VerifyInvestor", purpose: "Accredited Investors" }
    ],
    webDeliverables: [
      "Investor: KYC Workflow, Verification Status",
      "Issuer: KYB Workflow",
      "Admin: Compliance Review Dashboard"
    ],
    mobileDeliverables: [
      "Investor: KYC Submission, Status Tracking",
      "Issuer: KYB Tracking"
    ],
    dependency: "Investor & Issuer Onboarding"
  },
  {
    id: 4,
    title: "Wallet Compliance Layer",
    weeks: "Weeks 4-7",
    startWeek: 4,
    endWeek: 7,
    objective: "Ensure only compliant wallets can participate.",
    category: "Compliance",
    features: [
      "Wallet Screening (Risk Scoring, Transaction Monitoring, Sanctions Screening)",
      "Wallet Whitelisting (Approved wallets only: Buy, Hold, Transfer)",
      "Compliance Validation Engine (Before every transfer: KYC Check, AML Check, Jurisdiction Check, Accreditation Check)"
    ],
    vendors: [
      { name: "Chainalysis", purpose: "Wallet Compliance" },
      { name: "TRM Labs", purpose: "Wallet Monitoring" },
      { name: "Elliptic", purpose: "Risk Screening" }
    ],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "Epic 2 + Epic 3"
  },
  {
    id: 5,
    title: "Legal & SPV Infrastructure",
    weeks: "Weeks 5-8",
    startWeek: 5,
    endWeek: 8,
    objective: "Create legal ownership structure for tokenized assets.",
    category: "Legal & SPVs",
    features: [
      "SPV Management (United States: Delaware LLC, Delaware LP; UAE: ADGM SPV, DIFC SPV)",
      "Legal Document Engine (Generate: Subscription Agreement, Investment Agreement, Operating Agreement, Offering Memorandum)",
      "Investor Document Vault (Download Agreements, Legal Records, E-Signatures)"
    ],
    vendors: [
      { name: "Clerky", purpose: "US SPVs" },
      { name: "Stripe Atlas", purpose: "US Formation" },
      { name: "ADGM", purpose: "UAE SPVs" },
      { name: "DIFC", purpose: "UAE SPVs" },
      { name: "DocuSign", purpose: "E-Signatures" }
    ],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "Compliance Layer"
  },
  {
    id: 6,
    title: "Custody Infrastructure",
    weeks: "Weeks 6-9",
    startWeek: 6,
    endWeek: 9,
    objective: "Secure management of tokenized assets and ownership records.",
    category: "Custody",
    features: [
      "Institutional Custody (MPC Wallets, Institutional Storage)",
      "Custody Governance",
      "Asset Repository (Property Records, Asset Documentation, Ownership Records)"
    ],
    vendors: [
      { name: "Fireblocks", purpose: "Custody" },
      { name: "BitGo", purpose: "Custody" },
      { name: "Copper", purpose: "Custody" }
    ],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "Blockchain Infrastructure"
  },
  {
    id: 7,
    title: "Payments & Escrow",
    weeks: "Weeks 7-10",
    startWeek: 7,
    endWeek: 10,
    objective: "Enable investor subscriptions and settlements.",
    category: "Payments",
    features: [
      "Fiat Payments (ACH, Wire Transfer, SWIFT)",
      "Stablecoin Payments (USDC, USDT)",
      "Escrow (Investment Escrow, Settlement Escrow, Distribution Escrow)"
    ],
    vendors: [
      { name: "Lead Bank", purpose: "US Banking" },
      { name: "Column Bank", purpose: "Banking APIs" },
      { name: "Circle", purpose: "Stablecoin Infrastructure" }
    ],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "Compliance + Custody"
  },
  {
    id: 8,
    title: "Yield Distribution Engine",
    weeks: "Weeks 8-11",
    startWeek: 8,
    endWeek: 11,
    objective: "Automate investor returns.",
    category: "Payments",
    features: [
      "Distribution Types (Rental Income, Dividends, Interest Payments)",
      "Distribution Scheduling (Monthly, Quarterly, Annual)",
      "Distribution Tracking (History, Statements, Audit Records)"
    ],
    vendors: [
      { name: "Circle", purpose: "Stablecoin Payouts" },
      { name: "Stripe Treasury", purpose: "Banking Payouts" }
    ],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "Payments Infrastructure"
  },
  {
    id: 9,
    title: "Security Infrastructure",
    weeks: "Weeks 9-12",
    startWeek: 9,
    endWeek: 12,
    objective: "Enterprise-grade platform security.",
    category: "Security",
    features: [
      "Authentication (MFA, RBAC)",
      "Monitoring (Audit Logs, Security Monitoring)",
      "Key Management (Wallet Keys, Contract Keys)"
    ],
    vendors: [
      { name: "Auth0 / Clerk", purpose: "Authentication" },
      { name: "AWS KMS", purpose: "Key Management" }
    ],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "All Core Modules"
  },
  {
    id: 10,
    title: "Web & Mobile Rollout",
    weeks: "Weeks 4-12",
    startWeek: 4,
    endWeek: 12,
    objective: "Runs in Parallel",
    category: "Rollout",
    features: [
      "Investor Web & Mobile (Wallet, Marketplace, Token Holdings, Portfolio, Documents, Yield Tracking, Notifications)",
      "Issuer Web & Mobile (Asset Management, Tokenization, Raise Monitoring, Investor Registry, Distribution Monitoring)",
      "Admin Web (Compliance Operations, Custody Operations, Escrow Operations, Distribution Operations, Reporting)"
    ],
    vendors: [],
    webDeliverables: [],
    mobileDeliverables: [],
    dependency: "All Core Modules"
  }
];
