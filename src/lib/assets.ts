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
  image: string | null;
  featured: boolean;
  description: string | null;
  watchlist?: boolean;
  fundingLabel?: string | null;
  riskLabel?: string | null;
  verified?: boolean;
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

/** Resolve cover image URL from API fields; returns null when none is provided. */
export function resolveMarketplaceCoverImage(
  record: Record<string, unknown>,
  metaAsset?: Record<string, unknown> | null,
): string | null {
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

  const coverImageKey =
    (metaAsset
      ? pickString(metaAsset, ["coverImageKey", "cover_image_key"])
      : null) ??
    pickString(record, ["coverImageKey", "cover_image_key"]);

  const coverImageUrl = metaAsset
    ? pickString(metaAsset, ["coverImageUrl", "cover_image_url", "imageUrl", "image_url"])
    : null;
  if (coverImageUrl) {
    if (coverImageUrl.startsWith("http://") || coverImageUrl.startsWith("https://")) {
      return coverImageUrl;
    }
    if (baseUrl) {
      return coverImageUrl.startsWith("/")
        ? `${baseUrl}${coverImageUrl}`
        : `${baseUrl}/${coverImageUrl}`;
    }
  }

  if (coverImageKey && baseUrl) {
    const key = coverImageKey.replace(/^\//, "");
    return `${baseUrl}/storage/${key}`;
  }

  const raw = pickString(record, [
    "coverImageUrl",
    "cover_image_url",
    "image",
    "imageUrl",
    "image_url",
    "coverImage",
    "cover_image",
    "thumbnail",
  ]);
  if (!raw) return null;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (!baseUrl) return raw;
  return raw.startsWith("/") ? `${baseUrl}${raw}` : `${baseUrl}/${raw}`;
}

function formatCurrencyShort(value: number | null, prefix = "$"): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`;
  return `${prefix}${value.toLocaleString()}`;
}

function formatWholeNumber(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-US");
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
  const hero =
    record.hero && typeof record.hero === "object"
      ? (record.hero as Record<string, unknown>)
      : null;
  const metadata =
    record.metadata && typeof record.metadata === "object"
      ? (record.metadata as Record<string, unknown>)
      : null;
  const metaAsset =
    metadata && metadata.asset && typeof metadata.asset === "object"
      ? (metadata.asset as Record<string, unknown>)
      : null;
  const metaOffering =
    metadata && metadata.offering && typeof metadata.offering === "object"
      ? (metadata.offering as Record<string, unknown>)
      : null;
  const metaAccreditation =
    metadata && metadata.accreditation && typeof metadata.accreditation === "object"
      ? (metadata.accreditation as Record<string, unknown>)
      : null;

  const id =
    pickString(record, ["id", "_id", "assetId", "asset_id"]) ?? "unknown";
  const name =
    pickString(record, ["name", "title", "assetName", "asset_name"]) ??
    "Untitled asset";
  const type =
    pickString(record, [
      "assetTypeLabel",
      "asset_type_label",
      "assetType",
      "asset_type",
      "type",
      "category",
    ]) ??
    "Asset";
  const location =
    pickString(record, ["location", "city", "address", "jurisdiction"]) ??
    "—";

  // APY / Yield extraction with fallback to metadata.asset.capRate or metadata.offering.targetIrr
  const apyRaw =
    pickNumber(record, [
      "apy",
      "apyPercent",
      "annualYield",
      "annual_yield",
      "yield",
    ]) ??
    pickNumber(record, ["expectedReturn", "expected_return"]) ??
    (metaAsset ? pickNumber(metaAsset, ["capRate"]) : null) ??
    (metaOffering ? pickNumber(metaOffering, ["targetIrr", "preferredReturn"]) : null) ??
    (hero ? pickNumber(hero, ["annualYieldPercent", "apyPercent", "apy"]) : null);

  const minRaw = pickNumber(record, [
    "minInvestment",
    "min_investment",
    "minimumInvestment",
    "minimum_investment",
  ]) ?? (hero ? pickNumber(hero, ["minimumInvestment", "minInvestment"]) : null);

  // Note: Backend might not expose raised at root. Check offering metadata first, fallback to root.
  const raised =
    pickNumber(record, [
      "raised",
      "raisedAmount",
      "raised_amount",
      "amountRaised",
    ]) ?? 
    (metaOffering ? pickNumber(metaOffering, ["raised", "raisedAmount"]) : null) ??
    0;

  const target =
    pickNumber(record, [
      "target",
      "targetRaise",
      "target_raise",
      "targetRaiseAmount",
      "fundraisingTarget",
    ]) ??
    0;

  const pct =
    pickNumber(record, [
      "progress",
      "progressPct",
      "progress_pct",
      "fundedPercent",
      "fundingProgressPercent",
    ]) ??
    (metaOffering ? pickNumber(metaOffering, ["progress", "progressPct"]) : null) ??
    (hero ? pickNumber(hero, ["fundraisingProgressPercent", "fundingProgressPercent"]) : null) ??
    calcPct(raised, target);

  const investors =
    pickNumber(record, ["investors", "investorCount", "investor_count"]) ?? 
    (metaOffering ? pickNumber(metaOffering, ["investors", "investorCount"]) : null) ??
    0;

  const daysLeft =
    pickNumber(record, ["daysLeft", "days_left", "closingInDays", "daysRemaining"]) ??
    (metaOffering ? pickNumber(metaOffering, ["daysLeft", "closingDays"]) : null) ??
    0;

  const image = resolveMarketplaceCoverImage(record, metaAsset);

  // Support tags from accreditation exemptions as tag fallback
  const tagsRaw = record.tags ?? record.labels ?? metaAccreditation?.exemptions;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map(String).filter(Boolean)
    : [];

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
    watchlist: Boolean(
      record.watchlist ??
        record.isWatchlisted ??
        record.inWatchlist ??
        record.in_watchlist ??
        record.is_watchlisted,
    ),
  };
}

export function parseAssetList(payload: unknown): MarketplaceAsset[] {
  return unwrapList(payload).map(parseAssetRecord);
}

export function parseAssetDetail(payload: unknown): AssetDetail | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object") return null;
  const root = record as Record<string, unknown>;
  const base = parseAssetRecord(root);
  const highlights = pickStringArray(record as Record<string, unknown>, [
    "highlights",
    "keyHighlights",
    "key_highlights",
  ]);
  const financialsRaw = root.financials;
  const financialsRecord =
    financialsRaw && typeof financialsRaw === "object" && !Array.isArray(financialsRaw)
      ? (financialsRaw as Record<string, unknown>)
      : null;
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
  } else if (financialsRecord) {
    const appraisalValue = pickNumber(financialsRecord, ["appraisalValue"]);
    const annualIncome = pickNumber(financialsRecord, ["annualIncome"]);
    const tokenPrice = pickNumber(financialsRecord, ["tokenPrice"]);
    const totalSupply = pickNumber(financialsRecord, ["totalSupply"]);
    const currency = pickString(financialsRecord, ["currency"]) ?? "USD";
    const offering =
      financialsRecord.offering &&
      typeof financialsRecord.offering === "object" &&
      !Array.isArray(financialsRecord.offering)
        ? (financialsRecord.offering as Record<string, unknown>)
        : null;
    financials = [
      appraisalValue !== null
        ? { label: "Appraisal Value", val: formatCurrencyShort(appraisalValue) }
        : null,
      annualIncome !== null
        ? { label: "Annual Income", val: formatCurrencyShort(annualIncome) }
        : null,
      tokenPrice !== null
        ? { label: "Token Price", val: formatCurrencyShort(tokenPrice) }
        : null,
      totalSupply !== null
        ? { label: "Total Supply", val: formatWholeNumber(totalSupply) }
        : null,
      offering
        ? {
            label: "Lockup Period",
            val: pickString(offering, ["lockupPeriod", "lockup_period"]) ?? "—",
          }
        : null,
      pickString(root, ["regulationLabel"])
        ? { label: "Regulation", val: pickString(root, ["regulationLabel"]) ?? "—" }
        : null,
      pickString(root, ["jurisdiction"])
        ? { label: "Jurisdiction", val: pickString(root, ["jurisdiction"]) ?? "—" }
        : null,
      currency ? { label: "Currency", val: currency } : null,
    ].filter((x): x is { label: string; val: string } => Boolean(x));
  } else {
    // Real API fallback: parsing directly from the root level and metadata fields
    const metadata =
      root.metadata && typeof root.metadata === "object"
        ? (root.metadata as Record<string, unknown>)
        : null;
    const metaAsset =
      metadata?.asset && typeof metadata.asset === "object"
        ? (metadata.asset as Record<string, unknown>)
        : null;
    const metaOffering =
      metadata?.offering && typeof metadata.offering === "object"
        ? (metadata.offering as Record<string, unknown>)
        : null;
    const metaAccreditation =
      metadata?.accreditation && typeof metadata.accreditation === "object"
        ? (metadata.accreditation as Record<string, unknown>)
        : null;

    const appraisalValue = pickNumber(root, ["appraisalValue"]) ?? (metaAsset ? pickNumber(metaAsset, ["appraisalValue"]) : null);
    const annualIncome = pickNumber(root, ["annualIncome"]) ?? (metaAsset ? pickNumber(metaAsset, ["annualIncome"]) : null);
    const tokenPrice = pickNumber(root, ["tokenPrice"]);
    const totalSupply = pickNumber(root, ["totalSupply"]);
    const currency = pickString(root, ["currency"]) ?? "USD";

    // Lockup extraction from detailed root.offering object or metaOffering
    const lockupPeriod =
      (root.offering && typeof root.offering === "object"
        ? pickString(root.offering as Record<string, unknown>, ["lockupPeriod", "lockup_period"])
        : null) ??
      (metaOffering ? pickString(metaOffering, ["lockupPeriod", "lockup_period"]) : null);

    // Regulation extraction from detailed root.offering object, regulationLabel, or metaAccreditation exemptions
    const regulation =
      pickString(root, ["regulationLabel", "regulationType", "regulation"]) ??
      (root.offering && typeof root.offering === "object"
        ? pickString(root.offering as Record<string, unknown>, ["regulationType", "regulation"])
        : null) ??
      (metaAccreditation
        ? pickString(metaAccreditation, ["offeringRegulation"]) ?? pickStringArray(metaAccreditation, ["exemptions"])[0]
        : null);

    // Jurisdiction extraction from detailed metadata accreditation, legal, or root level
    const jurisdiction =
      pickString(root, ["jurisdiction"]) ??
      (metaAccreditation ? pickString(metaAccreditation, ["jurisdiction"]) : null) ??
      (root.legal && typeof root.legal === "object"
        ? pickString(root.legal as Record<string, unknown>, ["jurisdiction"])
        : null);

    financials = [
      appraisalValue !== null
        ? { label: "Appraisal Value", val: formatCurrencyShort(appraisalValue) }
        : null,
      annualIncome !== null
        ? { label: "Annual Income", val: formatCurrencyShort(annualIncome) }
        : null,
      tokenPrice !== null
        ? { label: "Token Price", val: formatCurrencyShort(tokenPrice) }
        : null,
      totalSupply !== null
        ? { label: "Total Supply", val: formatWholeNumber(totalSupply) }
        : null,
      lockupPeriod
        ? {
            label: "Lockup Period",
            val: lockupPeriod,
          }
        : null,
      regulation
        ? { label: "Regulation", val: regulation }
        : null,
      jurisdiction
        ? { label: "Jurisdiction", val: jurisdiction }
        : null,
      currency ? { label: "Currency", val: currency } : null,
    ].filter((x): x is { label: string; val: string } => Boolean(x));
  }

  return {
    ...base,
    verified: Boolean(
      root.verified ??
        root.isVerified,
    ),
    highlights,
    financials,
    offering: parseAssetOffering(root.offering ?? root.overview ?? financialsRecord?.offering ?? root),
    tokenization: parseAssetTokenization(
      root.tokenization ?? financialsRecord?.tokenization ?? root.financials ?? root,
    ),
  };
}

export function parseAssetOffering(payload: unknown): AssetOffering | null {
  const record = unwrapPayload(payload);
  if (!record || typeof record !== "object") return null;
  const o = record as Record<string, unknown>;
  const raised = pickNumber(o, [
    "raised",
    "raisedAmount",
    "raised_amount",
    "amountRaised",
  ]);
  const target = pickNumber(o, [
    "target",
    "targetRaise",
    "target_raise",
    "targetRaiseAmount",
  ]);
  const apyNum = pickNumber(o, [
    "apy",
    "apyPercent",
    "annualYield",
    "annualYieldPercent",
    "yield",
  ]);
  return {
    minInvestment:
      pickString(o, ["minInvestment", "min_investment"]) ??
      (pickNumber(o, [
        "minInvestment",
        "min_investment",
        "minimumInvestment",
      ]) !== null
        ? formatCurrencyShort(
            pickNumber(o, ["minInvestment", "min_investment", "minimumInvestment"]),
          )
        : null),
    targetRaise: target,
    raisedAmount: raised,
    progressPct:
      pickNumber(o, [
        "progress",
        "progressPct",
        "fundingProgressPercent",
        "fundraisingProgressPercent",
      ]) ?? calcPct(raised, target),
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
    totalSupply:
      pickString(o, ["totalSupply", "total_supply", "supply"]) ??
      formatWholeNumber(pickNumber(o, ["totalSupply", "total_supply", "supply"])),
    circulatingSupply: pickString(o, [
      "circulatingSupply",
      "circulating_supply",
    ]),
    ticker: pickString(o, ["ticker", "symbol", "tokenSymbol"]),
    network: pickString(o, ["network", "blockchain", "blockchainNetwork"]),
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
