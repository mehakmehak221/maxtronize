'use client';

import React, { useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react';
import InvestorLayout from '@/components/InvestorLayout';
import { FileUploadZone, type FileUploadZoneHandle } from '@/components/FileUploadZone';
import {
  Document,
  PendingIcon,
  SuccessIcon,
  WalletCustodyBarsIcon,
  WalletPolygonIcon,
  WalletTransferIcon,
  WalletWithdrawIcon,
} from '@/app/VectorImages';
import { formatRequestError } from '@/lib/formatRequestError';
import { categoryQueryFromKey, type IssuerDocument, type IssuerDocumentCategoryLabel } from '@/lib/issuerDocuments';
import {
  useGetInvestorDocumentCategoriesQuery,
  useGetInvestorDocumentsSummaryQuery,
  useListInvestorDocumentsQuery,
  useSignInvestorDocumentMutation,
} from '@/store/api/investorDocumentsApi';

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

function ShieldOutlineMini(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

type CategoryLabel = 'All Documents' | 'Legal' | 'Compliance' | 'Asset Docs' | 'Reports';

function categoryUiFromLabel(label: IssuerDocumentCategoryLabel): CategoryLabel {
  switch (label) {
    case 'LEGAL':
      return 'Legal';
    case 'COMPLIANCE':
      return 'Compliance';
    case 'ASSET DOCS':
      return 'Asset Docs';
    case 'REPORTS':
      return 'Reports';
    default:
      return 'Legal';
  }
}

type Doc = {
  name: string;
  id: string;
  cat: CategoryLabel;
  catLabel: IssuerDocumentCategoryLabel;
  asset: string;
  status: string;
  statusType: IssuerDocument['statusType'];
  date: string;
  size: string;
};

type UploadedStorageFile = {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  url: string;
};

const INVESTOR_UPLOADED_FILES_STORAGE_KEY = 'investor_uploaded_storage_files';

function formatUploadedAt(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatLocalFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapApiDoc(doc: IssuerDocument): Doc {
  return {
    name: doc.name,
    id: doc.id,
    cat: categoryUiFromLabel(doc.categoryLabel),
    catLabel: doc.categoryLabel,
    asset: doc.assetName,
    status: doc.status,
    statusType: doc.statusType,
    date: doc.date,
    size: doc.size,
  };
}

function SignDocumentButton({
  docId,
  pending,
  signingId,
  isSigning,
  onSign,
}: {
  docId: string;
  pending: boolean;
  signingId: string | null;
  isSigning: boolean;
  onSign: (id: string) => void;
}) {
  if (!pending) return null;

  const busy = isSigning && signingId === docId;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSign(docId);
      }}
      disabled={isSigning}
      className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? 'Signing…' : 'Sign'}
    </button>
  );
}

export default function InvestorDocumentsPage() {
  const uploadZoneRef = React.useRef<FileUploadZoneHandle | null>(null);
  const [activeTabKey, setActiveTabKey] = useState('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedStorageFile[]>([]);

  const [signInvestorDocument, { isLoading: isSigning }] = useSignInvestorDocumentMutation();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(INVESTOR_UPLOADED_FILES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setUploadedFiles(
        parsed.filter(
          (item): item is UploadedStorageFile =>
            Boolean(item) &&
            typeof item === 'object' &&
            typeof (item as UploadedStorageFile).id === 'string' &&
            typeof (item as UploadedStorageFile).name === 'string' &&
            typeof (item as UploadedStorageFile).uploadedAt === 'string' &&
            typeof (item as UploadedStorageFile).url === 'string',
        ),
      );
    } catch {
      // Ignore corrupted local storage and start fresh.
    }
  }, []);

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useGetInvestorDocumentsSummaryQuery();
  const {
    data: categoryTabs = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useGetInvestorDocumentCategoriesQuery();

  const { data: listResult, isLoading, isError, refetch } = useListInvestorDocumentsQuery({
    page: 1,
    limit: 50,
    search: debouncedSearch || undefined,
    category: categoryQueryFromKey(activeTabKey),
  });

  const allDocs = useMemo(
    () => (listResult?.items ?? []).map(mapApiDoc),
    [listResult?.items],
  );

  const filteredDocs = allDocs;

  async function handleSignDocument(docId: string) {
    setSignError(null);
    setSigningId(docId);
    try {
      await signInvestorDocument(docId).unwrap();
    } catch (err) {
      setSignError(formatRequestError(err));
    } finally {
      setSigningId(null);
    }
  }

  function handleUploadedToStorage(url: string, file: File) {
    const nextUpload: UploadedStorageFile = {
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: formatLocalFileSize(file.size),
      uploadedAt: formatUploadedAt(new Date()),
      url,
    };

    setUploadedFiles((prev) => {
      const next = [nextUpload, ...prev].slice(0, 12);
      window.localStorage.setItem(
        INVESTOR_UPLOADED_FILES_STORAGE_KEY,
        JSON.stringify(next),
      );
      return next;
    });
  }

  const pageError = summaryError || categoriesError || isError;
  const statsLoading = summaryLoading || categoriesLoading;

  const stats = useMemo(() => {
    const pendingCount = summary?.pendingSignature.count ?? 0;
    const attentionCount = summary?.complianceScore.itemsNeedingAttention ?? 0;

    return [
      {
        label: 'Total Documents',
        val: statsLoading ? '…' : String(summary?.totalDocuments.count ?? 0),
        sub: summary?.totalDocuments.summary || 'Across your portfolio',
        Icon: Document,
        iconRing: 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
      },
      {
        label: 'Fully Signed',
        val: statsLoading ? '…' : String(summary?.fullySigned.count ?? 0),
        sub: `${summary?.fullySigned.completionRate ?? 0}% completion rate`,
        Icon: SuccessIcon,
        iconRing: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
        iconShape: 'circle' as const,
      },
      {
        label: 'Pending Signature',
        val: statsLoading ? '…' : String(pendingCount),
        sub: summary?.pendingSignature.summary || (pendingCount > 0 ? 'Action required' : 'None pending'),
        Icon: PendingIcon,
        iconRing: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300',
        highlight: pendingCount > 0,
      },
      {
        label: 'Needs Attention',
        val: statsLoading ? '…' : String(attentionCount),
        sub: summary?.complianceScore.summary || (attentionCount > 0 ? `${attentionCount} item${attentionCount === 1 ? '' : 's'}` : 'All clear'),
        Icon: ShieldOutlineMini,
        iconRing: 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
        highlight: attentionCount > 0,
      },
    ];
  }, [summary, statsLoading]);

  const categories = useMemo(() => {
    if (categoryTabs.length > 0) {
      return categoryTabs.map((tab) => ({
        key: tab.key,
        name: tab.label,
        count: tab.count,
      }));
    }
    return [{ key: 'ALL', name: 'All Documents', count: listResult?.pagination.total ?? 0 }];
  }, [categoryTabs, listResult?.pagination.total]);

  const statusStyle: Record<IssuerDocument['statusType'], string> = {
    signed: 'bg-green-50 text-green-600 border-green-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    draft: 'bg-ui-muted-deep text-ui-muted-text border-ui-border-strong',
    expired: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const catStyle: Record<string, string> = {
    LEGAL: 'bg-primary/5 text-primary border-primary/10',
    COMPLIANCE: 'bg-blue-50 text-blue-600 border-blue-100',
    'ASSET DOCS': 'bg-amber-50 text-amber-600 border-amber-100',
    REPORTS: 'bg-green-50 text-green-600 border-green-100',
  };

  function CategoryGlyph({ catLabel }: { catLabel: string }) {
    const cls = 'h-3.5 w-3.5 shrink-0';
    switch (catLabel) {
      case 'LEGAL':
        return <Document className={cls} />;
      case 'COMPLIANCE':
        return <WalletTransferIcon className={cls} />;
      case 'ASSET DOCS':
        return <WalletPolygonIcon className={`${cls} w-3`} />;
      case 'REPORTS':
        return <WalletCustodyBarsIcon className="h-3.5 w-2.5 shrink-0" />;
      default:
        return <Document className={cls} />;
    }
  }

  function StatusGlyph({ statusType }: { statusType: IssuerDocument['statusType'] }) {
    const cls = 'h-3.5 w-3.5 shrink-0';
    switch (statusType) {
      case 'signed':
        return <SuccessIcon className={cls} />;
      case 'pending':
        return <PendingIcon className={cls} />;
      case 'draft':
        return <Document className={cls} />;
      case 'expired':
        return <WalletWithdrawIcon className={cls} />;
      default:
        return <Document className={cls} />;
    }
  }

  return (
    <InvestorLayout pageTitle="Documents">
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">Documents</h1>
            <p className="text-sm text-ui-faint mt-1 font-medium">
              Legal agreements, compliance filings, and asset documentation — all in one secure vault.
            </p>
          </div>
          <button
            type="button"
            onClick={() => uploadZoneRef.current?.openPicker()}
            className="self-start sm:self-auto px-5 md:px-7 py-3 bg-primary text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Upload to Secure Storage
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 2xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-[20px] border p-4 shadow-sm md:rounded-[28px] md:p-6 ${
                s.highlight
                  ? 'border-amber-100/80 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/25'
                  : 'border-ui-border bg-ui-card dark:border-zinc-800 dark:bg-zinc-900/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                    s.iconShape === 'circle' ? 'rounded-full' : 'rounded-xl'
                  } ${s.iconRing}`}
                >
                  <s.Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="mb-0.5 text-[9px] font-bold uppercase leading-snug tracking-wide text-ui-faint sm:tracking-widest">
                    {s.label}
                  </p>
                  <p className={`text-xl font-bold md:text-2xl ${s.highlight ? 'text-amber-600' : 'text-ui-strong'}`}>
                    {s.val}
                  </p>
                  <p
                    className={`hidden text-[10px] font-medium sm:block ${s.highlight ? 'text-amber-600/90' : 'text-ui-faint'}`}
                  >
                    {s.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveTabKey(cat.key)}
                className={`flex items-center gap-1.5 px-3 md:px-5 py-2 rounded-full text-[12px] font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeTabKey === cat.key
                    ? 'bg-slate-900 text-white shadow-md dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {cat.name}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                    activeTabKey === cat.key
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full shrink-0 lg:w-72">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ui-faint"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 bg-ui-card border border-ui-border rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary/5 shadow-sm"
            />
          </div>
        </div>

        {pageError ? (
          <div className="rounded-2xl border border-ui-border bg-ui-card px-6 py-8 text-center">
            <p className="text-sm font-medium text-ui-muted-text">Could not load documents.</p>
            <button
              type="button"
              onClick={() => {
                void refetch();
                void refetchSummary();
                void refetchCategories();
              }}
              className="mt-3 text-[11px] font-bold uppercase tracking-widest text-primary"
            >
              Retry
            </button>
          </div>
        ) : null}

        {signError ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
          >
            {signError}
          </div>
        ) : null}

        <div id="investor-document-upload">
          <FileUploadZone
            ref={uploadZoneRef}
            folder="general"
            helperText="This uploads a file to secure storage. Investor vault creation and assignment are not available in the current investor documents API."
            onUploaded={handleUploadedToStorage}
          />
        </div>

        {uploadedFiles.length > 0 ? (
          <section className="overflow-hidden rounded-[20px] border border-ui-border bg-ui-card/95 shadow-sm md:rounded-[32px] dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex flex-col gap-2 border-b border-ui-divider px-5 py-4 md:px-8 md:py-5">
              <h2 className="text-[14px] font-bold text-ui-strong">Recent Storage Uploads</h2>
              <p className="text-[12px] font-medium text-ui-faint">
                Uploaded files remain visible here on this device after they are sent to secure storage.
              </p>
            </div>
            <div className="divide-y divide-ui-divider">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-ui-strong">
                      {file.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-ui-faint">
                      <span>{file.size}</span>
                      <span className="text-ui-placeholder">•</span>
                      <span>{file.uploadedAt}</span>
                      <span className="text-ui-placeholder">•</span>
                      <span>Stored upload</span>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-ui-border px-4 py-2.5 text-[12px] font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
                  >
                    Open File
                  </a>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="space-y-3 xl:hidden">
          {isLoading ? (
            <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-12 text-center text-[13px] font-medium text-ui-faint animate-pulse">
              Loading documents…
            </p>
          ) : filteredDocs.length === 0 ? (
            <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-12 text-center text-[13px] font-medium text-ui-faint">
              No documents found matching your search.
            </p>
          ) : (
            filteredDocs.map((doc) => (
              <article
                key={doc.id}
                className="rounded-2xl border border-ui-border bg-ui-card p-4 shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ui-muted-deep text-ui-faint">
                    <Document className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold leading-snug text-ui-strong">{doc.name}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">{doc.id}</p>
                  </div>
                  <SignDocumentButton
                    docId={doc.id}
                    pending={doc.statusType === 'pending'}
                    signingId={signingId}
                    isSigning={isSigning}
                    onSign={handleSignDocument}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-ui-divider pt-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold ${catStyle[doc.catLabel]}`}>
                    <CategoryGlyph catLabel={doc.catLabel} />
                    {doc.catLabel}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${statusStyle[doc.statusType]}`}>
                    <StatusGlyph statusType={doc.statusType} />
                    {doc.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-[11px]">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Asset</p>
                    <p className="line-clamp-2 font-medium text-ui-muted-text">{doc.asset}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Date</p>
                    <p className="font-medium text-ui-faint">{doc.date}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">Size</p>
                    <p className="font-medium text-ui-faint">{doc.size}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="hidden overflow-hidden rounded-[20px] border border-ui-border bg-ui-card/95 shadow-sm md:rounded-[32px] xl:block dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-ui-divider">
                  {['Document', 'Category', 'Asset', 'Status', 'Date', 'Size', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 md:px-8 py-4 text-[9px] font-bold text-ui-faint uppercase tracking-widest bg-transparent"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-divider">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center">
                      <p className="text-[13px] font-medium text-ui-faint animate-pulse">Loading documents…</p>
                    </td>
                  </tr>
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center">
                      <p className="text-[13px] font-medium text-ui-faint">No documents found matching your search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-ui-muted-deep/40 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-ui-muted-deep text-ui-faint group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] md:text-[13px] font-bold text-ui-strong truncate max-w-[140px] md:max-w-[220px] group-hover:text-primary transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">{doc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold whitespace-nowrap ${catStyle[doc.catLabel]}`}
                        >
                          <CategoryGlyph catLabel={doc.catLabel} />
                          {doc.catLabel}
                        </span>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <WalletPolygonIcon className="h-3.5 w-3 shrink-0 text-violet-500 dark:text-violet-400" aria-hidden />
                          <p className="text-[12px] font-medium text-ui-muted-text">{doc.asset}</p>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold whitespace-nowrap ${statusStyle[doc.statusType]}`}
                        >
                          <StatusGlyph statusType={doc.statusType} />
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <span className="text-[11px] font-medium text-ui-faint whitespace-nowrap">{doc.date}</span>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <span className="text-[11px] font-medium text-ui-faint">{doc.size}</span>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                        <SignDocumentButton
                          docId={doc.id}
                          pending={doc.statusType === 'pending'}
                          signingId={signingId}
                          isSigning={isSigning}
                          onSign={handleSignDocument}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InvestorLayout>
  );
}
