import Center from "@/components/center";
import { PrismaClient } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const cookieStorage = cookies()
  const token = cookieStorage.get('token')
  if (!token)
    redirect('/auth/login')
  const prisma = new PrismaClient()
  const user = await prisma.user.findFirst({ where: { token: token.value } })
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <Center>
      <Loader2 className="animate-spin size-12" />
    </Center>
  )
}