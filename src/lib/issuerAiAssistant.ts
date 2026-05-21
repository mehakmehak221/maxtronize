import { pickNumber, pickString, unwrapList, unwrapPayload } from "@/lib/apiParse";

export type IssuerAiAssistantConfig = {
  name: string;
  status: string;
  subtitle: string | null;
  model: string | null;
  enabled: boolean;
  initialized: boolean;
  organizationName: string | null;
};

export type IssuerAiAssistantSuggestedPrompt = {
  id: string;
  text: string;
  category: string | null;
};

export type IssuerAiAssistantMessage = {
  id: string;
  role: string;
  content: string;
  createdAt: string | null;
  status: string | null;
};

export type IssuerAiAssistantInit = {
  config: IssuerAiAssistantConfig;
  suggestedPrompts: IssuerAiAssistantSuggestedPrompt[];
  messages: IssuerAiAssistantMessage[];
};

export type IssuerAiAssistantSendResponse = {
  userMessage: IssuerAiAssistantMessage | null;
  assistantMessage: IssuerAiAssistantMessage | null;
  threadId: string | null;
  raw: unknown;
};

function unwrapRecord(payload: unknown): Record<string, unknown> | null {
  const root = unwrapPayload(payload);
  if (!root || typeof root !== "object" || Array.isArray(root)) return null;
  return root as Record<string, unknown>;
}

function pickBoolean(obj: Record<string, unknown>, keys: string[]): boolean | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "yes") return true;
      if (normalized === "false" || normalized === "no") return false;
    }
  }
  return null;
}

function formatMessageTimestamp(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function parseAiConfig(record: Record<string, unknown>): IssuerAiAssistantConfig {
  const nested =
    record.config && typeof record.config === "object"
      ? (record.config as Record<string, unknown>)
      : record.assistant && typeof record.assistant === "object"
        ? (record.assistant as Record<string, unknown>)
        : record;

  const enabled =
    pickBoolean(nested, ["enabled", "isEnabled", "available"]) ?? true;
  const initialized =
    pickBoolean(nested, ["initialized", "isInitialized", "bootstrapped"]) ?? false;

  return {
    name:
      pickString(nested, ["name", "assistantName", "title"]) ??
      "Maxtronize AI Assistant",
    status:
      pickString(nested, ["status", "state"]) ??
      (enabled ? "Live" : "Offline"),
    subtitle:
      pickString(nested, ["subtitle", "description", "summary"]) ??
      "Strategy, compliance, pricing, and investor insights",
    model: pickString(nested, ["model", "modelName", "provider"]),
    enabled,
    initialized,
    organizationName: pickString(nested, [
      "organizationName",
      "organization_name",
      "issuerName",
      "issuer_name",
      "workspaceName",
    ]),
  };
}

function parseAiMessage(
  record: Record<string, unknown>,
  index: number,
): IssuerAiAssistantMessage {
  return {
    id:
      pickString(record, ["id", "_id", "messageId", "message_id"]) ??
      `message-${index}`,
    role: pickString(record, ["role", "sender", "author"]) ?? "assistant",
    content:
      pickString(record, ["content", "message", "text", "reply"]) ??
      "—",
    createdAt: formatMessageTimestamp(
      pickString(record, [
        "createdAt",
        "created_at",
        "timestamp",
        "sentAt",
        "sent_at",
      ]),
    ),
    status: pickString(record, ["status", "state"]),
  };
}

function parseAiSuggestedPrompt(
  record: Record<string, unknown>,
  index: number,
): IssuerAiAssistantSuggestedPrompt {
  return {
    id:
      pickString(record, ["id", "_id", "key"]) ??
      `prompt-${index}`,
    text:
      pickString(record, ["text", "prompt", "label", "title"]) ??
      "Suggested prompt",
    category: pickString(record, ["category", "group"]),
  };
}

export function parseIssuerAiAssistant(
  payload: unknown,
): IssuerAiAssistantConfig {
  const record = unwrapRecord(payload) ?? {};
  return parseAiConfig(record);
}

export function parseIssuerAiAssistantMessages(
  payload: unknown,
): IssuerAiAssistantMessage[] {
  return unwrapList(payload).map(parseAiMessage);
}

export function parseIssuerAiAssistantSuggestedPrompts(
  payload: unknown,
): IssuerAiAssistantSuggestedPrompt[] {
  return unwrapList(payload).map(parseAiSuggestedPrompt);
}

export function parseIssuerAiAssistantInit(
  payload: unknown,
): IssuerAiAssistantInit {
  const record = unwrapRecord(payload) ?? {};
  const messagesRaw =
    record.messages ??
    record.history ??
    record.items ??
    record.chat ??
    [];
  const promptsRaw =
    record.suggestedPrompts ??
    record.prompts ??
    record.quickPrompts ??
    [];

  return {
    config: parseAiConfig(record),
    suggestedPrompts: parseIssuerAiAssistantSuggestedPrompts(promptsRaw),
    messages: parseIssuerAiAssistantMessages(messagesRaw),
  };
}

export function parseIssuerAiAssistantSendResponse(
  payload: unknown,
): IssuerAiAssistantSendResponse {
  const record = unwrapRecord(payload) ?? {};
  const assistantCandidate =
    record.assistantMessage && typeof record.assistantMessage === "object"
      ? (record.assistantMessage as Record<string, unknown>)
      : record.reply && typeof record.reply === "object"
        ? (record.reply as Record<string, unknown>)
        : record.message && typeof record.message === "object"
          ? (record.message as Record<string, unknown>)
          : null;
  const userCandidate =
    record.userMessage && typeof record.userMessage === "object"
      ? (record.userMessage as Record<string, unknown>)
      : record.user && typeof record.user === "object"
        ? (record.user as Record<string, unknown>)
        : null;

  return {
    userMessage: userCandidate ? parseAiMessage(userCandidate, 0) : null,
    assistantMessage: assistantCandidate
      ? parseAiMessage(assistantCandidate, 1)
      : null,
    threadId:
      pickString(record, ["threadId", "conversationId", "chatId"]) ?? null,
    raw: payload,
  };
}

export function buildAiMessagesQueryString(params?: {
  page?: number;
  limit?: number;
}): string {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export function buildAiAssistantDraftReply(
  response: IssuerAiAssistantSendResponse,
): IssuerAiAssistantMessage | null {
  if (response.assistantMessage) return response.assistantMessage;

  const record = unwrapRecord(response.raw);
  if (!record) return null;
  const content =
    pickString(record, ["reply", "message", "content"]) ??
    pickString(record, ["text"]);
  if (!content) return null;

  return {
    id: `assistant-${pickNumber(record, ["timestamp"]) ?? Date.now()}`,
    role: "assistant",
    content,
    createdAt: formatMessageTimestamp(
      pickString(record, ["createdAt", "created_at", "timestamp"]),
    ),
    status: pickString(record, ["status", "state"]),
  };
}
