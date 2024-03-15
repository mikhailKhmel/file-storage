"use client"
import { registration } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registrationSchema, registrationSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


export default function RegistrationPage() {
    const router = useRouter()
    const form = useForm<registrationSchemaType>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(values: registrationSchemaType) {
        const result = await registration(values)
        if (result.success) {
            return router.push('/home')
        } else {
            form.setError(result.error?.path as "email" | "password" | "confirmPassword" | "root" | `root.${string}`, { message: result.error?.message })
        }
    }

    return (
        <div className="flex flex-row justify-center mt-40">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Регистрация</CardTitle>
                            <CardDescription></CardDescription>
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Подтвердите Пароль</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button type="submit" className="w-full">Зарегистрироваться в системе</Button>
                            <Button type="button" className="w-full" variant="outline" onClick={() => router.push("/auth/login")}>Авторизоваться</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}