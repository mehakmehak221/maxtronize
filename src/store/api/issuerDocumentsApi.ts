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
  type UploadIssuerDocumentRequest,
} from "@/lib/issuerDocuments";
import { baseApi } from "./baseApi";

export const issuerDocumentsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getIssuerDocumentsSummary: build.query<IssuerDocumentsSummary, void>({
      query: () => ({ url: "/documents/summary", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseIssuerDocumentsSummary(response),
      providesTags: [{ type: "IssuerDocuments", id: "SUMMARY" }],
    }),
    getIssuerDocumentCategories: build.query<DocumentCategoryTab[], void>({
      query: () => ({ url: "/documents/categories", method: "GET" }),
      transformResponse: (response: unknown) =>
        parseDocumentCategories(response),
      providesTags: [{ type: "IssuerDocuments", id: "CATEGORIES" }],
    }),
    listIssuerDocuments: build.query<
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
          url: `/documents${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) =>
        parseIssuerDocumentsList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((doc) => ({
                type: "IssuerDocuments" as const,
                id: doc.id,
              })),
              { type: "IssuerDocuments", id: "LIST" },
            ]
          : [{ type: "IssuerDocuments", id: "LIST" }],
    }),
    getIssuerDocument: build.query<IssuerDocument | null, string>({
      query: (id) => ({ url: `/documents/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => parseIssuerDocument(response),
      providesTags: (_result, _error, id) => [
        { type: "IssuerDocuments", id },
      ],
    }),
    uploadIssuerDocument: build.mutation<unknown, UploadIssuerDocumentRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append("file", body.file);
        formData.append("title", body.title.trim());
        formData.append("category", body.category);
        if (body.assetId?.trim()) {
          formData.append("assetId", body.assetId.trim());
        }
        if (body.documentDate) {
          formData.append("documentDate", body.documentDate);
        }
        if (body.expiresAt) {
          formData.append("expiresAt", body.expiresAt);
        }
        if (body.signaturesRequired != null) {
          formData.append(
            "signaturesRequired",
            String(body.signaturesRequired),
          );
        }
        return {
          url: "/documents/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [
        { type: "IssuerDocuments", id: "LIST" },
        { type: "IssuerDocuments", id: "SUMMARY" },
        { type: "IssuerDocuments", id: "CATEGORIES" },
      ],
    }),
  }),
});

export const {
  useGetIssuerDocumentsSummaryQuery,
  useGetIssuerDocumentCategoriesQuery,
  useListIssuerDocumentsQuery,
  useGetIssuerDocumentQuery,
  useUploadIssuerDocumentMutation,
} = issuerDocumentsApi;
