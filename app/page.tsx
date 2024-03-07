import Center from "@/components/center";
import useAuth from "@/lib/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const { isAuth } = await useAuth()
  if (!isAuth) {
    redirect('/auth/login')
  } else {
    redirect('/home')
  }
  return (
    <Center>
      <Loader2 className=" animate-spin size-12" />
    </Center>
  )
}