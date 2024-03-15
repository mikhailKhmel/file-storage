import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const prisma = new PrismaClient()
    const file = await prisma.file.findFirst({ where: { id: params.id, isPublic: true } })
    if (!file)
        notFound()
    const headers = {
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename=${encodeURI(file.name)}`,
        'Content-Length': file.data.byteLength.toString()
    }
    return new Response(file.data, { headers })
}