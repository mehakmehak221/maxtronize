"use client";

import { ImageIcon, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { storageUrlFromCoverKey } from "@/lib/onboarding";
import { resolveCoverImagePreviewSrc } from "@/lib/storageUrl";
import { useOnboarding } from "@/components/onboarding/OnboardingContext";

type OnboardingCoverImageUploadProps = {
  /** Selected before onboarding session exists (start page). */
  pendingFile?: File | null;
  onPendingFileChange?: (file: File | null) => void;
  /** Known storage key (from asset draft or after upload). */
  coverImageKey?: string | null;
  /** Direct URL from upload API (preferred for preview). */
  coverImageUrl?: string | null;
  onCoverImageKeyChange?: (key: string | null) => void;
  onCoverImageUrlChange?: (url: string | null) => void;
  disabled?: boolean;
  /** When false, file is only stored locally until parent uploads after start. */
  uploadOnSelect?: boolean;
  assetType?: string;
  assetName?: string;
};

const ACCEPT = ".jpg,.jpeg,.png,.webp";

export function OnboardingCoverImageUpload({
  pendingFile = null,
  onPendingFileChange,
  coverImageKey = null,
  coverImageUrl = null,
  onCoverImageKeyChange,
  onCoverImageUrlChange,
  disabled = false,
  uploadOnSelect = true,
  assetType,
  assetName,
}: OnboardingCoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    onboardingId,
    uploadAndLinkCoverImage,
    isSaving,
    isApprovedOrLocked,
  } = useOnboarding();
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [remotePreview, setRemotePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const locked = disabled || isApprovedOrLocked;
  const openHref = useMemo(
    () => storageUrlFromCoverKey(coverImageKey ?? "", coverImageUrl),
    [coverImageKey, coverImageUrl],
  );

  useEffect(() => {
    if (!pendingFile) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  useEffect(() => {
    if (localPreview || pendingFile) return;
    if (!coverImageKey && !coverImageUrl) {
      setRemotePreview(null);
      return;
    }

    let cancelled = false;
    let blobUrl: string | null = null;

    void resolveCoverImagePreviewSrc({
      coverImageKey,
      coverImageUrl,
    }).then((src) => {
      if (!cancelled) {
        blobUrl = src;
        setRemotePreview(src);
      }
    });

    return () => {
      cancelled = true;
      if (blobUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [coverImageKey, coverImageUrl, localPreview, pendingFile]);

  const previewUrl = localPreview ?? remotePreview;

  async function handleFile(file: File | undefined) {
    if (!file || locked) return;
    setStatus(null);
    setLocalError(null);

    if (!uploadOnSelect || !onboardingId) {
      onPendingFileChange?.(file);
      return;
    }

    const result = await uploadAndLinkCoverImage(file, { assetType, assetName });
    if (!result) {
      setLocalError("Could not upload cover image. Try a JPG or PNG under 10MB.");
      return;
    }
    if ("error" in result && result.error) {
      setLocalError(result.error);
      return;
    }
    if (!("key" in result) || !result.key) {
      setLocalError("Cover uploaded but storage key was missing. Try again.");
      return;
    }
    onPendingFileChange?.(null);
    onCoverImageKeyChange?.(result.key);
    onCoverImageUrlChange?.(result.url ?? null);
    setStatus("Cover image uploaded");
  }

  function clearSelection() {
    if (locked) return;
    onPendingFileChange?.(null);
    onCoverImageKeyChange?.(null);
    onCoverImageUrlChange?.(null);
    setRemotePreview(null);
    setStatus("Removed");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">
          Cover image
        </label>
        <p className="mt-1 text-xs text-ui-faint">
          Upload a JPG or PNG. The file is stored on the server and linked on your asset draft.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPT}
        disabled={locked || isSaving}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-ui-border bg-ui-muted-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Asset cover preview"
            className="h-40 w-full object-cover"
          />
        </div>
      ) : coverImageKey || coverImageUrl ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-ui-border bg-ui-muted-surface text-xs text-ui-faint">
          Loading preview…
        </div>
      ) : (
        <button
          type="button"
          disabled={locked || isSaving}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ui-border bg-ui-muted-surface p-8 transition-colors hover:border-ui-border-strong hover:bg-ui-muted-deep disabled:opacity-60"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <p className="text-[11px] font-bold text-primary">
            {locked
              ? "Onboarding locked"
              : isSaving
                ? "Uploading…"
                : "Click to upload cover image"}
          </p>
          <p className="text-[10px] text-ui-faint">JPG, PNG, or WebP</p>
        </button>
      )}

      {coverImageKey ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="flex items-start gap-2">
            <ImageIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
              strokeWidth={2}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                Storage key
              </p>
              <p className="break-all font-mono text-[11px] text-emerald-900 dark:text-emerald-100">
                {coverImageKey}
              </p>
              {openHref ? (
                <a
                  href={openHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[10px] font-bold text-primary hover:underline"
                >
                  Open image
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : pendingFile ? (
        <p className="text-[11px] font-medium text-ui-muted-text">
          {uploadOnSelect
            ? `${pendingFile.name} selected`
            : `${pendingFile.name} will upload when you start onboarding`}
        </p>
      ) : null}

      {(previewUrl || pendingFile || coverImageKey) && !locked ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => inputRef.current?.click()}
            className="text-[10px] font-bold text-primary hover:underline disabled:opacity-60"
          >
            Replace
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={clearSelection}
            className="text-[10px] font-bold text-rose-600 hover:underline disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      ) : null}

      {status ? <p className="text-[10px] font-medium text-emerald-600">{status}</p> : null}
      {localError ? (
        <p className="text-[10px] font-medium text-rose-600">{localError}</p>
      ) : null}
    </div>
  );
}
