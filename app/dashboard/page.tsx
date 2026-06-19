"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-lg bg-card border-none rounded-2xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="font-fraunces text-4xl font-medium tracking-tight">
            Dashboard
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            You are successfully logged in! Secure cookies are active.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center mt-6 pb-8">
          <Button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="h-12 bg-primary text-primary-foreground uppercase tracking-wider font-semibold rounded-lg px-8 hover:bg-primary/90 transition-all"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
