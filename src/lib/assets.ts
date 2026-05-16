import {
  pickNumber,
  pickString,
  pickStringArray,
  unwrapList,
  unwrapPayload,
} from "@/lib/apiParse";

export type MarketplaceAsset = {
  id: string;
  name: string;
  type: string;
  location: string;
  apy: string;
  minInv: string;
  raised: number;
  target: number;
  pct: number;
  investors: number;
  daysLeft: number;
  tags: string[];
  image: string;
  featured: boolean;
  description: string | null;
};

export type AssetDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  url: string | null;
};

export type AssetOffering = {
  minInvestment: string | null;
  targetRaise: number | null;
  raisedAmount: number | null;
  progressPct: number | null;
  apy: string | null;
  closingDays: number | null;
  investorCount: number | null;
  highlights: string[];
};

export type AssetTokenization = {
  tokenPrice: string | null;
  totalSupply: string | null;
  circulatingSupply: string | null;
  ticker: string | null;
  network: string | null;
  standard: string | null;
};

export type AssetDetail = MarketplaceAsset & {
  verified: boolean;
  highlights: string[];
  financials: { label: string; val: string }[];
  offering: AssetOffering | null;
  tokenization: AssetTokenization | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop";

function formatCurrencyShort(value: number | null, prefix = "$"): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`;
  return `${prefix}${value.toLocaleString()}`;
}

function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`;
}

function calcPct(raised: number | null, target: number | null): number {
  if (raised === null || target === null || target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

function parseAssetRecord(record: Record<string, unknown>): MarketplaceAsset {
  const id =
    pickString(record, ["id", "_id", "assetId", "asset_id"]) ?? "unknown";
  const name =
    pickString(record, ["name", "title", "assetName", "asset_name"]) ??
    "Untitled asset";
  const type =
    pickString(record, ["assetType", "asset_type", "type", "category"]) ??
    "Asset";
  const location =
    pickString(record, ["location", "city", "address", "jurisdiction"]) ??
    "—";
  const apyRaw =
    pickNumber(record, ["apy", "annualYield", "annual_yield", "yield"]) ??
    pickNumber(record, ["expectedReturn", "expected_return"]);
  const minRaw = pickNumber(record, [
    "minInvestment",
    "min_investment",
    "minimumInvestment",
    "minimum_investment",
  ]);
  const raised =
    pickNumber(record, ["raised", "raisedAmount", "raised_amount", "amountRaised"]) ?? 0;
  const target =
    pickNumber(record, ["target", "targetRaise", "target_raise", "fundraisingTarget"]) ??
    0;
  const pct =
    pickNumber(record, ["progress", "progressPct", "progress_pct", "fundedPercent"]) ??
    calcPct(raised, target);
  const investors =
    pickNumber(record, ["investors", "investorCount", "investor_count"]) ?? 0;
  const daysLeft =
    pickNumber(record, ["daysLeft", "days_left", "closingInDays", "daysRemaining"]) ??
    0;
  const image =
    pickString(record, [
      "image",
      "imageUrl",
      "image_url",
      "coverImage",
      "cover_image",
      "thumbnail",
    ]) ?? FALLBACK_IMAGE;
  const tags = pickStringArray(record, ["tags", "labels", "complianceTags"]);
  const featured = Boolean(
    record.featured ?? record.isFeatured ?? record.is_featured,
  );

  return {
    id,
    name,
    type,
    location,
    apy: apyRaw !== null ? formatPercent(apyRaw) : pickString(record, ["apyLabel"]) ?? "—",
    minInv: minRaw !== null ? formatCurrencyShort(minRaw) : "—",
    raised: raised / (raised > 1000 ? 1_000_000 : 1),
    target: target / (target > 1000 ? 1_000_000 : 1),
    pct,
    investors,
    daysLeft,
    tags,
    image,
    featured,
    description: pickString(record, ["description", "summary", "about"]),
  };
}

export function parseAssetList(payload: unknown): MarketplaceAsset[] {
  return unwrapList(payload).map(parseAssetRecord);
}

export function parseAssetDetail(payload: unknown): AssetDetail | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object") return null;
  const base = parseAssetRecord(record as Record<string, unknown>);
  const highlights = pickStringArray(record as Record<string, unknown>, [
    "highlights",
    "keyHighlights",
    "key_highlights",
  ]);
  const financialsRaw = (record as Record<string, unknown>).financials;
  let financials: { label: string; val: string }[] = [];
  if (Array.isArray(financialsRaw)) {
    financials = financialsRaw
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const o = item as Record<string, unknown>;
        const label = pickString(o, ["label", "name", "key"]);
        const val = pickString(o, ["val", "value", "amount"]);
        if (!label || !val) return null;
        return { label, val };
      })
      .filter((x): x is { label: string; val: string } => Boolean(x));
  }

  return {
    ...base,
    verified: Boolean(
      (record as Record<string, unknown>).verified ??
        (record as Record<string, unknown>).isVerified,
    ),
    highlights,
    financials,
    offering: null,
    tokenization: null,
  };
}

export function parseAssetOffering(payload: unknown): AssetOffering | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object") return null;
  const o = record as Record<string, unknown>;
  const raised = pickNumber(o, ["raised", "raisedAmount", "raised_amount"]);
  const target = pickNumber(o, ["target", "targetRaise", "target_raise"]);
  const apyNum = pickNumber(o, ["apy", "annualYield", "yield"]);
  return {
    minInvestment:
      pickString(o, ["minInvestment", "min_investment"]) ??
      (pickNumber(o, ["minInvestment", "min_investment"]) !== null
        ? formatCurrencyShort(pickNumber(o, ["minInvestment", "min_investment"]))
        : null),
    targetRaise: target,
    raisedAmount: raised,
    progressPct:
      pickNumber(o, ["progress", "progressPct"]) ?? calcPct(raised, target),
    apy: apyNum !== null ? formatPercent(apyNum) : pickString(o, ["apy"]),
    closingDays: pickNumber(o, ["daysLeft", "closingInDays", "daysRemaining"]),
    investorCount: pickNumber(o, ["investors", "investorCount"]),
    highlights: pickStringArray(o, ["highlights", "keyHighlights"]),
  };
}

export function parseAssetTokenization(payload: unknown): AssetTokenization | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object") return null;
  const o = record as Record<string, unknown>;
  const price = pickNumber(o, ["tokenPrice", "token_price", "price"]);
  return {
    tokenPrice:
      price !== null
        ? formatCurrencyShort(price)
        : pickString(o, ["tokenPrice", "price"]),
    totalSupply: pickString(o, ["totalSupply", "total_supply", "supply"]),
    circulatingSupply: pickString(o, [
      "circulatingSupply",
      "circulating_supply",
    ]),
    ticker: pickString(o, ["ticker", "symbol", "tokenSymbol"]),
    network: pickString(o, ["network", "blockchain"]),
    standard: pickString(o, ["standard", "tokenStandard", "token_standard"]),
  };
}

export function parseAssetDocuments(payload: unknown): AssetDocument[] {
  return unwrapList(payload).map((doc, index) => {
    const name =
      pickString(doc, ["name", "title", "fileName", "file_name"]) ??
      `Document ${index + 1}`;
    const type = pickString(doc, ["type", "category", "documentType"]) ?? "Document";
    const size =
      pickString(doc, ["size", "fileSize", "file_size"]) ?? "—";
    const date =
      pickString(doc, ["date", "createdAt", "created_at", "uploadedAt"]) ?? "—";
    const url = pickString(doc, ["url", "fileUrl", "file_url", "downloadUrl"]);
    return {
      id: pickString(doc, ["id", "_id"]) ?? `${index}-${name}`,
      name,
      type,
      size,
      date,
      url,
    };
  });
}
