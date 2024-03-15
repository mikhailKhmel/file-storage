'use server'

import { fileSchemaType, loginSchemaType, registrationSchemaType } from "@/lib/schemas";
import { AuthResult } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

export async function registration(values: registrationSchemaType): Promise<AuthResult> {
    const prisma = new PrismaClient()
    const user = await prisma.user.findFirst({ where: { email: values.email } })
    if (user) {
        return { success: false, error: { path: "email", message: "Алло, такой пользователь уже существует" } }
    }

    const hashedPassword = await bcrypt.hash(values.password, 10)
    const token = jwt.sign({ email: values.email, password: values.password }, process.env.SECRET_KEY as string)
    await prisma.user.create({
        data: {
            email: values.email,
            password: hashedPassword,
            token: token
        }
    })

    const cookieStorage = cookies()
    cookieStorage.set('token', token)

    return { success: true }
}

export async function login(values: loginSchemaType): Promise<AuthResult> {
    const prisma = new PrismaClient()
    const user = await prisma.user.findFirst({ where: { email: values.email } })
    if (!user) {
        return { success: false, error: { path: "email", message: "Алло, такого пользователя нет!" } }
    }

    const result = await bcrypt.compare(values.password, user.password)
    if (!result) {
        return { success: false, error: { path: "password", message: "Алло, неверный пароль" } }
    }

    const cookieStorage = cookies()
    cookieStorage.set('token', user.token)

    return { success: true }
}

export async function upload(values: any) {
    console.log(values)
}