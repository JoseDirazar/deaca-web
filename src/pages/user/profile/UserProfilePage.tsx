import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from "@/context/useUserStore";
import { useUserApi } from "@/hooks/useUserApi.hook";
import { z } from 'zod';

// Definir los esquemas de validación
const userProfileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const avatarSchema = z
  .instanceof(FileList)
  .refine(files => files.length > 0, 'Se requiere una imagen')
  .refine(
    files => files[0]?.type.startsWith('image/'),
    'El archivo debe ser una imagen'
  )
  .refine(
    files => files[0]?.size <= 5 * 1024 * 1024, // 5MB
    'La imagen no puede pesar más de 5MB'
  );
import { LuLoader } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import Button from "@/component/ui/Button";
import Input from "@/component/ui/Input";
import UserAvatar from "@/component/ui/user/UserAvatar";
import PageHeader from "@/component/PageHeader";
import { toast } from "sonner";
import { useState } from 'react';

export default function UserProfilePage() {
  const { user } = useUserStore();
  const { updateAvatar, updateUser } = useUserApi();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    }
  });

  const { mutateAsync: updateUserAsync } = updateUser;
  const { mutateAsync: updateAvatarAsync } = updateAvatar;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      
      // Validar el archivo
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('La imagen no puede pesar más de 5MB');
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      await updateAvatarAsync(formData);
      toast.success('Foto de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar el avatar:', error);
      toast.error('Error al actualizar la foto de perfil');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      await updateUserAsync(data);
      toast.success('Perfil actualizado correctamente');
      reset(data); // Resetear el formulario con los nuevos valores
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  return (
    <>
      <PageHeader title="Perfil" description="Gestiona tu perfil de usuario" />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="relative w-fit">
          <input
            type="file"
            id="photo"
            className="hidden"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
          />
          <UserAvatar avatar={user?.avatar} />
          <Button
            type="button"
            onClick={() => document.getElementById("photo")?.click()}
            disabled={isUploading}
            icon={isUploading ? <LuLoader className="animate-spin" size={20} /> : <IoAdd size={20} />}
            className="absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-primary p-2 text-white hover:bg-primary/90"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              id="firstName"
              title="Nombre"
              {...register('firstName')}
            />
            {errors.firstName?.message && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <Input
              type="text"
              id="lastName"
              title="Apellido"
              {...register('lastName')}
            />
            {errors.lastName?.message && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          
          <div>
            <Input
              type="email"
              id="email"
              title="Email"
              value={user?.email || ''}
              disabled
              className="opacity-70 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar perfil'}
        </button>
      </form>
    </>
  );
}
