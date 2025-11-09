import { z } from 'zod';

// Esquema para el perfil de usuario
export const userProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El nombre solo puede contener letras y espacios'),
  
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El apellido solo puede contener letras y espacios'),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// Esquema para la subida de archivos
export const avatarSchema = z.instanceof(FileList)
  .transform(files => files.item(0))
  .refine(file => {
    return !file || (file instanceof File && file.size <= 5 * 1024 * 1024);
  }, 'La imagen no puede pesar más de 5MB')
  .refine(file => {
    return !file || file.type.startsWith('image/');
  }, 'El archivo debe ser una imagen');
