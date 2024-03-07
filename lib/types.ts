import { registrationSchemaType } from "./schemas";


export type AuthResult = {
    success: boolean;
    error?: {
        path: keyof registrationSchemaType, message: string;
    }
}