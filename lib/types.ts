import { File } from "@prisma/client";
import { registrationSchemaType } from "./schemas";


export type AuthResult = {
    success: boolean;
    error?: {
        path: keyof registrationSchemaType, message: string;
    }
}

export type FileModel = File & {
    size: number
}