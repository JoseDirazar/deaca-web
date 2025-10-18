import Button from "@/component/ui/Button";
import OutletForm from "@/component/ui/form/OutletForm";
import Input from "@/component/ui/Input";
import UserAvatar from "@/component/ui/user/UserAvatar";
import { useUserStore } from "@/context/useUserStore";
import { LuLoader } from "react-icons/lu";
import type { User } from "@/types/user/user.interface";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useUserApi } from "@/hooks/useUserApi.hook";
import PageContainer from "@/component/ui/PageContainer";
import PageHeader from "@/component/PageHeader";

export default function UserProfilePage() {
  const { user } = useUserStore();
  const [form, setForm] = useState<Partial<User>>({
    firstName: user?.firstName,
    lastName: user?.lastName,
  });
  const { updateAvatar, updateUser } = useUserApi();

  const {
    mutateAsync: updateUserAsync,
    isPending: isUpdatingUser,
    isError: isErrorUpdateUser,
    error: errorUpdateUser,
  } = updateUser;
  const {
    mutateAsync: updateAvatarAsync,
    isPending: isUpdatingAvatar,
    isError: isErrorUpdateAvatar,
    error: errorUpdateAvatar,
  } = updateAvatar;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await updateAvatarAsync(formData);
  };

  return (
    <PageContainer>
      <PageHeader title="Perfil" description="Gestiona tu perfil de usuario" />
      <OutletForm
        onSubmit={(e) => {
          e.preventDefault();
          updateUserAsync(form);
        }}
      >
        <div className="relative w-fit">
          <input
            type="file"
            id="photo"
            className="hidden"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          <UserAvatar avatar={user?.avatar} />
          <Button
            type="button"
            onClick={() => document.getElementById("photo")?.click()}
            disabled={isUpdatingAvatar}
            icon={
              isUpdatingAvatar ? <LuLoader size={20} /> : <IoAdd size={20} />
            }
            className="absolute right-0 bottom-0 flex items-center justify-center rounded-full p-2 text-center"
          />
        </div>
        <Input
          type="text"
          id="firstName"
          title="Nombre"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <Input
          type="text"
          id="lastName"
          title="Apellido"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <Input
          type="email"
          id="email"
          title="Email"
          value={user?.email}
          disabled
        />

        <Button
          type="submit"
          disabled={isUpdatingUser}
          label={isUpdatingUser ? "Actualizando..." : "Actualizar perfil"}
        />
      </OutletForm>
      {isErrorUpdateUser && (
        <p className="text-red-500">{errorUpdateUser?.message}</p>
      )}
      {isErrorUpdateAvatar && (
        <p className="text-red-500">{errorUpdateAvatar?.message}</p>
      )}
      {isUpdatingUser && <p className="text-red-500">Actualizando...</p>}
      {isUpdatingAvatar && <p className="text-red-500">Actualizando...</p>}
    </PageContainer>
  );
}
