import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";
import { formatCompactCurrency } from "@/lib/issuerDashboard";
import type { PaginationMeta } from "@/lib/issuerDocuments";

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export type HubAssetDisplayStatus = "Live" | "Funded" | "Draft" | string;

export type HubAsset = {
  id: string;
  name: string;
  displayStatus: HubAssetDisplayStatus;
  tag: string;
  valuation: string;
  yield: string;
  investors: string;
  regulation: string;
  progress: number;
  raised: string;
  target: string;
  barKey: string;
};

export type ListIssuerHubAssetsParams = {
  page?: number;
  limit?: number;
  search?: string;
  displayStatus?: string;
};

export type IssuerHubAssetsListResult = {
  items: HubAsset[];
  pagination: PaginationMeta;
};

const BAR_KEYS = ["a", "b", "c", "draft"] as const;

function parsePagination(payload: unknown): PaginationMeta {
  if (!payload || typeof payload !== "object") return DEFAULT_PAGINATION;
  const record = payload as Record<string, unknown>;
  const pagination =
    record.pagination && typeof record.pagination === "object"
      ? (record.pagination as Record<string, unknown>)
      : record;

  return {
    page: pickNumber(pagination, ["page"]) ?? DEFAULT_PAGINATION.page,
    limit: pickNumber(pagination, ["limit"]) ?? DEFAULT_PAGINATION.limit,
    total: pickNumber(pagination, ["total"]) ?? DEFAULT_PAGINATION.total,
    totalPages:
      pickNumber(pagination, ["totalPages", "total_pages"]) ??
      DEFAULT_PAGINATION.totalPages,
    hasNextPage: Boolean(
      pagination.hasNextPage ?? pagination.has_next_page ?? false,
    ),
    hasPreviousPage: Boolean(
      pagination.hasPreviousPage ?? pagination.has_previous_page ?? false,
    ),
  };
}

function normalizeDisplayStatus(raw: string | null): HubAssetDisplayStatus {
  const normalized = (raw ?? "").trim();
  if (!normalized) return "Draft";
  const lower = normalized.toLowerCase();
  if (
    lower.includes("live") ||
    lower.includes("active") ||
    lower.includes("fundraising") ||
    lower.includes("raising")
  ) {
    return "Live";
  }
  if (
    lower.includes("funded") ||
    lower.includes("closed") ||
    lower.includes("complete")
  ) {
    return "Funded";
  }
  if (lower.includes("draft") || lower.includes("pending")) {
    return "Draft";
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatYield(value: number | null, raw: string | null): string {
  if (raw?.trim()) return raw.trim();
  if (value === null || value <= 0) return "—";
  return `${value.toFixed(1)}%`;
}

function formatInvestors(value: number | null, raw: string | null): string {
  if (raw?.trim()) return raw.trim();
  if (value === null) return "0";
  return String(value);
}

function barKeyForAsset(
  displayStatus: HubAssetDisplayStatus,
  index: number,
): string {
  if (displayStatus === "Draft" || displayStatus.toLowerCase() === "draft") {
    return "draft";
  }
  return BAR_KEYS[index % 3] ?? "a";
}

function parseHubAsset(record: Record<string, unknown>, index: number): HubAsset {
  const id = pickString(record, ["id", "_id", "assetId", "asset_id"]) ?? "";
  const name =
    pickString(record, [
      "name",
      "title",
      "assetName",
      "asset_name",
      "propertyName",
      "property_name",
    ]) ?? "Untitled asset";

  const displayStatus = normalizeDisplayStatus(
    pickString(record, [
      "displayStatus",
      "display_status",
      "status",
      "lifecycleStatus",
      "lifecycle_status",
      "offeringStatus",
    ]),
  );

  const tag =
    pickString(record, [
      "tag",
      "tokenSymbol",
      "token_symbol",
      "symbol",
      "ticker",
      "token",
    ]) ?? "—";

  const valuationValue = pickNumber(record, [
    "valuation",
    "appraisalValue",
    "appraisal_value",
    "tokenizedValue",
    "tokenized_value",
    "value",
  ]);
  const valuation =
    pickString(record, ["valuationLabel", "valuation_label", "valuationDisplay"]) ??
    (valuationValue !== null
      ? formatCompactCurrency(valuationValue)
      : "—");

  const yieldPercent = pickNumber(record, [
    "yield",
    "yieldPercent",
    "yield_percent",
    "apy",
    "averageApy",
  ]);
  const yieldLabel = formatYield(
    yieldPercent,
    pickString(record, ["yieldLabel", "yield_label", "displayYield"]),
  );

  const investorCount = pickNumber(record, [
    "investors",
    "investorCount",
    "investor_count",
    "totalInvestors",
  ]);
  const investors = formatInvestors(
    investorCount,
    pickString(record, ["investorsLabel", "investors_label"]),
  );

  const regulation =
    pickString(record, [
      "regulation",
      "reg",
      "offeringType",
      "offering_type",
      "exemption",
      "regType",
    ]) ?? "—";

  const progress =
    pickNumber(record, [
      "progress",
      "progressPercent",
      "progress_percent",
      "completionPercent",
      "completion_percent",
      "raiseProgress",
    ]) ?? 0;

  const raisedValue = pickNumber(record, [
    "raised",
    "capitalRaised",
    "capital_raised",
    "amountRaised",
    "amount_raised",
  ]);
  const targetValue = pickNumber(record, [
    "target",
    "raiseTarget",
    "raise_target",
    "fundingTarget",
    "funding_target",
    "goal",
  ]);

  const raised =
    pickString(record, ["raisedLabel", "raised_label", "displayRaised"]) ??
    (raisedValue !== null ? formatCompactCurrency(raisedValue) : "$0");
  const target =
    pickString(record, ["targetLabel", "target_label", "displayTarget"]) ??
    (targetValue !== null ? formatCompactCurrency(targetValue) : "—");

  return {
    id: id || `asset-${index}`,
    name,
    displayStatus,
    tag,
    valuation,
    yield: yieldLabel,
    investors,
    regulation,
    progress: Math.min(100, Math.max(0, progress)),
    raised,
    target,
    barKey: barKeyForAsset(displayStatus, index),
  };
}

export function parseIssuerHubAssetsList(
  payload: unknown,
): IssuerHubAssetsListResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(record.data ?? record.items ?? record.assets).map(
    parseHubAsset,
  );
  return {
    items,
    pagination: parsePagination(payload),
  };
}

export function countActiveOfferings(assets: HubAsset[]): number {
  return assets.filter(
    (a) =>
      a.displayStatus === "Live" ||
      a.displayStatus.toLowerCase().includes("active"),
  ).length;
}

export type HubAssetsSummary = {
  totalAssets: number;
  publishedAssets: number;
  draftOnboardings: number;
  activeOfferings: number;
};

export type HubCapTableSummary = {
  investorCount: number;
  positionCount: number;
  totalInvested: number;
  totalDistributed: number;
  currency: string;
};

export type HubCapTableRow = {
  id: string;
  initials: string;
  chipKey: string;
  name: string;
  email: string;
  asset: string;
  token: string;
  tokens: string;
  ownershipPercent: number;
  invested: string;
  distributed: string;
  jurisdiction: string;
  joinDate: string;
  status: string;
  statusTone: "funded" | "committed" | "other";
};

export type ListHubCapTableParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  assetId?: string;
};

export type HubCapTableListResult = {
  items: HubCapTableRow[];
  pagination: PaginationMeta;
};

export type HubInvestorRow = {
  id: string;
  initials: string;
  chipIndex: number;
  name: string;
  email: string;
  kycStatus: string;
  accreditation: string;
  commitment: string;
  asset: string;
  jurisdiction: string;
  source: string;
  joinDate: string;
  kycApproved: boolean;
};

export type ListHubInvestorsParams = {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
  accreditationStatus?: string;
  source?: string;
  assetId?: string;
  bucket?: "kycApproved" | "pendingReview" | "actionRequired" | string;
};

export type HubInvestorsListResult = {
  items: HubInvestorRow[];
  pagination: PaginationMeta;
};

export type HubComplianceSummary = {
  complianceScore: { score: number; maxScore: number; summary: string };
  secFilings: {
    current: number;
    total: number;
    allCurrent: boolean;
    summary: string;
  };
  kycCompletion: {
    ratePercent: number;
    verifiedCount: number;
    totalCount: number;
    summary: string;
  };
  ofacHits: { count: number; periodDays: number; summary: string };
  openComplianceItems: { count: number; summary: string };
};

export type HubRegulatoryStatusRow = {
  id: string;
  title: string;
  status: string;
  statusTone: "success" | "info" | "warn" | "neutral";
  entity: string;
  description: string;
  date: string;
};

export type ListHubRegulatoryStatusParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  assetId?: string;
};

export type HubRegulatoryStatusListResult = {
  items: HubRegulatoryStatusRow[];
  pagination: PaginationMeta;
};

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function chipKeyFromSeed(seed: string): string {
  const keys = ["yt", "sl", "ad", "ro", "mo", "cw", "eh"];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) % 997;
  }
  return keys[hash % keys.length] ?? "yt";
}

function chipIndexFromSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) % 997;
  }
  return (hash % 6) + 1;
}

function formatHubDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function parseNestedRecord(
  record: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const nested = record[key];
  if (!nested || typeof nested !== "object" || Array.isArray(nested)) return {};
  return nested as Record<string, unknown>;
}

export function parseHubAssetsSummary(payload: unknown): HubAssetsSummary {
  const record =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data &&
        typeof (payload as Record<string, unknown>).data === "object"
          ? ((payload as Record<string, unknown>).data as Record<string, unknown>)
          : (payload as Record<string, unknown>))
      : {};
  return {
    totalAssets: pickNumber(record, ["totalAssets", "total_assets"]) ?? 0,
    publishedAssets:
      pickNumber(record, ["publishedAssets", "published_assets"]) ?? 0,
    draftOnboardings:
      pickNumber(record, ["draftOnboardings", "draft_onboardings"]) ?? 0,
    activeOfferings:
      pickNumber(record, ["activeOfferings", "active_offerings"]) ?? 0,
  };
}

export function parseHubCapTableSummary(payload: unknown): HubCapTableSummary {
  const record =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data &&
        typeof (payload as Record<string, unknown>).data === "object"
          ? ((payload as Record<string, unknown>).data as Record<string, unknown>)
          : (payload as Record<string, unknown>))
      : {};
  return {
    investorCount:
      pickNumber(record, ["investorCount", "investor_count"]) ?? 0,
    positionCount:
      pickNumber(record, ["positionCount", "position_count"]) ?? 0,
    totalInvested:
      pickNumber(record, ["totalInvested", "total_invested"]) ?? 0,
    totalDistributed:
      pickNumber(record, ["totalDistributed", "total_distributed"]) ?? 0,
    currency: pickString(record, ["currency", "currencyCode"]) ?? "USD",
  };
}

function parseCapTableRow(
  record: Record<string, unknown>,
  index: number,
): HubCapTableRow {
  const id = pickString(record, ["id", "_id", "positionId"]) ?? `cap-${index}`;
  const name =
    pickString(record, ["name", "investorName", "investor_name"]) ?? "—";
  const email = pickString(record, ["email", "investorEmail"]) ?? "";
  const asset =
    pickString(record, ["asset", "assetName", "asset_name"]) ?? "—";
  const token =
    pickString(record, ["token", "tokenSymbol", "symbol"]) ?? "—";
  const tokens =
    pickString(record, ["tokens", "tokenAmount", "token_amount", "tokenCount"]) ??
    "—";
  const ownershipPercent =
    pickNumber(record, [
      "ownershipPercent",
      "ownership_percent",
      "ownership",
      "own",
    ]) ?? 0;
  const investedValue = pickNumber(record, [
    "invested",
    "investedAmount",
    "amountInvested",
  ]);
  const distributedValue = pickNumber(record, [
    "distributed",
    "distributions",
    "totalDistributed",
  ]);
  const invested =
    pickString(record, ["investedLabel", "invested_display"]) ??
    (investedValue !== null ? formatCompactCurrency(investedValue) : "—");
  const distributed =
    pickString(record, ["distributedLabel", "distributed_display"]) ??
    (distributedValue !== null && distributedValue > 0
      ? formatCompactCurrency(distributedValue)
      : "—");
  const jurisdiction =
    pickString(record, ["jurisdiction", "country", "region"]) ?? "—";
  const joinDate = formatHubDate(
    pickString(record, ["joinDate", "join_date", "createdAt", "date"]),
  );
  const status = pickString(record, ["status", "state"]) ?? "—";
  const statusLower = status.toLowerCase();
  const statusTone: HubCapTableRow["statusTone"] = statusLower.includes("fund")
    ? "funded"
    : statusLower.includes("commit")
      ? "committed"
      : "other";

  return {
    id,
    initials: initialsFromName(name),
    chipKey: chipKeyFromSeed(id),
    name,
    email,
    asset,
    token,
    tokens,
    ownershipPercent,
    invested,
    distributed,
    jurisdiction,
    joinDate,
    status,
    statusTone,
  };
}

export function parseHubCapTableList(payload: unknown): HubCapTableListResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(record.data ?? record.items).map(parseCapTableRow);
  return { items, pagination: parsePagination(payload) };
}

function parseHubInvestor(
  record: Record<string, unknown>,
  index: number,
): HubInvestorRow {
  const id = pickString(record, ["id", "_id", "investorId"]) ?? `inv-${index}`;
  const name =
    pickString(record, ["name", "investorName", "investor_name", "fullName"]) ??
    "—";
  const email = pickString(record, ["email"]) ?? "";
  const kycStatus =
    pickString(record, ["kycStatus", "kyc_status", "status"]) ?? "—";
  const accreditation =
    pickString(record, [
      "accreditation",
      "accreditationStatus",
      "accreditation_status",
    ]) ?? "—";
  const commitmentValue = pickNumber(record, [
    "commitment",
    "amount",
    "invested",
    "commitmentAmount",
  ]);
  const commitment =
    pickString(record, ["commitmentLabel", "commitment_display"]) ??
    (commitmentValue !== null ? formatCompactCurrency(commitmentValue) : "—");
  const asset =
    pickString(record, ["asset", "assetName", "asset_name"]) ?? "—";
  const jurisdiction =
    pickString(record, ["jurisdiction", "country", "region"]) ?? "—";
  const source = pickString(record, ["source", "channel"]) ?? "—";
  const joinDate = formatHubDate(
    pickString(record, ["joinDate", "join_date", "createdAt"]),
  );
  const kycApproved =
    kycStatus.toLowerCase().includes("approv") ||
    kycStatus.toLowerCase().includes("verified");

  return {
    id,
    initials: initialsFromName(name),
    chipIndex: chipIndexFromSeed(id),
    name,
    email,
    kycStatus,
    accreditation,
    commitment,
    asset,
    jurisdiction,
    source,
    joinDate,
    kycApproved,
  };
}

export function parseHubInvestorsList(payload: unknown): HubInvestorsListResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(record.data ?? record.items).map(parseHubInvestor);
  return { items, pagination: parsePagination(payload) };
}

export function parseHubComplianceSummary(payload: unknown): HubComplianceSummary {
  const record =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data &&
        typeof (payload as Record<string, unknown>).data === "object"
          ? ((payload as Record<string, unknown>).data as Record<string, unknown>)
          : (payload as Record<string, unknown>))
      : {};
  const score = parseNestedRecord(record, "complianceScore");
  const sec = parseNestedRecord(record, "secFilings");
  const kyc = parseNestedRecord(record, "kycCompletion");
  const ofac = parseNestedRecord(record, "ofacHits");
  const open = parseNestedRecord(record, "openComplianceItems");

  return {
    complianceScore: {
      score: pickNumber(score, ["score"]) ?? 0,
      maxScore: pickNumber(score, ["maxScore", "max_score"]) ?? 100,
      summary:
        pickString(score, ["summary", "label"]) ?? "Compliance score unavailable",
    },
    secFilings: {
      current: pickNumber(sec, ["current"]) ?? 0,
      total: pickNumber(sec, ["total"]) ?? 0,
      allCurrent: Boolean(sec.allCurrent ?? sec.all_current ?? false),
      summary: pickString(sec, ["summary"]) ?? "",
    },
    kycCompletion: {
      ratePercent:
        pickNumber(kyc, ["ratePercent", "rate_percent", "rate"]) ?? 0,
      verifiedCount:
        pickNumber(kyc, ["verifiedCount", "verified_count"]) ?? 0,
      totalCount: pickNumber(kyc, ["totalCount", "total_count"]) ?? 0,
      summary: pickString(kyc, ["summary"]) ?? "",
    },
    ofacHits: {
      count: pickNumber(ofac, ["count"]) ?? 0,
      periodDays: pickNumber(ofac, ["periodDays", "period_days"]) ?? 90,
      summary: pickString(ofac, ["summary"]) ?? "",
    },
    openComplianceItems: {
      count: pickNumber(open, ["count"]) ?? 0,
      summary: pickString(open, ["summary"]) ?? "",
    },
  };
}

function regulatoryStatusTone(status: string): HubRegulatoryStatusRow["statusTone"] {
  const lower = status.toLowerCase();
  if (
    lower.includes("filed") ||
    lower.includes("active") ||
    lower.includes("current") ||
    lower.includes("complete")
  ) {
    return "success";
  }
  if (lower.includes("review") || lower.includes("pending")) return "warn";
  if (lower.includes("mica") || lower.includes("reg s")) return "info";
  return "neutral";
}

function parseRegulatoryStatusRow(
  record: Record<string, unknown>,
  index: number,
): HubRegulatoryStatusRow {
  const id = pickString(record, ["id", "_id"]) ?? `reg-${index}`;
  const title =
    pickString(record, ["title", "name", "filing", "type", "label"]) ??
    "Regulatory item";
  const status = pickString(record, ["status", "state"]) ?? "—";
  const entity =
    pickString(record, ["entity", "asset", "assetName", "asset_name"]) ?? "—";
  const description =
    pickString(record, ["description", "desc", "summary", "details"]) ?? "";
  const date = formatHubDate(
    pickString(record, ["date", "filedAt", "filed_at", "updatedAt"]),
  );

  return {
    id,
    title,
    status,
    statusTone: regulatoryStatusTone(status),
    entity,
    description,
    date,
  };
}

export function parseHubRegulatoryStatusList(
  payload: unknown,
): HubRegulatoryStatusListResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(
    record.data ?? record.items ?? record.filings,
  ).map(parseRegulatoryStatusRow);
  return { items, pagination: parsePagination(payload) };
}

export type HubInvestorsSummary = {
  kycApproved: number;
  pendingReview: number;
  actionRequired: number;
  totalPositions: number;
};

export type HubOverviewSummary = {
  updatedAt: string | null;
  organizationName: string;
  totalCapitalRaised: {
    amount: number;
    currency: string;
    activeOfferingsCount: number;
    weeklyChange: number;
  };
  activeAssets: {
    total: number;
    inFunding: number;
    fullyFunded: number;
    quarterlyChange: number;
  };
  totalInvestors: {
    total: number;
    funded: number;
    committed: number;
    monthlyChange: number;
  };
  blendedYield: {
    percent: number;
    quarterlyChangePercent: number;
  };
  pendingKyc: {
    total: number;
    awaitingDocuments: number;
    inReview: number;
    overdueCount: number;
  };
  nextDistribution: {
    amount: number;
    currency: string;
    scheduledAt: string | null;
    investorCount: number;
    label: string;
  } | null;
};

export type CapitalVelocityPoint = {
  week: string;
  raised: number;
  committed: number;
};

export type HubCapitalVelocity = {
  weeks: number;
  series: CapitalVelocityPoint[];
};

export type HubOverviewActivityItem = {
  id: string;
  label: string;
  time: string;
  tone: "primary" | "info" | "success" | "warn" | "danger";
};

export type HubOverviewActivityResult = {
  items: HubOverviewActivityItem[];
  pagination: PaginationMeta;
};

export type ListHubOverviewActivityParams = {
  page?: number;
  limit?: number;
};

function parseNested(
  record: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const nested = record[key];
  if (!nested || typeof nested !== "object" || Array.isArray(nested)) {
    return {};
  }
  return nested as Record<string, unknown>;
}

export function parseHubInvestorsSummary(payload: unknown): HubInvestorsSummary {
  const record =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data &&
        typeof (payload as Record<string, unknown>).data === "object"
          ? ((payload as Record<string, unknown>).data as Record<string, unknown>)
          : (payload as Record<string, unknown>))
      : {};
  return {
    kycApproved:
      pickNumber(record, ["kycApproved", "kyc_approved"]) ?? 0,
    pendingReview:
      pickNumber(record, ["pendingReview", "pending_review"]) ?? 0,
    actionRequired:
      pickNumber(record, ["actionRequired", "action_required"]) ?? 0,
    totalPositions:
      pickNumber(record, ["totalPositions", "total_positions"]) ?? 0,
  };
}

export function parseHubOverviewSummary(payload: unknown): HubOverviewSummary {
  const record =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data &&
        typeof (payload as Record<string, unknown>).data === "object"
          ? ((payload as Record<string, unknown>).data as Record<string, unknown>)
          : (payload as Record<string, unknown>))
      : {};

  const org = parseNested(record, "organization");
  const capital = parseNested(record, "totalCapitalRaised");
  const assets = parseNested(record, "activeAssets");
  const investors = parseNested(record, "totalInvestors");
  const yieldData = parseNested(record, "blendedYield");
  const kyc = parseNested(record, "pendingKyc");
  const distRaw = record.nextDistribution ?? record.next_distribution;

  let nextDistribution: HubOverviewSummary["nextDistribution"] = null;
  if (distRaw && typeof distRaw === "object" && !Array.isArray(distRaw)) {
    const dist = distRaw as Record<string, unknown>;
    const amount = pickNumber(dist, ["amount", "value"]) ?? 0;
    const currency = pickString(dist, ["currency"]) ?? "USD";
    const scheduledAt =
      pickString(dist, ["scheduledAt", "scheduled_at", "date"]) ?? null;
    const investorCount =
      pickNumber(dist, ["investorCount", "investor_count", "investors"]) ?? 0;
    const label =
      pickString(dist, ["label", "description"]) ??
      (scheduledAt
        ? `Scheduled ${formatHubDate(scheduledAt)} · ${investorCount} investors`
        : `${investorCount} investors`);
    nextDistribution = {
      amount,
      currency,
      scheduledAt,
      investorCount,
      label,
    };
  }

  return {
    updatedAt: pickString(record, ["updatedAt", "updated_at"]) ?? null,
    organizationName:
      pickString(org, ["name", "organizationName", "organization_name"]) ?? "",
    totalCapitalRaised: {
      amount: pickNumber(capital, ["amount", "total"]) ?? 0,
      currency: pickString(capital, ["currency"]) ?? "USD",
      activeOfferingsCount:
        pickNumber(capital, [
          "activeOfferingsCount",
          "active_offerings_count",
        ]) ?? 0,
      weeklyChange:
        pickNumber(capital, ["weeklyChange", "weekly_change"]) ?? 0,
    },
    activeAssets: {
      total: pickNumber(assets, ["total", "count"]) ?? 0,
      inFunding: pickNumber(assets, ["inFunding", "in_funding"]) ?? 0,
      fullyFunded:
        pickNumber(assets, ["fullyFunded", "fully_funded"]) ?? 0,
      quarterlyChange:
        pickNumber(assets, ["quarterlyChange", "quarterly_change"]) ?? 0,
    },
    totalInvestors: {
      total: pickNumber(investors, ["total", "count"]) ?? 0,
      funded: pickNumber(investors, ["funded"]) ?? 0,
      committed: pickNumber(investors, ["committed"]) ?? 0,
      monthlyChange:
        pickNumber(investors, ["monthlyChange", "monthly_change"]) ?? 0,
    },
    blendedYield: {
      percent:
        pickNumber(yieldData, ["percent", "apy", "averageApy"]) ?? 0,
      quarterlyChangePercent:
        pickNumber(yieldData, [
          "quarterlyChangePercent",
          "quarterly_change_percent",
        ]) ?? 0,
    },
    pendingKyc: {
      total: pickNumber(kyc, ["total", "count"]) ?? 0,
      awaitingDocuments:
        pickNumber(kyc, ["awaitingDocuments", "awaiting_documents"]) ?? 0,
      inReview: pickNumber(kyc, ["inReview", "in_review"]) ?? 0,
      overdueCount:
        pickNumber(kyc, ["overdueCount", "overdue_count"]) ?? 0,
    },
    nextDistribution,
  };
}

function parseCapitalVelocityPoint(
  record: Record<string, unknown>,
): CapitalVelocityPoint {
  return {
    week: pickString(record, ["week", "label"]) ?? "",
    raised:
      pickNumber(record, ["raised", "raisedAmount", "raised_amount"]) ?? 0,
    committed:
      pickNumber(record, ["committed", "committedAmount", "committed_amount"]) ??
      0,
  };
}

export function parseHubCapitalVelocity(payload: unknown): HubCapitalVelocity {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const seriesRaw = record.series ?? record.data;
  const series = Array.isArray(seriesRaw)
    ? seriesRaw
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object",
        )
        .map(parseCapitalVelocityPoint)
    : [];
  return {
    weeks: pickNumber(record, ["weeks", "weekCount", "week_count"]) ?? series.length,
    series,
  };
}

function overviewActivityTone(
  record: Record<string, unknown>,
): HubOverviewActivityItem["tone"] {
  const hay = `${pickString(record, ["type", "category", "status", "eventType"]) ?? ""}`.toLowerCase();
  if (hay.includes("ofac") || hay.includes("flag") || hay.includes("danger")) {
    return "danger";
  }
  if (hay.includes("kyc") || hay.includes("compliance") || hay.includes("review")) {
    return "warn";
  }
  if (hay.includes("distribution") || hay.includes("yield")) return "success";
  if (hay.includes("commit") || hay.includes("invest")) return "primary";
  return "info";
}

function parseOverviewActivityItem(
  record: Record<string, unknown>,
  index: number,
): HubOverviewActivityItem {
  const label =
    pickString(record, [
      "label",
      "title",
      "description",
      "message",
      "name",
      "summary",
    ]) ?? "Activity";
  const time =
    pickString(record, ["time", "timeAgo", "relativeTime"]) ??
    formatRelativeHubTime(
      pickString(record, [
        "createdAt",
        "created_at",
        "occurredAt",
        "occurred_at",
        "timestamp",
      ]),
    );

  return {
    id: pickString(record, ["id", "_id"]) ?? `activity-${index}`,
    label,
    time,
    tone: overviewActivityTone(record),
  };
}

function formatRelativeHubTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatHubDate(value);
}

export function parseHubOverviewActivity(
  payload: unknown,
): HubOverviewActivityResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], pagination: DEFAULT_PAGINATION };
  }
  const record = payload as Record<string, unknown>;
  const items = unwrapList(record.data ?? record.items ?? record.activities).map(
    parseOverviewActivityItem,
  );
  return { items, pagination: parsePagination(payload) };
}

export function capitalVelocityChartValues(series: CapitalVelocityPoint[]): {
  raisedM: number[];
  committedM: number[];
  maxM: number;
  weekLabels: string[];
} {
  const raisedM = series.map((p) => p.raised / 1_000_000);
  const committedM = series.map((p) => p.committed / 1_000_000);
  const maxRaw = Math.max(...raisedM, ...committedM, 0);
  const maxM = maxRaw > 0 ? Math.ceil(maxRaw * 1.15 * 4) / 4 : 12;
  const weekLabels = series.map((p) => p.week || "");
  return { raisedM, committedM, maxM, weekLabels };
}

export function formatHubUpdatedAt(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatSignedChange(value: number, options?: { suffix?: string; isPercent?: boolean }): string {
  const suffix = options?.suffix ?? "";
  const formatted = options?.isPercent
    ? `${Math.abs(value).toFixed(1)}%`
    : formatCompactCurrency(Math.abs(value));
  const sign = value >= 0 ? "↗" : "↘";
  const prefix = value >= 0 ? "+" : "-";
  if (options?.isPercent) {
    return `${sign} ${prefix}${formatted}${suffix}`;
  }
  return `${sign} ${prefix}${formatted}${suffix}`;
}

export function buildHubQueryString(
  params: Record<string, string | number | undefined | null>,
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const str = typeof value === "string" ? value.trim() : String(value);
    if (str) searchParams.set(key, str);
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
