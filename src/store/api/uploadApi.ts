import { parseUploadFileUrl } from "@/lib/profile";
import { baseApi } from "./baseApi";

export type UploadFileResponse = {
  url: string;
  raw: unknown;
};

export type UploadFileRequest =
  | File
  | {
      file: File;
      folder?: "kyc" | "kyb" | "assets" | "avatars" | "general";
    };

export const uploadApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    uploadFile: build.mutation<UploadFileResponse, UploadFileRequest>({
      query: (input) => {
        const file = input instanceof File ? input : input.file;
        const folder = input instanceof File ? undefined : input.folder;
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/upload/file",
          method: "POST",
          params: folder ? { folder } : undefined,
          body: formData,
        };
      },
      transformResponse: (response: unknown): UploadFileResponse => ({
        url: parseUploadFileUrl(response) ?? "",
        raw: response,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
