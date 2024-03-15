import { ITEMS_COUNT } from "@/lib/utils"
import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
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

    let page: string | null | number = request.nextUrl.searchParams.get('page')
    if (!page) {
        page = '1'
    }
    page = (+page) - 1
    if (page < 0) {
        page = 0
    }
    const files = await prisma.file.findMany({ where: { userId: user.id }, skip: page * ITEMS_COUNT, take: ITEMS_COUNT })
    const count = await prisma.file.count({ where: { userId: user.id } })
    const data = files.map(file => ({ ...file, size: file.data.byteLength, data: null }))
    return Response.json({ data, count })
}