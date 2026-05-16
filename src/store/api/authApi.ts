import { isAuthenticated, signOut } from "@/lib/auth";
import { syncSessionFromAuthResponse } from "@/lib/authSession";
import { parseProfile, type UserProfile } from "@/lib/profile";
import { clearAccessToken, persistAccessToken } from "@/lib/authToken";
import { baseApi } from "./baseApi";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SetupProfileRequest,
  UpdateProfileRequest,
  VerifyForgotPasswordOtpRequest,
} from "./auth.types";

export type { AuthRole } from "./auth.types";
export type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SetupProfileRequest,
  UpdateProfileRequest,
  VerifyForgotPasswordOtpRequest,
} from "./auth.types";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    register: build.mutation<unknown, RegisterRequest>({
      query: (body) => {
        const payload: Record<string, string> = {
          fullName: body.fullName,
          email: body.email,
          password: body.password,
          role: body.role,
        };
        const ref = body.referralCode?.trim();
        if (ref) payload.referralCode = ref;
        return {
          url: "/auth/register",
          method: "POST",
          body: payload,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistAccessToken(data);
          syncSessionFromAuthResponse(data, {
            email: arg.email,
            role: arg.role,
          });
        } catch {
          /* handled by caller */
        }
      },
    }),
    login: build.mutation<unknown, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistAccessToken(data);
          syncSessionFromAuthResponse(data, {
            email: arg.email,
            role: arg.role,
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
        body,
      }),
      transformResponse: (response: unknown) => parseProfile(response),
      invalidatesTags: ["User"],
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
  useRegisterMutation,
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
