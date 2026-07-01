"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs"
import Link from "next/link"
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import { toast } from 'sonner'

type inputs = {
    email: string,
    password: string
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<inputs>()
    const router = useRouter()
    const [role, setRole] = useState("USER")
    const onSubmit: SubmitHandler<inputs> = async (data) => {
        try {
            // Use NextAuth signIn to automatically handle secure HTTP-only cookies
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                role:role,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Invalid credentials")
                return
            }

            // ─── ROLE VALIDATION CHECK IS HANDLED SECURELY BY AUTH.TS ───
            // If they reach here, the credentials provider has successfully verified the role!
            toast.success(`Logged in successfully`)
            
            // Use window.location.href to force a hard navigation so the session cookie is immediately picked up by the server
            if (role === "USER") {
                window.location.href = '/dashboard/spotter/search'
            } else {
                window.location.href = '/dashboard/owner'
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong.")
        }
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2 ">
            <Tabs value={role} onValueChange={(newRole) => { setRole(newRole); reset() }} className="w-full max-w-md bg-card border-none rounded-2xl shadow-2xl text-center">
                <Card className="p-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6 mt-4">

                            {/* Toggle Switch */}
                            <TabsList className="grid w-full grid-cols-2 bg-background/50 mb-8 p-1 rounded-lg">
                                <TabsTrigger value="USER" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-wider text-[11px]">
                                    Spotter/Driver
                                </TabsTrigger>
                                <TabsTrigger value="OWNER" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase tracking-wider text-[11px] ">
                                    Owner
                                </TabsTrigger>
                            </TabsList>


                            {/* User/Driver Login Fields */}

                            <CardHeader className="space-y-3">
                                <CardTitle className="font-fraunces text-3xl font-medium">
                                    {role === "USER"
                                        ? <>Welcome Back<span className="text-primary">→</span></>
                                        : <>Owner Portal<span className="text-primary">→</span></>
                                    }
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {role === "USER"
                                        ? <>Sign in to find and book your perfect parking spot.</>
                                        : <>Sign in to manage your parking inventory and track your earnings.</>
                                    }
                                </CardDescription>
                            </CardHeader>

                            <Label className="text-[11px] uppercase tracking-widest text-primary font-semibold">Email</Label>
                            <Input className="text-[11px] h-12 bg-background/50" placeholder="name@example.com" type="email" {...register("email", { required: `Email is required` })} />
                            <Label className="text-[11px] uppercase tracking-widest text-primary font-semibold">Password</Label>
                            <Input className="text-[11px] h-12 bg-background/50" placeholder="Enter your password" type="password" {...register("password", { required: `Password is required`, minLength: 6 })} />

                        </CardContent>

                        <CardFooter className="mt-8 bg-background/10 flex flex-col gap-4">
                            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground uppercase tracking-wider font-semibold rounded-lg cursor-pointer transition-all duration-400 ease-in-out hover:bg-primary/90">
                                Sign In
                            </Button>
                            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                                Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Register here</Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </Tabs>
        </div>
    )
}
