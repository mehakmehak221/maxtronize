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
import { clearAccessToken, persistAccessToken } from "@/lib/authToken";

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
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistAccessToken(data);
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
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistAccessToken(data);
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
    getProfile: build.query<unknown, void>({
      query: () => ({ url: "/auth/profile", method: "GET" }),
      providesTags: ["User"],
    }),
    updateProfile: build.mutation<unknown, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    setupProfile: build.mutation<unknown, SetupProfileRequest>({
      query: (body) => ({
        url: "/auth/setup-profile",
        method: "POST",
        body,
      }),
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
