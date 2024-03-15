import Center from "@/components/center"

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <Center>
            {children}
        </Center>
    )
}