"use client";

import { useRef, useState } from "react";
import { Lock, Upload } from "lucide-react";
import { formatRequestError } from "@/lib/formatRequestError";
import { useUploadFileMutation } from "@/store/api/uploadApi";

const iconStroke = 1.75;

type FileUploadZoneProps = {
  onUploaded?: (url: string, file: File) => void;
  className?: string;
};

export function FileUploadZone({ onUploaded, className = "" }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, { isLoading }] = useUploadFileMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setError(null);
    setMessage(null);

    try {
      const result = await upload(file).unwrap();
      const url = result.url || "Uploaded successfully";
      setMessage(`${file.name} uploaded`);
      onUploaded?.(url, file);
    } catch (err) {
      setError(formatRequestError(err));
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isLoading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isLoading) inputRef.current?.click();
          }
        }}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed border-ui-border bg-ui-card p-4 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50/30 sm:rounded-[20px] sm:p-5 xl:rounded-[24px] xl:p-6 ${isLoading ? "pointer-events-none opacity-70" : ""}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[#7C3AED] transition-transform group-hover:scale-105">
            <Upload className="h-5 w-5" strokeWidth={iconStroke} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-ui-strong">
              <span className="text-[#7C3AED] underline decoration-violet-300 underline-offset-2">
                {isLoading ? "Uploading…" : "Click to upload"}
              </span>{" "}
              or drag & drop files here
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-ui-faint">
              PDF, DOCX, XLSX up to 50MB · Encrypted at rest
            </p>
          </div>
          <Lock
            className="h-5 w-5 shrink-0 text-ui-faint"
            strokeWidth={iconStroke}
            aria-hidden
          />
        </div>
      </div>
      {message ? (
        <p className="mt-2 text-[12px] font-medium text-emerald-600">{message}</p>
      ) : null}
      {error ? (
        <p className="mt-2 text-[12px] font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
