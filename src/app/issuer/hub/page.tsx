'use client';

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Brain,
  Building2,
  CheckCircle2,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
  RefreshCw,
  Send,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { HubAssetsTab } from '@/components/issuer/HubAssetsTab';
import { HubCapTableTab } from '@/components/issuer/HubCapTableTab';
import { HubComplianceTab } from '@/components/issuer/HubComplianceTab';
import { HubInvestorsTab } from '@/components/issuer/HubInvestorsTab';
import { HubDistributionsTab } from '@/components/issuer/HubDistributionsTab';
// import { HubAnalyticsTab } from '@/components/hub/HubAnalyticsTab';
import { HubOverviewTab } from '@/components/issuer/HubOverviewTab';
import { formatRequestError } from '@/lib/formatRequestError';
import { buildAiAssistantDraftReply } from '@/lib/issuerAiAssistant';
import { formatHubUpdatedAt } from '@/lib/issuerHub';
import { useGetIssuerHubOverviewSummaryQuery } from '@/store/api/issuerHubApi';
import {
  useBootstrapIssuerHubAiAssistantMutation,
  useGetIssuerHubAiAssistantInitQuery,
  useGetIssuerHubAiAssistantQuery,
  useGetIssuerHubAiSuggestedPromptsQuery,
  useListIssuerHubAiMessagesQuery,
  useSendIssuerHubAiMessageMutation,
} from '@/store';

const iconStroke = 1.75;

function TabIcon({ Icon, active }: { Icon: LucideIcon; active: boolean }) {
  return (
    <Icon
      className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-primary' : 'text-text-muted'}`}
      strokeWidth={iconStroke}
      aria-hidden
    />
  );
}

function MetricIconCircle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

type TabType =
  | 'overview'
  | 'assets'
  | 'cap-table'
  | 'investors'
  | 'distributions'
  | 'compliance'
  // | 'analytics' // Investor-only API — hidden for issuer until issuer endpoints exist
  | 'ai-assistant';

// Keep the richer analytics and AI assistant UI visible by request.
// These surfaces are preserved as preview UI even where the live backend workflow is still evolving.
const HUB_TABS: { id: TabType; name: string; icon: LucideIcon; showDot?: boolean }[] = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid },
  { id: 'assets', name: 'Assets', icon: Building2 },
  { id: 'cap-table', name: 'Cap Table', icon: FileText },
  { id: 'investors', name: 'Investors', icon: Users },
  { id: 'distributions', name: 'Distributions', icon: DollarSign },
  { id: 'compliance', name: 'Compliance', icon: ShieldCheck },
  // { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'ai-assistant', name: 'AI Assistant', icon: Brain, showDot: true },
];

export default function IssuerHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [aiDraft, setAiDraft] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [investorSearch, setInvestorSearch] = useState('');
  const [capTableSearch, setCapTableSearch] = useState('');
  const [complianceSearch, setComplianceSearch] = useState('');

  const { data: overviewSummary } = useGetIssuerHubOverviewSummaryQuery();
  const aiTabActive = activeTab === 'ai-assistant';
  const [aiStatusMsg, setAiStatusMsg] = useState<string | null>(null);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);
  const [aiBootstrappedOnce, setAiBootstrappedOnce] = useState(false);

  const { data: aiConfigData } = useGetIssuerHubAiAssistantQuery(undefined, {
    skip: !aiTabActive,
  });
  const {
    data: aiInitData,
    isLoading: aiInitLoading,
    error: aiInitError,
    refetch: refetchAiInit,
  } = useGetIssuerHubAiAssistantInitQuery(undefined, {
    skip: !aiTabActive,
  });
  const { data: aiMessagesData = [], isLoading: aiMessagesLoading } =
    useListIssuerHubAiMessagesQuery(
      { page: 1, limit: 30 },
      { skip: !aiTabActive },
    );
  const { data: aiPromptsData = [] } = useGetIssuerHubAiSuggestedPromptsQuery(
    undefined,
    { skip: !aiTabActive },
  );
  const [bootstrapAiAssistant, { isLoading: isBootstrappingAi }] =
    useBootstrapIssuerHubAiAssistantMutation();
  const [sendAiMessage, { isLoading: isSendingAi }] =
    useSendIssuerHubAiMessageMutation();

  const aiConfig = aiConfigData ?? aiInitData?.config;
  const aiMessages = useMemo(
    () =>
      aiMessagesData.length > 0
        ? aiMessagesData
        : (aiInitData?.messages ?? []),
    [aiInitData?.messages, aiMessagesData],
  );
  const aiSuggestedPrompts = useMemo(
    () =>
      aiPromptsData.length > 0
        ? aiPromptsData
        : (aiInitData?.suggestedPrompts ?? []),
    [aiInitData?.suggestedPrompts, aiPromptsData],
  );
  const visibleAiMessages = useMemo(() => aiMessages.slice(-6), [aiMessages]);

  useEffect(() => {
    setAiStatusMsg(null);
    setAiErrorMsg(null);
  }, [activeTab]);

  useEffect(() => {
    if (!aiTabActive || aiBootstrappedOnce || isBootstrappingAi) return;
    if (aiInitLoading || aiMessagesLoading) return;
    if (aiMessages.length > 0) return;

    setAiBootstrappedOnce(true);
    void bootstrapAiAssistant()
      .unwrap()
      .then((result) => {
        if (result.message?.content) {
          setAiStatusMsg('Assistant initialized with a live welcome message.');
        }
      })
      .catch((error) => {
        setAiBootstrappedOnce(false);
        setAiErrorMsg(formatRequestError(error));
      });
  }, [
    aiBootstrappedOnce,
    aiInitLoading,
    aiMessages.length,
    aiMessagesLoading,
    aiTabActive,
    bootstrapAiAssistant,
    isBootstrappingAi,
  ]);

  async function handleAiBootstrap() {
    setAiErrorMsg(null);
    setAiStatusMsg(null);
    try {
      const result = await bootstrapAiAssistant().unwrap();
      setAiStatusMsg(
        result.message?.content
          ? 'Assistant initialized successfully.'
          : 'Assistant initialized successfully.',
      );
      setAiBootstrappedOnce(true);
    } catch (error) {
      setAiErrorMsg(formatRequestError(error));
    }
  }

  async function handleAiSend(prefilledMessage?: string) {
    const message = (prefilledMessage ?? aiDraft).trim();
    if (!message || isSendingAi) return;

    setAiErrorMsg(null);
    setAiStatusMsg(null);

    try {
      const response = await sendAiMessage({ message }).unwrap();
      const assistantReply =
        response.assistantMessage ?? buildAiAssistantDraftReply(response);
      setAiDraft('');
      setAiStatusMsg(
        assistantReply?.content
          ? 'Assistant response received.'
          : 'Message sent successfully.',
      );
    } catch (error) {
      setAiErrorMsg(formatRequestError(error));
    }
  }

  const hubSearchValue =
    activeTab === 'assets'
      ? assetSearch
      : activeTab === 'investors'
        ? investorSearch
        : activeTab === 'cap-table'
          ? capTableSearch
          : activeTab === 'compliance'
            ? complianceSearch
            : '';

  const hubSearchPlaceholder =
    activeTab === 'assets'
      ? 'Search assets...'
      : activeTab === 'investors'
        ? 'Search investors...'
        : activeTab === 'cap-table'
          ? 'Search cap table...'
          : activeTab === 'compliance'
            ? 'Search filings...'
            : 'Search investors, assets...';

  const onHubSearchChange = (value: string) => {
    if (activeTab === 'assets') setAssetSearch(value);
    else if (activeTab === 'investors') setInvestorSearch(value);
    else if (activeTab === 'cap-table') setCapTableSearch(value);
    else if (activeTab === 'compliance') setComplianceSearch(value);
  };

  const renderOverview = () => <HubOverviewTab />;

  const renderAssets = () => (
    <HubAssetsTab search={assetSearch} onSearchChange={setAssetSearch} />
  );

  const renderInvestors = () => (
    <HubInvestorsTab search={investorSearch} onSearchChange={setInvestorSearch} />
  );

  const renderCapTable = () => (
    <HubCapTableTab search={capTableSearch} onSearchChange={setCapTableSearch} />
  );

  const renderCompliance = () => (
    <HubComplianceTab search={complianceSearch} onSearchChange={setComplianceSearch} />
  );

  // const renderAnalytics = () => <HubAnalyticsTab variant="issuer" />;

  const renderAiAssistant = () => (
    <div className="min-w-0 max-w-full px-3 animate-in fade-in duration-500 sm:px-4 md:px-5">
      <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-card-border bg-card shadow-sm">
        <div className="flex flex-col gap-5 border-b border-card-border p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8 md:px-10 md:py-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md sm:h-14 sm:w-14">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={iconStroke} aria-hidden />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                {aiConfig?.name || 'Maxtronize AI Assistant'}
              </h3>
              <p className="mt-0.5 text-base font-semibold text-primary sm:text-[13px]">
                {aiConfig?.subtitle || 'Strategy · Compliance · Pricing · Investor Insights'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 sm:self-auto dark:border-emerald-700/60 dark:bg-emerald-950/50">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {aiConfig?.status || 'Live'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void handleAiBootstrap()}
              disabled={isBootstrappingAi}
              className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-primary/30 hover:text-primary disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isBootstrappingAi ? 'animate-spin' : ''}`}
                strokeWidth={iconStroke}
              />
              {isBootstrappingAi ? 'Initializing…' : 'Initialize'}
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8 md:px-10 md:py-9">
          {aiStatusMsg ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-semibold text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              {aiStatusMsg}
            </div>
          ) : null}

          {aiErrorMsg || aiInitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-700 dark:border-rose-700/60 dark:bg-rose-950/40 dark:text-rose-300">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{aiErrorMsg || formatRequestError(aiInitError)}</span>
                <button
                  type="button"
                  onClick={() => refetchAiInit()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:border-rose-300 dark:border-rose-800 dark:bg-transparent dark:text-rose-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" strokeWidth={iconStroke} />
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {aiInitLoading && visibleAiMessages.length === 0 ? (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-surface" />
              <div className="h-20 animate-pulse rounded-2xl bg-surface" />
            </div>
          ) : visibleAiMessages.length > 0 ? (
            <div className="space-y-4">
              {visibleAiMessages.map((message) => {
                const assistant = message.role.toLowerCase().includes('assistant');
                return (
                  <div
                    key={message.id}
                    className={`flex min-w-0 gap-4 sm:gap-5 ${assistant ? '' : 'justify-end'}`}
                  >
                    {assistant ? (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-10 sm:w-10">
                        <Brain className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={iconStroke} aria-hidden />
                      </div>
                    ) : null}
                    <div
                      className={`min-w-0 max-w-3xl flex-1 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 ${
                        assistant
                          ? 'rounded-tl-md border border-violet-100 bg-violet-50/90 dark:border-violet-800/60 dark:bg-violet-950/55'
                          : 'rounded-tr-md border border-card-border bg-surface dark:border-zinc-700 dark:bg-zinc-900/60'
                      }`}
                    >
                      <p className="text-base leading-relaxed text-foreground sm:text-[15px] sm:leading-relaxed">
                        {message.content}
                      </p>
                      {message.createdAt ? (
                        <p className="mt-4 text-xs font-medium text-text-muted sm:text-[11px]">
                          {message.createdAt}
                        </p>
                      ) : null}
                    </div>
                    {!assistant ? (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-foreground ring-1 ring-card-border sm:h-10 sm:w-10">
                        <Users className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={iconStroke} aria-hidden />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-card-border bg-surface px-5 py-8 text-center">
              <p className="text-base font-semibold text-foreground">
                The assistant is ready to help with offering structure, compliance, and investor strategy.
              </p>
              <p className="mt-2 text-base text-text-muted">
                Initialize the assistant or send your first message to start a live thread.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1 sm:gap-3.5">
            {aiSuggestedPrompts.length > 0
              ? aiSuggestedPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => void handleAiSend(prompt.text)}
                    disabled={isSendingAi}
                    className="max-w-full rounded-full border border-card-border bg-surface px-5 py-2.5 text-left text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-violet-50/80 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/40"
                  >
                    {prompt.text}
                  </button>
                ))
              : [
                  'What offering structure is best for my next SPV?',
                  'Generate an investor-ready summary for my live asset.',
                  'Review my cap table and flag concentration risk.',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setAiDraft(prompt)}
                    className="max-w-full rounded-full border border-card-border bg-surface px-5 py-2.5 text-left text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-violet-50/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/40"
                  >
                    {prompt}
                  </button>
                ))}
          </div>
        </div>

        <div className="border-t border-card-border p-5 sm:p-8 md:px-10 md:pb-10 md:pt-2">
          <div className="relative flex items-center gap-3 rounded-2xl border border-card-border bg-surface pl-5 pr-3 py-3 sm:rounded-3xl sm:pl-6 sm:pr-3 sm:py-3.5 dark:border-zinc-700 dark:bg-zinc-900/60">
            <input
              type="text"
              value={aiDraft}
              onChange={(event) => setAiDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleAiSend();
                }
              }}
              placeholder="Ask about offering structure, pricing, compliance, investor insights..."
              className="min-w-0 flex-1 bg-transparent py-0.5 text-base text-foreground outline-none placeholder:text-text-muted sm:text-[15px]"
            />
            <button
              type="button"
              onClick={() => void handleAiSend()}
              disabled={!aiDraft.trim() || isSendingAi}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:h-12 sm:w-12"
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={iconStroke} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-full min-w-0 space-y-6 animate-in fade-in duration-700 sm:space-y-8 xl:space-y-10">
        <header className="-mx-5 mb-6 flex flex-col gap-3 px-5 py-4 sm:-mx-6 sm:px-6 md:-mx-8 md:mb-8 md:flex md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-0 lg:mb-10">
          <div className="flex min-w-0 flex-col gap-0.5 md:flex-row md:items-baseline md:gap-2.5">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">Issuer Hub</h1>
            <span className="truncate text-base font-semibold text-primary">
              {overviewSummary?.organizationName?.trim() || 'Issuer Hub'}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end md:gap-4">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">
                {overviewSummary?.updatedAt
                  ? `Updated ${formatHubUpdatedAt(overviewSummary.updatedAt)}`
                  : 'Updated —'}
              </span>
            </div>
            <div className="relative w-full min-w-0 md:w-auto md:max-w-[16rem]">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={hubSearchValue}
                onChange={(event) => onHubSearchChange(event.target.value)}
                placeholder={hubSearchPlaceholder}
                className="h-9 w-full rounded-full border border-card-border bg-card py-1.5 pl-9 pr-4 text-base text-foreground outline-none focus:border-primary md:w-64"
              />
            </div>
          </div>
        </header>

        <div className="-mx-1 flex max-w-full min-w-0 overflow-x-auto border-b border-border">
          {HUB_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 transition-colors sm:px-6 ${
                  active
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent font-medium text-text-muted hover:text-foreground'
                }`}
              >
                <TabIcon Icon={tab.icon} active={active} />
                <span className="whitespace-nowrap text-base">{tab.name}</span>
                {tab.showDot ? (
                  <span
                    className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary ring-2 ring-card"
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="min-h-[60vh] min-w-0 max-w-full">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'assets' && renderAssets()}
          {activeTab === 'investors' && renderInvestors()}
          {activeTab === 'cap-table' && renderCapTable()}
          {activeTab === 'compliance' && renderCompliance()}
          {activeTab === 'distributions' && <HubDistributionsTab />}
          {/* {activeTab === 'analytics' && renderAnalytics()} */}
          {activeTab === 'ai-assistant' && renderAiAssistant()}
        </div>
      </div>
    </DashboardLayout>
  );
}
