"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, X } from "lucide-react";
import { formatRequestError } from "@/lib/formatRequestError";
import type { IssuerDocument } from "@/lib/issuerDocuments";
import { useGetIssuerDocumentQuery } from "@/store/api/issuerDocumentsApi";

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
      <p className="text-[13px] font-medium text-ui-strong">{value}</p>
    </div>
  );
}

export function DocumentDetailPanel({
  documentId,
  onClose,
  CategoryBadge,
  StatusBadge,
}: DocumentDetailPanelProps) {
  const [mounted, setMounted] = useState(false);
  const { data: doc, isLoading, error } = useGetIssuerDocumentQuery(
    documentId ?? "",
    { skip: !documentId },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!documentId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [documentId]);

  if (!documentId || !mounted) return null;

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
        className="relative flex max-h-[min(85dvh,560px)] w-full max-w-lg min-h-0 flex-col overflow-hidden rounded-t-2xl border border-ui-border bg-ui-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
                {isLoading ? "Loading…" : (doc?.name ?? "Document")}
              </h2>
              {doc?.id ? (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-ui-faint">
                  DOC · {doc.id}
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          {error ? (
            <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formatRequestError(error)}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-ui-muted-text">Loading document…</p>
          ) : doc ? (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge catLabel={doc.categoryLabel} />
                <StatusBadge status={doc.status} statusType={doc.statusType} />
              </div>
              <DetailRow label="Asset" value={doc.assetName} />
              <DetailRow label="Date" value={doc.date} />
              <DetailRow label="Size" value={doc.size} />
              <DetailRow label="Category" value={doc.category} />
            </div>
          ) : (
            <p className="text-sm text-ui-muted-text">Document not found.</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
