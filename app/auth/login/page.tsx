"use client"
import { login } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, loginSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";


export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const form = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(values: loginSchemaType) {
        setIsLoading(true)
        const result = await login(values)
        if (result.success) {
            router.push('/')
        } else {
            form.setError(result.error?.path as "email" | "password" | "root" | `root.${string}`, { message: result.error?.message })
        }
        setIsLoading(false)
    }

    return (
        <div className="flex flex-row justify-center mt-40">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Авторизация</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Пароль</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button type="submit" className="w-full">{isLoading ? <Loader2Icon className="animate-spin" /> : 'Войти в систему'}</Button>
                            <Button type="button" className="w-full" variant="outline" onClick={() => router.push("/auth/registration")}>Зарегистрироваться</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div >
    )
}