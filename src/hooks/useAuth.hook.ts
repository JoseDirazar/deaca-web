import { AxiosError } from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useUserStore } from "../context/useUserStore";
import type { User } from "../types/user/user.interface";
import { authService } from "../api/auth-service";
import type { RequestPasswordResetDto, ResetPasswordDto, SignUp, VerifyEmailDto } from "../types/common/api-request.interface";
import type { PreviousWindowLocation } from "../types/common/previous-window-location.interface";


type SignInWithGoogleResponse = {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  user: User
};

export const saveTokens = async (token: string, refreshToken?: string) => {
  await localStorage.setItem("access_token", token);
  if (refreshToken) await localStorage.setItem("refresh_token", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const signUp = useMutation({
    mutationFn: async (data: Partial<User>) => {
      localStorage.setItem("pending_email", data.email as string);
      return authService.signUp(data as SignUp);
    },
    onSuccess: async (response) => {
      const { accessToken, refreshToken, ok } = response.data;
      if (ok) {
        await saveTokens(accessToken, refreshToken);
        toast.success(
          "Successfully signed up! Please check your email to verify your account."
        );
      }
    },
    onError: (error: unknown) => {
      console.error(JSON.stringify(error, null, 2));
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to sign up");
      }
    },
  });

  const confirmEmail = useMutation({
    mutationFn: (data: VerifyEmailDto) => authService.confirmEmail(data),
    onSuccess: () => {
      toast.success("Email verified successfully!");
      localStorage.removeItem("pending_email");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to verify email");
      }
    },
  });

  const signIn = useMutation({
    mutationFn: (data: Partial<User>) => authService.signIn(data),
    onSuccess: async (response) => {
      const { accessToken, refreshToken, ok, user } = response.data;
      if (ok) {
        await saveTokens(accessToken, refreshToken);
        setUser(user);
        toast.success("Successfully signed in!");
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to sign in");
      }
    },
  });

  const signInWithGoogle = useMutation({
    mutationFn: (accessToken: string) =>
      authService.signInWithGoogle(accessToken),
    onSuccess: async (response: { data: SignInWithGoogleResponse }) => {
      const { accessToken, refreshToken, user, ok } = response.data;
      if (ok) {
        await saveTokens(accessToken, refreshToken);
        setUser(user);
        toast.success("Successfully signed in with Google!");
        const from =
          (window.history.state as PreviousWindowLocation)?.from?.pathname ||
          "/";
        navigate(from, { replace: true });
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to sign in with Google"
        );
      }
    },
  });

  const refreshToken = useMutation({
    mutationFn: (refreshToken: string) =>
      authService.refreshToken(refreshToken),
    onSuccess: async (response) => {
      const { accessToken, ok } = response.data;
      if (ok) {
        await saveTokens(accessToken);
      }
    },
  });

  const signOut = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: async () => {
      clearTokens();
      setUser(null);
      queryClient.clear();
      toast.success("Successfully signed out");
    },
    onError: () => {
      toast.error("Failed to sign out");
    },
  });

  const requestPasswordReset = useMutation({
    mutationFn: (data: RequestPasswordResetDto) =>
      authService.requestPasswordReset(data),
    onSuccess: () => {
      toast.success("Password reset instructions sent to your email");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to request password reset"
        );
      }
    },
  });

  const resetPassword = useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
    onSuccess: async (response) => {
      const { token, refreshToken, user } = response.data;
      if (token && refreshToken) {
        await saveTokens(token, refreshToken);
        setUser(user);
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to reset password"
        );
      }
    },
  });

  const resendVerificationEmail = useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email),
    onSuccess: () => {
      toast.success("Verification email resent successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message ||
          "Failed to resend verification email"
        );
      }
    },
  });

  return {
    signUp,
    confirmEmail,
    signIn,
    signInWithGoogle,
    refreshToken,
    signOut,
    requestPasswordReset,
    resetPassword,
    resendVerificationEmail,
  };
};
