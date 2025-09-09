// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId:'98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com',      //'11371365567-t8d9umesb7fasbhagohklhe23a3dt9ks.apps.googleusercontent.com',
//       clientSecret:'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',    //'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',
//       authorization: {
//         params: {
//           scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly',
//           access_type: 'offline',
//           prompt: 'consent'
//         }
//       }
//     })
//   ],
//   secret: '29f4aec9b4910c4b267378732e6a5af0f86300ee01a25ef5b5efa2580501fc1c',
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//     verifyRequest: '/auth/verify-request'
//   },
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (account && user) {
//         console.log('NextAuth: Processing sign in for user:', user.email)
        
//         // Save tokens to JWT
//         token.accessToken = account.access_token
//         token.refreshToken = account.refresh_token
//         token.id = `temp_${user.email!.replace(/[^a-zA-Z0-9]/g, '_')}`
//         token.scope = account.scope
//         token.expiresAt = account.expires_at

//         // Send webhook data for user signup
//         try {
//           const userData = {
//             event: 'user_signup',
//             timestamp: new Date().toISOString(),
//             user: {
//               id: token.id,
//               name: user.name,
//               email: user.email,
//               image: user.image,
//               provider: account.provider,
//               accessToken: account.access_token,
//               refreshToken: account.refresh_token,
//               scope: account.scope,
//               expiresAt: account.expires_at
//             }
//           }

//           // Send to Make.com webhook
//           fetch('https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(userData)
//           }).then(response => {
//             if (response.ok) {
//               console.log('✅ Webhook sent successfully for user signup')
//             } else {
//               console.error('❌ Webhook failed:', response.status)
//             }
//           }).catch(error => {
//             console.error('❌ Webhook error:', error)
//           })

//           // Send email processing event
//           const emailData = {
//             event: 'process_user_emails',
//             userId: token.id,
//             userEmail: user.email,
//             accessToken: account.access_token,
//             refreshToken: account.refresh_token,
//             scope: account.scope
//           }

//           fetch('https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(emailData)
//           }).then(response => {
//             if (response.ok) {
//               console.log('✅ Email processing webhook sent successfully')
//             } else {
//               console.error('❌ Email webhook failed:', response.status)
//             }
//           }).catch(error => {
//             console.error('❌ Email webhook error:', error)
//           })

//         } catch (error) {
//           console.error('❌ Error sending webhooks:', error)
//         }
//       }

//       // Return previous token if the access token has not expired yet
//       if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
//         return token
//       }

//       // Access token has expired, try to update it
//       if (token.refreshToken) {
//         try {
//           const response = await fetch('https://oauth2.googleapis.com/token', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: new URLSearchParams({
//               client_id:'98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com',    //'11371365567-t8d9umesb7fasbhagohklhe23a3dt9ks.apps.googleusercontent.com',
//               client_secret:'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',    // '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',
//               grant_type: 'refresh_token',
//               refresh_token: token.refreshToken as string
//             })
//           })

//           const tokens = await response.json()

//           if (!response.ok) {
//             throw new Error(`Token refresh failed: ${tokens.error || response.statusText}`)
//           }

//           console.log('NextAuth: Token refreshed successfully')
          
//           return {
//             ...token,
//             accessToken: tokens.access_token,
//             expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in
//           }
//         } catch (error) {
//           console.error('NextAuth: Error refreshing token:', error)
//           return { ...token, error: 'RefreshAccessTokenError' }
//         }
//       }

//       return token
//     },
//     async session({ session, token }) {
//       // Send properties to the client
//       session.accessToken = token.accessToken as string
//       session.user.id = token.id as string
//       session.scope = token.scope as string
//       session.expiresAt = token.expiresAt as number

//       console.log('NextAuth: Session created for user:', session.user.email)

//       return session
//     },
//     async redirect({ url, baseUrl }) {
//       // Security: Only allow redirects to our domain
//       if (url.startsWith('/')) return `${baseUrl}${url}`
//       else if (new URL(url).origin === baseUrl) return url
//       return baseUrl
//     }
//   },
//   debug: true, // Enable debug to see what's happening
// })













// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId:'98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com', 
//       clientSecret:'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',
//       authorization: {
//         params: {
//           scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly',
//           access_type: 'offline',
//           prompt: 'consent'
//         }
//       }
//     })
//   ],
//   secret: '29f4aec9b4910c4b267378732e6a5af0f86300ee01a25ef5b5efa2580501fc1c',
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//     verifyRequest: '/auth/verify-request'
//   },
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (account && user) {
//         console.log('NextAuth: Processing sign in for user:', user.email)
        
//         // Save tokens to JWT
//         token.accessToken = account.access_token
//         token.refreshToken = account.refresh_token
//         token.id = `temp_${user.email!.replace(/[^a-zA-Z0-9]/g, '_')}`
//         token.scope = account.scope
//         token.expiresAt = account.expires_at

//         // Define webhook payloads
//         const userData = {
//           event: 'user_signup',
//           timestamp: new Date().toISOString(),
//           user: {
//             id: token.id,
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             provider: account.provider,
//             accessToken: account.access_token,
//             refreshToken: account.refresh_token,
//             scope: account.scope,
//             expiresAt: account.expires_at
//           }
//         }

//         const emailData = {
//           event: 'process_user_emails',
//           userId: token.id,
//           userEmail: user.email,
//           accessToken: account.access_token,
//           refreshToken: account.refresh_token,
//           scope: account.scope
//         }

//         // Send webhooks and await their responses
//         try {
//           await Promise.all([
//             fetch('https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(userData)
//             }).then(response => {
//               if (response.ok) {
//                 console.log('✅ Webhook sent successfully for user signup')
//               } else {
//                 console.error('❌ Webhook failed:', response.status)
//               }
//             }),
//             fetch('https://hook.eu2.make.com/5fmpca1ttbvulfu8c5gf6kxjbgc6r2h4', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(emailData)
//             }).then(response => {
//               if (response.ok) {
//                 console.log('✅ Email processing webhook sent successfully')
//               } else {
//                 console.error('❌ Email webhook failed:', response.status)
//               }
//             })
//           ])
//         } catch (error) {
//           console.error('❌ Error sending webhooks:', error)
//         }
//       }

//       // Return previous token if the access token has not expired yet
//       if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
//         return token
//       }

//       // Access token has expired, try to update it
//       if (token.refreshToken) {
//         try {
//           const response = await fetch('https://oauth2.googleapis.com/token', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: new URLSearchParams({
//               client_id:'98761758378-7h0nc6sbk6gotpipu3s2tnfquakt0nb1.apps.googleusercontent.com',
//               client_secret:'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',
//               grant_type: 'refresh_token',
//               refreshToken: token.refreshToken as string
//             })
//           })

//           const tokens = await response.json()

//           if (!response.ok) {
//             throw new Error(`Token refresh failed: ${tokens.error || response.statusText}`)
//           }

//           console.log('NextAuth: Token refreshed successfully')
          
//           return {
//             ...token,
//             accessToken: tokens.access_token,
//             expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in
//           }
//         } catch (error) {
//           console.error('NextAuth: Error refreshing token:', error)
//           return { ...token, error: 'RefreshAccessTokenError' }
//         }
//       }

//       return token
//     },
//     async session({ session, token }) {
//       // Send properties to the client
//       session.accessToken = token.accessToken as string
//       session.user.id = token.id as string
//       session.scope = token.scope as string
//       session.expiresAt = token.expiresAt as number

//       console.log('NextAuth: Session created for user:', session.user.email)

//       return session
//     },
//     async redirect({ url, baseUrl }) {
//       // Security: Only allow redirects to our domain
//       if (url.startsWith('/')) return `${baseUrl}${url}`
//       else if (new URL(url).origin === baseUrl) return url
//       return baseUrl
//     }
//   },
//   debug: true, // Enable debug to see what's happening
// })



// This is the NextAuth.js configuration file for your application.
// It handles user authentication with Google and manages token rotation to ensure the session remains active.

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// This function takes an expired token and uses the refresh token to get a new access token.
async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }).toString(),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log('NextAuth: Token refreshed successfully');

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      // If a new refresh token is provided, use it; otherwise, use the old one.
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('NextAuth: Error refreshing token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export default NextAuth({
  // Configure Google as an authentication provider.
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          // IMPORTANT: These parameters are crucial for getting a refresh token.
          access_type: 'offline', // Requests a refresh token
          prompt: 'consent', // Forces the user to re-consent, ensuring a refresh token is issued
        },
      },
    }),
  ],

  // The `secret` is used to sign and encrypt the JWT and session cookies.
  // It should be a long, random string.
  secret: process.env.NEXTAUTH_SECRET as string,
  
  // Use JWTs for session strategy to enable server-side access to tokens.
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Define custom pages for handling sign-in, errors, and verification.
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  // Callbacks are used to customize the session and JWT.
  callbacks: {
    async jwt({ token, user, account }) {
      // Step 1: Initial sign-in. This runs only on the first login.
      if (account && user) {
        console.log('NextAuth: Initial sign-in for user:', user.email);
        
        // Return a new token with all the necessary information.
        // We calculate the expiry time for the access token.
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: (account.expires_at as number) * 1000, // Convert to milliseconds
          user,
        };
      }

      // Step 2: Return previous token if the access token is still valid.
      // We check if the token exists and if the current time is less than the expiry time.
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Step 3: Access token has expired, try to update it using the refresh token.
      // This is the core of the token rotation logic.
      if (token.refreshToken) {
        const refreshedToken = await refreshAccessToken(token);
        return refreshedToken;
      }

      // If there's no refresh token, return the original token. This should trigger a re-login.
      return token;
    },

    async session({ session, token }) {
      // Send properties from the JWT to the session object, which is available on the client.
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      session.error = token.error;
      
      console.log('NextAuth: Session created for user:', session.user.email);
      
      return session;
    },
    
    // Define a custom redirect callback for security.
    async redirect({ url, baseUrl }) {
      // Allow relative URLs or URLs with the same origin.
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Enable debug mode for verbose logging in development.
  debug: true,
});
