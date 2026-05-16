"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Upload, X } from "lucide-react";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  ISSUER_DOCUMENT_ACCEPT,
  ISSUER_DOCUMENT_ALLOWED_LABEL,
  normalizeIssuerDocumentFile,
  validateIssuerDocumentFile,
} from "@/lib/issuerDocumentUpload";
import type { DocumentCategoryTab } from "@/lib/issuerDocuments";
import { useUploadIssuerDocumentMutation } from "@/store/api/issuerDocumentsApi";

const iconStroke = 1.75;

const inputClass =
  "w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3.5 text-sm text-[#1F2937] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#C084FC] focus:bg-white focus:ring-2 focus:ring-[#8B5CF6]/20";

const labelClass =
  "text-[10px] font-bold uppercase tracking-[0.1em] text-[#4B5563]";

type IssuerDocumentUploadModalProps = {
  open: boolean;
  onClose: () => void;
  categoryOptions: DocumentCategoryTab[];
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className={labelClass}>
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

export function IssuerDocumentUploadModal({
  open,
  onClose,
  categoryOptions,
}: IssuerDocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("LEGAL");
  const [assetId, setAssetId] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [signaturesRequired, setSignaturesRequired] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [upload, { isLoading }] = useUploadIssuerDocumentMutation();

  const uploadCategories = categoryOptions.filter((tab) => tab.key !== "ALL");

  const resolvedCategory =
    uploadCategories.length > 0 &&
    !uploadCategories.some((c) => c.key === category)
      ? (uploadCategories[0]?.key ?? "LEGAL")
      : category;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function resetForm() {
    setFile(null);
    setTitle("");
    setCategory(uploadCategories[0]?.key ?? "LEGAL");
    setAssetId("");
    setDocumentDate("");
    setExpiresAt("");
    setSignaturesRequired("0");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    resetForm();
    setFormError(null);
    setSuccess(null);
    onClose();
  }

  function handleFileChosen(chosen: File | null) {
    if (!chosen) {
      setFile(null);
      return;
    }

    const validationError = validateIssuerDocumentFile(chosen);
    if (validationError) {
      setFormError(validationError);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFormError(null);
    setFile(normalizeIssuerDocumentFile(chosen));
    if (!title.trim()) {
      setTitle(chosen.name.replace(/\.[^.]+$/, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    if (!file) {
      setFormError("Please choose a file to upload.");
      return;
    }
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!resolvedCategory) {
      setFormError("Category is required.");
      return;
    }

    const signatures = Number(signaturesRequired);
    if (Number.isNaN(signatures) || signatures < 0) {
      setFormError("Signatures required must be 0 or greater.");
      return;
    }

    try {
      await upload({
        file: normalizeIssuerDocumentFile(file),
        title: title.trim(),
        category: resolvedCategory,
        assetId: assetId.trim() || undefined,
        documentDate: documentDate || undefined,
        expiresAt: expiresAt || undefined,
        signaturesRequired: signatures,
      }).unwrap();

      setSuccess("Document uploaded successfully.");
      resetForm();
      window.setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err) {
      setFormError(formatRequestError(err));
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4 md:p-6"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-document-title"
        className="relative flex h-[min(92dvh,720px)] w-full max-w-xl min-h-0 flex-col overflow-hidden rounded-t-2xl border border-ui-border bg-ui-card shadow-2xl sm:h-auto sm:max-h-[min(85dvh,720px)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — always visible */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-ui-divider px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED] sm:h-11 sm:w-11">
              <Upload className="h-5 w-5" strokeWidth={iconStroke} />
            </div>
            <div className="min-w-0 pr-2">
              <h2
                id="upload-document-title"
                className="text-base font-bold tracking-tight text-ui-strong sm:text-lg"
              >
                Upload document
              </h2>
              <p className="mt-0.5 text-xs text-ui-muted-text sm:text-sm">
                Add a file to your secure document vault.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-xl p-2 text-ui-muted-text transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={iconStroke} />
          </button>
        </div>

        {/* Body — scrolls inside panel */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          {formError ? (
            <p
              className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {formError}
            </p>
          ) : null}
          {success ? (
            <p className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}

          <form
            id="issuer-document-upload-form"
            className="space-y-4 sm:space-y-5"
            onSubmit={(e) => void handleSubmit(e)}
          >
            <div className="space-y-2">
              <FieldLabel required>File</FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={ISSUER_DOCUMENT_ACCEPT}
                onChange={(e) => handleFileChosen(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFileChosen(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`group w-full rounded-2xl border-2 border-dashed p-4 text-left transition-all sm:p-5 ${
                  file
                    ? "border-violet-300 bg-violet-50/40"
                    : "border-ui-border bg-[#F9FAFB] hover:border-violet-300 hover:bg-violet-50/30"
                } disabled:opacity-60`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                      file
                        ? "bg-violet-100 text-[#7C3AED]"
                        : "bg-white text-ui-muted-text shadow-sm"
                    }`}
                  >
                    {file ? (
                      <FileText className="h-5 w-5" strokeWidth={iconStroke} />
                    ) : (
                      <Upload className="h-5 w-5" strokeWidth={iconStroke} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {file ? (
                      <>
                        <p className="truncate text-[13px] font-bold text-ui-strong">
                          {file.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-ui-faint">
                          {formatFileSize(file.size)} · Tap to replace
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[13px] font-bold text-ui-strong">
                          <span className="text-[#7C3AED]">Choose a file</span> or
                          drag & drop
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-ui-faint">
                          {ISSUER_DOCUMENT_ALLOWED_LABEL} · up to 50MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <FieldLabel required>Title</FieldLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g. Limited Partnership Agreement"
              />
            </div>

            <div className="space-y-2">
              <FieldLabel required>Category</FieldLabel>
              <select
                value={resolvedCategory}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputClass} cursor-pointer appearance-none bg-size-[16px] bg-position-[right_1rem_center] bg-no-repeat pr-10`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                }}
              >
                {uploadCategories.length === 0 ? (
                  <option value="LEGAL">Legal</option>
                ) : (
                  uploadCategories.map((tab) => (
                    <option key={tab.key} value={tab.key}>
                      {tab.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="rounded-2xl border border-ui-divider bg-ui-muted/40 p-4 sm:p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ui-faint">
                Optional details
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <FieldLabel>Linked asset</FieldLabel>
                  <input
                    type="text"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    className={inputClass}
                    placeholder="Asset ID (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel>Document date</FieldLabel>
                    <input
                      type="date"
                      value={documentDate}
                      onChange={(e) => setDocumentDate(e.target.value)}
                      max={todayIsoDate()}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Expires on</FieldLabel>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      min={documentDate || undefined}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel>Signatures required</FieldLabel>
                  <input
                    type="number"
                    min={0}
                    value={signaturesRequired}
                    onChange={(e) => setSignaturesRequired(e.target.value)}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer — always visible */}
        <div className="flex shrink-0 flex-col gap-2 border-t border-ui-divider bg-ui-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full rounded-xl border border-ui-border bg-white px-6 py-3 text-sm font-bold text-ui-body transition-colors hover:bg-ui-muted-deep disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="issuer-document-upload-form"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#9810FA] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-[#7C3AED] disabled:opacity-60 sm:w-auto"
          >
            <Upload className="h-4 w-4" strokeWidth={iconStroke} />
            {isLoading ? "Uploading…" : "Upload document"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
