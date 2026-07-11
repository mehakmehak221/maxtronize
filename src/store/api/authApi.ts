import { isAuthenticated, signOut } from "@/lib/auth";
import { syncSessionFromAuthResponse } from "@/lib/authSession";
import { parseProfile, type UserProfile } from "@/lib/profile";
import { clearAccessToken, persistAccessToken } from "@/lib/authToken";
import { baseApi } from "./baseApi";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SendOtpRequest,
  SetupProfileRequest,
  UpdateProfileRequest,
  VerifyForgotPasswordOtpRequest,
  VerifyOtpRequest,
} from "./auth.types";

export type { AuthRole } from "./auth.types";
export type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SendOtpRequest,
  SetupProfileRequest,
  UpdateProfileRequest,
  VerifyForgotPasswordOtpRequest,
  VerifyOtpRequest,
} from "./auth.types";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    sendOtp: build.mutation<unknown, SendOtpRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: build.mutation<unknown, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistAccessToken(data);
          syncSessionFromAuthResponse(data, {
            email: arg.email,
          });
        } catch {
          /* handled by caller */
        }
      },
    }),
    login: build.mutation<unknown, LoginRequest>({
      query: (body) => {
        const { rememberMe, ...apiBody } = body;
        return {
          url: "/auth/login",
          method: "POST",
          body: apiBody,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistAccessToken(data, arg.rememberMe);
          syncSessionFromAuthResponse(data, {
            email: arg.email,
            role: arg.role,
            rememberMe: arg.rememberMe,
          });
        } catch {
          /* handled by caller */
        }
      },
    }),
    forgotPassword: build.mutation<unknown, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyForgotPasswordOtp: build.mutation<
      unknown,
      VerifyForgotPasswordOtpRequest
    >({
      query: (body) => ({
        url: "/auth/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation<unknown, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: build.query<UserProfile | null, void>({
      query: () => ({ url: "/auth/profile", method: "GET" }),
      transformResponse: (response: unknown) => parseProfile(response),
      providesTags: ["User"],
    }),
    updateProfile: build.mutation<UserProfile | null, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: {
          fullName: body.fullName.trim(),
          country: body.country.trim(),
          ...(body.dateOfBirth?.trim() ? { dateOfBirth: body.dateOfBirth.trim() } : {}),
          ...(body.residentialAddress?.trim() ? { residentialAddress: body.residentialAddress.trim() } : {}),
        },
        responseHandler: async (response) => {
          const text = await response.text();
          if (!response.ok) {
            throw new Error(text.trim() || response.statusText);
          }
          if (!text.trim()) return null;
          try {
            return JSON.parse(text) as unknown;
          } catch {
            return text;
          }
        },
      }),
      transformResponse: (response: unknown) =>
        response ? parseProfile(response) : null,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const trimmedName = arg.fullName.trim();
        const trimmedCountry = arg.country.trim();
        const patchResult = dispatch(
          authApi.util.updateQueryData("getProfile", undefined, (draft) => {
            if (!draft) return;
            draft.fullName = trimmedName;
            draft.country = trimmedCountry;
            draft.nationality = trimmedCountry;
            if (arg.dateOfBirth?.trim()) {
              draft.dateOfBirth = arg.dateOfBirth.trim();
            }
            if (arg.residentialAddress?.trim()) {
              draft.residentialAddress = arg.residentialAddress.trim();
            }
          }),
        );
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              authApi.util.updateQueryData("getProfile", undefined, () => data),
            );
          }
        } catch {
          patchResult.undo();
        }
      },
    }),
    setupProfile: build.mutation<UserProfile | null, SetupProfileRequest>({
      query: (body) => ({
        url: "/auth/setup-profile",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => parseProfile(response),
      invalidatesTags: ["User"],
    }),
    logout: build.mutation<unknown, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          /* still end local session */
        }
        signOut();
        clearAccessToken();
        dispatch(baseApi.util.resetApiState());
      },
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useSetupProfileMutation,
  useLogoutMutation,
} = authApi;

/** Skips the request until the user has signed in through the app (avoids 401 noise). */
export function useAuthenticatedProfileQuery(
  options?: Parameters<typeof useGetProfileQuery>[1],
) {
  const skipUnauthenticated =
    typeof window !== "undefined" && !isAuthenticated();
  return useGetProfileQuery(undefined, {
    ...options,
    skip: skipUnauthenticated || options?.skip === true,
  });
}
