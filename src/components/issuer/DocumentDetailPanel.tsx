"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, FileText, Trash2, X } from "lucide-react";
import { formatRequestError } from "@/lib/formatRequestError";
import type { IssuerDocument } from "@/lib/issuerDocuments";
import {
  useGetIssuerDocumentQuery,
  useDeleteIssuerDocumentMutation,
} from "@/store/api/issuerDocumentsApi";
import { useIsClient } from "@/hooks/useIsClient";

const iconStroke = 1.75;

type DocumentDetailPanelProps = {
  documentId: string | null;
  onClose: () => void;
  CategoryBadge: React.ComponentType<{
    catLabel: IssuerDocument["categoryLabel"];
  }>;
  StatusBadge: React.ComponentType<{
    status: string;
    statusType: IssuerDocument["statusType"];
  }>;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
        {label}
      </p>
      <p className="text-base font-medium text-ui-strong">{value}</p>
    </div>
  );
}

export function DocumentDetailPanel({
  documentId,
  onClose,
  CategoryBadge,
  StatusBadge,
}: DocumentDetailPanelProps) {
  const isClient = useIsClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: doc,
    isLoading,
    error,
  } = useGetIssuerDocumentQuery(documentId ?? "", { skip: !documentId });

  const [deleteDoc, { isLoading: isDeleting }] =
    useDeleteIssuerDocumentMutation();

  // Reset confirm state when a new document is opened
  useEffect(() => {
    setConfirmDelete(false);
    setDeleteError(null);
  }, [documentId]);

  useEffect(() => {
    if (!documentId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [documentId]);

  if (!documentId || !isClient) return null;

  async function handleDelete() {
    if (!documentId) return;
    try {
      await deleteDoc(documentId).unwrap();
      onClose();
    } catch (err: unknown) {
      setDeleteError(
        err && typeof err === "object" && "data" in err
          ? String((err as { data: unknown }).data)
          : "Failed to delete document.",
      );
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4 md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-detail-title"
        className="relative flex max-h-[min(85dvh,600px)] w-full max-w-lg min-h-0 flex-col overflow-hidden rounded-t-2xl border border-ui-border bg-ui-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-ui-divider px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-muted-text">
              <FileText className="h-5 w-5" strokeWidth={iconStroke} />
            </div>
            <div className="min-w-0">
              <h2
                id="document-detail-title"
                className="text-lg font-bold text-ui-strong"
              >
                {isLoading ? "Loading…" : (doc?.title ?? "Document")}
              </h2>
              {doc?.id ? (
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-ui-faint">
                  DOC · {doc.documentCode || doc.id}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ui-muted-text transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={iconStroke} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          {error ? (
            <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-base text-red-700">
              {formatRequestError(error)}
            </p>
          ) : null}

          {deleteError ? (
            <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-base text-ui-muted-text">Loading document…</p>
          ) : doc ? (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge catLabel={doc.categoryLabel} />
                <StatusBadge status={doc.status} statusType={doc.statusType} />
              </div>
              <DetailRow label="Asset" value={doc.assetTitle} />
              <DetailRow label="File" value={doc.fileName || "—"} />
              <DetailRow label="Size" value={doc.sizeLabel} />
              <DetailRow label="Category" value={doc.category} />
              {doc.documentDate ? (
                <DetailRow label="Document Date" value={doc.documentDate} />
              ) : null}
              {doc.expiresAt ? (
                <DetailRow label="Expires" value={doc.expiresAt} />
              ) : null}
              {doc.signatureProgress.required > 0 ? (
                <DetailRow
                  label="Signatures"
                  value={doc.signatureProgress.label}
                />
              ) : null}
            </div>
          ) : (
            <p className="text-base text-ui-muted-text">Document not found.</p>
          )}
        </div>

        {/* Footer actions */}
        {doc && !isLoading ? (
          <div className="shrink-0 border-t border-ui-divider px-4 py-3 sm:px-6 sm:py-4">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <p className="flex-1 text-sm font-medium text-rose-600">
                  Delete this document permanently?
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                  className="rounded-xl border border-ui-border px-4 py-2 text-sm font-bold text-ui-body transition-colors hover:bg-ui-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {doc.signedUrl ? (
                  <a
                    href={doc.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#9810FA] px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_-4px_rgba(152,16,250,0.45)] transition-all hover:bg-[#7C3AED]"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={iconStroke} />
                    View Document
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={iconStroke} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
