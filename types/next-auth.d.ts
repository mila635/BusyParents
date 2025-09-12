import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    accessToken?: string
    refreshToken?: string
    scope?: string
    expiresAt?: number
    userId?: string
    role?: string
    isActive?: boolean
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
    refreshToken?: string
    scope?: string
    expiresAt?: number
    userId?: string
    role?: string
    isActive?: boolean
    error?: string
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // first login → persist tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.scope = account.scope
      }
      return token
    },
    async session({ session, token }) {
      // expose tokens in session
      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined
      session.scope = token.scope as string | undefined
      session.expiresAt = token.expiresAt as number | undefined
      return session
    }
  }
})
