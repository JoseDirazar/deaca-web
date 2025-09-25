import type { AuthResponse, RequestPasswordResetDto, ResetPasswordDto, SignUp, VerifyEmailDto } from "../types/common/api-request.interface";
import type { User } from "../types/user/user.interface";
import api from "./axios-instance";

export const authService = {
    signUp: (data: SignUp) => api.post("/auth/sign-up", data),
    confirmEmail: (data: VerifyEmailDto) =>
        api.post("/auth/confirm-email", data),
    resendVerificationEmail: (email: string) =>
        api.post("/auth/resend-verification-email", { email }),
    signIn: (
        data: Partial<User>,
    ): Promise<{ data: AuthResponse }> =>
        api.post("/auth/sign-in", data),
    signInWithGoogle: (accessToken: string) =>
        api.post("/auth/google-auth", { accessToken }),
    refreshToken: (
        refreshToken: string,
    ): Promise<{ data: AuthResponse }> =>
        api.post("/auth/refresh-token", { refreshToken }),
    signOut: () => api.post("/auth/sign-out"),
    requestPasswordReset: (data: RequestPasswordResetDto) =>
        api.post("/auth/request-password-reset", data),
    resetPassword: (data: ResetPasswordDto) =>
        api.post("/auth/reset-password", data),
};

