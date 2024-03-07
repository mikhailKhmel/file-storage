import useAuth from "@/lib/hooks/useAuth"
import { redirect } from "next/navigation"

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    const { isAuth } = await useAuth()
    if (!isAuth) {
        redirect('/auth/login')
    }

    return (
        <>
            {children}
        </>
    )
}