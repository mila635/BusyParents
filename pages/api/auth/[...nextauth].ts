

// // import NextAuth from 'next-auth'
// // import GoogleProvider from 'next-auth/providers/google'

// // export default NextAuth({
// //   providers: [
// //     GoogleProvider({
// //       clientId:'98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com', 
// //       clientSecret:'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',
// //       authorization: {
// //         params: {
// //           scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly',
// //           access_type: 'offline',
// //           prompt: 'consent'
// //         }
// //       }
// //     })
// //   ],
// //   secret: '29f4aec9b4910c4b267378732e6a5af0f86300ee01a25ef5b5efa2580501fc1c',
// //   session: {
// //     strategy: 'jwt',
// //     maxAge: 30 * 24 * 60 * 60, // 30 days
// //   },
// //   pages: {
// //     signIn: '/auth/signin',
// //     error: '/auth/error',
// //     verifyRequest: '/auth/verify-request'
// //   },
// //   callbacks: {
// //     async jwt({ token, user, account }) {
// //       // Initial sign in
// //       if (account && user) {
// //         console.log('NextAuth: Processing sign in for user:', user.email)
        
// //         // Save tokens to JWT
// //         token.accessToken = account.access_token
// //         token.refreshToken = account.refresh_token
// //         token.id = `temp_${user.email!.replace(/[^a-zA-Z0-9]/g, '_')}`
// //         token.scope = account.scope
// //         token.expiresAt = account.expires_at

// //         // Define webhook payloads
// //         const userData = {
// //           event: 'user_signup',
// //           timestamp: new Date().toISOString(),
// //           user: {
// //             id: token.id,
// //             name: user.name,
// //             email: user.email,
// //             image: user.image,
// //             provider: account.provider,
// //             accessToken: account.access_token,
// //             refreshToken: account.refresh_token,
// //             scope: account.scope,
// //             expiresAt: account.expires_at
// //           }
// //         }

// //         const emailData = {
// //           event: 'process_user_emails',
// //           userId: token.id,
// //           userEmail: user.email,
// //           accessToken: account.access_token,
// //           refreshToken: account.refresh_token,
// //           scope: account.scope
// //         }

// //         // Send webhooks and await their responses
// //         try {
// //           await Promise.all([
// //             fetch('https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4', {
// //               method: 'POST',
// //               headers: { 'Content-Type': 'application/json' },
// //               body: JSON.stringify(userData)
// //             }).then(response => {
// //               if (response.ok) {
// //                 console.log('✅ Webhook sent successfully for user signup')
// //               } else {
// //                 console.error('❌ Webhook failed:', response.status)
// //               }
// //             }),
// //             fetch('https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4', {
// //               method: 'POST',
// //               headers: { 'Content-Type': 'application/json' },
// //               body: JSON.stringify(emailData)
// //             }).then(response => {
// //               if (response.ok) {
// //                 console.log('✅ Email processing webhook sent successfully')
// //               } else {
// //                 console.error('❌ Email webhook failed:', response.status)
// //               }
// //             })
// //           ])
// //         } catch (error) {
// //           console.error('❌ Error sending webhooks:', error)
// //         }
// //       }

// //       // Return previous token if the access token has not expired yet
// //       if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
// //         return token
// //       }

// //       // Access token has expired, try to update it
// //       if (token.refreshToken) {
// //         try {
// //           const response = await fetch('https://oauth2.googleapis.com/token', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// //             body: new URLSearchParams({
// //               client_id:'98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com',
// //               client_secret:'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',
// //               grant_type: 'refresh_token',
// //               refreshToken: token.refreshToken as string
// //             })
// //           })

// //           const tokens = await response.json()

// //           if (!response.ok) {
// //             throw new Error(`Token refresh failed: ${tokens.error || response.statusText}`)
// //           }

// //           console.log('NextAuth: Token refreshed successfully')
          
// //           return {
// //             ...token,
// //             accessToken: tokens.access_token,
// //             expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in
// //           }
// //         } catch (error) {
// //           console.error('NextAuth: Error refreshing token:', error)
// //           return { ...token, error: 'RefreshAccessTokenError' }
// //         }
// //       }

// //       return token
// //     },
// //     async session({ session, token }) {
// //       // Send properties to the client
// //       session.accessToken = token.accessToken as string
// //       session.user.id = token.id as string
// //       session.scope = token.scope as string
// //       session.expiresAt = token.expiresAt as number

// //       console.log('NextAuth: Session created for user:', session.user.email)

// //       return session
// //     },
// //     async redirect({ url, baseUrl }) {
// //       // Security: Only allow redirects to our domain
// //       if (url.startsWith('/')) return `${baseUrl}${url}`
// //       else if (new URL(url).origin === baseUrl) return url
// //       return baseUrl
// //     }
// //   },
// //   debug: true, // Enable debug to see what's happening
// // })



// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     // Save accessToken to token
//     async jwt({ token, account, user }) {
//       if (account) {
//         token.accessToken = account.access_token
//         token.refreshToken = account.refresh_token
//         token.expiresAt = account.expires_at
//         token.user = user
//       }
//       return token
//     },

//     // Pass token values into session
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string
//       session.refreshToken = token.refreshToken as string
//       session.expiresAt = token.expiresAt as number
//       session.user = token.user as typeof session.user
//       return session
//     },
//   },

//   pages: {
//     signIn: "/auth/SignIn", // Custom sign-in page
//   },
// })









import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.expiresAt = token.expiresAt as number
      session.user = token.user as typeof session.user
      return session
    },
  },

  pages: {
    signIn: "/auth/SignIn",
  },
})

