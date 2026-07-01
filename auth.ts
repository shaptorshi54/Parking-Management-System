import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt'
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
                role: {}
            },

            async authorize(credentials: any) {
                const user = await prisma.users.findUnique({ where: { email: credentials?.email } })
                if (!user) return null

                if (user.role !== credentials?.role) {
                    throw new Error(`Role mismatch`)
                }

                const passwordValidate = await bcrypt.compare(credentials.password, user.password)
                if (!passwordValidate) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ]
})
