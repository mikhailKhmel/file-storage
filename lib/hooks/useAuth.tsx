import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

export default async function useAuth() {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    if (!token) {
        return { isAuth: false }
    }
    const prisma = new PrismaClient()
    const user = prisma.user.findFirst({ where: { token: token.value } })
    if (!user) {
        return { isAuth: false }
    }

    return { isAuth: true }
}