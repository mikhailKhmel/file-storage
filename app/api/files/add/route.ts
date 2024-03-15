import { fromArrayBufferToBuffer } from "@/lib/utils"
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

    const formData = await request.formData()
    const files = formData.getAll('file') as File[]
    for (let file of files) {
        const data = fromArrayBufferToBuffer(await file.arrayBuffer())
        await prisma.file.create({
            data: {
                //@ts-ignore
                data: data,
                name: file.name,
                userId: user.id,
                type: file.type
            }
        })
    }

    return new Response(null, { status: 200 })
}