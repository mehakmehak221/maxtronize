"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Wallet,
  Send,
  HelpCircle,
  Info,
  Globe,
  FileText,
  Percent,
  ChevronDown,
  ChevronRight,
  Check,
  Eye,
} from 'lucide-react';
import InvestorLayout from "@/components/InvestorLayout";
import { getStoredAccessToken } from "@/lib/authToken";
import {
  FileUploadZone,
  type FileUploadZoneHandle,
} from "@/components/FileUploadZone";
import {
  Document,
  PendingIcon,
  SuccessIcon,
  WalletCustodyBarsIcon,
  WalletPolygonIcon,
  WalletTransferIcon,
  WalletWithdrawIcon,
} from "@/app/VectorImages";
import { formatRequestError } from "@/lib/formatRequestError";
import {
  categoryQueryFromKey,
  type IssuerDocument,
  type IssuerDocumentCategoryLabel,
} from "@/lib/issuerDocuments";
import {
  useGetInvestorDocumentCategoriesQuery,
  useGetInvestorDocumentsSummaryQuery,
  useListInvestorDocumentsQuery,
  useSignInvestorDocumentMutation,
} from "@/store/api/investorDocumentsApi";

type NavSvg = ComponentType<SVGProps<SVGSVGElement>>;

function ShieldOutlineMini(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

type CategoryLabel =
  | "All Documents"
  | "Legal"
  | "Compliance"
  | "Asset Docs"
  | "Reports";

function categoryUiFromLabel(
  label: IssuerDocumentCategoryLabel,
): CategoryLabel {
  switch (label) {
    case "LEGAL":
      return "Legal";
    case "COMPLIANCE":
      return "Compliance";
    case "ASSET DOCS":
      return "Asset Docs";
    case "REPORTS":
      return "Reports";
    default:
      return "Legal";
  }
}

type Doc = {
  name: string;
  id: string;
  cat: CategoryLabel;
  catLabel: IssuerDocumentCategoryLabel;
  asset: string;
  status: string;
  statusType: IssuerDocument["statusType"];
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

const INVESTOR_UPLOADED_FILES_STORAGE_KEY = "investor_uploaded_storage_files";

function resolveAbsoluteUrl(url: string): string {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  if (!cleanUrl.startsWith("/storage/") && !cleanUrl.startsWith("/api/")) {
    return `${baseUrl}/storage${cleanUrl}`;
  }
  return `${baseUrl}${cleanUrl}`;
}

function formatUploadedAt(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLocalFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapApiDoc(doc: IssuerDocument): Doc {
  return {
    name: doc.title,
    id: doc.id,
    cat: categoryUiFromLabel(doc.categoryLabel),
    catLabel: doc.categoryLabel,
    asset: doc.assetTitle,
    status: doc.statusLabel,
    statusType: doc.statusType,
    date: doc.fileName,
    size: doc.sizeLabel,
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
      className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? "Signing…" : "Sign"}
    </button>
  );
}

export default function InvestorDocumentsPage() {
  const uploadZoneRef = React.useRef<FileUploadZoneHandle | null>(null);
  const [activeTabKey, setActiveTabKey] = useState("ALL");
  const [viewMode, setViewMode] = useState<'general' | 'tax'>('general');
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedStorageFile[]>(
    () => {
      try {
        const raw = window.localStorage.getItem(
          INVESTOR_UPLOADED_FILES_STORAGE_KEY,
        );
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
          (item): item is UploadedStorageFile =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as UploadedStorageFile).id === "string" &&
            typeof (item as UploadedStorageFile).name === "string" &&
            typeof (item as UploadedStorageFile).uploadedAt === "string" &&
            typeof (item as UploadedStorageFile).url === "string",
        );
      } catch {
        return [];
      }
    },
  );

  const [signInvestorDocument, { isLoading: isSigning }] =
    useSignInvestorDocumentMutation();

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [search]);

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

  const {
    data: listResult,
    isLoading,
    isError,
    refetch,
  } = useListInvestorDocumentsQuery({
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

  const handleOpenFile = async (e: React.MouseEvent, url: string, filename: string) => {
    e.preventDefault();
    const resolvedUrl = resolveAbsoluteUrl(url);
    const token = getStoredAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(resolvedUrl, {
        headers,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
      }, 100);
    } catch (err) {
      console.error("Failed to open file with auth, fallback to direct open:", err);
      window.open(resolvedUrl, "_blank");
    }
  };

  const pageError = summaryError || categoriesError || isError;
  const statsLoading = summaryLoading || categoriesLoading;

  const stats = useMemo(() => {
    const pendingCount = summary?.pendingSignature.count ?? 0;
    const attentionCount = summary?.complianceScore.itemsNeedingAttention ?? 0;

    return [
      {
        label: "Total Documents",
        val: statsLoading ? "…" : String(summary?.totalDocuments.count ?? 0),
        sub: summary?.totalDocuments.summary || "Across your portfolio",
        Icon: Document,
        iconRing:
          "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
      },
      {
        label: "Fully Signed",
        val: statsLoading ? "…" : String(summary?.fullySigned.count ?? 0),
        sub: `${summary?.fullySigned.completionRate ?? 0}% completion rate`,
        Icon: SuccessIcon,
        iconRing:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
        iconShape: "circle" as const,
      },
      {
        label: "Pending Signature",
        val: statsLoading ? "…" : String(pendingCount),
        sub:
          summary?.pendingSignature.summary ||
          (pendingCount > 0 ? "Action required" : "None pending"),
        Icon: PendingIcon,
        iconRing:
          "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300",
        highlight: pendingCount > 0,
      },
      {
        label: "Needs Attention",
        val: statsLoading ? "…" : String(attentionCount),
        sub:
          summary?.complianceScore.summary ||
          (attentionCount > 0
            ? `${attentionCount} item${attentionCount === 1 ? "" : "s"}`
            : "All clear"),
        Icon: ShieldOutlineMini,
        iconRing:
          "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
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
    return [
      {
        key: "ALL",
        name: "All Documents",
        count: listResult?.pagination.total ?? 0,
      },
    ];
  }, [categoryTabs, listResult?.pagination.total]);

  const statusStyle: Record<IssuerDocument["statusType"], string> = {
    signed: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    draft: "bg-ui-muted-deep text-ui-muted-text border-ui-border-strong",
    expired: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const catStyle: Record<string, string> = {
    LEGAL: "bg-primary/5 text-primary border-primary/10",
    COMPLIANCE: "bg-blue-50 text-blue-600 border-blue-100",
    "ASSET DOCS": "bg-amber-50 text-amber-600 border-amber-100",
    REPORTS: "bg-green-50 text-green-600 border-green-100",
  };

  function CategoryGlyph({ catLabel }: { catLabel: string }) {
    const cls = "h-3.5 w-3.5 shrink-0";
    switch (catLabel) {
      case "LEGAL":
        return <Document className={cls} />;
      case "COMPLIANCE":
        return <WalletTransferIcon className={cls} />;
      case "ASSET DOCS":
        return <WalletPolygonIcon className={`${cls} w-3`} />;
      case "REPORTS":
        return <WalletCustodyBarsIcon className="h-3.5 w-2.5 shrink-0" />;
      default:
        return <Document className={cls} />;
    }
  }

  function StatusGlyph({
    statusType,
  }: {
    statusType: IssuerDocument["statusType"];
  }) {
    const cls = "h-3.5 w-3.5 shrink-0";
    switch (statusType) {
      case "signed":
        return <SuccessIcon className={cls} />;
      case "pending":
        return <PendingIcon className={cls} />;
      case "draft":
        return <Document className={cls} />;
      case "expired":
        return <WalletWithdrawIcon className={cls} />;
      default:
        return <Document className={cls} />;
    }
  }

  return (
    <InvestorLayout pageTitle="Documents">
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-ui-strong tracking-tight">
              Documents
            </h1>
            <p className="text-base text-ui-faint mt-1 font-medium">
              Legal agreements, compliance filings, and asset documentation — all in one secure vault.
            </p>
          </div>
          {viewMode === 'general' && (
            <button
              type="button"
              onClick={() => uploadZoneRef.current?.openPicker()}
              className="self-start sm:self-auto px-5 md:px-7 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all flex items-center gap-2 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Upload to Secure Storage
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-card-border pb-1">
          <button
            type="button"
            onClick={() => setViewMode('general')}
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all ${
              viewMode === 'general'
                ? 'border-[#7C3AED] text-[#7C3AED] font-black'
                : 'border-transparent text-text-muted hover:text-foreground'
            }`}
          >
            General Documents
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tax')}
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all ${
              viewMode === 'tax'
                ? 'border-[#7C3AED] text-[#7C3AED] font-black'
                : 'border-transparent text-text-muted hover:text-foreground'
            }`}
          >
            Tax Center
          </button>
        </div>

        {viewMode === 'general' ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 2xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-[20px] border p-4 shadow-sm md:rounded-[28px] md:p-6 ${
                    s.highlight
                      ? "border-amber-100/80 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/25"
                      : "border-ui-border bg-ui-card dark:border-zinc-800 dark:bg-zinc-900/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                        s.iconShape === "circle" ? "rounded-full" : "rounded-xl"
                      } ${s.iconRing}`}
                    >
                      <s.Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[9px] font-bold uppercase leading-snug tracking-wide text-ui-faint sm:tracking-widest">
                        {s.label}
                      </p>
                      <p
                        className={`text-xl font-bold md:text-2xl ${s.highlight ? "text-amber-600" : "text-ui-strong"}`}
                      >
                        {s.val}
                      </p>
                      <p
                        className={`hidden text-xs font-medium sm:block ${s.highlight ? "text-amber-600/90" : "text-ui-faint"}`}
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
                    className={`flex items-center gap-1.5 px-3 md:px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                      activeTabKey === cat.key
                        ? "bg-slate-900 text-white shadow-md dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {cat.name}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                        activeTabKey === cat.key
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2.5 bg-ui-card border border-ui-border rounded-2xl text-base font-medium outline-none focus:ring-4 focus:ring-primary/5 shadow-sm"
                />
              </div>
            </div>

            {pageError ? (
              <div className="rounded-2xl border border-ui-border bg-ui-card px-6 py-8 text-center">
                <p className="text-sm font-medium text-ui-faint">{pageError}</p>
                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                    void refetchSummary();
                    void refetchCategories();
                  }}
                  className="mt-3 text-xs font-bold uppercase tracking-widest text-[#7C3AED]"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {signError ? (
              <div
                role="alert"
                className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-base font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
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
                  <h2 className="text-base font-bold text-ui-strong">
                    Recent Storage Uploads
                  </h2>
                  <p className="text-sm font-medium text-ui-faint">
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
                        <p className="truncate text-base font-bold text-ui-strong">
                          {file.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-ui-faint">
                          <span>{file.size}</span>
                          <span className="text-ui-placeholder">•</span>
                          <span>{file.uploadedAt}</span>
                          <span className="text-ui-placeholder">•</span>
                          <span>Stored upload</span>
                        </div>
                      </div>
                      <a
                        href={resolveAbsoluteUrl(file.url)}
                        onClick={(e) => handleOpenFile(e, file.url, file.name)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-ui-border px-4 py-2.5 text-sm font-bold text-ui-muted-text transition-colors hover:bg-ui-muted"
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
                <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-12 text-center text-base font-medium text-ui-faint animate-pulse">
                  Loading documents…
                </p>
              ) : filteredDocs.length === 0 ? (
                <p className="rounded-2xl border border-ui-border bg-ui-card px-6 py-12 text-center text-base font-medium text-ui-faint">
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
                        <p className="text-base font-bold leading-snug text-ui-strong">
                          {doc.name}
                        </p>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                          {doc.id}
                        </p>
                      </div>
                      <SignDocumentButton
                        docId={doc.id}
                        pending={doc.statusType === "pending"}
                        signingId={signingId}
                        isSigning={isSigning}
                        onSign={handleSignDocument}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 border-t border-ui-divider pt-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold ${catStyle[doc.catLabel]}`}
                      >
                        <CategoryGlyph catLabel={doc.catLabel} />
                        {doc.catLabel}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle[doc.statusType]}`}
                      >
                        <StatusGlyph statusType={doc.statusType} />
                        {doc.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                      <div className="min-w-0">
                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                          Asset
                        </p>
                        <p className="line-clamp-2 font-medium text-ui-muted-text">
                          {doc.asset}
                        </p>
                      </div>
                      <div>
                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                          Date
                        </p>
                        <p className="font-medium text-ui-faint">{doc.date}</p>
                      </div>
                      <div>
                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-ui-faint">
                          Size
                        </p>
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
                      {[
                        "Document",
                        "Category",
                        "Asset",
                        "Status",
                        "Date",
                        "Size",
                        "",
                      ].map((h) => (
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
                          <p className="text-base font-medium text-ui-faint animate-pulse">
                            Loading documents…
                          </p>
                        </td>
                      </tr>
                    ) : filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-12 text-center">
                          <p className="text-base font-medium text-ui-faint">
                            No documents found matching your search.
                          </p>
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
                              <div className="w-8 h-8 rounded-xl bg-ui-muted-deep text-ui-faint group-hover:bg-[#7C3AED] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm md:text-[13px] font-bold text-ui-strong truncate max-w-[140px] md:max-w-[220px] group-hover:text-primary transition-colors">
                                  {doc.name}
                                </p>
                                <p className="text-[9px] font-bold text-ui-faint uppercase tracking-widest">
                                  {doc.id}
                                </p>
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
                              <WalletPolygonIcon
                                className="h-3.5 w-3 shrink-0 text-violet-500 dark:text-violet-400"
                                aria-hidden
                              />
                              <p className="text-sm font-medium text-ui-muted-text">
                                {doc.asset}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap ${statusStyle[doc.statusType]}`}
                            >
                              <StatusGlyph statusType={doc.statusType} />
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-xs font-medium text-ui-faint whitespace-nowrap">
                              {doc.date}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5">
                            <span className="text-xs font-medium text-ui-faint">
                              {doc.size}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                            <SignDocumentButton
                              docId={doc.id}
                              pending={doc.statusType === "pending"}
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
          </>
        ) : (
          /* Tax Center Tab View Mode */
          <>
            {/* Solid Purple KPI Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-950 to-purple-900 border border-indigo-950/30 p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-purple-200" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-200">Tax Year</span>
                  <span className="text-2xl font-black block mt-0.5">2025</span>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 block">Total Distributions</span>
                <span className="text-xl font-black block mt-0.5">$48,200.00</span>
                <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">+12.4% vs 2024</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 block">Capital Gains</span>
                <span className="text-xl font-black block mt-0.5">$12,400.00</span>
                <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">+8.7% vs 2024</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 block">Tax Documents Available</span>
                <span className="text-xl font-black block mt-0.5">8 Forms Ready</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 block">Status</span>
                <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-black tracking-wider uppercase text-emerald-400 mt-1.5 inline-block">
                  Ready for Filing
                </span>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
              
              {/* Left Column (8 cols): Tax Docs Table, distribution & K-1 summaries, Lexa, download options, Activity */}
              <div className="xl:col-span-8 space-y-6">
                
                {/* Tax Documents Card */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4 mb-5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Tax Documents</h4>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search documents..."
                          className="rounded-2xl border border-card-border bg-card-bg pl-9 pr-4 py-2 text-xs font-bold text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-44"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-xl border border-card-border bg-card px-3 py-1.5 text-[10px] font-bold text-text-muted cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <span>All Types</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Document Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-card-border text-[9px] font-black uppercase tracking-widest text-text-muted">
                          <th className="pb-3">Document Name</th>
                          <th className="pb-3">Tax Year</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Generated On</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border text-xs font-bold text-text-muted">
                        {[
                          { name: 'Form 1099-DIV', year: '2025', type: 'Dividend Income', date: 'Jan 15, 2026' },
                          { name: 'Form 1099-B', year: '2025', type: 'Capital Gains', date: 'Jan 15, 2026' },
                          { name: 'Schedule K-1', year: '2025', type: 'Partnership Income', date: 'Jan 15, 2026' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#7C3AED] shrink-0" />
                                <span className="text-foreground font-black">{row.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-foreground">{row.year}</td>
                            <td className="py-4 font-normal">{row.type}</td>
                            <td className="py-4 font-normal">{row.date}</td>
                            <td className="py-4">
                              <span className="inline-flex rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[8px] font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                                Ready
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2.5 text-text-muted">
                                <button type="button" title="View Document" className="hover:text-foreground"><Eye className="h-4 w-4" /></button>
                                <button type="button" title="Download Document" className="hover:text-foreground"><Download className="h-4 w-4" /></button>
                                <button type="button" title="Copy Link" className="hover:text-foreground"><Copy className="h-4 w-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between border-t border-card-border pt-4 mt-4 text-[10px] font-bold text-text-muted">
                    <span>Showing 1 to 8 of 8 documents</span>
                    <div className="flex items-center gap-2">
                      <button type="button" className="px-2.5 py-1 rounded border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900/50">Previous</button>
                      <span className="h-6 w-6 rounded bg-[#7C3AED] text-white flex items-center justify-center">1</span>
                      <button type="button" className="px-2.5 py-1 rounded border border-card-border hover:bg-slate-50 dark:hover:bg-slate-900/50">Next</button>
                    </div>
                  </div>
                </div>

                {/* Distribution Summary & K-1 Availability side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Distribution Summary */}
                  <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Distribution Summary</h4>
                        <button type="button" className="text-[9px] font-bold text-[#7C3AED] hover:underline uppercase">Export CSV</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-bold">
                          <thead>
                            <tr className="text-[8px] font-black uppercase tracking-widest text-text-muted">
                              <th className="pb-2">Asset</th>
                              <th className="pb-2 text-right">Distribution</th>
                              <th className="pb-2 text-right">Tax Class</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { name: 'Prime Office Tower NYC', val: '$14,200.00', tag: 'Ordinary Income', tagColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
                              { name: 'Harbor Logistics Fund', val: '$9,800.00', tag: 'Capital Gain', tagColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
                            ].map((row, idx) => (
                              <tr key={idx}>
                                <td className="py-2.5 font-extrabold text-foreground">{row.name}</td>
                                <td className="py-2.5 text-right text-foreground">{row.val}</td>
                                <td className="py-2.5 text-right">
                                  <span className={`inline-block rounded-lg px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${row.tagColor}`}>
                                    {row.tag}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <button type="button" className="text-xs font-black tracking-widest text-[#7C3AED] hover:underline uppercase mt-4 w-full flex items-center justify-center gap-1">
                      <span>View Full Distribution History</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* K-1 Availability */}
                  <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">K-1 Availability (2025)</h4>
                      </div>
                      <div className="space-y-2.5 text-xs font-bold text-foreground">
                        {[
                          { name: 'Harbor Logistics Fund', status: 'Ready', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
                          { name: 'Infrastructure Fund', status: 'Generating', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
                          { name: 'Private Credit Fund', status: 'Ready', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
                        ].map((row, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>{row.name}</span>
                            <span className={`inline-block rounded-lg px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${row.color}`}>
                              {row.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button type="button" className="text-xs font-black tracking-widest text-[#7C3AED] hover:underline uppercase mt-4 w-full flex items-center justify-center gap-1">
                      <span>View All K-1 Documents</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                </div>

                {/* Lexa Tax AI Assistant */}
                <div className="rounded-3xl border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/20 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#7C3AED]">Lexa Tax</span>
                    <span className="rounded-full bg-purple-100 dark:bg-purple-950/40 px-1.5 py-0.5 text-[8px] font-black text-[#7C3AED]">BETA</span>
                  </div>
                  <p className="text-xs text-text-muted">Ask questions about your tax documents and investments.</p>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask Lexa anything about your taxes..."
                      className="w-full rounded-2xl border border-card-border bg-card pl-4 pr-12 py-3.5 text-xs font-bold text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center shrink-0">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {[
                      'Explain my 1099-DIV',
                      'Summarize my K-1',
                      'Estimate taxable income',
                      'Show capital gains summary',
                    ].map((pill) => (
                      <button
                        key={pill}
                        type="button"
                        className="rounded-xl border border-card-border bg-card px-3 py-1.5 text-[10px] font-bold text-text-muted hover:border-text-muted transition-all"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Center */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Download Center</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Download All Tax Documents', desc: 'ZIP file with all available documents' },
                      { title: 'Export Tax Summary (CSV)', desc: 'Download income summary data' },
                      { title: 'Share with Accountant', desc: 'Securely share your tax documents' },
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-card-border bg-slate-50 dark:bg-slate-900/10 p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-all"
                      >
                        <div>
                          <h5 className="text-xs font-extrabold text-foreground">{row.title}</h5>
                          <span className="text-[10px] text-text-muted mt-0.5 block">{row.desc}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Room Activity */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Data Room Activity</h4>
                    <button type="button" className="text-[9px] font-bold text-text-muted hover:text-foreground">View All</button>
                  </div>
                  
                  <div className="relative border-l border-card-border pl-6 space-y-6 ml-2.5">
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-[#7C3AED] ring-4 ring-purple-100 dark:ring-purple-950/20" />
                      <div>
                        <h5 className="text-xs font-bold text-foreground">Tax documents generated for 2025</h5>
                        <p className="text-[10px] text-text-muted mt-0.5">Jan 15, 2026 · 10:30 AM · System</p>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-[#7C3AED] ring-4 ring-purple-100 dark:ring-purple-950/20" />
                      <div>
                        <h5 className="text-xs font-bold text-foreground">K-1 for Harbor Logistics Fund is ready</h5>
                        <p className="text-[10px] text-text-muted mt-0.5">Jan 14, 2026 · 04:15 PM · Maxtronize Team</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (4 cols): filing status, income breakdown, upcoming deadlines, insights, resources */}
              <div className="xl:col-span-4 space-y-6">
                
                {/* Tax Filing Status */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">Tax Filing Status</h4>
                  <div className="space-y-3.5 text-xs font-bold">
                    {[
                      { label: 'Federal Tax Documents', status: 'Ready', color: 'text-emerald-500' },
                      { label: 'State Tax Documents', status: 'Ready', color: 'text-emerald-500' },
                      { label: 'International Tax Forms', status: 'Pending', color: 'text-amber-500' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-text-muted">
                        <span>{row.label}</span>
                        <span className={`font-black ${row.color}`}>{row.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-card-border flex justify-between text-[10px] font-bold text-text-muted">
                    <span>Last Updated</span>
                    <span>Jan 15, 2026</span>
                  </div>
                </div>

                {/* Income Breakdown Card */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Income Breakdown (2025)</h4>
                  
                  {/* Circular Doughnut chart */}
                  <div className="relative h-40 w-40 flex items-center justify-center mx-auto">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" className="text-card-border" strokeWidth="2.5" />
                      {/* Dividend Income (33.5%) */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="33.5 100" strokeDashoffset="0" />
                      {/* Rental Yield (30%) */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="2.5" strokeDasharray="30 100" strokeDashoffset="-33.5" />
                      {/* Interest Income (11.2%) */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="11.2 100" strokeDashoffset="-63.5" />
                      {/* Capital Gains (25.3%) */}
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="25.3 100" strokeDashoffset="-74.7" />
                    </svg>
                    <div className="text-center z-10">
                      <span className="text-xl font-black text-foreground">$60,600</span>
                      <span className="text-[8px] font-black uppercase tracking-wider text-text-muted block mt-0.5">Total Income</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 text-xs font-bold text-text-muted">
                    {[
                      { label: 'Dividend Income', val: '$20,300 (33.5%)', color: 'bg-blue-500' },
                      { label: 'Rental Yield Income', val: '$18,200 (30.0%)', color: 'bg-emerald-500' },
                      { label: 'Interest Income', val: '$6,800 (11.2%)', color: 'bg-amber-500' },
                      { label: 'Capital Gains', val: '$12,400 (20.5%)', color: 'bg-purple-500' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                          <span>{row.label}</span>
                        </div>
                        <span className="text-foreground">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Tax Deadlines */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Upcoming Tax Deadlines</h4>
                  
                  <div className="space-y-4">
                    {[
                      { date: 'JAN 31', title: '1099 Forms Available', desc: 'Form 1099-DIV, 1099-B' },
                      { date: 'MAR 15', title: 'K-1 Filing Deadline', desc: 'Schedule K-1 for Partnerships' },
                      { date: 'APR 15', title: 'Federal Tax Filing Deadline', desc: 'Individual Tax Returns' },
                    ].map((dl, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="h-10 w-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center shrink-0 border border-card-border">
                          <span className="text-[10px] font-black text-[#7C3AED] leading-none">{dl.date.split(' ')[0]}</span>
                          <span className="text-xs font-black text-foreground mt-0.5 leading-none">{dl.date.split(' ')[1]}</span>
                        </div>
                        <div>
                          <h5 className="text-xs font-extrabold text-foreground leading-tight">{dl.title}</h5>
                          <span className="text-[10px] text-text-muted block mt-0.5">{dl.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Center Insights */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#7C3AED] mb-2">Tax Center Insights</h4>
                  
                  <div className="space-y-3.5 text-xs font-bold font-sans">
                    <div className="flex justify-between items-center text-text-muted">
                      <span>Estimated Taxable Income</span>
                      <span className="text-foreground">$60,300.00</span>
                    </div>
                    <div className="flex justify-between items-center text-text-muted">
                      <span>Federal Tax Estimate</span>
                      <span className="text-foreground">$13,200.00</span>
                    </div>
                    <div className="flex justify-between items-center text-text-muted">
                      <span>State Tax Estimate</span>
                      <span className="text-foreground">$4,100.00</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-text-muted leading-relaxed pt-3 border-t border-card-border">
                    *Estimates are for informational purposes only and do not constitute professional tax advice. Consult a certified public accountant.
                  </p>
                </div>

                {/* Common Tax Information Resources */}
                <div className="rounded-3xl border border-card-border bg-card p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted">Common Tax Information</h4>
                  <div className="space-y-3.5 text-xs font-bold text-text-muted">
                    {[
                      { title: 'Tax Document Guide', desc: 'Learn about each tax form' },
                      { title: 'Tax FAQ', desc: 'Frequently asked questions' },
                      { title: 'Tax Glossary', desc: 'Understand key terms' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center hover:text-foreground cursor-pointer">
                        <div>
                          <span className="text-foreground block">{row.title}</span>
                          <span className="text-[10px] text-text-muted block font-normal">{row.desc}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                  <button type="button" className="text-[10px] font-black text-[#7C3AED] hover:underline uppercase tracking-wider pt-3 border-t border-card-border w-full text-center block">
                    Visit Tax Resource Center
                  </button>
                </div>

              </div>

            </div>
          </>
        )}
      </div>
    </InvestorLayout>
  );
}
