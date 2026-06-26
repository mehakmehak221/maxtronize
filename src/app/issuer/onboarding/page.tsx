'use client';

import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hexagon, Triangle, type LucideIcon } from 'lucide-react';
import Badge from '@/app/components/ui/Badge';
import OnboardingLayout from '@/components/OnboardingLayout';
import {
  OnboardingProvider,
  useOnboarding,
} from '@/components/onboarding/OnboardingContext';
import { OnboardingCoverImageUpload } from '@/components/onboarding/OnboardingCoverImageUpload';
import { OnboardingDocumentUpload } from '@/components/onboarding/OnboardingDocumentUpload';
import { resolveOnboardingApplicationStatus } from '@/lib/onboarding';
import {
  onboardingFieldError,
  validateOnboardingForSubmit,
  validateOnboardingStart,
  validateOnboardingStep,
  type OnboardingFormSnapshot,
} from '@/lib/onboardingValidation';
import { resolveStoragePublicUrl } from '@/lib/storageUrl';
import { useIsClient } from '@/hooks/useIsClient';
import {
  buildOnboardingWizardInitialState,
  type OnboardingWizardFormState,
} from '@/lib/onboardingWizardInitialState';

const iconStroke = 1.75;

type AssetType = 'real-estate' | 'private-credit' | 'data-centers' | 'commodities';

const ONBOARDING_ASSET_TYPES: {
  id: AssetType;
  name: string;
  icon: React.ReactNode;
  sub: string;
}[] = [
    { id: 'real-estate', name: 'Real Estate', icon: <IconBuilding className="w-6 h-6" />, sub: 'Commercial, residential, industrial' },
    { id: 'private-credit', name: 'Private Credit', icon: <IconCard className="w-6 h-6" />, sub: 'Loans, bonds, structured credit' },
    { id: 'data-centers', name: 'Data Centers', icon: <IconMonitor className="w-6 h-6" />, sub: 'Colocation, hyperscale, edge' },
    { id: 'commodities', name: 'Commodities', icon: <IconDiamond className="w-6 h-6" />, sub: 'Gold, silver, oil, agricultural' },
  ];

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function IconCard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function IconMonitor({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IconDiamond({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l8 8-8 8-8-8 8-8z" />
    </svg>
  );
}

function EthereumNetworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5.28 17.256L1.04308e-06 8.64001L5.28 1.14441e-05H6.192L11.472 8.64001L6.192 17.256H5.28ZM2.304 7.82401H9.192L5.736 2.06401L2.304 7.82401ZM5.736 15.216L9.192 9.45601H2.304L5.736 15.216Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Application Summary row — mint badge + forest stroke icons */
function ApplicationSummaryIconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-700 shadow-sm">
      {children}
    </div>
  );
}

function IconShieldOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

function IconCubeOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12"
      />
    </svg>
  );
}

function IconDocumentOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function IconTrendingUpOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function IconCpuChipOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function IconLockClosedOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function OnboardingStartFallback() {
  return (
    <OnboardingLayout currentStep={1}>
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-base text-ui-muted-text">Loading tokenization wizard…</p>
      </div>
    </OnboardingLayout>
  );
}

function formatStepValidationBannerMessage(
  message: string | null,
  fieldErrors: Record<string, string>,
): string | null {
  if (!message) return null;

  const normalizedMessage = message.trim();
  const inlineFieldErrorCount = Object.entries(fieldErrors).filter(
    ([key, fieldMessage]) => key !== '_form' && fieldMessage.trim().length > 0,
  ).length;

  // When fields already show rule-specific errors inline, suppress the banner
  // entirely to avoid duplicate / redundant messaging on screen.
  if (inlineFieldErrorCount > 0) {
    return null;
  }

  return normalizedMessage;
}

function StepValidationBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-base text-rose-900"
    >
      <p className="font-medium text-rose-800">{message}</p>
    </div>
  );
}

function FormField({
  id,
  label,
  placeholder,
  required,
  fullWidth,
  isSelect,
  hint,
  value,
  onChange,
  options,
  inputType = 'text',
  error,
}: {
  id?: string;
  label: string;
  placeholder: string;
  required?: boolean;
  fullWidth?: boolean;
  isSelect?: boolean;
  hint?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: { label: string; value: string }[];
  inputType?: string;
  error?: string;
}) {
  const { isApprovedOrLocked } = useOnboarding();
  const borderClass = error ? 'border-rose-400' : 'border-ui-border';

  return (
    <div className={`space-y-3 ${fullWidth ? 'md:col-span-2' : ''}`}>
      {label ? (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-ui-faint cursor-pointer">
          <span className="inline-flex items-center gap-1.5">
            {label}
            {required ? (
              <span className="text-ui-danger-text font-bold">*</span>
            ) : (
              <span className="normal-case tracking-normal text-[10px] font-semibold text-ui-faint/70 ml-1">(Optional)</span>
            )}
          </span>
        </label>
      ) : null}
      {hint ? <p className={`text-xs text-ui-faint leading-relaxed ${label ? '' : '-mt-1'}`}>{hint}</p> : null}
      <div className="relative">
        {options ? (
          <select
            id={id}
            value={value ?? ''}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            disabled={isApprovedOrLocked}
            className={`w-full min-w-0 px-4 py-4 leading-normal bg-ui-input border rounded-2xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-base text-foreground placeholder:text-ui-placeholder font-medium sm:px-6 appearance-none disabled:opacity-75 disabled:cursor-not-allowed ${borderClass}`}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            disabled={isApprovedOrLocked}
            className={`w-full min-w-0 px-4 py-4 leading-normal bg-ui-input border rounded-2xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-base text-foreground placeholder:text-ui-placeholder font-medium sm:px-6 disabled:opacity-75 disabled:cursor-not-allowed ${borderClass}`}
          />
        )}
        {(isSelect || options) && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-ui-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
      {error ? <p className="text-base font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

function FileUploadField({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-ui-faint uppercase tracking-widest">{label}</label>
      <div className="p-6 border-2 border-dashed border-ui-border rounded-3xl bg-ui-muted-surface flex flex-col items-center justify-center gap-2 hover:bg-ui-muted-deep hover:border-ui-border-strong transition-all cursor-pointer group">
        <p className="text-xs font-bold text-ui-faint uppercase tracking-wide group-hover:text-ui-muted-text transition-colors">{sub}</p>
        <p className="text-xs font-bold text-primary group-hover:underline">Click to upload PDF / JPG</p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingStartFallback />}>
      <OnboardingProvider>
        <IssuerOnboardingWizard />
      </OnboardingProvider>
    </Suspense>
  );
}

type IssuerOnboardingStartPageProps = {
  selectedAssetType: AssetType;
  onSelectedAssetTypeChange: (type: AssetType) => void;
  startAssetName: string;
  onStartAssetNameChange: (value: string) => void;
  startCoverFile: File | null;
  onStartCoverFileChange: (file: File | null) => void;
  coverImageKey: string | null;
  coverImageUrl: string | null;
  onCoverImageKeyChange: (key: string | null) => void;
  onCoverImageUrlChange: (url: string | null) => void;
  isStartingSession: boolean;
  onIsStartingSessionChange: (value: boolean) => void;
  stepValidationBannerMessage: string | null;
  fieldError: (key: string) => string | undefined;
  onClearStartFieldError: (key: string) => void;
  onValidationFail: (fieldErrors: Record<string, string>, message: string) => void;
  onboardingSessionMissing: boolean;
};

function IssuerOnboardingStartPage({
  selectedAssetType,
  onSelectedAssetTypeChange,
  startAssetName,
  onStartAssetNameChange,
  startCoverFile,
  onStartCoverFileChange,
  coverImageKey,
  coverImageUrl,
  onCoverImageKeyChange,
  onCoverImageUrlChange,
  isStartingSession,
  onIsStartingSessionChange,
  stepValidationBannerMessage,
  fieldError,
  onClearStartFieldError,
  onValidationFail,
  onboardingSessionMissing,
}: IssuerOnboardingStartPageProps) {
  const router = useRouter();
  const { forceStartOnboardingSession, saveError } = useOnboarding();

  async function handleStartOnboarding() {
    const startValidation = validateOnboardingStart({ startAssetName });
    if (!startValidation.success) {
      onValidationFail(startValidation.fieldErrors, startValidation.message);
      return;
    }
    onIsStartingSessionChange(true);
    const started = await forceStartOnboardingSession({
      assetType: selectedAssetType,
      assetName: startAssetName.trim(),
      coverFile: startCoverFile,
      coverImageKey: coverImageKey ?? undefined,
      coverImageUrl: coverImageUrl ?? undefined,
    });
    if (!started?.id) {
      onIsStartingSessionChange(false);
      return;
    }
    onIsStartingSessionChange(false);
    router.replace('/issuer/onboarding');
  }

  return (
    <OnboardingLayout currentStep={0}>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <div className="mb-6">
            <Link
              href="/issuer/dashboard"
              className="inline-flex items-center gap-2 text-base font-semibold text-[#6B7280] hover:text-[#7C3AED] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
            New tokenization
          </p>
          <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">
            Tokenize a new asset
          </h1>
          <p className="text-ui-muted-text text-base">
            Each asset gets its own onboarding draft. Submit one application, then come back here
            anytime to tokenize another asset.
          </p>
        </header>

        {onboardingSessionMissing ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            Your previous onboarding draft could not be found. Start a new application below.
          </p>
        ) : null}

        <StepValidationBanner message={stepValidationBannerMessage} />

        <section className="bg-ui-card border border-ui-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-base font-bold text-ui-strong mb-1">Asset type</h3>
          <p className="text-base text-ui-faint mb-8">Select the category of asset you are tokenizing.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ONBOARDING_ASSET_TYPES.map((type) => (
              <button
                type="button"
                key={type.id}
                onClick={() => onSelectedAssetTypeChange(type.id)}
                className={`relative flex h-full min-h-[168px] flex-col items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all ${selectedAssetType === type.id
                  ? 'border-primary bg-ui-accent-tint'
                  : 'border-ui-border bg-ui-card hover:border-ui-border-strong'
                  }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${selectedAssetType === type.id ? 'bg-ui-card' : 'bg-ui-muted-deep'
                    }`}
                >
                  {type.icon}
                </div>
                <div className="min-w-0 w-full">
                  <p
                    className={`mb-1 text-base font-bold leading-snug ${selectedAssetType === type.id ? 'text-primary' : 'text-ui-strong'
                      }`}
                  >
                    {type.name}
                  </p>
                  <p className="text-xs leading-relaxed text-ui-faint">{type.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm space-y-8">
          <h3 className="text-base font-bold text-ui-strong">Asset details</h3>
          <div className="grid grid-cols-1 gap-8">
            <FormField
              id="startAssetName"
              label="Asset name"
              placeholder="Palm Jumeirah Residences SPV"
              required
              fullWidth
              value={startAssetName}
              error={fieldError('startAssetName')}
              onChange={(value) => {
                onStartAssetNameChange(value);
                onClearStartFieldError('startAssetName');
              }}
            />
            <OnboardingCoverImageUpload
              pendingFile={startCoverFile}
              onPendingFileChange={onStartCoverFileChange}
              coverImageKey={coverImageKey}
              coverImageUrl={coverImageUrl}
              onCoverImageKeyChange={onCoverImageKeyChange}
              onCoverImageUrlChange={onCoverImageUrlChange}
              uploadOnSelect={false}
              assetType={selectedAssetType}
              assetName={startAssetName}
            />
          </div>
        </section>

        {saveError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-800">
            {saveError}
          </p>
        ) : null}

        <div className="flex justify-end border-t border-ui-border pt-6">
          <button
            type="button"
            onClick={() => void handleStartOnboarding()}
            disabled={isStartingSession || !startAssetName.trim()}
            className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
          >
            {isStartingSession ? 'Starting draft…' : 'Start onboarding →'}
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}

function IssuerOnboardingWizard() {
  const {
    onboardingId,
    isReady,
    isLoading,
    onboardingSessionMissing,
    forceFreshStart,
    progressStep,
    onboardingState,
    hydratedRegulation,
    hydratedAssetType,
    hydratedCustodian,
    hydratedAccreditedOnly,
    hydratedVerificationMethod,
    hydratedAssetForm,
    hydratedCustodyForm,
    hydratedEntityForm,
    hydratedLegalForm,
    hydratedOfferingForm,
    hydratedTokenizationForm,
    clearSaveError,
  } = useOnboarding();

  const isClientReady = useIsClient();
  const isPageReady = isClientReady && isReady;
  const onStartPage =
    isPageReady &&
    (forceFreshStart || !onboardingId || onboardingSessionMissing);

  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>('real-estate');
  const [startAssetName, setStartAssetName] = useState('');
  const [startCoverFile, setStartCoverFile] = useState<File | null>(null);
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [stepValidation, setStepValidation] = useState<{
    step: number;
    fieldErrors: Record<string, string>;
    message: string | null;
  } | null>(null);
  const lastStartFormResetKeyRef = useRef<string | null>(null);

  const startFormResetKey = `${forceFreshStart ? '1' : '0'}:${onboardingId ?? ''}:${onboardingSessionMissing ? '1' : '0'}`;

  useEffect(() => {
    if (!isPageReady || !onStartPage) return;
    if (lastStartFormResetKeyRef.current === startFormResetKey) return;
    lastStartFormResetKeyRef.current = startFormResetKey;
    setStartAssetName('');
    setCoverImageKey(null);
    setCoverImageUrl(null);
    setStartCoverFile(null);
    clearSaveError();
  }, [clearSaveError, isPageReady, onStartPage, startFormResetKey]);

  const validationAppliesToView =
    stepValidation != null && onStartPage && stepValidation.step === 0;

  useEffect(() => {
    if (validationAppliesToView && stepValidation && stepValidation.fieldErrors) {
      const firstErrorKey = Object.keys(stepValidation.fieldErrors)[0];
      if (firstErrorKey) {
        const timer = setTimeout(() => {
          const element = document.getElementById(firstErrorKey);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus({ preventScroll: true });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [stepValidation, validationAppliesToView]);
  const stepValidationMessage = validationAppliesToView ? stepValidation.message : null;
  const stepValidationBannerMessage = formatStepValidationBannerMessage(
    stepValidationMessage,
    validationAppliesToView ? stepValidation.fieldErrors : {},
  );
  const fieldError = (key: string) =>
    validationAppliesToView ? onboardingFieldError(stepValidation.fieldErrors, key) : undefined;

  const draftWizardKey =
    isPageReady && !onStartPage && Boolean(onboardingId) && !isLoading
      ? `${onboardingId}:${progressStep ?? onboardingState?.currentStep ?? 1}`
      : null;

  if (!isPageReady) {
    return (
      <OnboardingLayout currentStep={0}>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-base text-ui-muted-text">Loading…</p>
        </div>
      </OnboardingLayout>
    );
  }

  if (onStartPage) {
    return (
      <IssuerOnboardingStartPage
        selectedAssetType={selectedAssetType}
        onSelectedAssetTypeChange={setSelectedAssetType}
        startAssetName={startAssetName}
        onStartAssetNameChange={setStartAssetName}
        startCoverFile={startCoverFile}
        onStartCoverFileChange={setStartCoverFile}
        coverImageKey={coverImageKey}
        coverImageUrl={coverImageUrl}
        onCoverImageKeyChange={setCoverImageKey}
        onCoverImageUrlChange={setCoverImageUrl}
        isStartingSession={isStartingSession}
        onIsStartingSessionChange={setIsStartingSession}
        stepValidationBannerMessage={stepValidationBannerMessage}
        fieldError={fieldError}
        onClearStartFieldError={(key) => {
          setStepValidation((prev) => {
            if (!prev?.fieldErrors[key]) return prev;
            const nextErrors = { ...prev.fieldErrors };
            delete nextErrors[key];
            if (Object.keys(nextErrors).length === 0) return null;
            return { ...prev, fieldErrors: nextErrors };
          });
        }}
        onValidationFail={(fieldErrors, message) => {
          setStepValidation({ step: 0, fieldErrors, message });
        }}
        onboardingSessionMissing={onboardingSessionMissing}
      />
    );
  }

  if (isLoading && Boolean(onboardingId)) {
    return (
      <OnboardingLayout currentStep={0}>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-base text-ui-muted-text">Loading onboarding draft…</p>
        </div>
      </OnboardingLayout>
    );
  }

  if (!draftWizardKey) {
    return (
      <OnboardingLayout currentStep={0}>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-base text-ui-muted-text">Loading…</p>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <IssuerOnboardingWizardForm
      key={draftWizardKey}
      initialState={buildOnboardingWizardInitialState({
        hydratedEntityForm,
        hydratedRegulation,
        hydratedAssetType,
        hydratedCustodian,
        hydratedAccreditedOnly,
        hydratedVerificationMethod,
        hydratedAssetForm,
        hydratedCustodyForm,
        hydratedLegalForm,
        hydratedOfferingForm,
        hydratedTokenizationForm,
        progressStep,
        onboardingCurrentStep: onboardingState?.currentStep,
      })}
    />
  );
}

function IssuerOnboardingWizardForm({
  initialState,
}: {
  initialState: OnboardingWizardFormState;
}) {
  const router = useRouter();
  const {
    onboardingId,
    isLoading,
    isSaving,
    saveError,
    isSessionTerminal,
    clearSaveError,
    coverImageKeyFromAsset,
    coverImageUrlFromAsset,
    progress,
    review,
    onboardingState,
    isApprovedOrLocked,
    saveEntityDraft,
    saveAccreditationDraft,
    saveAssetDraft,
    saveLegalDraft,
    saveOfferingDraft,
    saveTokenizationDraft,
    saveCustodyDraft,
    submitApplication,
    documents,
  } = useOnboarding();

  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [stepValidation, setStepValidation] = useState<{
    step: number;
    fieldErrors: Record<string, string>;
    message: string | null;
  } | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(initialState.selectedAssetType);
  const [selectedReg, setSelectedReg] = useState(initialState.selectedReg);
  const [selectedTokenStandard, setSelectedTokenStandard] = useState(initialState.selectedTokenStandard);
  const [selectedNetwork, setSelectedNetwork] = useState(initialState.selectedNetwork);
  const [selectedCustodian, setSelectedCustodian] = useState(initialState.selectedCustodian);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);

  const [legalCompanyName, setLegalCompanyName] = useState(initialState.legalCompanyName);
  const [entityType, setEntityType] = useState(initialState.entityType);
  const [ein, setEin] = useState(initialState.ein);
  const [businessAddress, setBusinessAddress] = useState(initialState.businessAddress);
  const [directorsNotes, setDirectorsNotes] = useState(initialState.directorsNotes);
  const [ubosNotes, setUbosNotes] = useState(initialState.ubosNotes);
  const [spvEntityName, setSpvEntityName] = useState(initialState.spvEntityName);
  const [spvJurisdiction, setSpvJurisdiction] = useState(initialState.spvJurisdiction);
  const [retainedOwnership, setRetainedOwnership] = useState(initialState.retainedOwnership);
  const [proRataDistributions, setProRataDistributions] = useState(initialState.proRataDistributions);
  const [votingRights, setVotingRights] = useState(initialState.votingRights);
  const [liquidationPreference, setLiquidationPreference] = useState(initialState.liquidationPreference);
  const [informationRights, setInformationRights] = useState(initialState.informationRights);
  const [targetRaiseAmount, setTargetRaiseAmount] = useState(initialState.targetRaiseAmount);
  const [minimumInvestment, setMinimumInvestment] = useState(initialState.minimumInvestment);
  const [maximumInvestors, setMaximumInvestors] = useState(initialState.maximumInvestors);
  const [offeringCurrency, setOfferingCurrency] = useState(initialState.offeringCurrency);
  const [offeringOpenDate, setOfferingOpenDate] = useState(initialState.offeringOpenDate);
  const [offeringCloseDate, setOfferingCloseDate] = useState(initialState.offeringCloseDate);
  const [firstYieldDate, setFirstYieldDate] = useState(initialState.firstYieldDate);
  const [distributionFrequency, setDistributionFrequency] = useState(initialState.distributionFrequency);
  const [lockupPeriod, setLockupPeriod] = useState(initialState.lockupPeriod);
  const [secondaryMarket, setSecondaryMarket] = useState(initialState.secondaryMarket);
  const [tokenName, setTokenName] = useState(initialState.tokenName);
  const [tokenSymbol, setTokenSymbol] = useState(initialState.tokenSymbol);
  const [totalSupply, setTotalSupply] = useState(initialState.totalSupply);
  const [tokenPrice, setTokenPrice] = useState(initialState.tokenPrice);
  const [accreditedOnly, setAccreditedOnly] = useState(initialState.accreditedOnly);
  const [verificationMethod, setVerificationMethod] = useState(initialState.verificationMethod);
  const [coverImageKey, setCoverImageKey] = useState<string | null>(initialState.coverImageKey);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initialState.coverImageUrl);
  const [assetName, setAssetName] = useState(initialState.assetName);
  const [assetDescription, setAssetDescription] = useState(initialState.assetDescription);
  const [assetAddress, setAssetAddress] = useState(initialState.assetAddress);
  const [assetAppraisal, setAssetAppraisal] = useState(initialState.assetAppraisal);
  const [assetIncome, setAssetIncome] = useState(initialState.assetIncome);
  const [assetMetadata, setAssetMetadata] = useState<Record<string, string>>(initialState.assetMetadata);
  const [coldStorageRatio, setColdStorageRatio] = useState(initialState.coldStorageRatio);
  const [multiSigConfig, setMultiSigConfig] = useState(initialState.multiSigConfig);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean[]>(initialState.acceptedTerms);

  const entityDocumentTypes = useMemo(
    () =>
      documents
        .map((doc) => doc.type)
        .filter((type): type is string => Boolean(type)),
    [documents],
  );

  // Auto-redirect to dashboard after successful submission
  useEffect(() => {
    if (!isSubmitted) return;
    const DURATION_MS = 4000;
    const TICK_MS = 40;
    const totalSteps = DURATION_MS / TICK_MS;
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      const pct = Math.min((step / totalSteps) * 100, 100);
      setRedirectProgress(pct);
      if (step >= totalSteps) {
        window.clearInterval(timer);
        router.push('/issuer/dashboard');
      }
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [isSubmitted, router]);

  // Automatically scroll to and focus the first invalid field when validation is triggered
  useEffect(() => {
    if (stepValidation && stepValidation.fieldErrors && stepValidation.step === currentStep) {
      const firstErrorKey = Object.keys(stepValidation.fieldErrors)[0];
      if (firstErrorKey) {
        const timer = setTimeout(() => {
          const element = document.getElementById(firstErrorKey);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus({ preventScroll: true });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [stepValidation, currentStep]);

  const clearFieldError = (key: string) => {
    setStepValidation((prev) => {
      if (!prev?.fieldErrors[key]) return prev;
      const nextErrors = { ...prev.fieldErrors };
      delete nextErrors[key];
      if (Object.keys(nextErrors).length === 0) return null;
      return { ...prev, fieldErrors: nextErrors };
    });
  };

  function buildFormSnapshot(): OnboardingFormSnapshot {
    return {
      startAssetName: assetName,
      legalCompanyName,
      entityType,
      ein,
      businessAddress,
      directorsNotes,
      ubosNotes,
      entityDocumentTypes,
      selectedReg,
      verificationMethod,
      selectedAssetType,
      assetName,
      assetAddress,
      assetAppraisal,
      assetMetadata,
      spvEntityName,
      spvJurisdiction,
      retainedOwnership,
      targetRaiseAmount,
      minimumInvestment,
      offeringOpenDate,
      offeringCloseDate,
      tokenName,
      tokenSymbol,
      totalSupply,
      tokenPrice,
      selectedCustodian,
      coldStorageRatio,
      multiSigConfig,
      acceptedTerms,
    };
  }

  function applyStepValidation(step: number): boolean {
    const result = validateOnboardingStep(step, buildFormSnapshot());
    if (result.success) {
      setStepValidation(null);
      return true;
    }
    setStepValidation({
      step,
      fieldErrors: result.fieldErrors,
      message: result.message,
    });
    return false;
  }

  const validationAppliesToView =
    stepValidation != null && stepValidation.step === currentStep;

  const activeFieldErrors = validationAppliesToView ? stepValidation.fieldErrors : {};
  const stepValidationMessage = validationAppliesToView ? stepValidation.message : null;
  const stepValidationBannerMessage = formatStepValidationBannerMessage(
    stepValidationMessage,
    activeFieldErrors,
  );

  const fieldError = (key: string) => onboardingFieldError(activeFieldErrors, key);

  async function advanceFromEntity() {
    if (!applyStepValidation(1)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveEntityDraft({
        legalCompanyName,
        entityType,
        ein,
        businessAddress,
        directorsNotes,
        ubosNotes,
      });
      if (!ok) return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function advanceFromAccreditation() {
    if (!applyStepValidation(2)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveAccreditationDraft({
        regulation: selectedReg,
        accreditedOnly,
        verificationMethod,
      });
      if (!ok) return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function advanceFromAsset() {
    if (!applyStepValidation(3)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveAssetDraft({
        assetType: selectedAssetType,
        name: assetName || undefined,
        description: assetDescription || undefined,
        address: assetAddress || undefined,
        appraisalValue: assetAppraisal || undefined,
        annualIncome: assetIncome || undefined,
        metadata: {
          ...assetMetadata,
          ...(coverImageKey ? { coverImageKey } : {}),
          ...(resolveStoragePublicUrl(coverImageKey, coverImageUrl)
            ? { coverImageUrl: resolveStoragePublicUrl(coverImageKey, coverImageUrl) }
            : {}),
        },
      });
      if (!ok) return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function advanceFromCustody() {
    if (!applyStepValidation(7)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveCustodyDraft({
        custodian: selectedCustodian,
        coldStorageRatio,
        multiSigConfig,
      });
      if (!ok) return;
    }
    setCurrentStep(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function advanceFromLegal() {
    if (!applyStepValidation(4)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveLegalDraft({
        spvEntityName,
        jurisdiction: spvJurisdiction,
        retainedOwnershipPercent: retainedOwnership,
        proRataDistributions,
        votingRights,
        liquidationPreference,
        informationRights,
      });
      if (!ok) return;
    }
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function advanceFromOffering() {
    if (!applyStepValidation(5)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveOfferingDraft(
        {
          targetRaiseAmount,
          minimumInvestment,
          maximumInvestors,
          currency: offeringCurrency,
          offeringOpenDate,
          offeringCloseDate,
          firstYieldDate,
          distributionFrequency,
          lockupPeriod,
          secondaryMarket,
        },
        selectedReg,
      );
      if (!ok) return;
    }
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function advanceFromTokenization() {
    if (!applyStepValidation(6)) return;
    if (onboardingId && !isApprovedOrLocked) {
      const ok = await saveTokenizationDraft({
        tokenName,
        tokenSymbol,
        totalSupply,
        tokenPrice,
        tokenStandard: selectedTokenStandard,
        blockchainNetwork: selectedNetwork,
        contractAddress: '',
      });
      if (!ok) return;
    }
    setCurrentStep(7);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmitApplication() {
    if (isApprovedOrLocked) {
      router.push('/issuer/dashboard');
      return;
    }
    const submitValidation = validateOnboardingForSubmit(buildFormSnapshot());
    if (!submitValidation.success) {
      setStepValidation({
        step: submitValidation.firstInvalidStep,
        fieldErrors: submitValidation.fieldErrors,
        message: submitValidation.message,
      });
      setCurrentStep(submitValidation.firstInvalidStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }


    if (onboardingId && !isApprovedOrLocked) {
      const saves = await Promise.all([
        saveEntityDraft({ legalCompanyName, entityType, ein, businessAddress, directorsNotes, ubosNotes }),
        saveAccreditationDraft({ regulation: selectedReg, accreditedOnly, verificationMethod }),
        saveAssetDraft({
          assetType: selectedAssetType,
          name: assetName || undefined,
          description: assetDescription || undefined,
          address: assetAddress || undefined,
          appraisalValue: assetAppraisal || undefined,
          annualIncome: assetIncome || undefined,
          metadata: {
            ...assetMetadata,
            ...(coverImageKey ? { coverImageKey } : {}),
            ...(resolveStoragePublicUrl(coverImageKey, coverImageUrl)
              ? { coverImageUrl: resolveStoragePublicUrl(coverImageKey, coverImageUrl) }
              : {}),
          },
        }),
        saveLegalDraft({ spvEntityName, jurisdiction: spvJurisdiction, retainedOwnershipPercent: retainedOwnership, proRataDistributions, votingRights, liquidationPreference, informationRights }),
        saveOfferingDraft({ targetRaiseAmount, minimumInvestment, maximumInvestors, currency: offeringCurrency, offeringOpenDate, offeringCloseDate, firstYieldDate, distributionFrequency, lockupPeriod, secondaryMarket }, selectedReg),
        saveTokenizationDraft({ tokenName, tokenSymbol, totalSupply, tokenPrice, tokenStandard: selectedTokenStandard, blockchainNetwork: selectedNetwork, contractAddress: '' }),
        saveCustodyDraft({ custodian: selectedCustodian, coldStorageRatio, multiSigConfig }),
      ]);
      if (saves.some((ok) => !ok)) return;
    }

    if (onboardingId) {
      const ok = await submitApplication();
      if (!ok) return;
    }
    setIsSubmitted(true);
  }

  function beginAnotherAsset() {
    clearSaveError();
    router.replace('/issuer/onboarding?start=1');
  }

  const assetDetailsTitle: Record<AssetType, string> = {
    'real-estate': 'Real Estate',
    'private-credit': 'Private Credit',
    'data-centers': 'Data Center',
    'commodities': 'Commodity',
  };

  const applicationStatus = useMemo(
    () =>
      resolveOnboardingApplicationStatus(
        [
          onboardingState?.status,
          progress?.status,
          review?.status,
        ],
        { forceUnderReview: isSubmitted },
      ),
    [
      isSubmitted,
      onboardingState?.status,
      progress?.status,
      review?.status,
    ],
  );

  const reviewSummaryItems = review?.sections?.length
    ? review.sections.map((section, index) => ({
      name: section.title,
      sub: section.subtitle,
      step: index + 1,
    }))
    : [
      {
        name: 'Entity Setup',
        sub: [legalCompanyName, entityType, ein].filter(Boolean).join(' · ') || 'Not provided',
        step: 1,
      },
      {
        name: 'Accreditation',
        sub: `${selectedReg} · ${accreditedOnly ? 'Accredited investors only' : 'Open to eligible investors'}`,
        step: 2,
      },
      {
        name: 'Asset Details',
        sub: [selectedAssetType, assetAddress, assetAppraisal && `$${assetAppraisal} valuation`].filter(Boolean).join(' · '),
        step: 3,
      },
      {
        name: 'Legal Structure',
        sub: [spvEntityName, spvJurisdiction].filter(Boolean).join(' · ') || 'SPV configuration',
        step: 4,
      },
      {
        name: 'Offering Setup',
        sub: [targetRaiseAmount && `$${targetRaiseAmount} target`, minimumInvestment && `$${minimumInvestment} minimum`].filter(Boolean).join(' · '),
        step: 5,
      },
      {
        name: 'Tokenization',
        sub: [tokenSymbol, selectedTokenStandard, selectedNetwork].filter(Boolean).join(' · '),
        step: 6,
      },
      {
        name: 'Custody',
        sub: `${selectedCustodian} · ${coldStorageRatio}% cold · ${multiSigConfig}`,
        step: 7,
      },
    ];

  const renderStep1 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
          Step 1 of 8 - Entity Setup
        </p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Entity Setup</h1>
        <p className="text-ui-muted-text text-base">Provide your entity details for Know Your Business (KYB) verification.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      <div className="bg-alert-info-bg border border-alert-info-border rounded-2xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-alert-info-title">Know Your Business (KYB)</h4>
          <p className="text-base text-alert-info-body leading-relaxed">
            We verify your entity against FinCEN, EDGAR, and state corporate registries. This typically takes 1–2 business days. All data is encrypted at rest.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-base font-bold text-ui-strong">Entity Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <FormField
              id="legalCompanyName"
              label="Legal Company Name"
              placeholder="Crescent Capital Partners LLC"
              required
              fullWidth
              value={legalCompanyName}
              error={fieldError('legalCompanyName')}
              onChange={(value) => {
                setLegalCompanyName(value);
                clearFieldError('legalCompanyName');
              }}
            />
            <FormField
              id="entityType"
              label="Entity Type"
              placeholder="LLC"
              required
              value={entityType}
              error={fieldError('entityType')}
              onChange={(value) => {
                setEntityType(value);
                clearFieldError('entityType');
              }}
            />
            <FormField
              id="ein"
              label="Employer Identification Number (EIN)"
              placeholder="82-4519302"
              required
              value={ein}
              error={fieldError('ein')}
              onChange={(value) => {
                setEin(value.replace(/[^\d-]/g, ''));
                clearFieldError('ein');
              }}
            />
            <FormField
              id="businessAddress"
              label="Registered Business Address"
              placeholder="1234 Financial District Blvd, Suite 800, New York, NY 10004"
              required
              fullWidth
              value={businessAddress}
              error={fieldError('businessAddress')}
              onChange={(value) => {
                setBusinessAddress(value);
                clearFieldError('businessAddress');
              }}
            />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-base font-bold text-ui-strong">Directors & UBOs</h3>
          <div className="space-y-6">
            <label className="block space-y-3">
              <span className="text-xs font-bold text-ui-faint uppercase tracking-widest">
                Directors <span className="text-ui-danger-text font-bold">*</span>
              </span>
              <textarea
                id="directorsNotes"
                value={directorsNotes}
                onChange={(e) => {
                  setDirectorsNotes(e.target.value);
                  clearFieldError('directorsNotes');
                }}
                rows={6}
                disabled={isApprovedOrLocked}
                className={`w-full min-h-[160px] px-6 py-4 bg-ui-input border rounded-2xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-base text-foreground placeholder:text-ui-placeholder font-medium resize-y disabled:opacity-75 disabled:cursor-not-allowed ${fieldError('directorsNotes') ? 'border-rose-400' : 'border-ui-border'
                  }`}
                placeholder="Full legal name, title, and identification details for each director or officer."
              />
              {fieldError('directorsNotes') ? (
                <p className="text-base font-medium text-rose-600">{fieldError('directorsNotes')}</p>
              ) : null}
            </label>
            <label className="block space-y-3">
              <span className="text-xs font-bold text-ui-faint uppercase tracking-widest">
                Ultimate Beneficial Owners (UBOs) <span className="text-ui-danger-text font-bold">*</span>
              </span>
              <textarea
                id="ubosNotes"
                value={ubosNotes}
                onChange={(e) => {
                  setUbosNotes(e.target.value);
                  clearFieldError('ubosNotes');
                }}
                rows={5}
                disabled={isApprovedOrLocked}
                className={`w-full min-h-[120px] px-6 py-4 bg-ui-input border rounded-2xl focus:bg-ui-input-focus focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-base text-foreground placeholder:text-ui-placeholder font-medium resize-y disabled:opacity-75 disabled:cursor-not-allowed ${fieldError('ubosNotes') ? 'border-rose-400' : 'border-ui-border'
                  }`}
                placeholder="List each beneficial owner and ownership percentage (must total 100%)."
              />
              {fieldError('ubosNotes') ? (
                <p className="text-base font-medium text-rose-600">{fieldError('ubosNotes')}</p>
              ) : null}
            </label>
          </div>
        </div>
      </section>

      <section id="entityDocuments" className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm space-y-8">
        <h3 className="text-base font-bold text-ui-strong">Supporting Documents</h3>
        {fieldError('entityDocuments') ? (
          <p className="text-base font-medium text-rose-600">{fieldError('entityDocuments')}</p>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OnboardingDocumentUpload
            label="Certificate of Formation / Incorporation"
            documentType="CERTIFICATE_OF_FORMATION"
            required
          />
          <OnboardingDocumentUpload
            label="Operating Agreement"
            documentType="OPERATING_AGREEMENT"
            required
          />
          <OnboardingDocumentUpload
            label="EIN Confirmation Letter"
            documentType="EIN_CONFIRMATION"
            required
          />
          <OnboardingDocumentUpload
            label="Government-Issued ID"
            documentType="GOVERNMENT_ID"
            required
          />
        </div>
      </section>

      <div className="flex justify-end border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => void advanceFromEntity()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
          Step 2 of 8 - Accreditation
        </p>
        <h1 className="text-2xl font-bold text-ui-strong mb-3 tracking-tight sm:text-3xl md:mb-4 md:text-4xl">Accreditation</h1>
        <p className="text-ui-muted-text text-base leading-relaxed">Configure your offering type and investor accreditation requirements.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      <div className="bg-alert-warn-bg border border-alert-warn-border rounded-2xl p-4 flex flex-col gap-4 items-start sm:flex-row sm:gap-5 sm:p-6 md:p-8">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-warn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="text-base font-bold text-alert-warn-title">Important: Regulation Selection</h4>
          <p className="text-base text-alert-warn-body leading-relaxed">
            This selection determines your <span className="font-bold">investor eligibility</span>,{' '}
            <span className="font-bold">marketing restrictions</span>, and ongoing compliance obligations. Consult with legal counsel before proceeding.
            {/* <button type="button" className="font-bold text-[#7C3AED] hover:underline">
              Talk to Compliance
            </button>{' '}
            for guidance. */}
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-2xl p-5 shadow-sm space-y-6 sm:p-6 sm:space-y-8 md:p-8 lg:p-10">
        <div>
          <h3 className="text-base font-bold text-ui-strong mb-1">Select Offering Regulation</h3>
          <p className="text-base text-ui-faint">Choose the exemption under which you will conduct this offering.</p>
        </div>

        <div id="selectedReg" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'reg-d-506b', name: 'Reg D — Rule 506(b)', tag: 'Most Common', sub: 'Up to 35 non-accredited + unlimited accredited investors. No SEC registration. No general solicitation.', checks: ['No SEC filing required', 'Up to 35 non-accredited investors'], crosses: ['No advertising', 'Pre-existing relationships required'] },
            { id: 'reg-d-506c', name: 'Reg D — Rule 506(c)', tag: 'Recommended', sub: 'Unlimited accredited investors only. General solicitation permitted. Must verify accreditation for each investor.', checks: ['General solicitation allowed', 'Unlimited raise size'], crosses: ['Accredited investors only', 'Must verify each investor'] },
            { id: 'reg-s', name: 'Regulation S', tag: 'International', sub: 'Offshore offerings to non-U.S. persons. Complements Reg D for global capital raises. No U.S. investor participation.', checks: ['Global investor access', 'No SEC registration'], crosses: ['U.S. persons excluded', 'Complex compliance'] },
            { id: 'reg-a', name: 'Regulation A+', tag: 'Public Light', sub: 'Mini-IPO structure. Up to $75M per year. Non-accredited investors permitted. Requires SEC qualification.', checks: ['Non-accredited investors permitted', 'Up to $75M raise'], crosses: ['SEC qualification required', 'Higher compliance cost'] }
          ].map((reg) => {
            const isSel = selectedReg === reg.id;
            const is506cBlue = isSel && reg.id === 'reg-d-506c';
            return (
              <div
                key={reg.id}
                onClick={isApprovedOrLocked ? undefined : () => setSelectedReg(reg.id)}
                className={`flex flex-col gap-4 rounded-2xl border-2 p-5 transition-all relative group sm:gap-5 sm:rounded-3xl sm:p-6 md:gap-6 md:p-8 ${isApprovedOrLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                  } ${is506cBlue
                    ? 'border-sky-500 bg-sky-50'
                    : isSel
                      ? 'border-primary bg-ui-accent-tint'
                      : isApprovedOrLocked
                        ? 'border-ui-border bg-ui-card'
                        : 'border-ui-border bg-ui-card hover:border-ui-border-strong'
                  }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
                  <h4 className={`min-w-0 flex-1 text-base font-bold leading-snug ${is506cBlue ? 'text-sky-800' : isSel ? 'text-primary' : 'text-ui-strong'}`}>{reg.name}</h4>
                  <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${is506cBlue
                    ? 'bg-sky-100 text-sky-800 border-sky-200'
                    : isSel
                      ? 'bg-ui-accent-tint text-primary border-primary/20'
                      : 'bg-ui-muted-deep text-ui-faint border-ui-border'
                    }`}>{reg.tag}</span>
                </div>
                <p className="text-xs text-ui-muted-text leading-relaxed">{reg.sub}</p>
                <div className="space-y-2 pt-2 border-t border-ui-divider">
                  {reg.checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-ui-success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-xs font-medium text-ui-body">{c}</span>
                    </div>
                  ))}
                  {reg.crosses.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      <span className="text-xs font-medium text-ui-muted-text">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-ui-card border border-ui-border rounded-2xl p-5 shadow-sm space-y-5 sm:p-6 sm:space-y-6 md:p-8 md:space-y-8 lg:p-10">
        <h3 className="text-base font-bold text-ui-strong">Investor Eligibility</h3>
        <div className="flex flex-col gap-4 rounded-2xl border border-ui-border bg-ui-muted-surface p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-ui-strong mb-1">Accredited Investors Only</p>
            <p className="text-xs leading-relaxed text-ui-faint sm:text-[11px]">
              Restrict this offering to SEC-accredited investors (net worth $1M+ or income $200K+/year).
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={accreditedOnly}
            disabled={isApprovedOrLocked}
            onClick={isApprovedOrLocked ? undefined : () => setAccreditedOnly((v) => !v)}
            className={`relative h-7 w-12 shrink-0 self-end rounded-full shadow-inner transition-colors sm:self-center disabled:opacity-75 disabled:cursor-not-allowed ${accreditedOnly ? 'bg-primary shadow-primary/20' : 'bg-ui-border-strong'
              }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-ui-card shadow-sm transition-all ${accreditedOnly ? 'right-1' : 'left-1'
                }`}
              aria-hidden
            />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <label htmlFor="verificationMethod" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-widest text-ui-faint cursor-pointer">
            <svg className="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <g clipPath="url(#clip0_accred_shield)">
                <path d="M11.6556 7.57612C11.6556 10.49 9.61586 11.947 7.19149 12.792C7.06454 12.835 6.92664 12.833 6.80103 12.7862C4.37084 11.947 2.33112 10.49 2.33112 7.57612V3.49666C2.33112 3.3421 2.39252 3.19387 2.50181 3.08457C2.6111 2.97528 2.75933 2.91388 2.91389 2.91388C4.07945 2.91388 5.5364 2.21455 6.55044 1.32872C6.6739 1.22324 6.83096 1.16528 6.99335 1.16528C7.15574 1.16528 7.3128 1.22324 7.43626 1.32872C8.45612 2.22038 9.90724 2.91388 11.0728 2.91388C11.2274 2.91388 11.3756 2.97528 11.4849 3.08457C11.5942 3.19387 11.6556 3.3421 11.6556 3.49666V7.57612Z" stroke="#00BC7D" strokeWidth="1.16556" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_accred_shield">
                  <rect width="13.9867" height="13.9867" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>Accreditation Verification Method <span className="text-ui-danger-text font-bold">*</span></span>
          </label>
          <FormField
            id="verificationMethod"
            label=""
            placeholder="Select Method"
            required
            value={verificationMethod}
            error={fieldError('verificationMethod')}
            onChange={(value) => {
              setVerificationMethod(value);
              clearFieldError('verificationMethod');
            }}
            options={[
              { label: 'Parallel Markets', value: 'parallel-markets' },
              { label: 'Internal KYC/AML', value: 'internal' },
              { label: 'Third-Party Legal', value: 'legal-opinion' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-[#C4B5FD] bg-ui-purple-banner-bg p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>
          <p className="min-w-0 text-xs font-medium leading-relaxed text-primary/80 sm:text-sm">
            Maxtronize integrates with <span className="font-bold">Parallel Markets</span> for automated accreditation checks. Investors will complete verification before committing capital.
          </p>
        </div>
      </section>

      <div className="flex flex-row items-center justify-between gap-3 border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => void advanceFromAccreditation()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderAssetDocumentUploads = () => {
    switch (selectedAssetType) {
      case 'real-estate':
        return (
          <>
            <OnboardingDocumentUpload label="MAI Appraisal Report" documentType="APPRAISAL_REPORT" required />
            <OnboardingDocumentUpload label="Rent Roll (last 12 months)" documentType="RENT_ROLL" />
            <OnboardingDocumentUpload label="Title Report" documentType="TITLE_REPORT" />
            <OnboardingDocumentUpload label="Environmental Assessment (Phase I)" documentType="ENVIRONMENTAL_REPORT" />
          </>
        );
      case 'commodities':
        return (
          <>
            <OnboardingDocumentUpload label="Vault Storage Certificate" documentType="VAULT_CERTIFICATE" required />
            <OnboardingDocumentUpload label="Independent Assay Report" documentType="ASSAY_REPORT" />
          </>
        );
      case 'data-centers':
        return (
          <>
            <OnboardingDocumentUpload label="Facility Appraisal Report" documentType="FACILITY_APPRAISAL" required />
            <OnboardingDocumentUpload label="Colocation Agreements" documentType="COLOCATION_AGREEMENT" />
          </>
        );
      case 'private-credit':
        return (
          <>
            <OnboardingDocumentUpload label="Credit Agreement" documentType="CREDIT_AGREEMENT" required />
            <OnboardingDocumentUpload label="Borrower Financial Statements" documentType="FINANCIAL_STATEMENT" />
          </>
        );
      default:
        return null;
    }
  };

  const renderStep3 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
          Step 3 of 8 - Asset Details
        </p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Asset Details</h1>
        <p className="text-ui-muted-text text-base">Submit asset details. Fields adjust dynamically based on your asset type.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      {/* Asset Type Selection */}
      <section className="bg-ui-card border border-ui-border rounded-2xl p-8 shadow-sm">
        <h3 className="text-base font-bold text-ui-strong mb-1">Asset Type</h3>
        <p className="text-base text-ui-faint mb-8">
          Select the category of asset you are tokenizing. Form fields will adjust accordingly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ONBOARDING_ASSET_TYPES.map((type) => (
            <button
              type="button"
              key={type.id}
              disabled={isApprovedOrLocked}
              onClick={isApprovedOrLocked ? undefined : () => setSelectedAssetType(type.id as AssetType)}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 group select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/45 min-w-0 disabled:opacity-75 disabled:cursor-not-allowed ${selectedAssetType === type.id
                ? 'border-primary bg-ui-accent-tint'
                : isApprovedOrLocked
                  ? 'border-ui-border bg-ui-card'
                  : 'border-ui-border bg-ui-card hover:border-ui-border-strong'
                }`}
            >
              <div
                className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl shadow-sm overflow-hidden transition-transform duration-200 ${!isApprovedOrLocked ? 'motion-safe:group-hover:scale-[1.06] motion-safe:group-focus-visible:scale-100' : ''
                  } ${selectedAssetType === type.id ? 'bg-ui-card' : 'bg-ui-muted-deep'
                  }`}
              >
                {type.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-base font-bold mb-1 ${selectedAssetType === type.id ? 'text-primary' : 'text-ui-strong'}`}>{type.name}</p>
                <p className="text-xs text-ui-faint leading-relaxed">{type.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Form */}
      <section className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm space-y-8">
        <div className="border-b border-ui-divider pb-6 mb-2">
          <h3 className="text-lg font-bold text-ui-strong">{assetDetailsTitle[selectedAssetType]} Details</h3>
        </div>

        <OnboardingCoverImageUpload
          coverImageKey={coverImageKey ?? coverImageKeyFromAsset}
          coverImageUrl={coverImageUrl ?? coverImageUrlFromAsset}
          onCoverImageKeyChange={setCoverImageKey}
          onCoverImageUrlChange={setCoverImageUrl}
          uploadOnSelect
          assetType={selectedAssetType}
          assetName={assetName}
          disabled={isApprovedOrLocked}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
          {selectedAssetType === 'commodities' && (
            <>
              <FormField id="assetName" label="Asset Name" placeholder="Gold Bullion Reserve Series I" required value={assetName} error={fieldError('assetName')} onChange={(v) => { setAssetName(v); clearFieldError('assetName'); }} />
              <FormField id="commodityType" label="Commodity Type" placeholder="Select Type" required options={[{ label: 'Precious Metals', value: 'precious-metals' }, { label: 'Base Metals', value: 'base-metals' }, { label: 'Energy', value: 'energy' }, { label: 'Agriculture', value: 'agriculture' }]} value={assetMetadata?.commodityType} error={fieldError('commodityType')} onChange={(v) => { setAssetMetadata(prev => ({ ...prev, commodityType: v })); clearFieldError('commodityType'); }} />
              <FormField label="Storage Location" placeholder="London, UK (LBMA Vault)" value={assetAddress} onChange={setAssetAddress} />
              <FormField id="assetAppraisal" label="Total Value (USD)" placeholder="50,000,000" required value={assetAppraisal} error={fieldError('assetAppraisal')} onChange={(v) => { setAssetAppraisal(v.replace(/[^0-9.,]/g, '')); clearFieldError('assetAppraisal'); }} />
              <FormField label="Purity / Grade" placeholder="99.99% Fine Gold" value={assetMetadata?.purity} onChange={(v) => setAssetMetadata(prev => ({ ...prev, purity: v }))} />
              <FormField label="Vault Provider" placeholder="Brinks / Loomis International" value={assetMetadata?.vaultProvider} onChange={(v) => setAssetMetadata(prev => ({ ...prev, vaultProvider: v }))} />
            </>
          )}

          {selectedAssetType === 'data-centers' && (
            <>
              <FormField id="assetName" label="Facility Name" placeholder="Ashburn DC Campus Alpha" required value={assetName} error={fieldError('assetName')} onChange={(v) => { setAssetName(v); clearFieldError('assetName'); }} />
              <FormField label="Total Capacity (MW)" placeholder="48" value={assetMetadata?.capacity} onChange={(v) => setAssetMetadata(prev => ({ ...prev, capacity: v.replace(/[^0-9.]/g, '') }))} />
              <FormField id="assetAddress" label="Location" placeholder="Ashburn, VA, USA" required value={assetAddress} error={fieldError('assetAddress')} onChange={(v) => { setAssetAddress(v); clearFieldError('assetAddress'); }} />
              <FormField id="assetAppraisal" label="Appraised Value (USD)" placeholder="250,000,000" required value={assetAppraisal} error={fieldError('assetAppraisal')} onChange={(v) => { setAssetAppraisal(v.replace(/[^0-9.,]/g, '')); clearFieldError('assetAppraisal'); }} />
              <FormField label="Annual NOI (USD)" placeholder="18,500,000" value={assetIncome} onChange={(v) => setAssetIncome(v.replace(/[^0-9.,]/g, ''))} />
              <FormField label="Tier Level" placeholder="Select Tier" options={[{ label: 'Tier I', value: 'tier-1' }, { label: 'Tier II', value: 'tier-2' }, { label: 'Tier III', value: 'tier-3' }, { label: 'Tier IV', value: 'tier-4' }]} value={assetMetadata?.tierLevel} onChange={(v) => setAssetMetadata(prev => ({ ...prev, tierLevel: v }))} />
            </>
          )}

          {selectedAssetType === 'private-credit' && (
            <>
              <FormField id="assetName" label="Loan / Bond Name" placeholder="Senior Secured Term Loan A" required value={assetName} error={fieldError('assetName')} onChange={(v) => { setAssetName(v); clearFieldError('assetName'); }} />
              <FormField id="assetAppraisal" label="Principal Amount (USD)" placeholder="25,000,000" required value={assetAppraisal} error={fieldError('assetAppraisal')} onChange={(v) => { setAssetAppraisal(v.replace(/[^0-9.,]/g, '')); clearFieldError('assetAppraisal'); }} />
              <FormField id="creditType" label="Credit Type" placeholder="Select Type" required options={[{ label: 'Senior Secured Term Loan', value: 'senior-secured' }, { label: 'Mezzanine Debt', value: 'mezzanine' }, { label: 'Unitranche', value: 'unitranche' }, { label: 'Convertible Note', value: 'convertible' }]} value={assetMetadata?.creditType} error={fieldError('creditType')} onChange={(v) => { setAssetMetadata(prev => ({ ...prev, creditType: v })); clearFieldError('creditType'); }} />
              <FormField label="Interest Rate (%)" placeholder="SOFR + 450bps" value={assetMetadata?.interestRate} onChange={(v) => setAssetMetadata(prev => ({ ...prev, interestRate: v }))} />
              <FormField label="Maturity Date" placeholder="Select Date" value={assetMetadata?.maturityDate} onChange={(v) => setAssetMetadata(prev => ({ ...prev, maturityDate: v }))} />
              <FormField label="Credit Rating" placeholder="BB+ / Ba1" value={assetMetadata?.creditRating} onChange={(v) => setAssetMetadata(prev => ({ ...prev, creditRating: v }))} />
            </>
          )}

          {selectedAssetType === 'real-estate' && (
            <>
              {fieldError('assetName') ? (
                <p id="assetName" className="md:col-span-2 text-base font-medium text-rose-600">{fieldError('assetName')}</p>
              ) : null}
              <FormField
                id="assetAddress"
                label="Property Address"
                placeholder="2847 Peachtree Rd NE, Atlanta, GA 30305"
                required
                fullWidth
                value={assetAddress}
                error={fieldError('assetAddress')}
                onChange={(v) => {
                  setAssetAddress(v);
                  clearFieldError('assetAddress');
                }}
              />
              <FormField
                id="assetAppraisal"
                label="Appraised Valuation (USD)"
                placeholder="12,500,000"
                required
                hint="Must be from a licensed MAI appraiser."
                value={assetAppraisal}
                error={fieldError('assetAppraisal')}
                onChange={(v) => {
                  setAssetAppraisal(v.replace(/[^0-9.,]/g, ''));
                  clearFieldError('assetAppraisal');
                }}
              />
              <FormField
                label="Annual Rental Income (USD)"
                placeholder="890,000"
                value={assetIncome}
                onChange={(v) => setAssetIncome(v.replace(/[^0-9.,]/g, ''))}
              />
              <FormField label="Property Type" placeholder="Select Type" options={[{ label: 'Residential', value: 'residential' }, { label: 'Commercial', value: 'commercial' }, { label: 'Industrial', value: 'industrial' }, { label: 'Mixed-Use', value: 'mixed-use' }, { label: 'Land', value: 'land' }]} value={assetMetadata?.propertyType} onChange={(v) => setAssetMetadata(prev => ({ ...prev, propertyType: v }))} />
              <FormField label="Cap Rate (%)" placeholder="6.8" value={assetMetadata?.capRate} onChange={(v) => setAssetMetadata(prev => ({ ...prev, capRate: v.replace(/[^0-9.]/g, '') }))} />
              <FormField label="Occupancy Rate (%)" placeholder="94.2" value={assetMetadata?.occupancyRate} onChange={(v) => setAssetMetadata(prev => ({ ...prev, occupancyRate: v.replace(/[^0-9.]/g, '') }))} />
              <FormField label="Year Built / Renovated" placeholder="2018 / 2023" value={assetMetadata?.yearBuilt} onChange={(v) => setAssetMetadata(prev => ({ ...prev, yearBuilt: v.replace(/[^0-9\s/]/g, '') }))} />
            </>
          )}
        </div>
      </section>

      <section id="assetDocuments" className="space-y-4">
        <p className="text-xs font-semibold text-ui-faint uppercase tracking-[0.22em]">Required Documents</p>
        <div className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm">
          {fieldError('assetDocuments') ? (
            <p className="mb-4 text-base font-medium text-rose-600">{fieldError('assetDocuments')}</p>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{renderAssetDocumentUploads()}</div>
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex flex-row items-center justify-between gap-3 border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => void advanceFromAsset()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
          Step 4 of 8 - Legal Structure
        </p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Legal Structure</h1>
        <p className="text-ui-muted-text text-base">Set up the Special Purpose Vehicle (SPV) structure for this asset.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      {/* Info Box */}
      <div className="bg-alert-info-bg border border-alert-info-border rounded-2xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl bg-alert-info-icon-wrap-bg border border-alert-info-icon-wrap-border flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-alert-info-title">Special Purpose Vehicle (SPV) Structure</h4>
          <p className="text-base text-alert-info-body leading-relaxed">
            Each asset is held in a dedicated Delaware LLC SPV to isolate liability and enable clean tokenized ownership transfer. Maxtronize provides registered agent services.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-base font-bold text-ui-strong">SPV Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField
              id="spvEntityName"
              label="SPV Entity Name"
              placeholder="Crescent Peachtree Tower Holdings LLC"
              required
              fullWidth
              hint="Will be registered as a Delaware LLC. Format: [Asset Name] Holdings LLC"
              value={spvEntityName}
              error={fieldError('spvEntityName')}
              onChange={(v) => {
                setSpvEntityName(v);
                clearFieldError('spvEntityName');
              }}
            />
            <FormField
              id="spvJurisdiction"
              label="SPV Jurisdiction"
              placeholder="ADGM"
              required
              value={spvJurisdiction}
              error={fieldError('spvJurisdiction')}
              onChange={(v) => {
                setSpvJurisdiction(v);
                clearFieldError('spvJurisdiction');
              }}
            />
            <FormField
              id="retainedOwnership"
              label="Issuer Retained Ownership (%)"
              placeholder="100"
              required
              hint="Remaining % is available for investor token allocation"
              value={retainedOwnership}
              error={fieldError('retainedOwnership')}
              onChange={(v) => {
                setRetainedOwnership(v.replace(/[^0-9.]/g, ''));
                clearFieldError('retainedOwnership');
              }}
            />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <div>
            <h3 className="text-base font-bold text-ui-strong mb-2">Token-Holder Rights Mapping</h3>
            <p className="text-base text-ui-faint">
              Define what rights token holders receive. These are encoded in the subscription agreement and operating agreement.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { id: 'pro-rata', title: 'Pro-Rata Cash Distributions', sub: 'Holders receive proportional income distributions', checked: proRataDistributions, toggle: () => setProRataDistributions((v) => !v) },
              { id: 'voting', title: 'Voting Rights', sub: 'Major asset decisions require a token holder vote', checked: votingRights, toggle: () => setVotingRights((v) => !v) },
              { id: 'liquidation', title: 'Liquidation Preference', sub: 'Priority return of capital on asset sale', checked: liquidationPreference, toggle: () => setLiquidationPreference((v) => !v) },
              { id: 'information', title: 'Information Rights', sub: 'Quarterly financials and annual audit reports', checked: informationRights, toggle: () => setInformationRights((v) => !v) },
            ] as const).map((right) => {
              const checked = right.checked;
              return (
                <button
                  key={right.id}
                  type="button"
                  disabled={isApprovedOrLocked}
                  onClick={isApprovedOrLocked ? undefined : right.toggle}
                  className={`text-left p-6 rounded-2xl border-2 transition-all flex gap-4 w-full disabled:opacity-75 disabled:cursor-not-allowed ${isApprovedOrLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                    } ${checked
                      ? 'border-primary bg-ui-accent-tint'
                      : isApprovedOrLocked
                        ? 'border-ui-divider bg-ui-muted-surface'
                        : 'border-ui-divider bg-ui-muted-surface hover:border-ui-border'
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${checked ? 'border-primary bg-primary' : 'border-ui-border-strong bg-ui-card'
                      }`}
                    aria-hidden
                  >
                    {checked ? <div className="w-2 h-2 rounded-full bg-ui-card" /> : null}
                  </div>
                  <div>
                    <p className={`text-base font-bold mb-1 ${checked ? 'text-primary' : 'text-ui-strong'}`}>
                      {right.title}
                    </p>
                    <p className="text-xs text-ui-faint leading-relaxed">{right.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-alert-warn-bg border border-alert-warn-border rounded-2xl p-6 flex gap-4 items-start">
          <svg className="w-5 h-5 text-alert-warn-icon shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-alert-warn-body leading-relaxed">
            Maxtronize legal templates are reviewed by <span className="font-bold">Cooley LLP</span> and <span className="font-bold">K&L Gates</span>. Custom rights structures require additional legal review ($2,500 flat fee).
          </p>
        </div>
      </section>

      <section className="bg-ui-card border border-ui-border rounded-2xl p-10 shadow-sm space-y-8">
        <h3 className="text-base font-bold text-ui-strong">Required Legal Documents</h3>
        <p className="text-base text-ui-faint">
          Upload finalized documents, or use Maxtronize templates where noted.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <OnboardingDocumentUpload
            label="Private Placement Memorandum (PPM)"
            documentType="PPM"
            sub="Upload PDF"
          />
          <OnboardingDocumentUpload
            label="Subscription Agreement"
            documentType="SUBSCRIPTION_AGREEMENT"
            sub="Upload PDF"
          />
          <OnboardingDocumentUpload
            label="Transfer Restriction Agreement"
            documentType="TRANSFER_RESTRICTION_AGREEMENT"
            sub="Upload PDF"
          />
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex flex-row items-center justify-between gap-3 border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => void advanceFromLegal()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 5 of 8 — Offering Setup</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Offering Setup</h1>
        <p className="text-ui-muted-text text-base">Configure capital raise parameters, timeline, and transfer restrictions.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-base font-bold text-ui-strong">Offering Configuration</h3>
          <p className="text-base text-ui-faint -mt-6">Define the capital raise parameters for this offering.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField id="targetRaiseAmount" label="Target Raise Amount (USD)" placeholder="5,000,000" required value={targetRaiseAmount} error={fieldError('targetRaiseAmount')} onChange={(v) => { setTargetRaiseAmount(v.replace(/[^0-9.,]/g, '')); clearFieldError('targetRaiseAmount'); }} />
            <FormField id="minimumInvestment" label="Minimum Investment (USD)" placeholder="25,000" required value={minimumInvestment} error={fieldError('minimumInvestment')} onChange={(v) => { setMinimumInvestment(v.replace(/[^0-9.,]/g, '')); clearFieldError('minimumInvestment'); }} />
            <FormField label="Maximum Investors" placeholder="250" value={maximumInvestors} onChange={(v) => setMaximumInvestors(v.replace(/[^0-9]/g, ''))} />
            <FormField label="Offering Currency" placeholder="USD" value={offeringCurrency} onChange={setOfferingCurrency} />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-base font-bold text-ui-strong">Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField id="offeringOpenDate" label="Offering Open Date" placeholder="2026-06-01" inputType="date" required value={offeringOpenDate} error={fieldError('offeringOpenDate')} onChange={(v) => { setOfferingOpenDate(v); clearFieldError('offeringOpenDate'); }} />
            <FormField id="offeringCloseDate" label="Offering Close Date" placeholder="2026-09-30" inputType="date" required value={offeringCloseDate} error={fieldError('offeringCloseDate')} onChange={(v) => { setOfferingCloseDate(v); clearFieldError('offeringCloseDate'); }} />
            <FormField label="First Yield Distribution" placeholder="2026-10-15" inputType="date" value={firstYieldDate} onChange={setFirstYieldDate} />
            <FormField label="Distribution Frequency" placeholder="QUARTERLY" value={distributionFrequency} onChange={setDistributionFrequency} />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-base font-bold text-ui-strong">Transfer Restrictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField label="Lock-up Period (months)" placeholder="12" inputType="number" value={lockupPeriod} onChange={(v) => setLockupPeriod(v.replace(/[^0-9]/g, ''))} />
            <FormField label="Secondary Market" placeholder="RESTRICTED" value={secondaryMarket} onChange={setSecondaryMarket} />
          </div>
          <div className="bg-alert-info-bg border border-alert-info-border rounded-2xl p-6 flex gap-4 items-start">
            <svg className="w-4 h-4 text-alert-info-icon shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xs text-alert-info-body leading-relaxed">
              Rule 144 requires a 6–month holding period before resale for most private placements. Maxtronize enforces transfer restrictions at the smart contract level.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-row items-center justify-between gap-3 border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => void advanceFromOffering()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 6 of 8 — Tokenization</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Tokenization</h1>
        <p className="text-ui-muted-text text-base">Configure the on-chain token parameters and blockchain network.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <div className="space-y-8">
          <h3 className="text-base font-bold text-ui-strong">Token Configuration</h3>
          <p className="text-base text-ui-faint -mt-6">Define the on-chain token parameters for this asset.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-8">
            <FormField id="tokenName" label="Token Name" placeholder="Crescent Peachtree Tower Token" required value={tokenName} error={fieldError('tokenName')} onChange={(v) => { setTokenName(v); clearFieldError('tokenName'); }} />
            <FormField id="tokenSymbol" label="Token Symbol" placeholder="CPTT" required value={tokenSymbol} error={fieldError('tokenSymbol')} onChange={(v) => { setTokenSymbol(v); clearFieldError('tokenSymbol'); }} />
            <FormField id="totalSupply" label="Total Supply" placeholder="1,000,000" required value={totalSupply} error={fieldError('totalSupply')} onChange={(v) => { setTotalSupply(v.replace(/[^0-9,]/g, '')); clearFieldError('totalSupply'); }} />
            <FormField id="tokenPrice" label="Token Price (USD)" placeholder="5.00" required value={tokenPrice} error={fieldError('tokenPrice')} onChange={(v) => { setTokenPrice(v.replace(/[^0-9.]/g, '')); clearFieldError('tokenPrice'); }} />
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <div>
            <h3 className="text-base font-bold text-ui-strong mb-1">Token Standard</h3>
            <p className="text-base text-ui-faint">Choose the smart contract standard that governs your token.</p>
          </div>
          <div className="space-y-4">
            {[
              { id: 'erc-1400', name: 'ERC-1400', tag: 'Recommended', sub: 'Security token standard with built-in compliance hooks. Best for regulated real-world assets.' },
              { id: 'erc-3643', name: 'ERC-3643 (T-REX)', sub: 'MiCA-aligned compliance-first standard with on-chain KYC registry and transfer rules.' },
              { id: 'erc-20', name: 'ERC-20', sub: 'Fungible token standard offering maximum secondary market liquidity.' }
            ].map((std) => (
              <div
                key={std.id}
                onClick={() => setSelectedTokenStandard(std.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex gap-5 ${selectedTokenStandard === std.id ? 'border-primary bg-ui-accent-tint' : 'border-ui-divider bg-ui-muted-surface hover:border-ui-border'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedTokenStandard === std.id ? 'border-primary bg-primary' : 'border-ui-border-strong bg-ui-card'}`}>
                  {selectedTokenStandard === std.id && <div className="w-2 h-2 rounded-full bg-ui-card"></div>}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className={`text-base font-bold ${selectedTokenStandard === std.id ? 'text-primary' : 'text-ui-strong'}`}>{std.name}</p>
                    {std.tag && <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-full uppercase border border-primary/10">{std.tag}</span>}
                  </div>
                  <p className="text-xs text-ui-faint leading-relaxed">{std.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-ui-divider">
          <h3 className="text-base font-bold text-ui-strong">Blockchain Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                {
                  id: 'ethereum',
                  name: 'Ethereum Mainnet',
                  sub: 'Maximum security & institutional liquidity',
                },
                {
                  id: 'polygon',
                  name: 'Polygon',
                  Icon: Hexagon as LucideIcon,
                  sub: 'Low gas fees, fast finality',
                },
                {
                  id: 'avalanche',
                  name: 'Avalanche',
                  Icon: Triangle as LucideIcon,
                  sub: 'Institutional-grade subnet',
                },
              ] as const
            ).map((net) => {
              const selected = selectedNetwork === net.id;
              return (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => setSelectedNetwork(net.id)}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-4 ${selected
                    ? 'border-primary bg-ui-card shadow-sm'
                    : 'border-ui-divider bg-ui-card hover:border-ui-border-strong'
                    }`}
                >
                  {net.id === 'ethereum' ? (
                    <EthereumNetworkIcon className="h-7 w-auto shrink-0 text-ui-strong" />
                  ) : (
                    <net.Icon
                      className="h-7 w-7 shrink-0 text-ui-strong"
                      strokeWidth={iconStroke}
                      aria-hidden
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold text-ui-strong mb-1">{net.name}</p>
                    <p className="text-[9px] text-ui-faint leading-tight">{net.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex flex-row items-center justify-between gap-3 border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(5)}
          className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => void advanceFromTokenization()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 7 of 8 — Custody</p>
        <h1 className="text-4xl font-bold text-ui-strong mb-4 tracking-tight">Custody</h1>
        <p className="text-ui-muted-text text-base">Select a qualified custodian for your tokenized asset.</p>
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      <div className="bg-alert-info-bg border border-alert-info-border rounded-3xl p-8 flex gap-5 items-start">
        <div className="w-10 h-10 rounded-2xl bg-alert-info-icon-wrap-bg border border-alert-info-icon-wrap-border flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-alert-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-alert-info-title">Qualified Digital Asset Custodian</h4>
          <p className="text-base text-alert-info-body leading-relaxed">
            All tokenized assets must be held by a qualified custodian under applicable regulations. Maxtronize has pre-negotiated institutional rates with our partner custodians.
          </p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
        <div>
          <h3 className="text-base font-bold text-ui-strong mb-1">Select Custodian</h3>
          <p className="text-base text-ui-faint">Your tokenized asset private keys will be managed by the selected custodian.</p>
        </div>
        <div id="selectedCustodian" className="space-y-4">
          {[
            { id: 'anchorage', name: 'Anchorage Digital', tag: 'Rating A+', sub: 'OCC-chartered crypto bank. Institutional cold storage with $11B+ in assets under custody.', badges: ['OCC Chartered', 'SOC 2 Type II', 'FDIC Member'] },
            { id: 'bitgo', name: 'BitGo', tag: 'Rating A', sub: 'Multi-signature institutional custody. $250M insurance coverage per wallet from Lloyd\'s of London.', badges: ['$250M Insurance', 'Multi-Sig', 'ISO 27001'] },
            { id: 'fireblocks', name: 'Fireblocks', tag: 'Rating A', sub: 'MPC-based custody technology with sub-second transaction settlement and full audit trail.', badges: ['MPC Technology', 'Real-Time Settlement', 'SOC 2 Type II'] }
          ].map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCustodian(c.id)}
              className={`p-8 rounded-3xl border-2 transition-all cursor-pointer flex gap-6 ${selectedCustodian === c.id ? 'border-primary bg-ui-accent-tint' : 'border-ui-divider bg-ui-muted-surface hover:border-ui-border'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedCustodian === c.id ? 'border-primary bg-primary' : 'border-ui-border-strong bg-ui-card'}`}>
                {selectedCustodian === c.id && <div className="w-2 h-2 rounded-full bg-ui-card"></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[15px] font-bold ${selectedCustodian === c.id ? 'text-primary' : 'text-ui-strong'}`}>{c.name}</p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${selectedCustodian === c.id ? 'bg-ui-success-badge-bg text-ui-success-badge-text' : 'bg-ui-muted-deep text-ui-faint'}`}>{c.tag}</span>
                </div>
                <p className="text-xs text-ui-muted-text leading-relaxed mb-4">{c.sub}</p>
                <div className="flex flex-wrap gap-2">
                  {c.badges.map((b, i) => (
                    <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-ui-muted-deep text-ui-faint rounded-md border border-ui-border">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-ui-divider space-y-8">
          <h3 className="text-base font-bold text-ui-strong">Wallet Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FormField
              id="coldStorageRatio"
              label="Cold Storage Ratio (%)"
              placeholder="85"
              required
              value={coldStorageRatio}
              error={fieldError('coldStorageRatio')}
              onChange={(v) => {
                setColdStorageRatio(v.replace(/[^0-9.]/g, ''));
                clearFieldError('coldStorageRatio');
              }}
            />
            <FormField
              id="multiSigConfig"
              label="Multi-Sig Configuration"
              placeholder="2-of-3 multisig"
              required
              value={multiSigConfig}
              error={fieldError('multiSigConfig')}
              onChange={(v) => {
                setMultiSigConfig(v);
                clearFieldError('multiSigConfig');
              }}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-row items-center justify-between gap-3 border-t border-ui-border pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(6)}
          className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => void advanceFromCustody()}
          disabled={isSaving}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isSaving ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );

  const step8BannerCopy: Record<
    typeof applicationStatus.key,
    { title: string; body: string; tone: 'purple' | 'amber' | 'emerald' | 'rose' }
  > = {
    draft: {
      title: 'Final Review — Almost There',
      body: 'Please review all information before submitting. Once submitted, your application will be reviewed by our compliance team within 2 business days.',
      tone: 'purple',
    },
    under_review: {
      title: 'Application Submitted',
      body: 'Your application is with our compliance team. You will be notified when the review is complete — typically within 2 business days.',
      tone: 'amber',
    },
    approved: {
      title: 'Application Approved',
      body: 'Your issuer application has been approved. Continue to your dashboard to manage offerings and investors.',
      tone: 'emerald',
    },
    locked: {
      title: 'Application Approved',
      body: 'Your issuer application has been approved and is locked for compliance. Continue to your dashboard.',
      tone: 'emerald',
    },
    rejected: {
      title: 'Application Not Approved',
      body: 'Your application was not approved. Please contact our compliance team for next steps.',
      tone: 'rose',
    },
  };

  const step8Banner = step8BannerCopy[applicationStatus.key];
  const step8BannerToneClass =
    step8Banner.tone === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : step8Banner.tone === 'emerald'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
        : step8Banner.tone === 'rose'
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : 'bg-ui-purple-banner-bg border-ui-purple-banner-border text-primary';

  const renderStep8 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Step 8 of 8 — Review & Submit</p>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-ui-strong tracking-tight">Review & Submit</h1>
          <Badge variant={applicationStatus.badgeVariant} dot={applicationStatus.key === 'under_review'}>
            {applicationStatus.label}
          </Badge>
        </div>
        <p className="text-ui-muted-text text-base">{applicationStatus.description}</p>
        {applicationStatus.rawStatus ? (
          <p className="text-xs font-medium text-ui-faint mt-2 uppercase tracking-widest">
            Status: {applicationStatus.rawStatus.replace(/_/g, ' ')}
          </p>
        ) : null}
      </header>

      <StepValidationBanner message={stepValidationBannerMessage} />

      <section className="bg-ui-card border border-ui-border rounded-3xl p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className="text-base font-bold text-ui-strong">Application Status</h3>
            <p className="text-base text-ui-muted-text leading-relaxed max-w-xl">
              {applicationStatus.description}
            </p>
          </div>
          <Badge variant={applicationStatus.badgeVariant} dot={applicationStatus.key === 'under_review'}>
            {applicationStatus.label}
          </Badge>
        </div>
        {applicationStatus.key === 'under_review' ? (
          <ul className="mt-6 space-y-2 border-t border-ui-border pt-6 text-xs text-ui-muted-text">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              KYB verification — in progress
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ui-faint" />
              Compliance review — pending
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ui-faint" />
              Smart contract deployment — upon approval
            </li>
          </ul>
        ) : null}
        {applicationStatus.key === 'approved' || applicationStatus.key === 'locked' ? (
          <ul className="mt-6 space-y-2 border-t border-ui-border pt-6 text-xs text-ui-muted-text">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Compliance review — complete
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Issuer access — enabled
            </li>
          </ul>
        ) : null}
        {isSessionTerminal ? (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-ui-border pt-6">
            <button
              type="button"
              onClick={beginAnotherAsset}
              className="btn-gradient-primary rounded-2xl px-5 py-2.5 text-base font-bold text-white shadow-lg shadow-primary/20"
            >
              + Tokenize another asset
            </button>
            <Link
              href="/issuer/dashboard"
              className="rounded-2xl border border-ui-border px-5 py-2.5 text-base font-bold text-ui-muted-text hover:bg-ui-muted-deep"
            >
              Go to dashboard
            </Link>
          </div>
        ) : null}
      </section>

      <div className={`rounded-3xl p-8 flex gap-5 items-start border ${step8BannerToneClass}`}>
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${step8Banner.tone === 'purple'
            ? 'bg-ui-purple-banner-icon-bg border-ui-purple-banner-border animate-pulse'
            : 'bg-white/60 border-current/20'
            }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="space-y-1 min-w-0">
          <h4 className="text-base font-bold">{step8Banner.title}</h4>
          <p className="text-base opacity-80 leading-relaxed">{step8Banner.body}</p>
        </div>
      </div>

      <section className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-10">
        <h3 className="text-base font-bold text-ui-strong">Application Summary</h3>
        <div className="space-y-3">
          {reviewSummaryItems.map((item) => (
            <div
              key={item.name}
              className="p-6 bg-ui-card rounded-2xl border border-ui-border flex items-center gap-5 hover:bg-ui-muted-surface transition-colors group"
            >
              <ApplicationSummaryIconBadge>
                <IconBuilding className="w-5 h-5" />
              </ApplicationSummaryIconBadge>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-ui-strong mb-0.5">{item.name}</p>
                <p className="text-xs text-ui-faint font-medium leading-relaxed">{item.sub}</p>
              </div>
              {applicationStatus.key === 'draft' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(item.step)}
                  className="text-xs font-bold text-primary hover:text-primary/80 shrink-0 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {applicationStatus.key === 'draft' && (
        <section id="acceptedTerms" className="bg-ui-card border border-ui-border rounded-3xl p-10 shadow-sm space-y-8">
          <h3 className="text-base font-bold text-ui-strong">Terms & Certification</h3>
          {fieldError('acceptedTerms') ? (
            <p className="text-base font-medium text-rose-600">{fieldError('acceptedTerms')}</p>
          ) : null}
          <div className="space-y-4">
            {[
              'I certify that all information provided is accurate and complete to the best of my knowledge.',
              'I understand that providing false information may result in rejection and potential legal liability.',
              'I agree to the Maxtronize Terms of Service, Privacy Policy, and Issuer Agreement.',
              'I consent to background checks and verification of all submitted documentation.'
            ].map((term, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group cursor-pointer"
                onClick={() => {
                  const newTerms = [...acceptedTerms];
                  newTerms[i] = !newTerms[i];
                  setAcceptedTerms(newTerms);
                  clearFieldError('acceptedTerms');
                }}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors shadow-sm ${acceptedTerms[i]
                    ? 'border-primary bg-primary shadow-primary/20'
                    : 'border-ui-border bg-ui-surface group-hover:border-primary/50'
                    }`}
                >
                  {acceptedTerms[i] && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-xs font-medium text-ui-body group-hover:text-ui-strong transition-colors">{term}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={`flex flex-row items-center gap-3 border-t border-ui-border pt-6 ${applicationStatus.key === 'draft' ? 'justify-between' : 'justify-end'}`}>
        {applicationStatus.key === 'draft' && (
          <button
            type="button"
            onClick={() => setCurrentStep(7)}
            className="shrink-0 whitespace-nowrap rounded-2xl border border-ui-border-strong bg-ui-card px-6 py-3.5 text-base font-bold text-ui-muted-text transition-all hover:bg-ui-muted-deep sm:px-8 sm:py-4"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={() => void handleSubmitApplication()}
          disabled={isSaving || (!applicationStatus.canSubmit && !isApprovedOrLocked)}
          className="btn-gradient-primary shrink-0 whitespace-nowrap rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-60 sm:px-10 sm:py-4"
        >
          {isApprovedOrLocked ? (
            <span>Go to Dashboard →</span>
          ) : applicationStatus.key === 'under_review' ? (
            <span>Submitted — Awaiting Review</span>
          ) : (
            <>
              <span className="sm:hidden">{isSaving ? 'Submitting…' : 'Submit →'}</span>
              <span className="hidden sm:inline">{isSaving ? 'Submitting…' : 'Submit Application →'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050508] p-6">
      {/* Deep purple / black radial hero */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(124,58,237,0.45)_0%,rgba(26,0,51,0.35)_35%,transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_100%,rgba(91,33,182,0.25)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-mesh auth-hero-mesh opacity-80" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.07]" aria-hidden />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center animate-in fade-in zoom-in duration-1000 space-y-10">
        <div className="relative inline-flex">
          <div className="absolute inset-0 scale-150 rounded-full bg-[var(--brand-cyan)]/25 blur-3xl" aria-hidden />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--brand-cyan)] shadow-[0_0_48px_-8px_rgba(0,212,168,0.65)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ui-card shadow-inner">
              <svg
                className="h-8 w-8 text-[var(--brand-cyan-dark)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Application Submitted</h1>
          <p className="mx-auto max-w-md text-base font-medium text-zinc-400">
            Your issuance application is under compliance review.
          </p>
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md">
          {[
            { label: 'KYB Verification', time: '1–2 business days', status: 'active' as const },
            { label: 'Compliance Review', time: '2–3 business days', status: 'pending' as const },
            { label: 'Smart Contract Deployment', time: 'Upon approval', status: 'pending' as const },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-white/[0.08]' : ''
                }`}
            >
              <div className="flex min-w-0 items-center gap-3 text-left">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${item.status === 'active' ? 'bg-[var(--brand-cyan)] shadow-[0_0_10px_rgba(0,212,168,0.8)]' : 'bg-white/25'
                    }`}
                />
                <span
                  className={`truncate text-base font-semibold ${item.status === 'active' ? 'text-white' : 'text-zinc-400'
                    }`}
                >
                  {item.label}
                </span>
              </div>
              <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-zinc-500">
                {item.time}
              </span>
            </div>
          ))}
        </div>

        {/* Animated redirect progress bar */}
        <div className="w-full max-w-md space-y-3 text-center">
          <p className="text-base font-medium text-zinc-400">Redirecting to your dashboard...</p>
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--brand-cyan)] to-[#7C3AED] transition-all"
              style={{ width: `${redirectProgress}%`, transitionDuration: '40ms', transitionTimingFunction: 'linear' }}
            />
          </div>
        </div>

        {/* Manual navigation fallback */}
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={beginAnotherAsset}
            className="rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-base font-bold text-zinc-300 transition-colors hover:bg-white/10"
          >
            + Tokenize another asset
          </button>
          <button
            type="button"
            onClick={() => router.push('/issuer/dashboard')}
            className="rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-base font-bold text-zinc-300 transition-colors hover:bg-white/10"
          >
            Go to dashboard →
          </button>
        </div>
      </div>
    </div>
  );

  if (isSubmitted) return renderSuccess();

  const effectiveStep = applicationStatus.key !== 'draft' ? 8 : currentStep;

  return (
    <OnboardingLayout currentStep={effectiveStep} showSaved={effectiveStep === 2} applicationStatus={applicationStatus} onStepClick={setCurrentStep}>
      {saveError ? (
        <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-800">
          {saveError}
        </p>
      ) : null}
      {effectiveStep === 1 && renderStep1()}
      {effectiveStep === 2 && renderStep2()}
      {effectiveStep === 3 && renderStep3()}
      {effectiveStep === 4 && renderStep4()}
      {effectiveStep === 5 && renderStep5()}
      {effectiveStep === 6 && renderStep6()}
      {effectiveStep === 7 && renderStep7()}
      {effectiveStep === 8 && renderStep8()}
    </OnboardingLayout>
  );
}
