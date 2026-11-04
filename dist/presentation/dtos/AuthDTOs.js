"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterUserSchema = void 0;
const zod_1 = require("zod");
exports.RegisterUserSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: 'El nombre completo es requerido' })
        .min(3, { error: 'El nombre completo debe tener al menos 3 caracteres' })
        .max(100, { error: 'El nombre completo no puede exceder 100 caracteres' }),
    email: zod_1.z
        .email({ error: 'Formato de correo electrónico inválido' }),
    password: zod_1.z
        .string({ error: 'La contraseña es requerida' })
        .min(8, { error: 'La contraseña debe tener mínimo 8 caracteres' })
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .email({ error: 'Formato de correo electrónico inválido' }),
    password: zod_1.z
        .string({ error: 'La contraseña es requerida' })
        .min(1, { error: 'La contraseña no puede estar vacía' }),
});
