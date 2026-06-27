import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";

export type IssuerDocumentCategoryLabel =
  | "LEGAL"
  | "COMPLIANCE"
  | "ASSET DOCS"
  | "REPORTS";

export type IssuerDocumentStatusType =
  | "draft"
  | "pending"
  | "signed"
  | "expired";

export type IssuerDocument = {
  id: string;
  documentCode: string;
  title: string;
  category: string;
  categoryLabel: IssuerDocumentCategoryLabel;
  assetId: string | null;
  assetTitle: string;
  status: string;
  statusLabel: string;
  statusType: IssuerDocumentStatusType;
  signatureProgress: {
    completed: number;
    required: number;
    label: string;
  };
  documentDate: string | null;
  expiresAt: string | null;
  size: number;
  sizeLabel: string;
  fileName: string;
  mimeType: string;
  signedUrl: string;
  createdAt: string | null;
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** POST /documents/upload requires assetId to be a UUID when provided. */
export function isDocumentAssetUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

/** Omit assetId unless it is a valid UUID (avoids 400 from API). */
export function sanitizeDocumentAssetId(
  value: string | undefined | null,
): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  return isDocumentAssetUuid(trimmed) ? trimmed : undefined;
}

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

function extractDateString(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "string") return raw || null;
  if (typeof raw === "number") return new Date(raw).toISOString();
  if (raw instanceof Date) return raw.toISOString();
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    // Try common API key names for date string values
    for (const key of ["date", "value", "timestamp", "iso", "dateString", "date_string"]) {
      if (typeof obj[key] === "string" && obj[key]) return obj[key] as string;
    }
  }
  return null;
}

function parseDocumentItem(record: Record<string, unknown>): IssuerDocument {
  const id =
    pickString(record, ["id", "_id", "documentId", "document_id"]) ?? "";
  const documentCode =
    pickString(record, ["documentCode", "document_code"]) ?? "";
  const title =
    pickString(record, ["title", "name", "fileName", "file_name"]) ??
    "Untitled document";

  const categoryRaw = pickString(record, ["category", "type", "documentType"]);
  const categoryLabel = (pickString(record, [
    "categoryLabel",
    "category_label",
  ]) ?? normalizeCategoryLabel(categoryRaw)) as IssuerDocumentCategoryLabel;
  const statusRaw = pickString(record, ["status", "signatureStatus", "state"]);
  const statusLabel =
    pickString(record, ["statusLabel", "status_label"]) ?? statusRaw ?? "—";
  const statusType = normalizeStatusType(statusLabel);

  const assetId = pickString(record, ["assetId", "asset_id"]) ?? null;
  const assetTitle =
    pickString(record, [
      "assetTitle",
      "asset_title",
      "assetName",
      "asset_name",
    ]) ?? "—";

  const signatureProgressRaw =
    record.signatureProgress ?? record.signature_progress;
  const signatureProgress =
    signatureProgressRaw &&
    typeof signatureProgressRaw === "object" &&
    !Array.isArray(signatureProgressRaw)
      ? {
          completed:
            pickNumber(signatureProgressRaw as Record<string, unknown>, [
              "completed",
            ]) ?? 0,
          required:
            pickNumber(signatureProgressRaw as Record<string, unknown>, [
              "required",
            ]) ?? 0,
          label:
            pickString(signatureProgressRaw as Record<string, unknown>, [
              "label",
            ]) ?? "0/0",
        }
      : { completed: 0, required: 0, label: "0/0" };

  const documentDate = extractDateString(
    record.documentDate ?? record.document_date,
  );

  const expiresAt = extractDateString(
    record.expiresAt ?? record.expires_at,
  );

  const size = pickNumber(record, ["size", "fileSize", "file_size"]) ?? 0;
  const sizeLabel =
    pickString(record, ["sizeLabel", "size_label"]) ?? formatFileSize(size);

  const fileName = pickString(record, ["fileName", "file_name"]) ?? "";
  const mimeType = pickString(record, ["mimeType", "mime_type", "type"]) ?? "";
  const signedUrl =
    pickString(record, ["signedUrl", "signed_url", "url"]) ?? "";

  const createdAt = extractDateString(
    record.createdAt ?? record.created_at,
  );

  return {
    id: id || title,
    documentCode,
    title,
    category: categoryRaw ?? categoryLabel,
    categoryLabel,
    assetId,
    assetTitle,
    status: statusRaw ?? "—",
    statusLabel,
    statusType,
    signatureProgress,
    documentDate,
    expiresAt,
    size,
    sizeLabel,
    fileName,
    mimeType,
    signedUrl,
    createdAt,
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

export function parseDocumentCategories(
  payload: unknown,
): DocumentCategoryTab[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const tabs = root.tabs;
  if (!Array.isArray(tabs)) return [];

  return tabs
    .filter(
      (tab): tab is Record<string, unknown> =>
        Boolean(tab) && typeof tab === "object",
    )
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
        pickNumber(fullySignedRecord, ["completionRate", "completion_rate"]) ??
        0,
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
