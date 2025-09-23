import type { User } from "@/types/user/user.interface";
import api from "./axios-instance";
import type { AuthResponse, ConfirmEmailRequest, RequestPasswordResetDto, ResetPasswordDto, SignUp } from "@/types/common/api-request.interface";

export const authService = {
    signUp: (data: SignUp) => api.post("/auth/sign-up", data),
    confirmEmail: (data: ConfirmEmailRequest) =>
        api.post("/auth/confirm-email", data),
    resendVerificationEmail: (email: string) =>
        api.post("/auth/resend-verification-email", { email }),
    signIn: (
        data: Partial<User>,
    ): Promise<{ data: AuthResponse }> =>
        api.post("/auth/sign-in", data),
    signInWithGoogle: (token: string) =>
        api.post("/auth/sign-in-with-google", { token }),
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

