import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z
    .string({ error: 'El nombre completo es requerido' })
    .min(3, { error: 'El nombre completo debe tener al menos 3 caracteres' })
    .max(100, { error: 'El nombre completo no puede exceder 100 caracteres' }),
  email: z
    .email({ error: 'Formato de correo electrónico inválido' }),
  password: z
    .string({ error: 'La contraseña es requerida' })
    .min(8, { error: 'La contraseña debe tener mínimo 8 caracteres' })
});

export const LoginSchema = z.object({
  email: z
    .email({ error: 'Formato de correo electrónico inválido' }),
  password: z
    .string({ error: 'La contraseña es requerida' })
    .min(1, { error: 'La contraseña no puede estar vacía' }),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;