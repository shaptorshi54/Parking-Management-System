"use client"

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { useState } from 'react'

type inputs = {
  name: string,
  email: string,
  password: string,
  phone: string
}

export default function RegisterPage() {
  const [role, setRole] = useState("USER")
  const { register, handleSubmit, formState: { errors }, reset } = useForm<inputs>()

  const onSubmit: SubmitHandler<inputs> = async (data: inputs) => {
    try {
      // Add the selected role to the payload based on the active tab
      const payload = { ...data, role: role }

      const res = await fetch('api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()

      if (!res.ok) {
        // You can't render <Alert> components inside a standard JS function, 
        // so we use sonner toast for errors!
        toast.error(result.message || "Error registering account")
        return
      }

      toast.success(`Registration successful! Redirecting to login...`)
      reset()
      
      // Automatically redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
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

              {/* Dynamic Header based on role */}
              <CardHeader className="space-y-3 px-0">
                <CardTitle className="font-fraunces text-3xl font-medium">
                  {role === "OWNER"
                    ? <>Want to list your space? Partner with us.<span className="text-primary">→</span></>
                    : <>Don't have an account? Register to park.<span className="text-primary">→</span></>
                  }
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {role === "OWNER"
                    ? "Sign in to manage your parking inventory and track your earnings."
                    : "Sign in to find and book your perfect parking spot."
                  }
                </CardDescription>
              </CardHeader>

              {/* SINGLE set of inputs prevents react-hook-form validation conflicts */}
              <div className="space-y-4 text-left">
                <Label className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                  {role === "OWNER" ? "Owner Name" : "Spotter/Driver Name"}
                </Label>
                <Input className="text-[11px] h-12 bg-background/50 uppercase" type='text' placeholder="Full Name" {...register("name", { required: `Name is required` })} />
                {errors.name && <p className='text-red-500 text-xs m-0'>{errors.name.message}</p>}

                <Label className="text-[11px] uppercase tracking-widest text-primary font-semibold">Email</Label>
                <Input className="text-[11px] h-12 bg-background/50" placeholder="name@example.com" type='email' {...register("email", { required: `Email is required` })} />
                {errors.email && <p className='text-red-500 text-xs m-0'>{errors.email.message}</p>}

                <Label className="text-[11px] uppercase tracking-widest text-primary font-semibold">Password</Label>
                <Input className="text-[11px] h-12 bg-background/50 uppercase" placeholder="Enter new password" type='password' {...register("password", { required: `Password is required`, minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                {errors.password && <p className='text-red-500 text-xs m-0'>{errors.password.message}</p>}

                <Label className="text-[11px] uppercase tracking-widest text-primary font-semibold">Phone Number</Label>
                <Input className="text-[11px] h-12 bg-background/50 uppercase" placeholder="Mobile No." type='number' {...register("phone", { required: `Phone number is required` })} />
                {errors.phone && <p className='text-red-500 text-xs m-0'>{errors.phone.message}</p>}
              </div>

            </CardContent>
            <CardFooter className="mt-8 bg-background/10 flex flex-col gap-4">
              <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground uppercase tracking-wider font-semibold rounded-lg cursor-pointer transition-all duration-400 ease-in-out">
                Register
              </Button>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Tabs>
    </div>
  )
}
