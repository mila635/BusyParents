

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"
import type { Account, User, Session } from "next-auth"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account: Account | null; user: User }) {
      if (account && user) {
        console.log('NextAuth: Processing sign in for user:', user.email)
        
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.scope = account.scope
        
        // Set default values for now
        token.userId = `temp_${user.email!.replace(/[^a-zA-Z0-9]/g, '_')}`
        token.role = 'PARENT'
        token.isActive = true
      }
      
      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }
      
      // Access token has expired, try to refresh it
      if (token.refreshToken) {
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken as string
            })
          })

          const tokens = await response.json()

          if (!response.ok) {
            throw new Error(`Token refresh failed: ${tokens.error || response.statusText}`)
          }

          console.log('NextAuth: Token refreshed successfully')
          
          return {
            ...token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
            refreshToken: tokens.refresh_token ?? token.refreshToken
          }
        } catch (error) {
          console.error('NextAuth: Error refreshing token:', error)
          return { ...token, error: 'RefreshAccessTokenError' }
        }
      }
      
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.expiresAt = token.expiresAt as number
      session.scope = token.scope as string
      session.userId = token.userId as string
      session.role = token.role as string
      session.isActive = token.isActive as boolean
      session.error = token.error
      
      console.log('NextAuth: Session created for user:', session.user?.email)
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('NextAuth: Redirect called with url:', url, 'baseUrl:', baseUrl)
      
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default redirect to dashboard after successful sign in
      return `${baseUrl}/dashboard`
    },
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: any }) {
      console.log('NextAuth: Sign in attempt for:', user.email)
      
      // Dual Action: Trigger N8N webhook AND allow sign in
      if (account?.provider === 'google' && account.access_token) {
        try {
          // Prepare N8N webhook payload
          const n8nPayload = {
            action: 'user_login',
            user: {
              email: user.email,
              name: user.name,
              image: user.image,
              id: user.id
            },
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            timestamp: new Date().toISOString(),
            source: 'google_signin',
            additionalData: {
              provider: account.provider,
              scope: account.scope,
              expires_at: account.expires_at
            }
          }

          console.log('🚀 Triggering N8N user login webhook for:', user.email)

          // Trigger N8N webhook (non-blocking)
          fetch(process.env.N8N_USER_LOGIN_WEBHOOK!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(n8nPayload)
          }).then(async (response) => {
            if (response.ok) {
              const result = await response.json()
              console.log('✅ N8N user login webhook triggered successfully:', result)
            } else {
              console.error('❌ N8N user login webhook failed:', response.status, response.statusText)
            }
          }).catch((error) => {
            console.error('❌ N8N user login webhook error:', error)
          })

        } catch (error) {
          console.error('❌ Error triggering N8N webhook during sign in:', error)
          // Don't block sign in if webhook fails
        }
      }
      
      // Allow sign in (dashboard redirect happens in redirect callback)
      return true
    }
  },

  pages: {
    signIn: "/auth/signin",
    error: '/auth/error',
  },
  
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

