'use client';

import React, { useState } from 'react';
import { formatRequestError } from '@/lib/formatRequestError';
import {
  downloadInvestmentDocumentViaProxy,
  type InvestmentHubDocument,
} from '@/lib/investorHubInvestmentDocuments';
import {
  useDownloadInvestorHubInvestmentDocumentMutation,
  useLazyGetInvestorHubInvestmentDocumentsDownloadAllQuery,
  useListInvestorHubInvestmentDocumentsQuery,
} from '@/store/api/investorHubInvestmentDocumentsApi';

function canAttemptDownload(doc: InvestmentHubDocument): boolean {
  return Boolean(doc.url) || doc.downloadable || doc.sizeBytes > 0;
}

async function downloadDocumentEntry(
  doc: InvestmentHubDocument,
  downloadDocument: ReturnType<
    typeof useDownloadInvestorHubInvestmentDocumentMutation
  >[0],
): Promise<void> {
  if (doc.url) {
    await downloadInvestmentDocumentViaProxy(doc.url, doc.name);
    return;
  }
  await downloadDocument({ id: doc.id, filename: doc.name }).unwrap();
}

function InvestmentDocumentRow({
  doc,
  onError,
}: {
  doc: InvestmentHubDocument;
  onError: (message: string) => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDocument] = useDownloadInvestorHubInvestmentDocumentMutation();
  const canDownload = canAttemptDownload(doc);

  async function handleDownload(e: React.MouseEvent) {
    e.preventDefault();
    if (!canDownload || isDownloading) return;

    setIsDownloading(true);
    onError('');
    try {
      await downloadDocumentEntry(doc, downloadDocument);
    } catch (err) {
      onError(formatRequestError(err));
    } finally {
      setIsDownloading(false);
    }
  }

  const inner = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-faint transition-all group-hover:bg-primary group-hover:text-white md:h-10 md:w-10">
        <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-ui-strong transition-colors group-hover:text-primary">
          {doc.name}
        </p>
        <p className="text-[10px] font-medium text-ui-faint">
          {doc.type} · {doc.size} · {doc.date}
        </p>
      </div>
      {canDownload ? (
        isDownloading ? (
          <svg className="h-4 w-4 shrink-0 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 shrink-0 text-ui-placeholder transition-colors group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )
      ) : null}
    </>
  );

  if (!canDownload) {
    return (
      <div className="flex items-center gap-4 px-5 py-5 md:gap-6 md:px-8 md:py-6">
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => void handleDownload(e)}
      disabled={isDownloading}
      className="group flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-ui-muted-surface disabled:cursor-wait md:gap-6 md:px-8 md:py-6"
    >
      {inner}
    </button>
  );
}

export function InvestorHubInvestmentDocumentsTab() {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { data, isLoading, error } = useListInvestorHubInvestmentDocumentsQuery();
  const [fetchDownloadAll, { isFetching: downloadingAll }] =
    useLazyGetInvestorHubInvestmentDocumentsDownloadAllQuery();
  const [downloadDocument] = useDownloadInvestorHubInvestmentDocumentMutation();

  const items = data?.items ?? [];

  async function handleDownloadAll() {
    setDownloadError(null);
    try {
      const result = await fetchDownloadAll().unwrap();

      if (result.files.length > 0) {
        for (const file of result.files) {
          await downloadInvestmentDocumentViaProxy(file.url, file.name);
        }
        return;
      }

      const downloadable = items.filter(canAttemptDownload);
      if (downloadable.length === 0) {
        setDownloadError('No files available to download.');
        return;
      }

      for (const doc of downloadable) {
        await downloadDocumentEntry(doc, downloadDocument);
      }
    } catch (err) {
      setDownloadError(formatRequestError(err));
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="overflow-hidden rounded-[20px] border border-ui-border bg-ui-card shadow-sm md:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-ui-divider p-5 md:p-8">
          <div>
            <h3 className="text-base font-bold text-ui-strong">Investment Documents</h3>
            <p className="mt-0.5 text-xs text-ui-faint">Statements, prospectuses, and legal documents</p>
          </div>
          <button
            type="button"
            onClick={() => void handleDownloadAll()}
            disabled={downloadingAll || isLoading || items.length === 0}
            className="flex items-center gap-2 text-[12px] font-bold text-primary transition-all hover:gap-3 disabled:opacity-60"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {downloadingAll ? 'Preparing…' : 'Download All'}
          </button>
        </div>

        {downloadError ? (
          <p className="border-b border-ui-divider px-5 py-3 text-sm text-rose-600 md:px-8" role="alert">
            {downloadError}
          </p>
        ) : null}

        {error ? (
          <p className="px-6 py-12 text-center text-sm text-rose-600" role="alert">
            {formatRequestError(error)}
          </p>
        ) : isLoading ? (
          <p className="px-6 py-12 text-center text-[13px] font-medium text-ui-faint animate-pulse">
            Loading documents…
          </p>
        ) : items.length === 0 ? (
          <p className="px-6 py-12 text-center text-[13px] font-medium text-ui-faint">
            No investment documents available yet.
          </p>
        ) : (
          <div className="divide-y divide-ui-divider">
            {items.map((doc) => (
              <InvestmentDocumentRow
                key={doc.id}
                doc={doc}
                onError={setDownloadError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
