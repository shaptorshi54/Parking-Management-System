import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt'


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
                role: {}
            },

            async authorize(credentials: any) {
                //find user
                //password comparison
                //return user info

                const user = await prisma.users.findUnique({ where: { email: credentials?.email } })

                if (!user) return null

                if (user.role !== credentials?.role) {
                    throw new Error(`Role mismatch`)
                }


                // validate password
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
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.name = token.name as string
                session.user.email = token.email as string
            }
            return session
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60
    },
    pages: {
        signIn: '/login'
    }
})
