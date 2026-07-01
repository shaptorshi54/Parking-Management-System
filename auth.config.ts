import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Leave empty for edge compatibility in middleware
  pages: {
    signIn: '/login',
  },
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
  }
} satisfies NextAuthConfig;
