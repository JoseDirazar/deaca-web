import { AxiosError } from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useUserStore } from "@/context/useUserStore";
import { authService } from "@/api/auth-service";
import type { RequestPasswordResetDto, ResetPasswordDto, SignInDto, SignUpDto, VerifyEmailDto } from "@/types/common/api-request.interface";
import type { PreviousWindowLocation } from "@/types/common/previous-window-location.interface";
import { useAuthStore } from "@/context/useAuthStore";
import { userService } from "@/api/user-service";

export const useAuthApi = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();

  const signUp = useMutation({
    mutationFn: async (data: SignUpDto) => {
      localStorage.setItem("pending_email", data.email as string);
      return authService.signUp(data).then(res => res.data);
    },
    onSuccess: async ({ message }) => {
      toast.success(message);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });

  const signIn = useMutation({
    mutationFn: (data: SignInDto) => authService.signIn(data).then(res => res.data),
    onSuccess: async ({ data: { accessToken }, message }) => {
      toast.success(message);
      setAccessToken(accessToken);
      const userResponse = await userService.getUser();
      setUser(userResponse.data.data);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });
  const signInWithGoogle = useMutation({
    mutationFn: (accessToken: string) =>
      authService.signInWithGoogle(accessToken).then(res => res.data),
    onSuccess: async ({ message, data: { accessToken } }) => {
      toast.success(message);
      setAccessToken(accessToken);
      const userResponse = await userService.getUser();
      setUser(userResponse.data.data);
      const from = (window.history.state as PreviousWindowLocation)?.from?.pathname || "/";
      navigate(from, { replace: true });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });

  const refreshToken = useMutation({
    mutationFn: (refreshToken: string) =>
      authService.refreshAccessToken(refreshToken).then(res => res.data),
    onSuccess: async ({ data: { accessToken } }) => {
      setAccessToken(accessToken);
    },
  });

  const signOut = useMutation({
    mutationFn: () => authService.signOut().then(res => res.data),
    onSuccess: async ({ message }) => {
      setUser(null);
      setAccessToken(null);
      queryClient.clear();
      toast.success(message);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });


  const confirmEmail = useMutation({
    mutationFn: (data: VerifyEmailDto) => authService.confirmEmail(data).then(res => res.data),
    onSuccess: ({ message }) => {
      toast.success(message);
      localStorage.removeItem("pending_email");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });


  const requestPasswordReset = useMutation({
    mutationFn: (data: RequestPasswordResetDto) =>
      authService.requestPasswordReset(data).then(res => res.data),
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });

  const resetPassword = useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data).then(res => res.data),
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
    },
  });

  const resendVerificationEmail = useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email).then(res => res.data),
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof AxiosError ? error?.response?.data?.message : "Algo salio mal");
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
