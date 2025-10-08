import api from "./axios-instance";
import type { RequestPasswordResetDto, ResetPasswordDto, SignInDto, VerifyEmailDto } from "@/types/common/api-request.interface";
import type { ApiResponse, ConfirmEmailResponse, GoogleAuthResponse, RefreshTokenResponse, RequestPasswordResetResponse, ResetPasswordResponse, SignInResponse, SignOutResponse } from "@/types/common/api-response.interface";
import type { SignUpDto, } from "@/types/common/api-request.interface";


export const authService = {
    signUp: (data: SignUpDto): ApiResponse<SignUpDto> => api.post("/auth/sign-up", data),
    signIn: (data: SignInDto): SignInResponse => api.post("/auth/login", data),
    signInWithGoogle: (accessToken: string): GoogleAuthResponse =>
        api.post("/auth/google-auth", { accessToken }),
    signOut: (): SignOutResponse => api.post("/auth/logout"),
    refreshAccessToken: (accessToken: string): RefreshTokenResponse =>
        api.post("/auth/refresh", { accessToken }),
    confirmEmail: (data: VerifyEmailDto): ConfirmEmailResponse => api.post("/auth/confirm-email", data),
    resendVerificationEmail: (email: string): RequestPasswordResetResponse => api.post("/auth/resend-verification-email", { email }),
    requestPasswordReset: (data: RequestPasswordResetDto): RequestPasswordResetResponse =>
        api.post("/auth/request-password-reset", data),
    resetPassword: (data: ResetPasswordDto): ResetPasswordResponse =>
        api.post("/auth/reset-password", data),
};

