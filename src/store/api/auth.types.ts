export type AuthRole = "INVESTOR" | "ISSUER" | "ADMIN" | "AGENT";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  role: AuthRole;
  referralCode?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  role: AuthRole;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyForgotPasswordOtpRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export type UpdateProfileRequest = {
  fullName?: string;
  country?: string;
};

export type SetupProfileRequest = {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  residentialAddress: string;
};
