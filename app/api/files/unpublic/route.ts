import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function POST(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    if (!token) {
        redirect('/auth/login')
    }
    const prisma = new PrismaClient()
    const user = await prisma.user.findFirst({ where: { token: token.value } })
    if (!user) {
        redirect('/auth/login')
    }
    const ids: string[] = await request.json()
    await prisma.file.updateMany({ where: { id: { in: ids } }, data: { isPublic: false } })
    return new Response(null, { status: 200 })
}