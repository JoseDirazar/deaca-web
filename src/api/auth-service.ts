import api from "./axios-instance";
import type { RequestPasswordResetDto, ResetPasswordDto, SignInDto, VerifyEmailDto } from "@/types/common/api-request.interface";
import type { ApiResponse, ConfirmEmailResponse, GoogleAuthResponse, RefreshTokenResponse, RequestPasswordResetResponse, ResetPasswordResponse, SignInResponse, SignOutResponse } from "@/types/common/api-response.interface";
import type { SignUpDto, } from "@/types/common/api-request.interface";


export const authService = {
    signUp: (data: SignUpDto): ApiResponse<SignUpDto> => api.post("/auth/sign-up", data),
    signIn: (data: SignInDto): SignInResponse => api.post("/auth/sign-in", data),
    confirmEmail: (data: VerifyEmailDto): ConfirmEmailResponse => api.post("/auth/confirm-email", data),
    resendVerificationEmail: (email: string): RequestPasswordResetResponse => api.post("/auth/resend-verification-email", { email }),
    signInWithGoogle: (accessToken: string): GoogleAuthResponse =>
        api.post("/auth/google-auth", { accessToken }),
    refreshAccessToken: (accessToken: string): RefreshTokenResponse =>
        api.post("/auth/refresh-token", { accessToken }),
    signOut: (): SignOutResponse => api.post("/auth/sign-out"),
    requestPasswordReset: (data: RequestPasswordResetDto): RequestPasswordResetResponse =>
        api.post("/auth/request-password-reset", data),
    resetPassword: (data: ResetPasswordDto): ResetPasswordResponse =>
        api.post("/auth/reset-password", data),
};

