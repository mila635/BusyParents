// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     // IMPORTANT: Replace this placeholder with the actual webhook URL from your Make.com scenario.
//     // To ensure security, you should store this URL as an environment variable (e.g., process.env.MAKE_WEBHOOK_URL)
//     // and never hardcode it directly in your application.
//     const makeWebhookUrl = 'https://hook.us2.make.com/jeh7g4itqovoivtlr5y2dg6gsf4fqx7x'; // PLACEHOLDER URL

//     if (makeWebhookUrl === 'https://hook.us2.make.com/jeh7g4itqovoivtlr5y2dg6gsf4fqx7x') {
//       return res.status(500).json({ error: 'Webhook URL is not configured. Please update the trigger-workflow.ts file with your actual URL.' });
//     }

//     try {
//       const response = await fetch(makeWebhookUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: "Triggering a new email scan." }), // Send a simple payload
//       });

//       if (response.ok) {
//         res.status(200).json({ message: 'Make.com workflow triggered successfully.' });
//       } else {
//         const errorData = await response.json();
//         res.status(response.status).json({ error: 'Failed to trigger Make.com workflow.', details: errorData });
//       }
//     } catch (error) {
//       console.error('API Error triggering workflow:', error);
//       res.status(500).json({ error: 'Failed to trigger workflow.', details: (error as Error).message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// This is the NextAuth.js configuration file for your application.
// It handles user authentication with Google and manages token rotation to ensure the session remains active.

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';

// // Define the refreshAccessToken function here or in a separate utility file.
// // This function takes an expired token and uses the refresh token to get a new access token.
// async function refreshAccessToken(token: any) {
//   try {
//     const url = "https://oauth2.googleapis.com/token";
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: process.env.GOOGLE_CLIENT_ID as string,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken as string,
//       }).toString(),
//     });

//     const refreshedTokens = await response.json();
//     if (!response.ok) {
//       throw refreshedTokens;
//     }

//     console.log('NextAuth: Token refreshed successfully');

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
//       // If a new refresh token is provided, use it; otherwise, use the old one.
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
//     };
//   } catch (error) {
//     console.error('NextAuth: Error refreshing token:', error);
//     return { ...token, error: 'RefreshAccessTokenError' };
//   }
// }

// export default NextAuth({
//   // Configure Google as an authentication provider.
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       authorization: {
//         params: {
//           // IMPORTANT: These parameters are crucial for getting a refresh token.
//           access_type: 'offline', // Requests a refresh token
//           prompt: 'consent', // Forces the user to re-consent, ensuring a refresh token is issued
//         },
//       },
//     }),
//   ],

//   // The `secret` is used to sign and encrypt the JWT and session cookies.
//   // It should be a long, random string.
//   secret: process.env.NEXTAUTH_SECRET as string,
  
//   // Use JWTs for session strategy to enable server-side access to tokens.
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },

//   // Define custom pages for handling sign-in, errors, and verification.
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//     verifyRequest: '/auth/verify-request',
//   },

//   // Callbacks are used to customize the session and JWT.
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Step 1: Initial sign-in. This runs only on the first login.
//       if (account && user) {
//         console.log('NextAuth: Initial sign-in for user:', user.email);
        
//         // Return a new token with all the necessary information.
//         // We calculate the expiry time for the access token.
//         return {
//           ...token,
//           accessToken: account.access_token,
//           refreshToken: account.refresh_token,
//           accessTokenExpires: (account.expires_at as number) * 1000, // Convert to milliseconds
//           user,
//         };
//       }

//       // Step 2: Return previous token if the access token is still valid.
//       // We check if the token exists and if the current time is less than the expiry time.
//       if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
//         return token;
//       }

//       // Step 3: Access token has expired, try to update it using the refresh token.
//       // This is the core of the token rotation logic.
//       if (token.refreshToken) {
//         const refreshedToken = await refreshAccessToken(token);
//         return refreshedToken;
//       }

//       // If there's no refresh token, return the original token. This should trigger a re-login.
//       return token;
//     },

//     async session({ session, token }) {
//       // Send properties from the JWT to the session object, which is available on the client.
//       session.user = token.user as any;
//       session.accessToken = token.accessToken as string;
//       session.error = token.error;
      
//       console.log('NextAuth: Session created for user:', session.user.email);
      
//       return session;
//     },
    
//     // Define a custom redirect callback for security.
//     async redirect({ url, baseUrl }) {
//       // Allow relative URLs or URLs with the same origin.
//       if (url.startsWith('/')) return `${baseUrl}${url}`;
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },

//   // Enable debug mode for verbose logging in development.
//   debug: true,
// });





import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 1. Authenticate the user.
    // getSession() will automatically refresh the token if it's expired
    // thanks to the new configuration in [...nextauth].ts.
    const session = await getSession({ req });
    if (!session || !session.accessToken) {
      return res.status(401).json({ error: 'You must be signed in to trigger this workflow.' });
    }

    // 2. Get the webhook URL from environment variables.
    const makeWebhookUrl = process.env.MAKE_EMAIL_PROCESSING_WEBHOOK_URL;

    if (!makeWebhookUrl) {
      console.error('Environment variable MAKE_EMAIL_PROCESSING_WEBHOOK_URL is not set.');
      return res.status(500).json({ error: 'Webhook URL is not configured.' });
    }

    // 3. Construct the payload to be sent to the Make.com webhook.
    // This payload includes the user's information and the fresh access token.
    try {
      const payload = {
        userId: session.user.id,
        userEmail: session.user.email,
        accessToken: session.accessToken,
        timestamp: new Date().toISOString(),
      };

      // 4. Send the POST request to the Make.com webhook.
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 5. Handle the response from Make.com.
      if (response.ok) {
        res.status(200).json({ message: 'Make.com workflow triggered successfully.' });
      } else {
        const errorData = await response.json();
        console.error('Make.com webhook failed:', response.status, errorData);
        res.status(response.status).json({
          error: 'Failed to trigger Make.com workflow.',
          details: errorData,
        });
      }
    } catch (error) {
      console.error('API Error triggering workflow:', error);
      res.status(500).json({
        error: 'Failed to trigger workflow.',
        details: (error as Error).message,
      });
    }
  } else {
    // Reject any requests that are not a POST request.
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
