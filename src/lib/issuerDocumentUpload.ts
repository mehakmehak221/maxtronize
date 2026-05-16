/** Matches POST /documents/upload backend file filter. */
export const ISSUER_DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const ISSUER_DOCUMENT_ALLOWED_LABEL = "PDF, DOC, DOCX, XLS, XLSX";

const EXTENSIONS = new Set(["pdf", "doc", "docx", "xls", "xlsx"]);

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const ALLOWED_MIMES = new Set(Object.values(MIME_BY_EXTENSION));

function fileExtension(name: string): string | null {
  const parts = name.split(".");
  if (parts.length < 2) return null;
  return parts.pop()?.toLowerCase() ?? null;
}

export function validateIssuerDocumentFile(file: File): string | null {
  const ext = fileExtension(file.name);
  if (!ext || !EXTENSIONS.has(ext)) {
    return `Invalid file type. Allowed: ${ISSUER_DOCUMENT_ALLOWED_LABEL}`;
  }

  if (file.type && !ALLOWED_MIMES.has(file.type)) {
    const zipOffice =
      file.type === "application/zip" &&
      (ext === "docx" || ext === "xlsx");
    const octetStream =
      file.type === "application/octet-stream" && EXTENSIONS.has(ext);
    if (!zipOffice && !octetStream) {
      return `Invalid file type. Allowed: ${ISSUER_DOCUMENT_ALLOWED_LABEL}`;
    }
  }

  return null;
}

/** Re-wrap file with the MIME the API expects when the browser reports a generic type. */
export function normalizeIssuerDocumentFile(file: File): File {
  const ext = fileExtension(file.name);
  if (!ext) return file;

  const expectedMime = MIME_BY_EXTENSION[ext];
  if (!expectedMime) return file;

  const needsFix =
    !file.type ||
    file.type === "application/octet-stream" ||
    file.type === "application/zip" ||
    !ALLOWED_MIMES.has(file.type);

  if (!needsFix) return file;

  return new File([file], file.name, {
    type: expectedMime,
    lastModified: file.lastModified,
  });
}
