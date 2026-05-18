import {
  parseDocumentCategories,
  parseIssuerDocument,
  parseIssuerDocumentsList,
  parseIssuerDocumentsSummary,
  type DocumentCategoryTab,
  type IssuerDocument,
  type IssuerDocumentsListResult,
  type IssuerDocumentsSummary,
  type ListIssuerDocumentsParams,
} from "@/lib/issuerDocuments";
import { baseApi } from "./baseApi";

export const investorDocumentsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getInvestorDocumentsSummary: build.query<IssuerDocumentsSummary, void>({
      query: () => ({ url: "/investor/documents/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseIssuerDocumentsSummary(response),
      providesTags: [{ type: "InvestorDocuments", id: "SUMMARY" }],
    }),
    getInvestorDocumentCategories: build.query<DocumentCategoryTab[], void>({
      query: () => ({ url: "/investor/documents/categories", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseDocumentCategories(response),
      providesTags: [{ type: "InvestorDocuments", id: "CATEGORIES" }],
    }),
    listInvestorDocuments: build.query<
      IssuerDocumentsListResult,
      ListIssuerDocumentsParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        const p = params ?? {};
        if (p.page != null) searchParams.set("page", String(p.page));
        if (p.limit != null) searchParams.set("limit", String(p.limit));
        if (p.search?.trim()) searchParams.set("search", p.search.trim());
        if (p.category?.trim()) searchParams.set("category", p.category.trim());
        if (p.status?.trim()) searchParams.set("status", p.status.trim());
        if (p.assetId?.trim()) searchParams.set("assetId", p.assetId.trim());
        const qs = searchParams.toString();
        return {
          url: `/investor/documents${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseIssuerDocumentsList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((doc) => ({
                type: "InvestorDocuments" as const,
                id: doc.id,
              })),
              { type: "InvestorDocuments", id: "LIST" },
            ]
          : [{ type: "InvestorDocuments", id: "LIST" }],
    }),
    getInvestorDocument: build.query<IssuerDocument | null, string>({
      query: (id) => ({ url: `/investor/documents/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerDocument(response),
      providesTags: (_result, _error, id) => [
        { type: "InvestorDocuments", id },
      ],
    }),
    signInvestorDocument: build.mutation<IssuerDocument | null, string>({
      query: (id) => ({
        url: `/investor/documents/${id}/sign`,
        method: "POST",
      }),
      transformResponse: (response: unknown) => parseIssuerDocument(response),
      invalidatesTags: (_result, _error, id) => [
        { type: "InvestorDocuments", id },
        { type: "InvestorDocuments", id: "LIST" },
        { type: "InvestorDocuments", id: "SUMMARY" },
        { type: "InvestorDocuments", id: "CATEGORIES" },
      ],
    }),
  }),
});

export const {
  useGetInvestorDocumentsSummaryQuery,
  useGetInvestorDocumentCategoriesQuery,
  useListInvestorDocumentsQuery,
  useGetInvestorDocumentQuery,
  useSignInvestorDocumentMutation,
} = investorDocumentsApi;
