import { AxiosError } from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useUserStore } from "@/context/useUserStore";
import { authService } from "@/api/auth-service";
import type { RequestPasswordResetDto, ResetPasswordDto, SignInDto, SignUpDto, VerifyEmailDto } from "@/types/common/api-request.interface";
import type { PreviousWindowLocation } from "@/types/common/previous-window-location.interface";

export const saveTokens = async (token: string, refreshToken?: string) => {
  await localStorage.setItem("access_token", token);
  if (refreshToken) await localStorage.setItem("refresh_token", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const useAuthApi = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const signUp = useMutation({
    mutationFn: async (data: SignUpDto) => {
      localStorage.setItem("pending_email", data.email as string);
      return authService.signUp(data).then(res => res.data.data);
    },
    onSuccess: async () => {
      toast.success("Gracias por registrarte. Revisa tu email para verificar tu cuenta.");
    },
    onError: (error: unknown) => {
      console.error(JSON.stringify(error, null, 2));
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Algo salio mal");
      }
    },
  });

  const confirmEmail = useMutation({
    mutationFn: (data: VerifyEmailDto) => authService.confirmEmail(data).then(res => res.data.data),
    onSuccess: () => {
      toast.success("Email verificado exitosamente!");
      localStorage.removeItem("pending_email");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Algo salio mal");
      }
    },
  });

  const signIn = useMutation({
    mutationFn: (data: SignInDto) => authService.signIn(data).then(res => res.data.data),
    onSuccess: async ({ accessToken, refreshToken, user }) => {
      await saveTokens(accessToken, refreshToken);
      setUser(user);
      toast.success("Bienvenido!");

    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Algo salio mal");
      }
    },
  });

  const signInWithGoogle = useMutation({
    mutationFn: (accessToken: string) =>
      authService.signInWithGoogle(accessToken).then(res => res.data.data),
    onSuccess: async ({ accessToken, refreshToken, user }) => {
      await saveTokens(accessToken, refreshToken);
      setUser(user);
      toast.success("Bienvenido!");
      const from =
        (window.history.state as PreviousWindowLocation)?.from?.pathname ||
        "/";
      navigate(from, { replace: true });
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
      authService.refreshAccessToken(refreshToken).then(res => res.data.data),
    onSuccess: async ({ accessToken }) => {
      await saveTokens(accessToken);
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
      toast.success("Instrucciones para restablecer tu contraseña enviadas a tu correo electrónica");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Algo salio mal"
        );
      }
    },
  });

  const resetPassword = useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data).then(res => res.data.data),
    onSuccess: async ({ accessToken, refreshToken, user }) => {
      await saveTokens(accessToken, refreshToken);
      setUser(user);
      toast.success("Restablecimiento de contraseña exitoso!");

    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Algo salio mal"
        );
      }
    },
  });

  const resendVerificationEmail = useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email).then(res => res.data.data),
    onSuccess: () => {
      toast.success("Correo de verificación reenviado exitosamente!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message ||
          "Algo salio mal"
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
