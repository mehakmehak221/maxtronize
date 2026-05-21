import {
  buildAiAssistantDraftReply,
  buildAiMessagesQueryString,
  parseIssuerAiAssistant,
  parseIssuerAiAssistantInit,
  parseIssuerAiAssistantMessages,
  parseIssuerAiAssistantSendResponse,
  parseIssuerAiAssistantSuggestedPrompts,
  type IssuerAiAssistantConfig,
  type IssuerAiAssistantInit,
  type IssuerAiAssistantMessage,
  type IssuerAiAssistantSendResponse,
  type IssuerAiAssistantSuggestedPrompt,
} from "@/lib/issuerAiAssistant";
import { baseApi } from "./baseApi";

export const issuerHubAiAssistantApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getIssuerHubAiAssistant: build.query<IssuerAiAssistantConfig, void>({
      query: () => ({
        url: "/issuer/hub/ai-assistant",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseIssuerAiAssistant(response),
      providesTags: [{ type: "IssuerHub", id: "AI_CONFIG" }],
    }),

    getIssuerHubAiAssistantInit: build.query<IssuerAiAssistantInit, void>({
      query: () => ({
        url: "/issuer/hub/ai-assistant/init",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseIssuerAiAssistantInit(response),
      providesTags: [
        { type: "IssuerHub", id: "AI_INIT" },
        { type: "IssuerHub", id: "AI_MESSAGES" },
        { type: "IssuerHub", id: "AI_PROMPTS" },
      ],
    }),

    getIssuerHubAiSuggestedPrompts: build.query<
      IssuerAiAssistantSuggestedPrompt[],
      void
    >({
      query: () => ({
        url: "/issuer/hub/ai-assistant/suggested-prompts",
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseIssuerAiAssistantSuggestedPrompts(response),
      providesTags: [{ type: "IssuerHub", id: "AI_PROMPTS" }],
    }),

    listIssuerHubAiMessages: build.query<
      IssuerAiAssistantMessage[],
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: `/issuer/hub/ai-assistant/messages${buildAiMessagesQueryString(params ?? undefined)}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        parseIssuerAiAssistantMessages(response),
      providesTags: [{ type: "IssuerHub", id: "AI_MESSAGES" }],
    }),

    bootstrapIssuerHubAiAssistant: build.mutation<
      { success: true; message: IssuerAiAssistantMessage | null },
      void
    >({
      query: () => ({
        url: "/issuer/hub/ai-assistant/bootstrap",
        method: "POST",
        body: {},
      }),
      transformResponse: (response: unknown) => {
        const parsed = parseIssuerAiAssistantSendResponse(response);
        return {
          success: true as const,
          message:
            parsed.assistantMessage ?? buildAiAssistantDraftReply(parsed),
        };
      },
      invalidatesTags: [
        { type: "IssuerHub", id: "AI_INIT" },
        { type: "IssuerHub", id: "AI_MESSAGES" },
        { type: "IssuerHub", id: "AI_CONFIG" },
      ],
    }),

    sendIssuerHubAiMessage: build.mutation<
      IssuerAiAssistantSendResponse,
      { message: string }
    >({
      query: ({ message }) => ({
        url: "/issuer/hub/ai-assistant/messages",
        method: "POST",
        body: {
          message,
          content: message,
          prompt: message,
        },
      }),
      transformResponse: (response: unknown) =>
        parseIssuerAiAssistantSendResponse(response),
      invalidatesTags: [
        { type: "IssuerHub", id: "AI_INIT" },
        { type: "IssuerHub", id: "AI_MESSAGES" },
        { type: "IssuerHub", id: "AI_PROMPTS" },
      ],
    }),
  }),
});

export const {
  useGetIssuerHubAiAssistantQuery,
  useGetIssuerHubAiAssistantInitQuery,
  useGetIssuerHubAiSuggestedPromptsQuery,
  useListIssuerHubAiMessagesQuery,
  useBootstrapIssuerHubAiAssistantMutation,
  useSendIssuerHubAiMessageMutation,
} = issuerHubAiAssistantApi;
