import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";

export type InvestmentHubDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  url: string | null;
};

export type InvestmentHubDocumentsResult = {
  items: InvestmentHubDocument[];
  total: number;
};

export type InvestmentHubDocumentFile = {
  name: string;
  url: string;
};

export type InvestmentHubDocumentsDownloadAll = {
  files: InvestmentHubDocumentFile[];
  total: number;
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

function parseDocument(record: Record<string, unknown>, index: number): InvestmentHubDocument {
  const id =
    pickString(record, ["id", "_id", "documentId", "document_id"]) ??
    `doc-${index}`;
  const name =
    pickString(record, ["name", "title", "fileName", "file_name"]) ??
    "Untitled document";
  const type =
    pickString(record, ["type", "category", "documentType", "document_type"]) ??
    "Document";

  const sizeBytes = pickNumber(record, [
    "sizeBytes",
    "size_bytes",
    "fileSize",
    "file_size",
  ]);

  return {
    id,
    name,
    type,
    size:
      pickString(record, ["size", "fileSizeLabel", "file_size_label"]) ??
      formatFileSize(sizeBytes),
    date: formatDocumentDate(
      pickString(record, ["date", "createdAt", "created_at", "uploadedAt"]),
    ),
    url:
      pickString(record, ["url", "downloadUrl", "download_url", "fileUrl"]) ??
      null,
  };
}

function parseDownloadFile(
  record: Record<string, unknown>,
  index: number,
): InvestmentHubDocumentFile | null {
  const url = pickString(record, ["url", "downloadUrl", "download_url", "fileUrl"]);
  if (!url) return null;
  return {
    url,
    name:
      pickString(record, ["name", "fileName", "file_name", "title"]) ??
      `document-${index + 1}`,
  };
}

export function parseInvestmentHubDocuments(
  payload: unknown,
): InvestmentHubDocumentsResult {
  if (!payload || typeof payload !== "object") {
    return { items: [], total: 0 };
  }
  const root = payload as Record<string, unknown>;
  const items = unwrapList(payload).map(parseDocument);
  const total =
    pickNumber(root, ["total", "count"]) ?? items.length;

  return { items, total };
}

export function parseInvestmentHubDocumentsDownloadAll(
  payload: unknown,
): InvestmentHubDocumentsDownloadAll {
  if (!payload || typeof payload !== "object") {
    return { files: [], total: 0 };
  }
  const root = payload as Record<string, unknown>;
  const filesRaw = root.files;
  const files = Array.isArray(filesRaw)
    ? filesRaw
        .filter((f): f is Record<string, unknown> => Boolean(f) && typeof f === "object")
        .map(parseDownloadFile)
        .filter((f): f is InvestmentHubDocumentFile => f !== null)
    : [];

  return {
    files,
    total: pickNumber(root, ["total", "count"]) ?? files.length,
  };
}
