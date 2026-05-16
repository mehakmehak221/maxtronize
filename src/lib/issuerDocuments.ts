import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";

export type IssuerDocumentStatusType = "signed" | "pending" | "draft" | "expired";

export type IssuerDocumentCategoryLabel =
  | "LEGAL"
  | "COMPLIANCE"
  | "ASSET DOCS"
  | "REPORTS";

export type IssuerDocument = {
  id: string;
  name: string;
  category: string;
  categoryLabel: IssuerDocumentCategoryLabel;
  assetName: string;
  status: string;
  statusType: IssuerDocumentStatusType;
  date: string;
  size: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type IssuerDocumentsListResult = {
  items: IssuerDocument[];
  pagination: PaginationMeta;
};

export type ListIssuerDocumentsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  assetId?: string;
};

export type UploadIssuerDocumentRequest = {
  file: File;
  title: string;
  category: string;
  assetId?: string;
  documentDate?: string;
  expiresAt?: string;
  signaturesRequired?: number;
};

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDocumentDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeCategoryLabel(
  raw: string | null,
): IssuerDocumentCategoryLabel {
  const normalized = (raw ?? "").toUpperCase().replace(/_/g, " ");
  if (normalized.includes("LEGAL")) return "LEGAL";
  if (normalized.includes("COMPLIANCE")) return "COMPLIANCE";
  if (normalized.includes("REPORT")) return "REPORTS";
  if (normalized.includes("ASSET")) return "ASSET DOCS";
  return "LEGAL";
}

function normalizeStatusType(raw: string | null): IssuerDocumentStatusType {
  const normalized = (raw ?? "").toLowerCase();
  if (
    normalized.includes("sign") &&
    !normalized.includes("pending") &&
    !normalized.includes("await")
  ) {
    return "signed";
  }
  if (
    normalized.includes("pending") ||
    normalized.includes("await") ||
    normalized.includes("partial")
  ) {
    return "pending";
  }
  if (normalized.includes("expir")) return "expired";
  if (normalized.includes("draft")) return "draft";
  return "draft";
}

function formatStatusLabel(
  raw: string | null,
  statusType: IssuerDocumentStatusType,
): string {
  if (raw?.trim()) return raw.trim();
  switch (statusType) {
    case "signed":
      return "Signed";
    case "pending":
      return "Awaiting Signature";
    case "expired":
      return "Expired";
    default:
      return "Draft";
  }
}

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

function parseDocumentItem(record: Record<string, unknown>): IssuerDocument {
  const id =
    pickString(record, ["id", "_id", "documentId", "document_id"]) ?? "";
  const name =
    pickString(record, [
      "name",
      "title",
      "fileName",
      "file_name",
      "documentName",
      "document_name",
    ]) ?? "Untitled document";

  const categoryRaw = pickString(record, ["category", "type", "documentType"]);
  const categoryLabel = normalizeCategoryLabel(categoryRaw);
  const statusRaw = pickString(record, ["status", "signatureStatus", "state"]);
  const statusType = normalizeStatusType(statusRaw);

  const assetRecord =
    record.asset && typeof record.asset === "object"
      ? (record.asset as Record<string, unknown>)
      : null;
  const assetName =
    pickString(record, ["assetName", "asset_name", "assetTitle"]) ??
    (assetRecord
      ? pickString(assetRecord, ["name", "title", "assetName"])
      : null) ??
    "—";

  const sizeBytes = pickNumber(record, [
    "sizeBytes",
    "size_bytes",
    "fileSize",
    "file_size",
  ]);
  const size =
    pickString(record, ["size", "fileSizeLabel", "file_size_label"]) ??
    formatFileSize(sizeBytes);

  const date = formatDocumentDate(
    pickString(record, [
      "date",
      "createdAt",
      "created_at",
      "updatedAt",
      "updated_at",
      "uploadedAt",
    ]),
  );

  return {
    id: id || name,
    name,
    category: categoryRaw ?? categoryLabel,
    categoryLabel,
    assetName,
    status: formatStatusLabel(statusRaw, statusType),
    statusType,
    date,
    size,
  };
}

export function parseIssuerDocumentsList(
  payload: unknown,
): IssuerDocumentsListResult {
  const items = unwrapList(payload).map(parseDocumentItem);
  return {
    items,
    pagination: parsePagination(payload),
  };
}

export function parseIssuerDocument(payload: unknown): IssuerDocument | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return parseDocumentItem(root.data as Record<string, unknown>);
  }
  if (root.document && typeof root.document === "object") {
    return parseDocumentItem(root.document as Record<string, unknown>);
  }
  return parseDocumentItem(root);
}

export type DocumentCategoryTab = {
  key: string;
  label: string;
  count: number;
};

export function parseDocumentCategories(payload: unknown): DocumentCategoryTab[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const tabs = root.tabs;
  if (!Array.isArray(tabs)) return [];

  return tabs
    .filter((tab): tab is Record<string, unknown> => Boolean(tab) && typeof tab === "object")
    .map((tab) => ({
      key: pickString(tab, ["key", "id", "value"]) ?? "ALL",
      label: pickString(tab, ["label", "name"]) ?? "All Documents",
      count: pickNumber(tab, ["count", "total"]) ?? 0,
    }));
}

export type IssuerDocumentsSummary = {
  totalDocuments: { count: number; summary: string };
  fullySigned: { count: number; completionRate: number };
  pendingSignature: { count: number; summary: string };
  complianceScore: {
    percent: number;
    itemsNeedingAttention: number;
    summary: string;
  };
};

function parseSummaryBlock(
  record: Record<string, unknown> | null,
  countKeys: string[],
  summaryKeys: string[],
): { count: number; summary: string } {
  if (!record) return { count: 0, summary: "" };
  return {
    count: pickNumber(record, countKeys) ?? 0,
    summary: pickString(record, summaryKeys) ?? "",
  };
}

export function parseIssuerDocumentsSummary(
  payload: unknown,
): IssuerDocumentsSummary {
  if (!payload || typeof payload !== "object") {
    return {
      totalDocuments: { count: 0, summary: "" },
      fullySigned: { count: 0, completionRate: 0 },
      pendingSignature: { count: 0, summary: "" },
      complianceScore: { percent: 0, itemsNeedingAttention: 0, summary: "" },
    };
  }

  const root = payload as Record<string, unknown>;
  const totalDocuments = parseSummaryBlock(
    (root.totalDocuments as Record<string, unknown>) ?? null,
    ["count"],
    ["summary"],
  );
  const fullySignedRecord =
    (root.fullySigned as Record<string, unknown>) ?? null;
  const pendingSignature = parseSummaryBlock(
    (root.pendingSignature as Record<string, unknown>) ?? null,
    ["count"],
    ["summary"],
  );
  const complianceRecord =
    (root.complianceScore as Record<string, unknown>) ?? null;

  return {
    totalDocuments,
    fullySigned: {
      count: pickNumber(fullySignedRecord, ["count"]) ?? 0,
      completionRate:
        pickNumber(fullySignedRecord, ["completionRate", "completion_rate"]) ?? 0,
    },
    pendingSignature,
    complianceScore: {
      percent:
        pickNumber(complianceRecord, ["percent", "percentage", "score"]) ?? 0,
      itemsNeedingAttention:
        pickNumber(complianceRecord, [
          "itemsNeedingAttention",
          "items_needing_attention",
        ]) ?? 0,
      summary: pickString(complianceRecord, ["summary"]) ?? "",
    },
  };
}

/** Maps categories API tab key to list API `category` query param. */
export function categoryQueryFromKey(key: string): string | undefined {
  if (!key || key.toUpperCase() === "ALL") return undefined;
  return key;
}
