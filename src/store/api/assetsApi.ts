import {
  parseAssetDetail,
  parseAssetDocuments,
  parseAssetList,
  parseAssetOffering,
  parseAssetTokenization,
  type AssetDetail,
  type AssetDocument,
  type AssetOffering,
  type AssetTokenization,
  type MarketplaceAsset,
} from "@/lib/assets";
import { baseApi } from "./baseApi";

export const assetsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    listAssets: build.query<MarketplaceAsset[], void>({
      query: () => ({ url: "/assets", method: "GET" }),
      transformResponse: (response: unknown) => parseAssetList(response),
      providesTags: [{ type: "Asset", id: "LIST" }],
    }),
    getAsset: build.query<AssetDetail | null, string>({
      query: (id) => ({ url: `/assets/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => parseAssetDetail(response),
      providesTags: (_result, _error, id) => [{ type: "Asset", id }],
    }),
    getAssetDocuments: build.query<AssetDocument[], string>({
      query: (id) => ({ url: `/assets/${id}/documents`, method: "GET" }),
      transformResponse: (response: unknown) => parseAssetDocuments(response),
      providesTags: (_result, _error, id) => [
        { type: "Asset", id: `${id}-documents` },
      ],
    }),
    getAssetOffering: build.query<AssetOffering | null, string>({
      query: (id) => ({ url: `/assets/${id}/offering`, method: "GET" }),
      transformResponse: (response: unknown) => parseAssetOffering(response),
      providesTags: (_result, _error, id) => [
        { type: "Asset", id: `${id}-offering` },
      ],
    }),
    getAssetTokenization: build.query<AssetTokenization | null, string>({
      query: (id) => ({ url: `/assets/${id}/tokenization`, method: "GET" }),
      transformResponse: (response: unknown) =>
        parseAssetTokenization(response),
      providesTags: (_result, _error, id) => [
        { type: "Asset", id: `${id}-tokenization` },
      ],
    }),
  }),
});

export const {
  useListAssetsQuery,
  useGetAssetQuery,
  useGetAssetDocumentsQuery,
  useGetAssetOfferingQuery,
  useGetAssetTokenizationQuery,
} = assetsApi;
