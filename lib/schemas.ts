import { z } from "zod";

export const registrationSchema = z.object({
    email: z.string().email({ message: "Алло, где эмейл?" }),
    password: z.string().min(4, { message: "Алло, пароль маленький" }),
    confirmPassword: z.string().min(4, { message: "Алло, пароль меленький" })
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // path of error
    message: "Алло, пароли не совпадают",
})

export type registrationSchemaType = z.infer<typeof registrationSchema>

export const loginSchema = z.object({
    email: z.string().email({ message: "Алло, где эмейл?" }),
    password: z.string().min(4, { message: "Алло, пароль маленький" }),
})

export type loginSchemaType = z.infer<typeof loginSchema>

const MAX_FILE_SIZE = 20000000;
export const fileSchema = z.object({
    data: z.any()
        .refine((file: File) => file?.size !== 0, "Алло, файл обязателен")
})
export type fileSchemaType = z.infer<typeof fileSchema>