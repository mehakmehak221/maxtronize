"use client";

import { useMemo, useRef, useState } from "react";
import type { OnboardingDocumentType } from "@/lib/onboarding";
import { useOnboarding } from "@/components/onboarding/OnboardingContext";

type OnboardingDocumentUploadProps = {
  label: string;
  sub?: string;
  documentType: OnboardingDocumentType | string;
  metadata?: Record<string, unknown>;
};

export function OnboardingDocumentUpload({
  label,
  sub = "Upload PDF",
  documentType,
  metadata,
}: OnboardingDocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    documents,
    uploadOnboardingFile,
    deleteOnboardingDocument,
    isSaving,
    saveError,
  } = useOnboarding();
  const [status, setStatus] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const existing = useMemo(
    () => documents.find((doc) => doc.type === documentType),
    [documentType, documents],
  );

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setStatus(null);
    const result = await uploadOnboardingFile(file, documentType, metadata);
    if (result) {
      setStatus(`${file.name} uploaded`);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete() {
    if (!existing) return;
    setIsDeleting(true);
    setStatus(null);
    const ok = await deleteOnboardingDocument(existing.id);
    if (ok) {
      setStatus("Removed");
    }
    setIsDeleting(false);
  }

  const busy = isSaving || isDeleting;

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-ui-faint uppercase tracking-widest">
        {label}
      </label>

      {existing ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-emerald-800 truncate">{existing.name}</p>
            <p className="text-[10px] text-emerald-700/80">{existing.date}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {existing.url ? (
              <a
                href={existing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-primary hover:underline"
              >
                View
              </a>
            ) : null}
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleDelete()}
              className="text-[10px] font-bold text-rose-600 hover:underline disabled:opacity-60"
            >
              {isDeleting ? "Removing…" : "Remove"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="text-[10px] font-bold text-ui-muted-text hover:underline disabled:opacity-60"
            >
              Replace
            </button>
          </div>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {!existing ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="w-full p-6 border-2 border-dashed border-ui-border rounded-3xl bg-ui-muted-surface flex flex-col items-center justify-center gap-2 hover:bg-ui-muted-deep hover:border-ui-border-strong transition-all disabled:opacity-60"
        >
          <p className="text-[10px] font-bold text-ui-faint uppercase tracking-wide">{sub}</p>
          <p className="text-[11px] font-bold text-primary">
            {isSaving ? "Uploading…" : "Click to upload PDF / JPG"}
          </p>
        </button>
      ) : null}

      {status ? <p className="text-[10px] font-medium text-emerald-600">{status}</p> : null}
      {saveError ? (
        <p className="text-[10px] font-medium text-rose-600">{saveError}</p>
      ) : null}
    </div>
  );
}
