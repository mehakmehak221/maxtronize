import { pickNumber, pickString, unwrapList } from "@/lib/apiParse";
import { downloadBlob } from "@/lib/issuerHubDownload";

export type InvestmentHubDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  date: string;
  url: string | null;
  downloadable: boolean;
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
    pickString(record, [
      "documentTypeLabel",
      "document_type_label",
      "type",
      "category",
      "documentType",
      "document_type",
    ]) ??
    "Document";

  const sizeBytes =
    pickNumber(record, [
      "sizeBytes",
      "size_bytes",
      "fileSize",
      "file_size",
      "size",
    ]) ?? 0;

  const downloadable = record.downloadable === true;

  return {
    id,
    name,
    type,
    size:
      pickString(record, [
        "sizeLabel",
        "size_label",
        "fileSizeLabel",
        "file_size_label",
      ]) ??
      formatFileSize(sizeBytes),
    sizeBytes,
    date: formatDocumentDate(
      pickString(record, [
        "issuedAt",
        "issued_at",
        "date",
        "createdAt",
        "created_at",
        "uploadedAt",
      ]),
    ),
    url: pickDownloadUrl(record),
    downloadable,
  };
}

function pickDownloadUrl(record: Record<string, unknown>): string | null {
  return pickString(record, [
    "signedUrl",
    "signed_url",
    "url",
    "downloadUrl",
    "download_url",
    "fileUrl",
    "file_url",
  ]);
}

function parseDownloadFile(
  record: Record<string, unknown>,
  index: number,
): InvestmentHubDocumentFile | null {
  const url = pickDownloadUrl(record);
  if (!url) return null;
  return {
    url,
    name:
      pickString(record, ["title", "name", "fileName", "file_name"]) ??
      `document-${index + 1}`,
  };
}

/** Fetch a signed file through the Next.js download proxy (avoids CORS issues). */
export async function downloadInvestmentDocumentViaProxy(
  url: string,
  filename: string,
): Promise<void> {
  const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }
  const blob = await response.blob();
  downloadBlob(blob, filename);
}

export function parseInvestmentDocumentDownloadUrl(
  payload: unknown,
): string | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;
  return pickDownloadUrl(data);
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

export function buildInvestmentDocumentDownloadAllPath(
  documentId?: string,
): string {
  if (!documentId?.trim()) {
    return "/investor/hub/investment-documents/download-all";
  }
  const params = new URLSearchParams({ documentId: documentId.trim() });
  return `/investor/hub/investment-documents/download-all?${params.toString()}`;
}

export function investmentDocumentDownloadAllPaths(
  documentId: string,
): string[] {
  const id = documentId.trim();
  return [
    buildInvestmentDocumentDownloadAllPath(id),
    `/investor/hub/investment-documents/download-all?id=${encodeURIComponent(id)}`,
  ];
}

export async function downloadResolvedInvestmentDocument(
  files: InvestmentHubDocumentFile[],
  fallbackFilename: string,
): Promise<void> {
  const file = files.find((entry) => entry.url);
  if (!file?.url) {
    throw new Error("No download URL available for this document.");
  }
  await downloadInvestmentDocumentViaProxy(file.url, file.name || fallbackFilename);
}

export function parseInvestmentHubDocumentsDownloadAll(
  payload: unknown,
): InvestmentHubDocumentsDownloadAll {
  if (!payload || typeof payload !== "object") {
    return { files: [], total: 0 };
  }
  const root = payload as Record<string, unknown>;

  const fromRecords = (records: Record<string, unknown>[]) =>
    records
      .map(parseDownloadFile)
      .filter((f): f is InvestmentHubDocumentFile => f !== null);

  let files: InvestmentHubDocumentFile[] = [];

  if (Array.isArray(root.files)) {
    files = fromRecords(
      root.files.filter(
        (f): f is Record<string, unknown> => Boolean(f) && typeof f === "object",
      ),
    );
  }

  if (files.length === 0 && Array.isArray(root.items)) {
    files = fromRecords(
      root.items.filter(
        (f): f is Record<string, unknown> => Boolean(f) && typeof f === "object",
      ),
    );
  }

  if (files.length === 0) {
    files = fromRecords(unwrapList(payload));
  }

  return {
    files,
    total: pickNumber(root, ["total", "count"]) ?? files.length,
  };
}

