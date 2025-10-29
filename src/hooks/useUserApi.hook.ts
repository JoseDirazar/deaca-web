import { userService } from "@/api/user-service";
import { useUserStore } from "@/context/useUserStore";
import type {
  AccountStatus,
  EditProfileDto,
} from "@/types/common/api-request.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserApi = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  const getUser = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => userService.getUser().then((res) => res?.data),
  });

  const useGetUsers = (queryParams: string) => {
    return useQuery({
      queryKey: ["users", queryParams],
      queryFn: () => userService.getUsers(queryParams).then((res) => res?.data),
    });
  };

  const updateUser = useMutation({
    mutationFn: (data: EditProfileDto) =>
      userService.updateUser(data).then((res) => res?.data),
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success("Avatar updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (error) => {
      toast.error("Error updating avatar");
      console.error(error);
    },
  });

  const updateAvatar = useMutation({
    mutationFn: (formData: FormData) =>
      userService.updateAvatar(formData).then((res) => res?.data),
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success("Avatar updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (error) => {
      toast.error("Error updating avatar");
      console.error(error);
    },
  });

  const changeUserAccountStatus = useMutation({
    mutationFn: (data: { email: string; status: AccountStatus }) =>
      userService.changeUserAccountStatus(data).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message ?? "Usuario actualizado");
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error("Error changing user account status");
      console.error(error);
    },
  });

  return {
    getUser,
    useGetUsers,
    updateUser,
    updateAvatar,
    changeUserAccountStatus,
    sendContactEmail,
    promoteUserToAdmin,
  };
};
