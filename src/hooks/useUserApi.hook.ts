import { userService } from "@/api/user-service";
import { useUserStore } from "@/context/useUserStore";
import type { EditProfileDto } from "@/types/common/api-request.interface";
import type { AccountStatus } from "@/types/enums/account-status.enum";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { QueryKeys } from "@/api/query-keys";

export const useUserApi = () => {
  const { setUser } = useUserStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getUser = useQuery({
    queryKey: [QueryKeys.USER],
    queryFn: () => userService.getUser().then((res) => res?.data),
  });

  const useGetUsers = (queryParams: string) => {
    return useSuspenseQuery({
      queryKey: [QueryKeys.USERS, queryParams],
      queryFn: () => userService.getUsers(queryParams).then((res) => res?.data),
    });
  };

  const useGetAdminUsersChart = () => {
    return useQuery({
      queryKey: [QueryKeys.ADMIN_USERS_CHART],
      queryFn: () => userService.getAdminUsersChart().then((res) => res?.data),
    });
  };

  const updateUser = useMutation({
    mutationFn: (data: EditProfileDto) =>
      userService.updateUser(data).then((res) => res?.data),
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success("Perfil actualizado");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: (error) => {
      toast.error("Error actualizando perfil");
      console.error(error);
    },
  });

  const updateAvatar = useMutation({
    mutationFn: (formData: FormData) =>
      userService.updateAvatar(formData).then((res) => res?.data),
    onSuccess: ({ data }) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: (error) => {
      toast.error("Error actualizando avatar");
      console.error(error);
    },
  });

  const changeUserAccountStatus = useMutation({
    mutationFn: (data: { email: string; status: AccountStatus }) =>
      userService.changeUserAccountStatus(data).then((res) => res?.data),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      toast.success(message ?? "Usuario actualizado");
    },
    onError: (error) => {
      toast.error("Error changing user account status");
      console.error(error);
    },
  });

  const sendContactEmail = useMutation({
    mutationFn: (data: { name: string; email: string; message: string }) =>
      userService.sendContactEmail(data).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message ?? "Email sent successfully");
    },
    onError: (error) => {
      toast.error("Error sending email");
      console.error(error);
    },
  });

  const promoteUserToAdmin = useMutation({
    mutationFn: (data: { email: string }) =>
      userService.promoteUserToAdmin(data).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message ?? "Usuario actualizado");
    },
    onError: (error) => {
      toast.error("Error changing user account status");
      console.error(error);
    },
  });

  const becomeBusinessOwner = useMutation({
    mutationFn: (data: { email: string }) =>
      userService.becomeBusinessOwner(data).then((res) => res?.data),
    onSuccess: ({ message, data }) => {
      setUser(data);
      toast.success(message ?? "Usuario actualizado");
      navigate("/usuario/emprendimientos", {
        state: { from: "become-business-owner" },
      });
    },
    onError: (error) => {
      toast.error("Error changing user account status");
      console.error(error);
    },
  });

  return {
    getUser,
    useGetUsers,
    useGetAdminUsersChart,
    updateUser,
    updateAvatar,
    changeUserAccountStatus,
    sendContactEmail,
    promoteUserToAdmin,
    becomeBusinessOwner,
  };
};
