import { parseUploadFileUrl } from "@/lib/profile";
import { baseApi } from "./baseApi";

export type UploadFileResponse = {
  url: string;
  raw: unknown;
};

export const uploadApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    uploadFile: build.mutation<UploadFileResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/upload/file",
          method: "POST",
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
